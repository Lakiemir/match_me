package com.matchme.connection;

import java.time.Instant;

// Response sent to the frontend for connection request screens.
public record ConnectionRequestResponse(
        Long senderUserId,
        Long receiverUserId,
        String status,
        Instant createdAt
) {
}
