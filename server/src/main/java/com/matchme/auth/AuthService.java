package com.matchme.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) {
        // Normalize the email so casing and surrounding spaces do not create duplicates.
        String email = normalizeEmail(request.email());

        // Stop registration if another user already has this email.
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        // Hash the raw password before saving the user.
        String passwordHash = passwordEncoder.encode(request.password());
        User user = new User(email, passwordHash);

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        // Normalize email the same way as registration.
        String email = normalizeEmail(request.email());

        // Load the user or fail with a generic login error.
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"
                ));

        // Compare the raw login password with the stored bcrypt hash.
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        // Create the JWT after credentials are confirmed.
        String token = jwtService.createToken(user);

        return new AuthResponse(token, "Bearer");
    }

    private String normalizeEmail(String email) {
        // Store and compare emails consistently.
        return email.trim().toLowerCase();
    }
}
