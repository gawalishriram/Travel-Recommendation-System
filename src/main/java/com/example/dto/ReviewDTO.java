package com.example.dto;

import java.sql.Timestamp;

// =========================================================
// ReviewDTO — Sent to frontend when listing reviews
// for a destination's detail page.
// =========================================================

public class ReviewDTO {

    private Integer reviewId;

    private Integer userId;

    private String userName;

    private Integer destinationId;

    private Integer rating;

    private String comment;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    // =====================================================
    // CONSTRUCTORS
    // =====================================================

    public ReviewDTO() {
    }

    public ReviewDTO(
            Integer reviewId,
            Integer userId,
            String userName,
            Integer destinationId,
            Integer rating,
            String comment,
            Timestamp createdAt,
            Timestamp updatedAt) {

        this.reviewId = reviewId;
        this.userId = userId;
        this.userName = userName;
        this.destinationId = destinationId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // =====================================================
    // GETTERS & SETTERS
    // =====================================================

    public Integer getReviewId() {
        return reviewId;
    }

    public void setReviewId(Integer reviewId) {
        this.reviewId = reviewId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Integer destinationId) {
        this.destinationId = destinationId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
