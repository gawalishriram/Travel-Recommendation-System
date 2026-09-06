package com.example.service;

import java.util.List;

import com.example.dto.DestinationDTO;
import com.example.dto.DestinationPageResponse;

public interface DestinationService {

    List<DestinationDTO> getAllDestinations();

    DestinationDTO getDestinationById(
            Integer id
    );

    DestinationDTO addDestination(
            DestinationDTO destinationDTO
    );

    DestinationDTO updateDestination(
            Integer id,
            DestinationDTO destinationDTO
    );

    void deleteDestination(
            Integer id
    );

    DestinationPageResponse getDestinationsPaginated(
            int page,
            int size
    );

    DestinationDTO rateDestination(
            Integer id,
            Double rating
    );
}