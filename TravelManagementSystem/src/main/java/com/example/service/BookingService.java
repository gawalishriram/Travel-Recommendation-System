package com.example.service;

import java.util.List;

import com.example.dto.BookingDTO;
import com.example.dto.BookingRequest;

public interface BookingService {

    BookingDTO createBooking(Integer userId, BookingRequest request);

    List<BookingDTO> getUserBookings(Integer userId);

    BookingDTO cancelBooking(Integer userId, Integer bookingId);

    List<BookingDTO> getAllBookings();
}