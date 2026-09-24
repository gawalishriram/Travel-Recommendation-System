package com.example.service;

import java.util.List;

import com.example.dto.DestinationDTO;
import com.example.dto.DestinationPageResponse;

public interface DestinationService {

    List<DestinationDTO> getAllDestinations();

    DestinationDTO getDestinationById(Integer id);

    DestinationDTO addDestination(DestinationDTO destinationDTO);

    DestinationDTO updateDestination(Integer id, DestinationDTO destinationDTO);

    void deleteDestination(Integer id);

    DestinationPageResponse getDestinationsPaginated(int page, int size);

    DestinationDTO rateDestination(Integer id, Double rating);

    /**
     * Full-text search across destinations with optional filters.
     *
     * @param keyword   Free-text keyword (matches name, category, season, location)
     * @param category  Exact category filter (nullable)
     * @param season    Exact season filter (nullable)
     * @param minBudget Minimum budget (nullable)
     * @param maxBudget Maximum budget (nullable)
     * @return Matching destinations sorted by rating DESC
     */
    List<DestinationDTO> searchDestinations(
            String keyword,
            String category,
            String season,
            Double minBudget,
            Double maxBudget
    );
}