package com.aklaa.api.controller;

import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.AuthResponseDTO;
import com.aklaa.api.dtos.LoginDTO;
import com.aklaa.api.dtos.RegistrationDTO;
import com.aklaa.api.dtos.UserDTO;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

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
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        AuthResponseDTO auth = authService.login(loginDTO);

        if (!auth.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(auth);
        }

        return ResponseEntity
                .ok(auth);
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
