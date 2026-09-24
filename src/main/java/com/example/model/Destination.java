package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "destinations")
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer destinationId;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double budget;

    private String season;

    private String category;

    private Double rating;

    @Column(name = "image_url")
    private String imageUrl;

    // =====================================================
    // RICH DETAIL FIELDS
    // =====================================================

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "highlights", columnDefinition = "TEXT")
    private String highlights;

    @Column(name = "best_time_to_visit", length = 100)
    private String bestTimeToVisit;

    // =====================================================
    // CONSTRUCTORS
    // =====================================================

    public Destination() {
    }

    public Destination(
            Integer destinationId,
            String name,
            String description,
            Double budget,
            String season,
            String category,
            Double rating,
            String imageUrl) {

        this.destinationId = destinationId;
        this.name = name;
        this.description = description;
        this.budget = budget;
        this.season = season;
        this.category = category;
        this.rating = rating;
        this.imageUrl = imageUrl;
    }

    // =====================================================
    // GETTERS & SETTERS
    // =====================================================

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getHighlights() {
        return highlights;
    }

    public void setHighlights(String highlights) {
        this.highlights = highlights;
    }

    public String getBestTimeToVisit() {
        return bestTimeToVisit;
    }

    public void setBestTimeToVisit(String bestTimeToVisit) {
        this.bestTimeToVisit = bestTimeToVisit;
    }
}