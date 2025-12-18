package com.aklaa.api.controller;

import com.aklaa.api.annotations.AllowAdmin;
import com.aklaa.api.annotations.AllowAnonymous;
import com.aklaa.api.annotations.AllowAuthenticated;
import com.aklaa.api.dao.ResetEmailRepository;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.request.UpdatedUserDTO;
import com.aklaa.api.dtos.response.UserDTO;
import com.aklaa.api.dtos.response.UserListResponseDTO;
import com.aklaa.api.model.EmailResetToken;
import com.aklaa.api.model.PasswordResetToken;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.UserType;
import com.aklaa.api.services.contract.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ResetEmailRepository resetEmailRepository;
    private final UserRepository userRepository;

    @AllowAdmin
    @GetMapping()
    public ResponseEntity<UserListResponseDTO> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        UserListResponseDTO response = userService.getUsers(search, type, pageable);
        return ResponseEntity.ok(response);
    }

    @AllowAdmin
    @GetMapping("{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        UserDTO response = userService.get(id);
        return ResponseEntity.ok(response);
    }

    @AllowAdmin
    @PutMapping("{id}")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @RequestParam UserType type) {

        UserDTO updatedUser = userService.updateUserRole(id, type);
        return ResponseEntity.ok(updatedUser);
    }

    @AllowAuthenticated
    @PutMapping("/email")
    public ResponseEntity<UserDTO> updateUserEmail(@RequestBody UpdatedUserDTO updatedUserDTO, @AuthenticationPrincipal User actionTaker) {

        UserDTO updatedUser = userService.update(actionTaker.getId(), updatedUserDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @AllowAuthenticated
    @DeleteMapping("{id}")
    public ResponseEntity<UserDTO> deleteUser(@PathVariable Long id, @AuthenticationPrincipal User actionTaker) {
        UserDTO deletedUser = userService.delete(id, actionTaker);
        return ResponseEntity.ok(deletedUser);
    }

    @AllowAuthenticated
    @DeleteMapping()
    public ResponseEntity<UserDTO> deleteOwnUser(@AuthenticationPrincipal User actionTaker) {
        UserDTO deletedUser = userService.delete(actionTaker.getId(), actionTaker);
        return ResponseEntity.ok(deletedUser);
    }

    @AllowAnonymous
    @GetMapping("/email-confirm")
    public ResponseEntity<String> emailReset(@RequestParam String token) {
        Optional<EmailResetToken> tokenOpt = resetEmailRepository.findByToken(token);

        if (tokenOpt.isEmpty() || tokenOpt.get().isExpired()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
        }
        User user = tokenOpt.get().getUser();
        user.setEmail(user.getPendingEmail().toLowerCase());
        user.setPendingEmail(null);
        userRepository.save(user);
        resetEmailRepository.delete(tokenOpt.get());

        return ResponseEntity.ok("Token is valid");
    }

    @AllowAdmin
    @PutMapping("/enable/{id}")
    public ResponseEntity<UserDTO> enableAccount(@PathVariable Long id) {
        UserDTO updatedUser = userService.enable(id);
        return ResponseEntity.ok(updatedUser);
    }
}