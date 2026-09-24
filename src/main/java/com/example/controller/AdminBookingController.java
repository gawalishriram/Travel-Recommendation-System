package com.example.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.BookingDTO;
import com.example.service.BookingService;

/**
 * Controller providing admin‑only endpoints for managing bookings.
 *
 * The existing {@link BookingController} exposes user‑focused endpoints under
 * {@code /bookings} and {@code /api/bookings}.  Some front‑end code expects the
 * admin endpoint to be available at {@code /admin/bookings} rather than the
 * nested path {@code /bookings/admin/all}.  To maintain backward compatibility
 * while fixing the UI, we introduce this dedicated controller that maps to the
 * expected URL.
 */
@RestController
@RequestMapping("/admin/bookings")
public class AdminBookingController {

    private final BookingService bookingService;

    public AdminBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * Returns all bookings in the system.  This endpoint is intended for admin
     * users; security configuration should restrict access accordingly.
     */
    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}
