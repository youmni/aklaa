package com.aklaa.api.services.implementation;

import com.aklaa.api.config.security.JwtService;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.AuthResponseDTO;
import com.aklaa.api.dtos.LoginDTO;
import com.aklaa.api.dtos.RegistrationDTO;
import com.aklaa.api.dtos.UserDTO;
import com.aklaa.api.mapper.UserMapper;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.AuthService;
import com.aklaa.api.services.contract.EmailService;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;

    @Autowired
    public AuthServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder, UserRepository userRepository, EmailService emailService, JwtService jwtService) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }

    @Override
    public UserDTO register(RegistrationDTO registrationDTO) {
        if (!registrationDTO.getPassword().equals(registrationDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = userMapper.toEntity(registrationDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActivationToken(UUID.randomUUID().toString());
        userRepository.save(user);

        try {
            emailService.sendActivationEmail(user, user.getActivationToken());
        } catch (IOException | MessagingException e) {
            e.printStackTrace();
        }
        return userMapper.toDTO(user);
    }

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(loginDTO.getEmail()).stream().findFirst();

            if (userOpt.isEmpty() || !passwordEncoder.matches(loginDTO.getPassword(), userOpt.get().getPassword())) {
                return AuthResponseDTO.builder()
                        .success(false)
                        .message("Invalid email or password")
                        .build();
            }

            if (!userOpt.get().isEnabled() || userOpt.get().getActivationToken() != null) {
                return AuthResponseDTO.builder()
                        .success(false)
                        .message("Account not activated yet")
                        .build();
            }

            User user = userOpt.get();

            String refreshToken = jwtService.generateRefreshToken(user.getId(), user.getUserType());
            String token = jwtService.generateToken(user.getId(), user.getUserType());

            return AuthResponseDTO.builder()
                    .success(true)
                    .message("Login successful")
                    .accessToken(token)
                    .refreshToken(refreshToken)
                    .build();

        } catch (JOSEException e) {
            return AuthResponseDTO.builder()
                    .success(false)
                    .message("Could not generate token: " + e.getMessage())
                    .build();
        }
    }
}