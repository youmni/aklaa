package com.aklaa.api.controller;

import com.aklaa.api.annotations.AllowAuthenticated;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.IngredientListResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.User;
import com.aklaa.api.services.implementation.IngredientServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientServiceImpl ingredientService;
    private final UserRepository userRepository;

    @AllowAuthenticated
    @PostMapping
    public ResponseEntity<IngredientResponseDTO> create(@RequestBody @Valid IngredientRequestDTO ingredientRequestDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        IngredientResponseDTO ingredient = ingredientService.create(ingredientRequestDTO, user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/ingredients/{id}")
                .buildAndExpand(ingredient.getId())
                .toUri();

        return ResponseEntity.created(location).body(ingredient);
    }

    @AllowAuthenticated
    @PutMapping("/{id}")
    public ResponseEntity<IngredientResponseDTO> update(@PathVariable Long id, @RequestBody @Valid IngredientRequestDTO ingredientRequestDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        IngredientResponseDTO ingredient = ingredientService.update(ingredientRequestDTO,id,user);
        return ResponseEntity.ok(ingredient);
    }

    @AllowAuthenticated
    @DeleteMapping("/{id}")
    public ResponseEntity<IngredientResponseDTO> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        IngredientResponseDTO ingredient = ingredientService.delete(id,user);
        return ResponseEntity.ok(ingredient);
    }

    @AllowAuthenticated
    @GetMapping("/{id}")
    public ResponseEntity<IngredientResponseDTO> getIngredient(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        IngredientResponseDTO ingredientResponseDTO = ingredientService.get(id, user);
        return ResponseEntity.ok(ingredientResponseDTO);
    }

    @AllowAuthenticated
    @GetMapping("/all")
    public ResponseEntity<List<IngredientResponseDTO>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        List<IngredientResponseDTO> ingredientResponseDTO = ingredientService.getAll(user);
        return ResponseEntity.ok(ingredientResponseDTO);
    }

    @AllowAuthenticated
    @GetMapping
    public ResponseEntity<IngredientListResponseDTO> filterIngredients(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();

        Pageable pageable = PageRequest.of(page, size);
        IngredientListResponseDTO response = ingredientService.filter(search, categories, pageable, user);
        return ResponseEntity.ok(response);
    }
}