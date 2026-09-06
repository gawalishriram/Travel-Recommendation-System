package com.example.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;

import com.example.dto.DestinationDTO;
import com.example.dto.DestinationPageResponse;
import com.example.service.DestinationService;
import com.example.service.FileStorageService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    private final FileStorageService fileStorageService;

    public DestinationController(
            DestinationService destinationService,
            FileStorageService fileStorageService) {

        this.destinationService =
                destinationService;

        this.fileStorageService =
                fileStorageService;
    }

    // =====================================================
    // GET ALL DESTINATIONS
    // GET /destinations
    // =====================================================

    @GetMapping
    public ResponseEntity<List<DestinationDTO>>
            getAllDestinations() {

        return ResponseEntity.ok(
                destinationService.getAllDestinations()
        );
    }

    // =====================================================
    // GET DESTINATIONS WITH PAGINATION
    // GET /destinations/page?page=0&size=10
    // =====================================================

    @GetMapping("/page")
    public ResponseEntity<DestinationPageResponse>
            getDestinationsPaginated(
                    @RequestParam(defaultValue = "0") int page,
                    @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                destinationService.getDestinationsPaginated(
                        page,
                        size
                )
        );
    }

    // =====================================================
    // GET DESTINATION BY ID
    // GET /destinations/{id}
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<DestinationDTO>
            getDestinationById(
                    @PathVariable Integer id) {

        DestinationDTO destination =
                destinationService
                        .getDestinationById(id);

        if (destination == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(destination);
    }

    // =====================================================
    // ADD DESTINATION
    // POST /destinations
    // =====================================================

    @PostMapping
    public ResponseEntity<DestinationDTO>
            addDestination(
                    @Valid
                    @RequestBody
                    DestinationDTO destinationDTO) {

        sanitizeImageUrl(destinationDTO);

        DestinationDTO savedDestination =
                destinationService
                        .addDestination(destinationDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDestination);
    }

    // =====================================================
    // UPDATE DESTINATION
    // PUT /destinations/{id}
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<DestinationDTO>
            updateDestination(
                    @PathVariable Integer id,
                    @Valid
                    @RequestBody
                    DestinationDTO destinationDTO) {

        sanitizeImageUrl(destinationDTO);

        DestinationDTO updatedDestination =
                destinationService
                        .updateDestination(
                                id,
                                destinationDTO
                        );

        if (updatedDestination == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(
                updatedDestination
        );
    }

    // =====================================================
    // DELETE DESTINATION
    // DELETE /destinations/{id}
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>>
            deleteDestination(
                    @PathVariable Integer id) {

        DestinationDTO destination =
                destinationService
                        .getDestinationById(id);

        if (destination == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        destinationService.deleteDestination(id);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Destination deleted successfully."
                )
        );
    }

    // =====================================================
    // UPLOAD DESTINATION IMAGE
    // POST /destinations/upload-image
    // =====================================================

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file")
            MultipartFile file) {

        try {

            String imageUrl =
                    fileStorageService
                            .storeDestinationImage(file);

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "imageUrl", imageUrl
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message", e.getMessage()
                            )
                    );

        } catch (IOException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "success", false,
                                    "message", "Failed to upload image."
                            )
                    );
        }
    }

    // =====================================================
    // USER RATE DESTINATION
    // POST /destinations/{id}/rate
    // =====================================================

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateDestination(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {

        try {
            Object ratingObj = body.get("rating");
            if (ratingObj == null) {
                return ResponseEntity.badRequest().body(
                        Map.of("success", false, "message", "Rating value is required.")
                );
            }

            double rating = Double.parseDouble(ratingObj.toString());
            DestinationDTO updated = destinationService.rateDestination(id, rating);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Thank you! Your rating has been submitted.",
                    "rating", updated.getRating(),
                    "destination", updated
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("success", false, "message", "Error saving rating.")
            );
        }
    }

    private void sanitizeImageUrl(DestinationDTO dto) {
        if (dto != null && dto.getImageUrl() != null) {
            String url = dto.getImageUrl().trim();
            if (url.startsWith("{") && url.contains("imageUrl")) {
                java.util.regex.Matcher matcher =
                        java.util.regex.Pattern.compile("\"imageUrl\"\\s*:\\s*\"([^\"]+)\"").matcher(url);
                if (matcher.find()) {
                    dto.setImageUrl(matcher.group(1));
                }
            }
        }
    }
}