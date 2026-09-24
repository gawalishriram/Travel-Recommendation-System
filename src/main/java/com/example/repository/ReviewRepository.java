package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {

    // All reviews for a destination (latest first)
    List<Review> findByDestination_DestinationIdOrderByCreatedAtDesc(
            Integer destinationId);

    // Check if a specific user already reviewed a destination (for upsert)
    Optional<Review> findByUser_UserIdAndDestination_DestinationId(
            Integer userId,
            Integer destinationId);

    // Compute the average rating for a destination (returns null if no reviews)
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.destination.destinationId = :destinationId")
    Double findAverageRatingByDestinationId(@Param("destinationId") Integer destinationId);

    // Count how many reviews a destination has
    long countByDestination_DestinationId(Integer destinationId);
}
