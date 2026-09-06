package com.example.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.FavoriteDTO;
import com.example.service.FavoriteService;

@RestController
@RequestMapping({"/favorites", "/api/favorites"})
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping({"/add/{destinationId}", "/{destinationId}"})
    public ResponseEntity<Map<String, Object>> addFavorite(@PathVariable Integer destinationId) {
        Integer userId = getCurrentUserId();
        favoriteService.addFavorite(userId, destinationId);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Destination added to favorites successfully."
        ));
    }

    @DeleteMapping({"/remove/{destinationId}", "/{destinationId}"})
    public ResponseEntity<Map<String, Object>> removeFavorite(@PathVariable Integer destinationId) {
        Integer userId = getCurrentUserId();
        favoriteService.removeFavorite(userId, destinationId);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Destination removed from favorites."
        ));
    }

    @GetMapping
    public ResponseEntity<List<FavoriteDTO>> getFavorites() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return Integer.valueOf(auth.getName());
    }
}