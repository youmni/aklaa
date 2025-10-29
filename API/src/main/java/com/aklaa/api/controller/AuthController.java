package com.aklaa.api.controller;

import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.*;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegistrationDTO registrationDTO) {
        UserDTO user = authService.register(registrationDTO);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/users/{id}")
                .buildAndExpand(user.getId())
                .toUri();

        return ResponseEntity.created(location).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        AuthResponseDTO auth = authService.login(loginDTO);

        if (!auth.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(auth);
        }

        Cookie accessTokenCookie = new Cookie("accessToken", auth.getAccessToken());
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setSecure(true);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setMaxAge(10 * 60);
        response.addCookie(accessTokenCookie);

        Cookie refreshTokenCookie = new Cookie("refreshToken", auth.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/api/auth/refresh");
        refreshTokenCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(refreshTokenCookie);

        return ResponseEntity
                .ok(auth);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }

        User user = optionalUser.get();

        UserDTO dto = UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .userType(user.getUserType().name())
                .build();

        return ResponseEntity.ok(dto);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> requestReset(@RequestBody PasswordResetRequestDTO passwordResetRequestDTO) {
        authService.processPasswordResetRequest(passwordResetRequestDTO);
        return ResponseEntity.ok("If the email is registered, you'll get a reset link");
    }


    @GetMapping("/activate")
    public ResponseEntity<String> activateAccount(@RequestParam String token) {
        User user = userRepository.findByActivationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        user.setEnabled(true);
        user.setActivationToken(null);
        userRepository.save(user);

        return ResponseEntity.ok("Account activated!");
    }
}
