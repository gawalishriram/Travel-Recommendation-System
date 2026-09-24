package com.example.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.model.Admin;
import com.example.repository.AdminRepository;

@Configuration
public class AdminDataInitializer {

    @Bean
    CommandLineRunner createDefaultAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            createOrUpdateAdmin(adminRepository, passwordEncoder, "admin@travelai.com", "admin123");
            createOrUpdateAdmin(adminRepository, passwordEncoder, "admin@gmail.com", "admin123");
            createOrUpdateAdmin(adminRepository, passwordEncoder, "admin", "admin123");
            createOrUpdateAdmin(adminRepository, passwordEncoder, "gawalishriram8@gmail.com", "Shriram@8080");

            System.out.println("Default ADMIN accounts initialized successfully.");
        };
    }

    private void createOrUpdateAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            String email,
            String rawPassword) {

        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (admin == null) {
            admin = new Admin();
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(rawPassword));
            admin.setRole("ADMIN");
            adminRepository.save(admin);
            System.out.println("Created admin account: " + email);
        } else {
            // Ensure valid password hash
            if (!passwordEncoder.matches(rawPassword, admin.getPassword()) && !rawPassword.equals(admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(rawPassword));
                admin.setRole("ADMIN");
                adminRepository.save(admin);
                System.out.println("Updated password for admin: " + email);
            }
        }
    }
}