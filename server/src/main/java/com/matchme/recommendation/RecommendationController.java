package com.matchme.recommendation;

import com.matchme.auth.JwtService;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Handles recommendation ids and dismissed recommendations.
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final JwtService jwtService;

    public RecommendationController(RecommendationService recommendationService, JwtService jwtService) {
        this.recommendationService = recommendationService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<RecommendationIdResponse> getRecommendations(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return recommendationService.getRecommendations(userId);
    }

    @PostMapping("/{id}/dismiss")
    public void dismissRecommendation(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long id
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        recommendationService.dismissRecommendation(userId, id);
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
