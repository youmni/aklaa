package com.aklaa.api.model;

import com.aklaa.api.model.enums.IngredientCategory;
import com.aklaa.api.model.enums.MeasurementUnit;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Ingredient name is required")
    @Size(min = 1, max = 100, message = "Ingredient name must be between 1 and 100 characters")
    private String name;

    @Column(nullable = false)
    @NotBlank(message = "Ingredient description is required")
    @Size(min = 1, max = 250, message = "Ingredient description must be between 1 and 250 characters")
    private String description;

    @Enumerated(EnumType.STRING)
    private IngredientCategory category;

    @Enumerated(EnumType.STRING)
    private MeasurementUnit unit;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
