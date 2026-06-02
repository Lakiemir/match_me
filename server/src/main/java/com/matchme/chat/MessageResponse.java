package com.matchme.chat;

import java.time.OffsetDateTime;

public record MessageResponse(
        Long id,
        Long chatId,
        Long senderId,
        String content,
        OffsetDateTime createdAt,
        boolean read) {
}
