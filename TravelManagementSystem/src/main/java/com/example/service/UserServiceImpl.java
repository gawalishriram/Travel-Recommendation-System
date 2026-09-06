package com.example.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.dto.ForgotPasswordRequest;
import com.example.dto.LoginRequest;
import com.example.dto.LoginResponse;
import com.example.dto.RegisterUserRequest;
import com.example.dto.ResetPasswordRequest;
import com.example.dto.UserAdminResponse;
import com.example.dto.UserPageResponse;
import com.example.dto.UserProfileResponse;
import com.example.dto.UserUpdateRequest;
import com.example.exception.InvalidCredentialsException;
import com.example.exception.UserAlreadyExistsException;
import com.example.exception.UserNotFoundException;
import com.example.model.Admin;
import com.example.model.User;
import com.example.repository.AdminRepository;
import com.example.repository.UserRepository;
import com.example.security.JwtService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public UserServiceImpl(
            UserRepository userRepository,
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    private static final java.util.Set<String> DISPOSABLE_DOMAINS = java.util.Set.of(
            "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com",
            "yopmail.com", "trashmail.com", "fake.com", "test.com", "example.com",
            "dispostable.com", "fakemailgenerator.com", "throwawaymail.com", "sharklasers.com",
            "getairmail.com", "maildrop.cc", "temp-mail.org", "inboxbear.com", "mytemp.email",
            "mytempmail.com", "nada.ltd", "mohmal.com", "crazymailing.com", "abc.com", "xyz.com"
    );

    private void validateGenuineEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new InvalidCredentialsException("Email address is required.");
        }
        int atIndex = email.indexOf('@');
        if (atIndex <= 0 || atIndex != email.lastIndexOf('@') || atIndex == email.length() - 1) {
            throw new InvalidCredentialsException("Invalid email address format.");
        }

        String localPart = email.substring(0, atIndex);
        String domain = email.substring(atIndex + 1).toLowerCase();

        if (localPart.length() < 2) {
            throw new InvalidCredentialsException("Email username is too short to be genuine.");
        }

        if (DISPOSABLE_DOMAINS.contains(domain)) {
            throw new InvalidCredentialsException("Disposable or temporary email services are not allowed. Please use a genuine email (e.g. Gmail, Outlook, Yahoo).");
        }

        if (!domain.contains(".") || domain.startsWith(".") || domain.endsWith(".")) {
            throw new InvalidCredentialsException("Invalid domain structure in email address.");
        }

        String tld = domain.substring(domain.lastIndexOf('.') + 1);
        if (tld.length() < 2 || tld.matches(".*\\d.*")) {
            throw new InvalidCredentialsException("Email domain has an invalid extension.");
        }

        // DNS MX record verification to confirm genuine mail domain
        try {
            java.util.Hashtable<String, String> env = new java.util.Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
            javax.naming.directory.DirContext ctx = new javax.naming.directory.InitialDirContext(env);
            javax.naming.directory.Attributes attrs = ctx.getAttributes(domain, new String[]{"MX"});
            javax.naming.directory.Attribute attr = attrs.get("MX");
            if (attr == null || attr.size() == 0) {
                // Check if domain at least has A record
                javax.naming.directory.Attributes aAttrs = ctx.getAttributes(domain, new String[]{"A"});
                if (aAttrs == null || aAttrs.get("A") == null) {
                    throw new InvalidCredentialsException("Email domain '" + domain + "' does not exist or cannot receive emails. Please use a genuine email address.");
                }
            }
        } catch (javax.naming.NameNotFoundException e) {
            throw new InvalidCredentialsException("Email domain '" + domain + "' does not exist. Please enter a genuine email address.");
        } catch (InvalidCredentialsException ice) {
            throw ice;
        } catch (Exception e) {
            // Proceed if offline or DNS query fails
        }
    }

    // =========================================================
    // REGISTER
    // =========================================================

    @Override
    public void registerUser(
            RegisterUserRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        validateGenuineEmail(email);

        String mobile =
                request.getMobile()
                        .trim();

        if (userRepository.existsByEmail(email)) {

            throw new UserAlreadyExistsException(
                    "Email already registered"
            );
        }

        if (userRepository.existsByMobile(mobile)) {

            throw new UserAlreadyExistsException(
                    "Mobile number already registered"
            );
        }

        User user = new User();

        user.setName(
                request.getName().trim()
        );

        user.setEmail(email);

        user.setMobile(mobile);

        user.setGender(
                request.getGender().trim()
        );

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setAddress(
                request.getAddress().trim()
        );

        userRepository.save(user);
    }

    // =========================================================
    // LOGIN
    // =========================================================

    @Override
    public LoginResponse loginUser(
            LoginRequest request) {

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new InvalidCredentialsException(
                                                "Invalid email or password"
                                        )
                        );

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        ) || request.getPassword().equals(user.getPassword());

        if (!passwordMatches) {
            throw new InvalidCredentialsException(
                    "Invalid email or password"
            );
        }

        // Upgrade plain text password if needed
        if (request.getPassword().equals(user.getPassword()) && !user.getPassword().startsWith("$2a$") && !user.getPassword().startsWith("$2b$")) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        /*
         * Track login time
         */
        user.setLastLoginAt(
                new java.sql.Timestamp(
                        System.currentTimeMillis()
                )
        );
        userRepository.save(user);

        /*
         * Normal USER JWT
         */
        String token =
                jwtService.generateToken(
                        user.getUserId(),
                        user.getEmail(),
                        "USER"
                );

        return new LoginResponse(
                true,
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                token,
                "Login Successful"
        );
    }

    // =========================================================
    // GET USER PROFILE
    // =========================================================

    @Override
    public UserProfileResponse getUserProfile(
            Integer userId) {

        User loggedInUser =
                getAuthenticatedUser();

        if (!loggedInUser.getUserId().equals(userId)) {

            throw new UserNotFoundException(
                    "User not found"
            );
        }

        return convertToProfileResponse(
                loggedInUser
        );
    }

    // =========================================================
    // UPDATE USER
    // =========================================================

    @Override
    public UserProfileResponse updateUser(
            Integer userId,
            UserUpdateRequest request) {

        User user =
                getAuthenticatedUser();

        if (!user.getUserId().equals(userId)) {

            throw new UserNotFoundException(
                    "User not found"
            );
        }

        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        String mobile =
                request.getMobile()
                        .trim();

        // -----------------------------------------------------
        // DUPLICATE EMAIL
        // -----------------------------------------------------

        if (userRepository.existsByEmailAndUserIdNot(
                email,
                userId)) {

            throw new UserAlreadyExistsException(
                    "Email already registered"
            );
        }

        // -----------------------------------------------------
        // DUPLICATE MOBILE
        // -----------------------------------------------------

        if (userRepository.existsByMobileAndUserIdNot(
                mobile,
                userId)) {

            throw new UserAlreadyExistsException(
                    "Mobile number already registered"
            );
        }

        user.setName(
                request.getName().trim()
        );

        user.setEmail(email);

        user.setMobile(mobile);

        user.setGender(
                request.getGender().trim()
        );

        user.setAddress(
                request.getAddress().trim()
        );

        // -----------------------------------------------------
        // OPTIONAL PASSWORD UPDATE
        // -----------------------------------------------------

        if (request.getPassword() != null
                && !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );
        }

        User updatedUser =
                userRepository.save(user);

        return convertToProfileResponse(
                updatedUser
        );
    }

    // =========================================================
    // ADMIN - GET ALL USERS
    // =========================================================

    @Override
    public UserPageResponse getAllUsers(
            int page,
            int size) {

        /*
         * Protect against invalid page.
         */
        if (page < 0) {
            page = 0;
        }

        /*
         * Protect against invalid size.
         */
        if (size <= 0) {
            size = 10;
        }

        /*
         * Maximum page size.
         */
        if (size > 100) {
            size = 100;
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size
                );

        Page<User> userPage =
                userRepository.findAll(
                        pageable
                );

        /*
         * Convert User entity to
         * UserAdminResponse DTO.
         *
         * Password is NOT returned.
         */
        List<UserAdminResponse> users =
                userPage
                        .getContent()
                        .stream()
                        .map(
                                user ->
                                        new UserAdminResponse(
                                                user.getUserId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getMobile(),
                                                user.getGender(),
                                                user.getAddress(),
                                                user.getCreatedAt()
                                        )
                        )
                        .toList();

        /*
         * Return pagination information.
         */
        return new UserPageResponse(
                users,
                userPage.getNumber(),
                userPage.getTotalPages(),
                userPage.getTotalElements(),
                userPage.getSize()
        );
    }

    // =========================================================
    // ADMIN - DELETE USER
    // =========================================================

    @Override
    public void deleteUser(
            Integer userId) {

        if (!userRepository.existsById(userId)) {

            throw new UserNotFoundException(
                    "User not found"
            );
        }

        userRepository.deleteById(userId);
    }

    // =========================================================
    // GET AUTHENTICATED USER
    // =========================================================

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null
                || authentication.getName().isBlank()) {

            throw new UserNotFoundException(
                    "User not authenticated"
            );
        }

        Integer userId;

        try {

            userId =
                    Integer.valueOf(
                            authentication.getName()
                    );

        } catch (NumberFormatException ex) {

            throw new UserNotFoundException(
                    "Invalid authenticated user"
            );
        }

        return userRepository
                .findById(userId)
                .orElseThrow(
                        () ->
                                new UserNotFoundException(
                                        "User not found"
                                )
                );
    }

    // =========================================================
    // FORGOT PASSWORD (SUPPORTS BOTH USER & ADMIN VIA REAL EMAIL)
    // =========================================================

    @Override
    public Map<String, Object> forgotPassword(
            ForgotPasswordRequest request) {

        String rawInput = request.getEmail() != null ? request.getEmail().trim() : "";
        String email = rawInput.toLowerCase();

        if (email.isBlank()) {
            throw new InvalidCredentialsException("Please provide a registered email address.");
        }

        // Generate 6-digit secure verification token
        String resetToken = String.format("%06d", new java.util.Random().nextInt(900000) + 100000);
        Timestamp expiry = new Timestamp(System.currentTimeMillis() + 15 * 60 * 1000); // 15 minutes

        // 1. Check in User Repository
        User user = userRepository.findByEmail(email)
                .or(() -> userRepository.findByEmail(rawInput))
                .orElse(null);

        if (user != null) {
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(expiry);
            userRepository.save(user);

            emailService.sendOtpEmail(user.getEmail(), user.getName(), resetToken);

            return Map.of(
                    "success", true,
                    "message", "A 6-digit verification code has been dispatched to your email address (" + user.getEmail() + ").",
                    "email", user.getEmail()
            );
        }

        // 2. Check in Admin Repository
        Admin admin = adminRepository.findByEmail(email)
                .or(() -> adminRepository.findByEmail(rawInput))
                .orElse(null);

        if (admin != null) {
            admin.setResetToken(resetToken);
            admin.setResetTokenExpiry(expiry);
            adminRepository.save(admin);

            emailService.sendOtpEmail(admin.getEmail(), "Admin", resetToken);

            return Map.of(
                    "success", true,
                    "message", "A 6-digit verification code has been dispatched to your email address (" + admin.getEmail() + ").",
                    "email", admin.getEmail()
            );
        }

        // 3. No account found
        throw new UserNotFoundException("No account found with email address: " + rawInput);
    }

    // =========================================================
    // RESET PASSWORD (SUPPORTS BOTH USER & ADMIN)
    // =========================================================

    @Override
    public void resetPassword(
            ResetPasswordRequest request) {

        String token = request.getToken() != null ? request.getToken().trim() : "";
        if (token.isBlank()) {
            throw new InvalidCredentialsException("Verification code is required.");
        }

        String rawEmail = request.getEmail() != null ? request.getEmail().trim() : "";
        String newPassword = request.getNewPassword() != null ? request.getNewPassword().trim() : "";

        if (newPassword.length() < 6) {
            throw new InvalidCredentialsException("Password must be at least 6 characters long.");
        }

        // 1. Try finding User by reset token
        User user = userRepository.findByResetToken(token).orElse(null);

        if (user != null) {
            if (!rawEmail.isBlank() && !user.getEmail().equalsIgnoreCase(rawEmail)) {
                throw new InvalidCredentialsException("Verification code does not match the provided email.");
            }

            if (user.getResetTokenExpiry() == null
                    || user.getResetTokenExpiry().before(new Timestamp(System.currentTimeMillis()))) {
                user.setResetToken(null);
                user.setResetTokenExpiry(null);
                userRepository.save(user);
                throw new InvalidCredentialsException("Verification code has expired. Please request a new code.");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            return;
        }

        // 2. Try finding Admin by reset token
        Admin admin = adminRepository.findByResetToken(token).orElse(null);

        if (admin != null) {
            if (!rawEmail.isBlank() && !admin.getEmail().equalsIgnoreCase(rawEmail)) {
                throw new InvalidCredentialsException("Verification code does not match the provided email.");
            }

            if (admin.getResetTokenExpiry() == null
                    || admin.getResetTokenExpiry().before(new Timestamp(System.currentTimeMillis()))) {
                admin.setResetToken(null);
                admin.setResetTokenExpiry(null);
                adminRepository.save(admin);
                throw new InvalidCredentialsException("Verification code has expired. Please request a new code.");
            }

            admin.setPassword(passwordEncoder.encode(newPassword));
            admin.setResetToken(null);
            admin.setResetTokenExpiry(null);
            adminRepository.save(admin);
            return;
        }

        // 3. Invalid token
        throw new InvalidCredentialsException("Invalid or expired verification code. Please check your email or request a new code.");
    }

    // =========================================================
    // CONVERT USER -> PROFILE RESPONSE
    // =========================================================

    private UserProfileResponse convertToProfileResponse(
            User user) {

        return new UserProfileResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getMobile(),
                user.getGender(),
                user.getAddress()
        );
    }
}