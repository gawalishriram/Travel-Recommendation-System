package com.example.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.dto.AdminDashboardResponse;
import com.example.dto.UserAdminResponse;
import com.example.model.User;
import com.example.repository.BookingRepository;
import com.example.repository.DestinationRepository;
import com.example.repository.UserRepository;

@Service
public class AdminDashboardServiceImpl
        implements AdminDashboardService {


    private final UserRepository userRepository;

    private final DestinationRepository destinationRepository;

    private final BookingRepository bookingRepository;


    public AdminDashboardServiceImpl(
            UserRepository userRepository,
            DestinationRepository destinationRepository,
            BookingRepository bookingRepository) {

        this.userRepository = userRepository;
        this.destinationRepository = destinationRepository;
        this.bookingRepository = bookingRepository;
    }


    @Override
    public AdminDashboardResponse
            getDashboardSummary() {


        long totalUsers =
                userRepository.count();


        long totalDestinations =
                destinationRepository.count();

        long totalBookings =
                bookingRepository.count();


        // =====================================================
        // GENDER COUNTS
        // =====================================================

        long maleCount =
                userRepository.countByGenderIgnoreCase("Male");

        long femaleCount =
                userRepository.countByGenderIgnoreCase("Female");

        long otherGenderCount =
                totalUsers - maleCount - femaleCount;


        // =====================================================
        // LOGGED-IN USERS
        // =====================================================

        List<User> loggedInUserEntities =
                userRepository
                        .findByLastLoginAtIsNotNullOrderByLastLoginAtDesc();

        List<UserAdminResponse> loggedInUsers =
                loggedInUserEntities
                        .stream()
                        .map(user ->
                                new UserAdminResponse(
                                        user.getUserId(),
                                        user.getName(),
                                        user.getEmail(),
                                        user.getMobile(),
                                        user.getGender(),
                                        user.getAddress(),
                                        user.getCreatedAt()
                                )
                        )
                        .toList();


        return new AdminDashboardResponse(
                totalUsers,
                totalDestinations,
                totalBookings,
                maleCount,
                femaleCount,
                otherGenderCount,
                loggedInUsers
        );
    }
}