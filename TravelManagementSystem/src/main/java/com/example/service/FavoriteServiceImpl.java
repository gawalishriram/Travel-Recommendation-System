package com.example.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dto.FavoriteDTO;
import com.example.exception.DestinationNotFoundException;
import com.example.exception.UserNotFoundException;
import com.example.model.Destination;
import com.example.model.Favorite;
import com.example.model.User;
import com.example.repository.DestinationRepository;
import com.example.repository.FavoriteRepository;
import com.example.repository.UserRepository;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public FavoriteServiceImpl(
            FavoriteRepository favoriteRepository,
            UserRepository userRepository,
            DestinationRepository destinationRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
    }

    @Override
    @Transactional
    public void addFavorite(Integer userId, Integer destinationId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        Destination destination = destinationRepository.findById(destinationId)
            .orElseThrow(() -> new DestinationNotFoundException("Destination not found"));

        if (!favoriteRepository.existsByUserAndDestination(user, destination)) {
            Favorite favorite = new Favorite(user, destination);
            favoriteRepository.save(favorite);
        }
    }

    @Override
    @Transactional
    public void removeFavorite(Integer userId, Integer destinationId) {
        favoriteRepository.deleteByUser_UserIdAndDestination_DestinationId(userId, destinationId);
    }

    @Override
    public List<FavoriteDTO> getUserFavorites(Integer userId) {
        List<Favorite> favorites = favoriteRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
        return favorites.stream().map(this::convertToDTO).toList();
    }

    private FavoriteDTO convertToDTO(Favorite favorite) {
        Destination d = favorite.getDestination();
        FavoriteDTO dto = new FavoriteDTO();
        dto.setFavoriteId(favorite.getFavoriteId());
        dto.setDestinationId(d.getDestinationId());
        dto.setName(d.getName());
        dto.setDestinationName(d.getName());
        dto.setDescription(d.getDescription());
        dto.setBudget(d.getBudget());
        dto.setPrice(d.getBudget());
        dto.setSeason(d.getSeason());
        dto.setCategory(d.getCategory());
        dto.setRating(d.getRating());
        dto.setImageUrl(d.getImageUrl());
        dto.setImage(d.getImageUrl());
        dto.setCreatedAt(favorite.getCreatedAt());
        return dto;
    }
}