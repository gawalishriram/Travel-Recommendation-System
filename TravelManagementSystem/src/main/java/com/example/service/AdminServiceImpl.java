package com.example.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.dto.AdminLoginRequest;
import com.example.dto.AdminLoginResponse;
import com.example.exception.InvalidCredentialsException;
import com.example.model.Admin;
import com.example.repository.AdminRepository;
import com.example.security.JwtService;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminServiceImpl(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AdminLoginResponse loginAdmin(AdminLoginRequest request) {
        if (request == null || request.getEmail() == null || request.getPassword() == null) {
            throw new InvalidCredentialsException("Email and password are required");
        }

        String rawEmail = request.getEmail().trim();
        String rawPassword = request.getPassword().trim();

        // 1. Try exact email or lowercase email
        Admin admin = adminRepository.findByEmail(rawEmail)
                .or(() -> adminRepository.findByEmail(rawEmail.toLowerCase()))
                .orElse(null);

        // 2. If not found and input does not contain @, try with @travelai.com or @gmail.com
        if (admin == null && !rawEmail.contains("@")) {
            admin = adminRepository.findByEmail(rawEmail + "@travelai.com")
                    .or(() -> adminRepository.findByEmail(rawEmail + "@gmail.com"))
                    .orElse(null);
        }

        if (admin == null) {
            throw new InvalidCredentialsException("Invalid admin email or password");
        }

        // Check password (BCrypt or plain-text fallback)
        boolean passwordMatches = passwordEncoder.matches(rawPassword, admin.getPassword())
                || rawPassword.equals(admin.getPassword());

        if (!passwordMatches) {
            throw new InvalidCredentialsException("Invalid admin email or password");
        }

        // If stored as plain-text, upgrade to BCrypt
        if (rawPassword.equals(admin.getPassword()) && !admin.getPassword().startsWith("$2a$") && !admin.getPassword().startsWith("$2b$")) {
            admin.setPassword(passwordEncoder.encode(rawPassword));
            adminRepository.save(admin);
        }

        // Generate token
        String token = jwtService.generateToken(
                admin.getAdminId(),
                admin.getEmail(),
                "ADMIN"
        );

        return new AdminLoginResponse(
                true,
                admin.getAdminId(),
                admin.getEmail(),
                "ADMIN",
                token,
                "Admin login successful"
        );
    }
}