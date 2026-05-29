package com.matchme;

import java.time.OffsetDateTime;

public record ChatResponse(
        Long id,
        Long otherUserId,
        String otherUsername,
        OffsetDateTime lastMessageAt,
        long unreadCount
) {
}
