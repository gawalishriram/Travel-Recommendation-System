package com.example.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // =====================================================
        // GET AUTHORIZATION HEADER
        // =====================================================

        String authorization =
                request.getHeader("Authorization");

        // =====================================================
        // NO AUTHORIZATION HEADER
        // =====================================================

        if (authorization == null
                || !authorization.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =====================================================
        // EXTRACT TOKEN
        // =====================================================

        String token =
                authorization
                        .substring(7)
                        .trim();

        // =====================================================
        // EMPTY TOKEN
        // =====================================================

        if (token.isEmpty()) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =====================================================
        // INVALID / EXPIRED TOKEN
        // =====================================================

        if (!jwtService.isTokenValid(token)) {

            SecurityContextHolder.clearContext();

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // =====================================================
        // EXTRACT JWT INFORMATION
        // =====================================================

        try {

            /*
             * IMPORTANT:
             *
             * We now identify the authenticated user by
             * userId instead of email.
             */
            Integer userId =
                    jwtService.extractUserId(token);

            String role =
                    jwtService.extractRole(token);

            // =================================================
            // CHECK JWT DATA
            // =================================================

            if (userId != null
                    && role != null
                    && !role.isBlank()
                    && SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                /*
                 * Your JWT contains:
                 *
                 * userId
                 * role
                 *
                 * Spring Security expects:
                 *
                 * ROLE_USER
                 * ROLE_ADMIN
                 */

                String authorityName =
                        role.startsWith("ROLE_")
                                ? role
                                : "ROLE_" + role;

                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                authorityName
                        );

                // =============================================
                // CREATE AUTHENTICATION
                // =============================================

                /*
                 * IMPORTANT:
                 *
                 * Authentication.getName()
                 * will now return the USER ID.
                 *
                 * Example:
                 *
                 * authentication.getName()
                 *         ↓
                 * "5"
                 *
                 * instead of:
                 *
                 * "user@gmail.com"
                 */

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                String.valueOf(userId),
                                null,
                                Collections.singletonList(
                                        authority
                                )
                        );

                // =============================================
                // SET SECURITY CONTEXT
                // =============================================

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );
            }

        } catch (Exception ex) {

            /*
             * Never allow a broken JWT to remain
             * inside SecurityContext.
             */

            SecurityContextHolder.clearContext();
        }

        // =====================================================
        // CONTINUE FILTER CHAIN
        // =====================================================

        filterChain.doFilter(
                request,
                response
        );
    }
}