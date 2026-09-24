package com.example.controller;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.LoginRequest;
import com.example.model.Admin;
import com.example.model.User;
import com.example.repository.AdminRepository;
import com.example.repository.UserRepository;
import com.example.security.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping({"/auth", "/api/auth"})
@CrossOrigin(origins = "http://localhost:8090")
public class AuthController {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AdminRepository adminRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> unifiedLogin(@Valid @RequestBody LoginRequest request) {
        String rawInput = request.getEmail().trim();
        String rawPassword = request.getPassword().trim();

        // 1. Try Authenticating as ADMIN first
        Admin admin = adminRepository.findByEmail(rawInput)
                .or(() -> adminRepository.findByEmail(rawInput.toLowerCase()))
                .orElse(null);

        if (admin == null && !rawInput.contains("@")) {
            admin = adminRepository.findByEmail(rawInput + "@travelai.com")
                    .or(() -> adminRepository.findByEmail(rawInput + "@gmail.com"))
                    .orElse(null);
        }

        if (admin != null) {
            boolean adminPassMatches = passwordEncoder.matches(rawPassword, admin.getPassword())
                    || rawPassword.equals(admin.getPassword());

            if (adminPassMatches) {
                if (rawPassword.equals(admin.getPassword()) && !admin.getPassword().startsWith("$2a$") && !admin.getPassword().startsWith("$2b$")) {
                    admin.setPassword(passwordEncoder.encode(rawPassword));
                    adminRepository.save(admin);
                }

                String token = jwtService.generateToken(admin.getAdminId(), admin.getEmail(), "ADMIN");

                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("role", "ADMIN");
                resp.put("token", token);
                resp.put("adminId", admin.getAdminId());
                resp.put("email", admin.getEmail());
                resp.put("message", "Admin Login Successful");

                return ResponseEntity.ok(resp);
            }
        }

        // 2. Try Authenticating as USER
        User user = userRepository.findByEmail(rawInput.toLowerCase())
                .or(() -> userRepository.findByEmail(rawInput))
                .orElse(null);

        if (user != null) {
            boolean userPassMatches = passwordEncoder.matches(rawPassword, user.getPassword())
                    || rawPassword.equals(user.getPassword());

            if (userPassMatches) {
                if (rawPassword.equals(user.getPassword()) && !user.getPassword().startsWith("$2a$") && !user.getPassword().startsWith("$2b$")) {
                    user.setPassword(passwordEncoder.encode(rawPassword));
                }

                user.setLastLoginAt(new Timestamp(System.currentTimeMillis()));
                userRepository.save(user);

                String token = jwtService.generateToken(user.getUserId(), user.getEmail(), "USER");

                Map<String, Object> resp = new HashMap<>();
                resp.put("success", true);
                resp.put("role", "USER");
                resp.put("token", token);
                resp.put("userId", user.getUserId());
                resp.put("name", user.getName());
                resp.put("email", user.getEmail());
                resp.put("message", "User Login Successful");

                return ResponseEntity.ok(resp);
            }
        }

        // 3. Neither matched
        Map<String, Object> err = new HashMap<>();
        err.put("success", false);
        err.put("message", "Invalid email/username or password.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
    }
}
