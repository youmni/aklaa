package com.aklaa.api.controller;

import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.request.IngredientRequestDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.dtos.response.IngredientResponseDTO;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.DishService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/dishes")
public class DishController {

    private final UserRepository userRepository;
    private final DishService dishService;

    public DishController(UserRepository userRepository, DishService dishService) {
        this.userRepository = userRepository;
        this.dishService = dishService;
    }

    @PostMapping
    public ResponseEntity<DishResponseDTO> create(@RequestBody @Valid DishRequestDTO dishRequestDTO, @AuthenticationPrincipal UserDetails userDetails){
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        DishResponseDTO dish = dishService.create(dishRequestDTO, user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/dishes/{id}")
                .buildAndExpand(dish.getId())
                .toUri();

        return ResponseEntity.created(location).body(dish);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DishResponseDTO> update(@PathVariable Long id, @RequestBody @Valid DishRequestDTO dishRequestDTO, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        DishResponseDTO dish = dishService.update(dishRequestDTO,id,user);
        return ResponseEntity.ok(dish);
    }
}
