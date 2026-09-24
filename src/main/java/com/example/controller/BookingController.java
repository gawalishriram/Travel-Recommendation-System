package com.example.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.BookingDTO;
import com.example.dto.BookingRequest;
import com.example.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/bookings", "/api/bookings"})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@Valid @RequestBody BookingRequest request) {
        Integer userId = getCurrentUserId();
        BookingDTO booking = bookingService.createBooking(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping({"", "/my"})
    public ResponseEntity<List<BookingDTO>> getMyBookings() {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @PutMapping({"/cancel/{bookingId}", "/{bookingId}/cancel"})
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Integer bookingId) {
        Integer userId = getCurrentUserId();
        return ResponseEntity.ok(bookingService.cancelBooking(userId, bookingId));
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<BookingDTO>> getAllBookingsAdmin() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return Integer.valueOf(auth.getName());
    }
}