package com.example.service;

import com.example.dto.AdminLoginRequest;
import com.example.dto.AdminLoginResponse;

public interface AdminService {

    AdminLoginResponse loginAdmin(
            AdminLoginRequest request
    );
}