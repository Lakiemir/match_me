package com.matchme.chat;

import java.time.OffsetDateTime;

public record ChatResponse(
        Long id,
        Long otherUserId,
        String otherName,
        String otherPictureLink,
        String lastMessageContent,
        OffsetDateTime lastMessageAt,
        long unreadCount) {
}
