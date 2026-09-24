package com.example.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dto.ReviewDTO;
import com.example.exception.DestinationNotFoundException;
import com.example.exception.UserNotFoundException;
import com.example.model.Destination;
import com.example.model.Review;
import com.example.model.User;
import com.example.repository.DestinationRepository;
import com.example.repository.ReviewRepository;
import com.example.repository.UserRepository;

// =========================================================
// ReviewServiceImpl
// — Upsert review (add if new, update if existing)
// — Recompute destination's average rating after each save
// — List all reviews for a destination (latest first)
// — Delete own review
// =========================================================

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public ReviewServiceImpl(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            DestinationRepository destinationRepository) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
    }

    // =========================================================
    // ADD OR UPDATE REVIEW (UPSERT)
    // =========================================================

    @Override
    @Transactional
    public ReviewDTO addOrUpdateReview(
            Integer userId,
            Integer destinationId,
            Integer rating,
            String comment) {

        // Validate rating range
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        // Load user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Load destination
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new DestinationNotFoundException(
                        "Destination not found with id: " + destinationId));

        // Check if this user already reviewed this destination (upsert)
        Review review = reviewRepository
                .findByUser_UserIdAndDestination_DestinationId(userId, destinationId)
                .orElse(new Review());

        review.setUser(user);
        review.setDestination(destination);
        review.setRating(rating);
        review.setComment(comment != null ? comment.trim() : null);

        review = reviewRepository.save(review);

        // Recompute and persist the destination's average rating
        recomputeDestinationRating(destination);

        return toDTO(review);
    }

    // =========================================================
    // GET ALL REVIEWS FOR DESTINATION
    // =========================================================

    @Override
    public List<ReviewDTO> getReviewsForDestination(Integer destinationId) {

        if (!destinationRepository.existsById(destinationId)) {
            throw new DestinationNotFoundException(
                    "Destination not found with id: " + destinationId);
        }

        return reviewRepository
                .findByDestination_DestinationIdOrderByCreatedAtDesc(destinationId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // DELETE OWN REVIEW
    // =========================================================

    @Override
    @Transactional
    public void deleteReview(Integer userId, Integer destinationId) {

        Review review = reviewRepository
                .findByUser_UserIdAndDestination_DestinationId(userId, destinationId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "You have not reviewed this destination."));

        Destination destination = review.getDestination();

        reviewRepository.delete(review);

        // Recompute average after deletion
        recomputeDestinationRating(destination);
    }

    // =========================================================
    // PRIVATE HELPERS
    // =========================================================

    /**
     * Recomputes the average rating of a destination from all its reviews
     * and saves it back to the Destination entity.
     */
    private void recomputeDestinationRating(Destination destination) {
        Double avg = reviewRepository.findAverageRatingByDestinationId(
                destination.getDestinationId());

        // Round to 1 decimal place
        if (avg != null) {
            avg = Math.round(avg * 10.0) / 10.0;
        } else {
            avg = 0.0;
        }

        destination.setRating(avg);
        destinationRepository.save(destination);
    }

    /**
     * Convert Review entity → ReviewDTO.
     */
    private ReviewDTO toDTO(Review review) {
        return new ReviewDTO(
                review.getReviewId(),
                review.getUser().getUserId(),
                review.getUser().getName(),
                review.getDestination().getDestinationId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
