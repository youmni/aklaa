package com.aklaa.api.services.implementation;

import com.aklaa.api.config.security.JwtService;
import com.aklaa.api.dao.ResetPasswordRepository;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.*;
import com.aklaa.api.mapper.UserMapper;
import com.aklaa.api.model.PasswordResetToken;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.AuthService;
import com.aklaa.api.services.contract.EmailService;
import com.nimbusds.jose.JOSEException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Base64;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private static final SecureRandom secureRandom = new SecureRandom();
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final ResetPasswordRepository resetPasswordRepository;

    @Autowired
    public AuthServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder, UserRepository userRepository, EmailService emailService, JwtService jwtService, ResetPasswordRepository resetPasswordRepository) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.resetPasswordRepository = resetPasswordRepository;
    }

    @Override
    public UserDTO register(RegistrationDTO registrationDTO) {
        if (!registrationDTO.getPassword().equals(registrationDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        try {
            User user = userMapper.toEntity(registrationDTO);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setActivationToken(generateSecureToken());
            userRepository.save(user);

            emailService.sendActivationEmail(user, user.getActivationToken());

            return userMapper.toDTO(user);

        } catch (IOException | MessagingException e) {
            throw new RuntimeException("Failed to send activation email");
        }
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

    @Override
    public void processPasswordResetRequest(PasswordResetRequestDTO passwordResetRequestDTO) {
        try{
            Optional<User> userOpt = userRepository.findByEmail(passwordResetRequestDTO.getEmail());
            if (userOpt.isEmpty()) return;

            User user = userOpt.get();
            String token = generateSecureToken();

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(15));

            resetPasswordRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user, token);
        } catch (IOException | MessagingException e) {
            throw new RuntimeException("Failed to send a password reset email");
        }
    }

    public static String generateSecureToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
}