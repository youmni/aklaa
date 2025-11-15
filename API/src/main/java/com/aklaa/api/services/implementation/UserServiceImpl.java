package com.aklaa.api.services.implementation;

import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.response.IngredientListResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.dtos.response.UserDTO;
import com.aklaa.api.dtos.response.UserListResponseDTO;
import com.aklaa.api.mapper.UserMapper;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.IngredientCategory;
import com.aklaa.api.model.enums.UserType;
import com.aklaa.api.services.contract.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;

@Component
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserDetailsService userDetailsService;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.userDetailsService = userDetailsService;
    }

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
                .build();
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
}
