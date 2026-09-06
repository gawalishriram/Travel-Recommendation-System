package com.example.service;

import java.util.List;

import com.example.dto.DestinationDTO;
import com.example.dto.RecommendationRequest;

public interface RecommendationService {

    List<DestinationDTO> getRecommendations(RecommendationRequest request);
}