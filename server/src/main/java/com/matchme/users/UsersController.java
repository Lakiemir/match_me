package com.matchme.users;

import com.matchme.auth.JwtService;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

// Minimal user endpoints needed by recommendation cards.
@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UsersService usersService;
    private final JwtService jwtService;

    public UsersController(UsersService usersService, JwtService jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }

    @GetMapping("/{id}")
    public UserSummaryResponse getUser(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long id
    ) {
        Long viewerUserId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return usersService.getUser(viewerUserId, id);
    }

    @GetMapping("/{id}/profile")
    public UserProfileViewResponse getUserProfile(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long id
    ) {
        Long viewerUserId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return usersService.getUserProfile(viewerUserId, id);
    }

    @GetMapping("/{id}/bio")
    public UserBioViewResponse getUserBio(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long id
    ) {
        Long viewerUserId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return usersService.getUserBio(viewerUserId, id);
    }

    private Long getUserIdFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing token");
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();

        try {
            return jwtService.getUserIdFromToken(token);
        } catch (JwtException | IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }
}
