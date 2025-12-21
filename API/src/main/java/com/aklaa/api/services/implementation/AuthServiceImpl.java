package com.aklaa.api.services.implementation;

import com.aklaa.api.config.security.JwtService;
import com.aklaa.api.dao.ResetEmailRepository;
import com.aklaa.api.dao.ResetPasswordRepository;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.request.PasswordResetDTO;
import com.aklaa.api.dtos.request.LoginDTO;
import com.aklaa.api.dtos.request.ForgotPasswordRequestDTO;
import com.aklaa.api.dtos.request.RegistrationDTO;
import com.aklaa.api.dtos.response.AuthResponseDTO;
import com.aklaa.api.dtos.response.UserDTO;
import com.aklaa.api.exceptions.AccountBlacklistedException;
import com.aklaa.api.exceptions.AccountNotActivatedException;
import com.aklaa.api.exceptions.InvalidCredentialsException;
import com.aklaa.api.mapper.UserMapper;
import com.aklaa.api.model.PasswordResetToken;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.UserType;
import com.aklaa.api.services.contract.AuthService;
import com.aklaa.api.services.contract.EmailService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Base64;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private static final SecureRandom secureRandom = new SecureRandom();
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final ResetPasswordRepository resetPasswordRepository;
    private final ResetEmailRepository resetEmailRepository;

    @Override
    public UserDTO register(RegistrationDTO registrationDTO) {
        if (!registrationDTO.getPassword().equals(registrationDTO.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = userMapper.toEntity(registrationDTO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setActivationToken(generateSecureToken());
        userRepository.save(user);

        emailService.sendActivationEmail(user, user.getActivationToken());

        return userMapper.toDTO(user);
    }

    @Override
    public void resetPassword(Long id, PasswordResetDTO passwordResetDTO) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty() || !passwordEncoder.matches(passwordResetDTO.getOldPassword(), userOpt.get().getPassword())) {
            throw new InvalidCredentialsException("Invalid password.");
        }

        if(!passwordResetDTO.getNewPassword().equals(passwordResetDTO.getConfirmNewPassword())) {
            throw new InvalidCredentialsException("New Passwords do not match.");
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(passwordResetDTO.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public AuthResponseDTO login(LoginDTO loginDTO){
            Optional<User> userOpt = userRepository.findByEmail(loginDTO.getEmail()).stream().findFirst();

            if (userOpt.isEmpty() || !passwordEncoder.matches(loginDTO.getPassword(), userOpt.get().getPassword())) {
                throw new InvalidCredentialsException("Invalid email or password.");
            }

            if (!userOpt.get().isEnabled() || userOpt.get().getActivationToken() != null) {
                throw new AccountNotActivatedException("Account not activated.");
            }

            if (userOpt.get().getUserType().equals(UserType.BLACKLISTED)) {
                throw new AccountBlacklistedException(
                        "Your account has been deactivated and cannot be used to access this application. " +
                                "This may be due to security or policy reasons. " +
                                "If you believe this is an error or need assistance, please contact the system administrator."
                );
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
    }

    @Override
    public void processPasswordResetRequest(ForgotPasswordRequestDTO forgotPasswordRequestDTO) {
            Optional<User> userOpt = userRepository.findByEmail(forgotPasswordRequestDTO.getEmail());
            if (userOpt.isEmpty()) return;

            User user = userOpt.get();
            String token = generateSecureToken();

            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiresAt(OffsetDateTime.now(ZoneOffset.UTC).plusMinutes(15));

            resetPasswordRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user, token);
    }

    public AuthResponseDTO refreshAccessToken(String refreshToken) {
        if (refreshToken == null) {
            throw new IllegalArgumentException("Missing refresh token");
        }

        if (!jwtService.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }

        String type = jwtService.getClaim(refreshToken, "type");
        if (!"refresh".equals(type)) {
            throw new IllegalArgumentException("Wrong token type");
        }

        String userId = jwtService.getSubject(refreshToken);

        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return AuthResponseDTO.builder()
                .success(true)
                .message("Refresh successful")
                .accessToken(jwtService.generateToken(user.getId(), user.getUserType()))
                .refreshToken(refreshToken)
                .build();
    }

    public String getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;

        return Arrays.stream(request.getCookies())
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    public static String generateSecureToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    @Scheduled(cron = "0 33 15 * * *", zone = "Europe/Brussels")
    @Transactional
    public void deletePasswordResetTokenAutomatically() {
        resetPasswordRepository.deletePasswordResetTokenAutomatically(
                LocalDateTime.now().minusMinutes(15)
        );
    }

    @Scheduled(cron = "0 0 5 * * *", zone = "Europe/Brussels")
    @Transactional
    public void deleteEmailResetTokenAutomatically() {
        resetEmailRepository.deleteEmailResetTokenAutomatically(
                LocalDateTime.now().minusHours(2)
        );
    }
}