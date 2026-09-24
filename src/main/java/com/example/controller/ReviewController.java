package com.example.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.ReviewDTO;
import com.example.dto.ReviewRequest;
import com.example.service.ReviewService;

import jakarta.validation.Valid;

// =========================================================
// ReviewController
//
//  GET  /destinations/{id}/reviews       — Public: list all reviews
//  POST /destinations/{id}/review        — USER: submit / update review
//  DELETE /destinations/{id}/review      — USER: delete own review
// =========================================================

@RestController
@RequestMapping("/destinations")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // =====================================================
    // GET ALL REVIEWS FOR A DESTINATION
    // GET /destinations/{id}/reviews
    // =====================================================

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewDTO>> getReviews(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                reviewService.getReviewsForDestination(id)
        );
    }

    // =====================================================
    // SUBMIT OR UPDATE OWN REVIEW
    // POST /destinations/{id}/review
    // Requires: USER role (JWT)
    // =====================================================

    @PostMapping("/{id}/review")
    public ResponseEntity<?> submitReview(
            @PathVariable Integer id,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {

        Integer userId = extractUserId(authentication);

        ReviewDTO saved = reviewService.addOrUpdateReview(
                userId,
                id,
                request.getRating(),
                request.getComment()
        );

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Thank you! Your review has been saved.",
                "review", saved
        ));
    }

    // =====================================================
    // DELETE OWN REVIEW
    // DELETE /destinations/{id}/review
    // Requires: USER role (JWT)
    // =====================================================

    @DeleteMapping("/{id}/review")
    public ResponseEntity<?> deleteReview(
            @PathVariable Integer id,
            Authentication authentication) {

        Integer userId = extractUserId(authentication);

        reviewService.deleteReview(userId, id);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Your review has been deleted."
        ));
    }

    // =====================================================
    // PRIVATE HELPER — extract userId from JWT principal
    // =====================================================

    private Integer extractUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalStateException("User not authenticated.");
        }
        try {
            return Integer.parseInt(authentication.getName());
        } catch (NumberFormatException e) {
            throw new IllegalStateException("Invalid authenticated user.");
        }
    }
}
