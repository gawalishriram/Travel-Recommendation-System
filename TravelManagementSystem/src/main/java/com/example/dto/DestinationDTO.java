package com.example.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DestinationDTO {

    private Integer destinationId;

    @NotBlank(message = "Destination name is required")
    @Size(
        max = 100,
        message = "Destination name must not exceed 100 characters"
    )
    private String name;

    @NotBlank(message = "Description is required")
    @Size(
        max = 1000,
        message = "Description must not exceed 1000 characters"
    )
    private String description;

    @NotNull(message = "Budget is required")
    @DecimalMin(
        value = "0.0",
        message = "Budget cannot be negative"
    )
    private Double budget;

    @NotBlank(message = "Season is required")
    private String season;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Rating is required")
    @DecimalMin(
        value = "0.0",
        message = "Rating cannot be less than 0"
    )
    @DecimalMax(
        value = "5.0",
        message = "Rating cannot be greater than 5"
    )
    private Double rating;

    private String imageUrl;

    public DestinationDTO() {
    }

    public Integer getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Integer destinationId) {
        this.destinationId = destinationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}