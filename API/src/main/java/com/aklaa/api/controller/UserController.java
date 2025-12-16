package com.aklaa.api.controller;

import com.aklaa.api.annotations.AllowAdmin;
import com.aklaa.api.annotations.AllowAuthenticated;
import com.aklaa.api.dtos.response.UserDTO;
import com.aklaa.api.dtos.response.UserListResponseDTO;
import com.aklaa.api.model.User;
import com.aklaa.api.model.enums.UserType;
import com.aklaa.api.services.contract.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

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
    @DeleteMapping("{id}")
    public ResponseEntity<UserDTO> deleteUser(@PathVariable Long id, @AuthenticationPrincipal User actionTaker) {
        UserDTO deletedUser = userService.delete(id, actionTaker);
        return ResponseEntity.ok(deletedUser);
    }

    @AllowAdmin
    @PutMapping("/enable/{id}")
    public ResponseEntity<UserDTO> enableAccount(@PathVariable Long id) {
        UserDTO updatedUser = userService.enable(id);
        return ResponseEntity.ok(updatedUser);
    }
}