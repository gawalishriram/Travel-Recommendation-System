package com.example.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RecommendationRequest {

    @NotNull(message = "Budget is required")
    @DecimalMin(value = "0.0", message = "Budget must be positive")
    private Double budget;

    @NotBlank(message = "Season is required")
    private String season;

    private String travelType;
    private String category;

    public RecommendationRequest() {
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

    public String getTravelType() {
        return travelType != null ? travelType : category;
    }

    public void setTravelType(String travelType) {
        this.travelType = travelType;
        this.category = travelType;
    }

    public String getCategory() {
        return category != null ? category : travelType;
    }

    public void setCategory(String category) {
        this.category = category;
        this.travelType = category;
    }
}