package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.ResetEmailRepository;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.request.UpdatedUserDTO;
import com.aklaa.api.dtos.response.UserDTO;
import com.aklaa.api.dtos.response.UserListResponseDTO;
import com.aklaa.api.mapper.UserMapper;
import com.aklaa.api.model.EmailResetToken;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.UserType;
import com.aklaa.api.services.contract.EmailService;
import com.aklaa.api.services.contract.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.NoSuchElementException;

import static com.aklaa.api.services.implementation.AuthServiceImpl.generateSecureToken;

@Component
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ResetEmailRepository resetEmailRepository;
    private final UserMapper userMapper;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    @Override
    public UserListResponseDTO getUsers(String search, String type, Pageable pageable) {
        UserType typeEnum = null;
        if (type != null && !type.isEmpty()) {
            try {
                typeEnum = UserType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                typeEnum = null;
            }
        }

        Specification<User> spec = searchSpec(search)
                .and(hasUserTypeSpec(typeEnum));

        Page<User> userPage = userRepository.findAll(spec, pageable);

        List<UserDTO> userDTOs = userPage.getContent().stream()
                .map(user -> UserDTO.builder()
                        .id(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .userType(user.getUserType().name())
                        .enabled(user.isEnabled())
                        .build())
                .toList();

        return UserListResponseDTO.builder()
                .users(userDTOs)
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .build();
    }

    @Override
    public UserDTO get(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        return userMapper.toDTO(user);
    }

    @Override
    public UserDTO updateUserRole(Long id, UserType userType) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        user.setUserType(userType);
        userRepository.save(user);

        refreshAuthentication(user.getEmail());

        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .userType(user.getUserType().name())
                .enabled(user.isEnabled())
                .build();
    }

    @Override
    public UserDTO enable(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if(!user.isEnabled()) {
            user.setEnabled(true);
            user.setActivationToken(null);
            userRepository.save(user);

            refreshAuthentication(user.getEmail());
        }

        return userMapper.toDTO(user);
    }

    @Override
    public UserDTO update(Long id, UpdatedUserDTO request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        if (emailHasChanged(request.getEmail(), user)) {
            requestEmailChange(user, request.getEmail());
        }

        userRepository.save(user);
        refreshAuthentication(user.getEmail());

        return userMapper.toDTO(user);
    }

    @Override
    public UserDTO delete(Long id, User actionTaker) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (!canDelete(user, actionTaker)) {
            throw new AccessDeniedException("User not allowed to delete");
        }

        userRepository.delete(user);

        return userMapper.toDTO(user);
    }

    @Override
    public void refreshAuthentication(String email) {
        Authentication existingAuth = SecurityContextHolder.getContext().getAuthentication();

        UserDetails updatedUserDetails = userDetailsService.loadUserByUsername(email);

        Authentication newAuth = new UsernamePasswordAuthenticationToken(
                updatedUserDetails,
                existingAuth != null ? existingAuth.getCredentials() : null,
                updatedUserDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(newAuth);
    }

    private Specification<User> hasUserTypeSpec(UserType type) {
        return (root, query, builder) -> {
            if (type == null) {
                return builder.conjunction();
            }
            return builder.equal(root.get("userType"), type);
        };
    }

    private Specification<User> searchSpec(String searchTerm) {
        return (root, query, builder) -> {
            if (searchTerm == null || searchTerm.isEmpty()) {
                return builder.conjunction();
            }

            String likeTerm = "%" + searchTerm.toLowerCase() + "%";

            return builder.or(
                    builder.like(builder.lower(root.get("firstName")), likeTerm),
                    builder.like(builder.lower(root.get("lastName")), likeTerm),
                    builder.like(builder.lower(root.get("email")), likeTerm)
            );
        };
    }

    private boolean canDelete(User user, User actionTaker) {
        return actionTaker.getUserType() == UserType.ADMIN || actionTaker.getId().equals(user.getId());
    }

    private boolean emailHasChanged(String newEmail, User user) {
        return newEmail != null && !newEmail.equalsIgnoreCase(user.getEmail());
    }

    private void requestEmailChange(User user, String newEmail) {
        String token = generateSecureToken();

        EmailResetToken tokenEntity = new EmailResetToken();
        tokenEntity.setToken(token);
        tokenEntity.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusHours(2));
        tokenEntity.setUser(user);

        resetEmailRepository.save(tokenEntity);

        user.setPendingEmail(newEmail);
        emailService.sendActivationUpdatedEmail(newEmail, token);
    }
}
