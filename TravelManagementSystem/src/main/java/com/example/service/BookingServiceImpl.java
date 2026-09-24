package com.example.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.dto.BookingDTO;
import com.example.dto.BookingRequest;
import com.example.exception.DestinationNotFoundException;
import com.example.exception.UserNotFoundException;
import com.example.model.Booking;
import com.example.model.Destination;
import com.example.model.User;
import com.example.repository.BookingRepository;
import com.example.repository.DestinationRepository;
import com.example.repository.UserRepository;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final DestinationRepository destinationRepository;

    public BookingServiceImpl(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            DestinationRepository destinationRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
    }

    @Override
    @Transactional
    public BookingDTO createBooking(Integer userId, BookingRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        Destination destination = destinationRepository.findById(request.getDestinationId())
            .orElseThrow(() -> new DestinationNotFoundException("Destination not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setDestination(destination);
        booking.setTravelDate(request.getTravelDate());
        booking.setNumberOfTravelers(request.getNumberOfTravelers());
        booking.setTotalAmount(destination.getBudget() * request.getNumberOfTravelers());
        booking.setStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);
        return convertToDTO(savedBooking);
    }

    @Override
    public List<BookingDTO> getUserBookings(Integer userId) {
        List<Booking> bookings = bookingRepository.findByUser_UserIdOrderByBookingDateDesc(userId);
        return bookings.stream().map(this::convertToDTO).toList();
    }

    @Override
    @Transactional
    public BookingDTO cancelBooking(Integer userId, Integer bookingId) {
        Booking booking = bookingRepository.findByBookingIdAndUser_UserId(bookingId, userId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found or not owned by user"));

        booking.setStatus("CANCELLED");
        Booking updated = bookingRepository.save(booking);
        return convertToDTO(updated);
    }

    @Override
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setUserId(booking.getUser().getUserId());
        dto.setUserName(booking.getUser().getName());
        dto.setDestinationId(booking.getDestination().getDestinationId());
        dto.setDestinationName(booking.getDestination().getName());
        dto.setDestinationImage(booking.getDestination().getImageUrl());
        dto.setTravelDate(booking.getTravelDate());
        dto.setNumberOfTravelers(booking.getNumberOfTravelers());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus());
        dto.setBookingDate(booking.getBookingDate());
        return dto;
    }
}