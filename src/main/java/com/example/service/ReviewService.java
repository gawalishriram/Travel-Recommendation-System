package com.example.service;

import java.util.List;

import com.example.dto.ReviewDTO;

// =========================================================
// ReviewService — Contract for user review operations
// =========================================================

public interface ReviewService {

    /**
     * Add or update a review (upsert).
     * One user can have at most one review per destination.
     * After save, destination's average rating is recomputed.
     *
     * @param userId        Authenticated user's ID
     * @param destinationId Target destination
     * @param rating        Star rating 1–5
     * @param comment       Optional comment text
     * @return Saved ReviewDTO
     */
    ReviewDTO addOrUpdateReview(Integer userId, Integer destinationId,
                                Integer rating, String comment);

    /**
     * Get all reviews for a destination, latest first.
     *
     * @param destinationId Target destination
     * @return List of ReviewDTOs
     */
    List<ReviewDTO> getReviewsForDestination(Integer destinationId);

    /**
     * Delete a user's own review for a destination.
     *
     * @param userId        Authenticated user's ID
     * @param destinationId Target destination
     */
    void deleteReview(Integer userId, Integer destinationId);
}
