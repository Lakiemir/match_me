package com.matchme.chat;

public record TypingSignalResponse(
        Long chatId,
        Long userId,
        boolean typing) {
}
