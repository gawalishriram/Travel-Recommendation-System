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

@Service
public class DestinationServiceImpl
        implements DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationServiceImpl(
            DestinationRepository destinationRepository) {

        this.destinationRepository =
                destinationRepository;
    }

    @Override
    public List<DestinationDTO> getAllDestinations() {

        return destinationRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public DestinationDTO getDestinationById(
            Integer id) {

        return destinationRepository
                .findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public DestinationDTO addDestination(
            DestinationDTO destinationDTO) {

        Destination destination =
                convertToEntity(destinationDTO);

        Destination savedDestination =
                destinationRepository.save(destination);

        return convertToDTO(savedDestination);
    }

    @Override
    public DestinationDTO updateDestination(
            Integer id,
            DestinationDTO destinationDTO) {

        return destinationRepository
                .findById(id)
                .map(existingDestination -> {

                    existingDestination.setName(
                            destinationDTO.getName()
                    );

                    existingDestination.setDescription(
                            destinationDTO.getDescription()
                    );

                    existingDestination.setBudget(
                            destinationDTO.getBudget()
                    );

                    existingDestination.setSeason(
                            destinationDTO.getSeason()
                    );

                    existingDestination.setCategory(
                            destinationDTO.getCategory()
                    );

                    existingDestination.setRating(
                            destinationDTO.getRating()
                    );

                    /*
                     * Only replace imageUrl when a new
                     * image URL is actually supplied.
                     */
                    if (destinationDTO.getImageUrl() != null
                            && !destinationDTO
                                .getImageUrl()
                                .isBlank()) {

                        existingDestination.setImageUrl(
                                destinationDTO.getImageUrl()
                        );
                    }

                    Destination updatedDestination =
                            destinationRepository.save(
                                    existingDestination
                            );

                    return convertToDTO(
                            updatedDestination
                    );
                })
                .orElse(null);
    }

    @Override
    public void deleteDestination(Integer id) {

        destinationRepository.deleteById(id);
    }

    @Override
    public DestinationPageResponse getDestinationsPaginated(
            int page,
            int size) {

        /*
         * Protect against invalid page.
         */
        if (page < 0) {
            page = 0;
        }

        /*
         * Protect against invalid size.
         */
        if (size <= 0) {
            size = 10;
        }

        /*
         * Maximum page size.
         */
        if (size > 100) {
            size = 100;
        }

        Pageable pageable =
                PageRequest.of(page, size);

        Page<Destination> destinationPage =
                destinationRepository.findAll(pageable);

        List<DestinationDTO> destinations =
                destinationPage
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

    private DestinationDTO convertToDTO(
            Destination destination) {

        DestinationDTO dto =
                new DestinationDTO();

        dto.setDestinationId(
                destination.getDestinationId()
        );

        dto.setName(
                destination.getName()
        );

        dto.setDescription(
                destination.getDescription()
        );

        dto.setBudget(
                destination.getBudget()
        );

        dto.setSeason(
                destination.getSeason()
        );

        dto.setCategory(
                destination.getCategory()
        );

        dto.setRating(
                destination.getRating()
        );

        dto.setImageUrl(
                destination.getImageUrl()
        );

        return dto;
    }

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
                // Smooth calculation: 70% current baseline + 30% user vote
                double updated = Math.round(((current * 0.7) + (rating * 0.3)) * 10.0) / 10.0;
                destination.setRating(updated);
            }
            Destination saved = destinationRepository.save(destination);
            return convertToDTO(saved);
        }).orElse(null);
    }

    private Destination convertToEntity(
            DestinationDTO dto) {

        Destination destination =
                new Destination();

        destination.setName(
                dto.getName()
        );

        destination.setDescription(
                dto.getDescription()
        );

        destination.setBudget(
                dto.getBudget()
        );

        destination.setSeason(
                dto.getSeason()
        );

        destination.setCategory(
                dto.getCategory()
        );

        destination.setRating(
                dto.getRating()
        );

        destination.setImageUrl(
                dto.getImageUrl()
        );

        return destination;
    }
}