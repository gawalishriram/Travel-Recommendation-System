package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUser_UserIdOrderByBookingDateDesc(Integer userId);

    Optional<Booking> findByBookingIdAndUser_UserId(Integer bookingId, Integer userId);
}