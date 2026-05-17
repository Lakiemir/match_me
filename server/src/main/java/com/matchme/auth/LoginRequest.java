package com.matchme.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

// Defines the JSON body accepted by POST /api/auth/login.
public record LoginRequest(
        @NotBlank
        @Email
        String email,

        @NotBlank
        String password
) {
}
