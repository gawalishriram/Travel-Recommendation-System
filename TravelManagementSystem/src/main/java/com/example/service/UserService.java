package com.example.service;

import java.util.Map;

import com.example.dto.ForgotPasswordRequest;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.RegisterUserRequest;
import com.example.dto.ResetPasswordRequest;
import com.example.dto.UserPageResponse;
import com.example.dto.UserProfileResponse;
import com.example.dto.UserUpdateRequest;

public interface UserService {

    void registerUser(RegisterUserRequest request);

    LoginResponse loginUser(LoginRequest request);

    UserProfileResponse getUserProfile(Integer userId);

    UserProfileResponse updateUser(
            Integer userId,
            UserUpdateRequest request
    );

    UserPageResponse getAllUsers(
            int page,
            int size
    );

    void deleteUser(Integer userId);

    Map<String, Object> forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}