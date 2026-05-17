package com.matchme.profile;

import com.matchme.auth.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// Handles the logged-in user's own profile.
@RestController
@RequestMapping("/api/me/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final JwtService jwtService;

    public ProfileController(ProfileService profileService, JwtService jwtService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ProfileResponse getMyProfile(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return profileService.getMyProfile(userId);
    }

    @PutMapping
    public ProfileResponse saveMyProfile(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @Valid @RequestBody ProfileRequest request
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return profileService.saveMyProfile(userId, request);
    }

    @DeleteMapping("/picture")
    public ProfileResponse removeMyPicture(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return profileService.removeMyPicture(userId);
    }

    private Long getUserIdFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing token");
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();

        try {
            // The JWT subject is the logged-in user's database id.
            return jwtService.getUserIdFromToken(token);
        } catch (JwtException | IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }
}
