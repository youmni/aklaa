package com.aklaa.api.dao;

import aj.org.objectweb.asm.commons.Remapper;
import com.aklaa.api.model.GroceryList;
import com.aklaa.api.model.Ingredient;
import com.aklaa.api.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface GroceryListRepository extends JpaRepository<GroceryList, Long> {
    Page<GroceryList> findByUser(User user, Pageable pageable);
    List<GroceryList> findByUser(User user);
    Optional<GroceryList> findByIdAndUser(Long id, User user);

    @Modifying
    @Query("DELETE FROM GroceryList g WHERE g.createdAt < :date")
    void deleteByCreatedAtBefore(@Param("date") LocalDateTime date);
}
