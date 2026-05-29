package com.matchme;

import java.time.OffsetDateTime;

public record MessageResponse(
        Long id,
        long senderId,
        String content,
        OffsetDateTime createdAt,
        boolean isRead
) {
}
