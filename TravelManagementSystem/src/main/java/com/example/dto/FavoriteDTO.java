package com.example.dto;

import java.sql.Timestamp;

public class FavoriteDTO {

    private Integer favoriteId;
    private Integer destinationId;
    private String name;
    private String destinationName;
    private String description;
    private Double budget;
    private Double price;
    private String season;
    private String category;
    private Double rating;
    private String imageUrl;
    private String image;
    private Timestamp createdAt;

    public FavoriteDTO() {
    }

    public Integer getFavoriteId() {
        return favoriteId;
    }

    public void setFavoriteId(Integer favoriteId) {
        this.favoriteId = favoriteId;
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
        this.destinationName = name;
    }

    public String getDestinationName() {
        return destinationName != null ? destinationName : name;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
        this.name = destinationName;
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
        this.price = budget;
    }

    public Double getPrice() {
        return price != null ? price : budget;
    }

    public void setPrice(Double price) {
        this.price = price;
        this.budget = price;
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
        this.image = imageUrl;
    }

    public String getImage() {
        return image != null ? image : imageUrl;
    }

    public void setImage(String image) {
        this.image = image;
        this.imageUrl = image;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}