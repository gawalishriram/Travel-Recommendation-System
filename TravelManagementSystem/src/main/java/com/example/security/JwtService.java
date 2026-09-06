package com.example.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    /*
     * =========================================================
     * JWT SECRET KEY
     * =========================================================
     *
     * Keep this same for USER and ADMIN.
     *
     * IMPORTANT:
     * If you change this secret, all previously generated
     * tokens will become invalid.
     */
    private static final String SECRET =
            "TravelManagementSystemSecretKeyForJwtAuthentication2026";

    /*
     * =========================================================
     * TOKEN EXPIRATION
     * =========================================================
     *
     * 1 hour
     */
    private static final long EXPIRATION =
            1000L * 60 * 60;

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(StandardCharsets.UTF_8)
            );

    // =========================================================
    // GENERATE TOKEN
    // =========================================================

    public String generateToken(
            Integer userId,
            String email,
            String role) {

        return Jwts.builder()

                /*
                 * Subject
                 *
                 * Keep email here because your existing
                 * login system already uses email.
                 */
                .subject(email)

                /*
                 * IMPORTANT:
                 * Permanent user/admin ID.
                 */
                .claim(
                        "userId",
                        userId
                )

                /*
                 * USER or ADMIN
                 */
                .claim(
                        "role",
                        role
                )

                /*
                 * Token creation time
                 */
                .issuedAt(
                        new Date()
                )

                /*
                 * Token expiration
                 */
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + EXPIRATION
                        )
                )

                /*
                 * Sign JWT
                 */
                .signWith(secretKey)

                .compact();
    }

    // =========================================================
    // EXTRACT USER ID
    // =========================================================

    public Integer extractUserId(
            String token) {

        return extractAllClaims(token)
                .get(
                        "userId",
                        Integer.class
                );
    }

    // =========================================================
    // EXTRACT EMAIL
    // =========================================================

    public String extractEmail(
            String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    // =========================================================
    // EXTRACT USERNAME
    // =========================================================
    /*
     * We are no longer going to use email as the authenticated
     * identity inside JwtAuthenticationFilter.
     *
     * However, this method is kept because other parts of
     * your project may still use it.
     */

    public String extractUsername(
            String token) {

        return extractEmail(token);
    }

    // =========================================================
    // EXTRACT ROLE
    // =========================================================

    public String extractRole(
            String token) {

        return extractAllClaims(token)
                .get(
                        "role",
                        String.class
                );
    }

    // =========================================================
    // VALIDATE TOKEN
    // =========================================================

    public boolean isTokenValid(
            String token) {

        try {

            Claims claims =
                    extractAllClaims(token);

            Date expiration =
                    claims.getExpiration();

            /*
             * Token is valid only when:
             *
             * 1. Signature is valid
             * 2. Token can be parsed
             * 3. Expiration exists
             * 4. Expiration is in the future
             * 5. userId exists
             * 6. role exists
             */

            Integer userId =
                    claims.get(
                            "userId",
                            Integer.class
                    );

            String role =
                    claims.get(
                            "role",
                            String.class
                    );

            return expiration != null
                    && expiration.after(new Date())
                    && userId != null
                    && role != null
                    && !role.isBlank();

        } catch (Exception ex) {

            return false;
        }
    }

    // =========================================================
    // PARSE TOKEN
    // =========================================================

    private Claims extractAllClaims(
            String token) {

        return Jwts.parser()

                .verifyWith(secretKey)

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}