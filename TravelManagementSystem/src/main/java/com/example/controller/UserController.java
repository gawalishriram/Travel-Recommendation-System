package com.example.controller;

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

import com.example.dto.ApiResponse;
import com.example.dto.ForgotPasswordRequest;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.RegisterUserRequest;
import com.example.dto.ResetPasswordRequest;
import com.example.dto.UserPageResponse;
import com.example.dto.UserProfileResponse;
import com.example.dto.UserUpdateRequest;
import com.example.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================================================
    // USER REGISTRATION
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(
            @Valid @RequestBody RegisterUserRequest request) {

        userService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse(
                                true,
                                "User Registered Successfully"
                        )
                );
    }

    // =========================================================
    // USER LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                userService.loginUser(request)
        );
    }

    // =========================================================
    // USER PROFILE (GET by ID - Supports multiple aliases)
    // =========================================================

    @GetMapping({"/userProfile/{userId}", "/{userId}", "/admin/{userId}"})
    public ResponseEntity<UserProfileResponse> getUserProfile(
            @PathVariable Integer userId) {

        return ResponseEntity.ok(
                userService.getUserProfile(userId)
        );
    }

    // =========================================================
    // UPDATE USER PROFILE (PUT - Supports multiple aliases)
    // =========================================================

    @PutMapping({"/updateUser/{userId}", "/{userId}", "/admin/{userId}", "/admin/update/{userId}"})
    public ResponseEntity<UserProfileResponse> updateUser(
            @PathVariable Integer userId,
            @Valid @RequestBody UserUpdateRequest request) {

        return ResponseEntity.ok(
                userService.updateUser(
                        userId,
                        request
                )
        );
    }

    // =========================================================
    // ADMIN - GET ALL USERS
    // =========================================================

    @GetMapping("/admin/all")
    public ResponseEntity<UserPageResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                userService.getAllUsers(page, size)
        );
    }

    // =========================================================
    // ADMIN - DELETE USER
    // =========================================================

    @DeleteMapping("/admin/{userId}")
    public ResponseEntity<ApiResponse> deleteUser(
            @PathVariable Integer userId) {

        userService.deleteUser(userId);

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "User deleted successfully"
                )
        );
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                userService.forgotPassword(request)
        );
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(request);

        return ResponseEntity.ok(
                new ApiResponse(
                        true,
                        "Password has been reset successfully. You can now login with your new password."
                )
        );
    }
}