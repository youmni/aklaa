package com.aklaa.api.controller;

import com.aklaa.api.annotations.AllowAuthenticated;
import com.aklaa.api.dao.UserRepository;
import com.aklaa.api.dtos.request.DishRequestDTO;
import com.aklaa.api.dtos.response.DishListResponseDTO;
import com.aklaa.api.dtos.response.DishResponseDTO;
import com.aklaa.api.model.User;
import com.aklaa.api.services.contract.DishService;
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
@RequestMapping("/api/dishes")
@RequiredArgsConstructor
public class DishController {

    private final UserRepository userRepository;
    private final DishService dishService;

    @AllowAuthenticated
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

    @AllowAuthenticated
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

    @AllowAuthenticated
    @DeleteMapping("{id}")
    public ResponseEntity<DishResponseDTO> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        DishResponseDTO dish = dishService.delete(id,user);
        return ResponseEntity.ok(dish);
    }

    @AllowAuthenticated
    @GetMapping("{id}")
    public ResponseEntity<DishResponseDTO> getIngredient(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> optionalUser = userRepository.findByEmail(userDetails.getUsername());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(null);
        }
        User user = optionalUser.get();
        DishResponseDTO dishResponseDTO = dishService.get(id, user);
        return ResponseEntity.ok(dishResponseDTO);
    }

    @AllowAuthenticated
    @GetMapping("/filter")
    public ResponseEntity<DishListResponseDTO> filterDishes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> countries,
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
        DishListResponseDTO response = dishService.filter(search, countries, pageable, user);
        return ResponseEntity.ok(response);
    }
}