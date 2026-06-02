package com.matchme.chat;

public record UnreadSignalResponse(
        Long chatId,
        long unreadCount
) {
}
