package com.matchme.connection;

import com.matchme.auth.JwtService;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// Handles connection and connection request API endpoints.
@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;
    private final JwtService jwtService;

    public ConnectionController(ConnectionService connectionService, JwtService jwtService) {
        this.connectionService = connectionService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public List<ConnectionIdResponse> getConnections(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return connectionService.getConnections(userId);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void disconnect(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long userId
    ) {
        Long currentUserId = getUserIdFromAuthorizationHeader(authorizationHeader);
        connectionService.disconnect(currentUserId, userId);
    }

    @PostMapping("/requests/{userId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ConnectionRequestResponse sendRequest(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long userId
    ) {
        Long senderUserId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return connectionService.sendRequest(senderUserId, userId);
    }

    @GetMapping("/requests/incoming")
    public List<ConnectionRequestResponse> getIncomingRequests(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        Long receiverUserId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return connectionService.getIncomingRequests(receiverUserId);
    }

    @PostMapping("/requests/{userId}/accept")
    public ConnectionRequestResponse acceptRequest(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long userId
    ) {
        Long receiverUserId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return connectionService.acceptRequest(receiverUserId, userId);
    }

    @PostMapping("/requests/{userId}/reject")
    public ConnectionRequestResponse rejectRequest(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long userId
    ) {
        Long receiverUserId = getUserIdFromAuthorizationHeader(authorizationHeader);
        return connectionService.rejectRequest(receiverUserId, userId);
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
