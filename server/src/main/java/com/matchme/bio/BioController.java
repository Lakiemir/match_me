package com.matchme.bio;

import com.matchme.auth.JwtService;
import com.matchme.users.UserBioViewResponse;
import com.matchme.users.UsersService;
import io.jsonwebtoken.JwtException;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Handles hobby options and the logged-in user's own bio.
@RestController
@RequestMapping("/api")
public class BioController {

    private final BioService bioService;
    private final UsersService usersService;
    private final JwtService jwtService;

    public BioController(BioService bioService, UsersService usersService, JwtService jwtService) {
        this.bioService = bioService;
        this.usersService = usersService;
        this.jwtService = jwtService;
    }

    @GetMapping("/hobbies")
    public List<HobbyResponse> getHobbies() {
        return bioService.getHobbies();
    }

    @GetMapping("/me/bio")
    public UserBioViewResponse getMyBio(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);

        // Required shortcut: /me/bio behaves like /users/{myId}/bio.
        return usersService.getUserBio(userId, userId);
    }

    @PutMapping("/me/bio")
    public BioResponse saveMyBio(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @Valid @RequestBody BioRequest request
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return bioService.saveMyBio(userId, request);
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
