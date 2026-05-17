package com.matchme.auth;

// Defines the JSON returned after successful login.
public record AuthResponse(
        String token,
        String type
) {
}
