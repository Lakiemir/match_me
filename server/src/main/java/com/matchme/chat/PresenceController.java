package com.matchme.chat;

import com.matchme.auth.JwtService;
import com.matchme.privacy.ProfileAccessService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

// Lets profile/chat screens load the first online/offline state before live events arrive.
@RestController
@RequestMapping("/api/presence")
public class PresenceController {

    private final PresenceService presenceService;
    private final ProfileAccessService profileAccessService;
    private final JwtService jwtService;

    public PresenceController(
            PresenceService presenceService,
            ProfileAccessService profileAccessService,
            JwtService jwtService) {
        this.presenceService = presenceService;
        this.profileAccessService = profileAccessService;
        this.jwtService = jwtService;
    }

    @GetMapping("/{userId}")
    public PresenceResponse getPresence(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long userId) {
        Long currentUserId = getUserIdFromAuthorizationHeader(authorizationHeader);

        if (!profileAccessService.canViewProfile(currentUserId, userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return new PresenceResponse(userId, presenceService.isOnline(userId));
    }

    private Long getUserIdFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing token");
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();

        try {
            return jwtService.getUserIdFromToken(token);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }
}
