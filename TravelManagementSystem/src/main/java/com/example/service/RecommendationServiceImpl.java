package com.example.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.dto.DestinationDTO;
import com.example.dto.RecommendationRequest;
import com.example.model.Destination;
import com.example.repository.DestinationRepository;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final DestinationRepository destinationRepository;

    public RecommendationServiceImpl(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Override
    public List<DestinationDTO> getRecommendations(RecommendationRequest request) {
        List<Destination> allDestinations = destinationRepository.findAll();

        Double budget = request.getBudget() != null ? request.getBudget() : Double.MAX_VALUE;
        String season = request.getSeason() != null ? request.getSeason().trim() : "";
        String travelType = request.getTravelType() != null ? request.getTravelType().trim() : "";

        return allDestinations.stream()
            .filter(d -> d.getBudget() == null || d.getBudget() <= budget)
            .filter(d -> season.equalsIgnoreCase("Any")
                    || season.isBlank()
                    || (d.getSeason() != null && d.getSeason().equalsIgnoreCase(season)))
            .filter(d -> travelType.equalsIgnoreCase("Any")
                    || travelType.isBlank()
                    || (d.getCategory() != null && d.getCategory().equalsIgnoreCase(travelType)))
            .sorted(Comparator.comparingDouble(
                    (Destination d) -> d.getRating() != null ? d.getRating() : 0.0
            ).reversed())
            .map(this::convertToDTO)
            .toList();
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
        return dto;
    }
}