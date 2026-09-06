package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // -------------------------------------------------
            // CSRF
            // -------------------------------------------------

            .csrf(csrf -> csrf.disable())

            // -------------------------------------------------
            // CORS
            // -------------------------------------------------

            .cors(cors -> {})

            // -------------------------------------------------
            // STATELESS JWT
            // -------------------------------------------------

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // -------------------------------------------------
            // AUTHORIZATION
            // -------------------------------------------------

            .authorizeHttpRequests(auth -> auth

                // CORS preflight
                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Public authentication & recommendations APIs
                .requestMatchers(
                    "/auth/**",
                    "/api/auth/**",
                    "/users/register",
                    "/users/login",
                    "/users/forgot-password",
                    "/users/reset-password",
                    "/admin/login",
                    "/recommendations/**",
                    "/api/recommend/**"
                ).permitAll()

                // Destination images
                .requestMatchers(
                    "/uploads/destinations/**"
                ).permitAll()

                // Public/User viewing of destinations
                .requestMatchers(
                    HttpMethod.GET,
                    "/destinations",
                    "/destinations/page",
                    "/destinations/**"
                ).permitAll()

                // User & Admin destination rating
                .requestMatchers(
                    HttpMethod.POST,
                    "/destinations/*/rate",
                    "/destinations/rate/**"
                ).hasAnyRole("USER", "ADMIN")

                // Admin destination modifications
                .requestMatchers(
                    HttpMethod.POST,
                    "/destinations",
                    "/destinations/upload-image"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PUT,
                    "/destinations/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE,
                    "/destinations/**"
                ).hasRole("ADMIN")

                // Admin APIs
                .requestMatchers(
                    "/admin/**",
                    "/users/admin/**",
                    "/bookings/admin/**"
                ).hasRole("ADMIN")

                // User features (Favorites, Bookings)
                .requestMatchers(
                    "/favorites/**",
                    "/api/favorites/**"
                ).hasRole("USER")

                .requestMatchers(
                    "/bookings/**",
                    "/api/bookings/**"
                ).hasAnyRole("USER", "ADMIN")

                // User profile APIs
                .requestMatchers(
                    "/users/userProfile/**",
                    "/users/updateUser/**",
                    "/users/*"
                ).hasAnyRole("USER", "ADMIN")

                // Everything else
                .anyRequest()
                .authenticated()
            )

            // -------------------------------------------------
            // JWT FILTER
            // -------------------------------------------------

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}