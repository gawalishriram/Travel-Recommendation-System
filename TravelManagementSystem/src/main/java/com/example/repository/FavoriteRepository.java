package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.model.Destination;
import com.example.model.Favorite;
import com.example.model.User;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {

    List<Favorite> findByUser_UserIdOrderByCreatedAtDesc(Integer userId);

    boolean existsByUserAndDestination(User user, Destination destination);

    Optional<Favorite> findByUser_UserIdAndDestination_DestinationId(Integer userId, Integer destinationId);

    void deleteByUser_UserIdAndDestination_DestinationId(Integer userId, Integer destinationId);
}