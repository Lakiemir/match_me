package com.matchme.websocket;

public record UnreadSignalResponse(Long chatId, long unreadCount) {}
