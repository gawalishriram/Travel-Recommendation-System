package com.example.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.dto.DestinationDTO;
import com.example.dto.RecommendationRequest;
import com.example.model.Destination;
import com.example.repository.DestinationRepository;
import com.example.repository.ReviewRepository;

// =========================================================
// RecommendationServiceImpl — Enhanced engine
//
// Filters by:  budget ≤ user budget
//              season  match (or "Any")
//              travelType / category match (or "Any")
//              optional keyword in name / location / highlights
//
// Scores each destination and sorts:
//   PRIMARY  : rating DESC (higher rated first)
//   SECONDARY: budget proximity (closer to user's budget wins)
// =========================================================

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final DestinationRepository destinationRepository;
    private final ReviewRepository reviewRepository;

    public RecommendationServiceImpl(
            DestinationRepository destinationRepository,
            ReviewRepository reviewRepository) {

        this.destinationRepository = destinationRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public List<DestinationDTO> getRecommendations(RecommendationRequest request) {

        List<Destination> allDestinations = destinationRepository.findAll();

        Double maxBudget = request.getBudget() != null ? request.getBudget() : Double.MAX_VALUE;
        String season    = normalize(request.getSeason());
        String travelType = normalize(request.getTravelType());
        String keyword   = normalize(request.getKeyword());

        return allDestinations.stream()
                // Budget filter
                .filter(d -> d.getBudget() == null || d.getBudget() <= maxBudget)

                // Season filter — "any" / blank = all seasons
                .filter(d -> season.isEmpty()
                        || season.equalsIgnoreCase("any")
                        || (d.getSeason() != null && d.getSeason().equalsIgnoreCase(season)))

                // Travel-type / category filter
                .filter(d -> travelType.isEmpty()
                        || travelType.equalsIgnoreCase("any")
                        || (d.getCategory() != null && d.getCategory().equalsIgnoreCase(travelType)))

                // Optional keyword search across name, category, location, highlights
                .filter(d -> keyword.isEmpty() || matchesKeyword(d, keyword))

                // Sort: rating DESC, then budget proximity ASC
                .sorted(
                    Comparator.comparingDouble((Destination d) ->
                            d.getRating() != null ? d.getRating() : 0.0
                    ).reversed()
                    .thenComparingDouble(d ->
                            d.getBudget() != null
                                    ? Math.abs(d.getBudget() - maxBudget)
                                    : 0.0
                    )
                )
                .map(this::convertToDTO)
                .toList();
    }

    // =====================================================
    // PRIVATE HELPERS
    // =====================================================

    /**
     * Returns true if the destination's name, category, season,
     * location, or highlights contain the keyword.
     */
    private boolean matchesKeyword(Destination d, String keyword) {
        String kw = keyword.toLowerCase();
        return contains(d.getName(), kw)
                || contains(d.getCategory(), kw)
                || contains(d.getSeason(), kw)
                || contains(d.getLocation(), kw)
                || contains(d.getHighlights(), kw)
                || contains(d.getDescription(), kw);
    }

    private boolean contains(String field, String keyword) {
        return field != null && field.toLowerCase().contains(keyword);
    }

    private String normalize(String value) {
        return value != null ? value.trim() : "";
    }

    private DestinationDTO convertToDTO(Destination destination) {
        DestinationDTO dto = new DestinationDTO();
        dto.setDestinationId(destination.getDestinationId());
        dto.setName(destination.getName());
        dto.setDescription(destination.getDescription());
        dto.setBudget(destination.getBudget());
        dto.setSeason(destination.getSeason());
        dto.setCategory(destination.getCategory());
        dto.setRating(destination.getRating());
        dto.setImageUrl(destination.getImageUrl());
        dto.setLocation(destination.getLocation());
        dto.setHighlights(destination.getHighlights());
        dto.setBestTimeToVisit(destination.getBestTimeToVisit());
        // Attach review count
        long reviewCount = reviewRepository.countByDestination_DestinationId(
                destination.getDestinationId());
        dto.setReviewCount((int) reviewCount);
        return dto;
    }
}