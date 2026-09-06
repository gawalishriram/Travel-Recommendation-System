package com.example.service;

import java.util.List;

import com.example.dto.FavoriteDTO;

public interface FavoriteService {

    void addFavorite(Integer userId, Integer destinationId);

    void removeFavorite(Integer userId, Integer destinationId);

    List<FavoriteDTO> getUserFavorites(Integer userId);
}