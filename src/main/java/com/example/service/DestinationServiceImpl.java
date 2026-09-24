package com.example.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.dto.DestinationDTO;
import com.example.dto.DestinationPageResponse;
import com.example.model.Destination;
import com.example.repository.DestinationRepository;
import com.example.repository.ReviewRepository;

@Service
public class DestinationServiceImpl
        implements DestinationService {

    private final DestinationRepository destinationRepository;
    private final ReviewRepository reviewRepository;

    public DestinationServiceImpl(
            DestinationRepository destinationRepository,
            ReviewRepository reviewRepository) {

        this.destinationRepository = destinationRepository;
        this.reviewRepository = reviewRepository;
    }

    // =====================================================
    // GET ALL DESTINATIONS
    // =====================================================

    @Override
    public List<DestinationDTO> getAllDestinations() {
        return destinationRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =====================================================
    // GET DESTINATION BY ID (with review count)
    // =====================================================

    @Override
    public DestinationDTO getDestinationById(Integer id) {
        return destinationRepository
                .findById(id)
                .map(dest -> {
                    DestinationDTO dto = convertToDTO(dest);
                    long count = reviewRepository.countByDestination_DestinationId(id);
                    dto.setReviewCount((int) count);
                    return dto;
                })
                .orElse(null);
    }

    // =====================================================
    // ADD DESTINATION
    // =====================================================

    @Override
    public DestinationDTO addDestination(DestinationDTO destinationDTO) {
        Destination destination = convertToEntity(destinationDTO);
        Destination savedDestination = destinationRepository.save(destination);
        return convertToDTO(savedDestination);
    }

    // =====================================================
    // UPDATE DESTINATION
    // =====================================================

    @Override
    public DestinationDTO updateDestination(Integer id, DestinationDTO destinationDTO) {

        return destinationRepository
                .findById(id)
                .map(existingDestination -> {

                    existingDestination.setName(destinationDTO.getName());
                    existingDestination.setDescription(destinationDTO.getDescription());
                    existingDestination.setBudget(destinationDTO.getBudget());
                    existingDestination.setSeason(destinationDTO.getSeason());
                    existingDestination.setCategory(destinationDTO.getCategory());

                    // Rating is now computed from reviews — only allow manual override
                    // when reviewCount is zero (i.e. admin seeds initial rating)
                    long reviewCount = reviewRepository.countByDestination_DestinationId(id);
                    if (reviewCount == 0 && destinationDTO.getRating() != null) {
                        existingDestination.setRating(destinationDTO.getRating());
                    }

                    // Only replace imageUrl when a new one is supplied
                    if (destinationDTO.getImageUrl() != null
                            && !destinationDTO.getImageUrl().isBlank()) {
                        existingDestination.setImageUrl(destinationDTO.getImageUrl());
                    }

                    // Rich detail fields
                    if (destinationDTO.getLocation() != null) {
                        existingDestination.setLocation(destinationDTO.getLocation().trim());
                    }
                    if (destinationDTO.getHighlights() != null) {
                        existingDestination.setHighlights(destinationDTO.getHighlights().trim());
                    }
                    if (destinationDTO.getBestTimeToVisit() != null) {
                        existingDestination.setBestTimeToVisit(
                                destinationDTO.getBestTimeToVisit().trim());
                    }

                    Destination updatedDestination = destinationRepository.save(existingDestination);
                    return convertToDTO(updatedDestination);
                })
                .orElse(null);
    }

    // =====================================================
    // DELETE DESTINATION
    // =====================================================

    @Override
    public void deleteDestination(Integer id) {
        destinationRepository.deleteById(id);
    }

    // =====================================================
    // PAGINATED
    // =====================================================

    @Override
    public DestinationPageResponse getDestinationsPaginated(int page, int size) {

        if (page < 0) page = 0;
        if (size <= 0) size = 10;
        if (size > 100) size = 100;

        Pageable pageable = PageRequest.of(page, size);
        Page<Destination> destinationPage = destinationRepository.findAll(pageable);

        List<DestinationDTO> destinations = destinationPage
                .getContent()
                .stream()
                .map(this::convertToDTO)
                .toList();

        return new DestinationPageResponse(
                destinations,
                destinationPage.getNumber(),
                destinationPage.getTotalPages(),
                destinationPage.getTotalElements(),
                destinationPage.getSize()
        );
    }

    // =====================================================
    // RATE DESTINATION (legacy endpoint — kept for compat)
    // =====================================================

    @Override
    public DestinationDTO rateDestination(Integer id, Double rating) {
        if (rating == null || rating < 1.0 || rating > 5.0) {
            throw new IllegalArgumentException("Rating must be between 1.0 and 5.0");
        }

        return destinationRepository.findById(id).map(destination -> {
            Double current = destination.getRating();
            if (current == null || current == 0.0) {
                destination.setRating(rating);
            } else {
                // Smooth weighted calculation
                double updated = Math.round(((current * 0.7) + (rating * 0.3)) * 10.0) / 10.0;
                destination.setRating(updated);
            }
            Destination saved = destinationRepository.save(destination);
            return convertToDTO(saved);
        }).orElse(null);
    }

    // =====================================================
    // SEARCH DESTINATIONS
    // =====================================================

    @Override
    public List<DestinationDTO> searchDestinations(
            String keyword,
            String category,
            String season,
            Double minBudget,
            Double maxBudget) {

        // Normalize empty strings to null so JPQL IS NULL check works
        String kw  = (keyword  != null && !keyword.isBlank())  ? keyword.trim()  : null;
        String cat = (category != null && !category.isBlank()) ? category.trim() : null;
        String sea = (season   != null && !season.isBlank())   ? season.trim()   : null;

        return destinationRepository
                .searchWithFilters(kw, cat, sea, minBudget, maxBudget)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    // =====================================================
    // CONVERT: Entity → DTO
    // =====================================================

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
        return dto;
    }

    // =====================================================
    // CONVERT: DTO → Entity
    // =====================================================

    private Destination convertToEntity(DestinationDTO dto) {
        Destination destination = new Destination();
        destination.setName(dto.getName());
        destination.setDescription(dto.getDescription());
        destination.setBudget(dto.getBudget());
        destination.setSeason(dto.getSeason());
        destination.setCategory(dto.getCategory());
        destination.setRating(dto.getRating() != null ? dto.getRating() : 0.0);
        destination.setImageUrl(dto.getImageUrl());
        if (dto.getLocation() != null) {
            destination.setLocation(dto.getLocation().trim());
        }
        if (dto.getHighlights() != null) {
            destination.setHighlights(dto.getHighlights().trim());
        }
        if (dto.getBestTimeToVisit() != null) {
            destination.setBestTimeToVisit(dto.getBestTimeToVisit().trim());
        }
        return destination;
    }
}