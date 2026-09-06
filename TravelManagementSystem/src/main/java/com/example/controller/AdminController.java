package com.example.controller;

import com.example.dto.AdminLoginRequest;
import com.example.dto.AdminLoginResponse;
import com.example.service.AdminService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:8090")
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService) {

        this.adminService = adminService;
    }

    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<AdminLoginResponse> loginAdmin(
            @RequestBody
            AdminLoginRequest request) {

        return ResponseEntity.ok(
                adminService.loginAdmin(request)
        );
    }
}