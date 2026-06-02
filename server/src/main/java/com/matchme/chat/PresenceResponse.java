package com.matchme.chat;

public record PresenceResponse(
        Long userId,
        boolean online) {
}
