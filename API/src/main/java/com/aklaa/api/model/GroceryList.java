package com.aklaa.api.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "grocery_lists")
public class GroceryList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime startOfWeek;

    private LocalDateTime endOfWeek;

    @OneToMany(mappedBy = "groceryList", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GroceryListIngredient> groceryListIngredients = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private User user;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
