package com.matchme.chat;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

// Tracks whether a user has at least one active WebSocket connection.
@Service
public class PresenceService {

    private final Map<Long, AtomicInteger> connectionCounts = new ConcurrentHashMap<>();

    public boolean connect(Long userId) {
        int count = connectionCounts
                .computeIfAbsent(userId, ignored -> new AtomicInteger(0))
                .incrementAndGet();

        return count == 1;
    }

    public boolean disconnect(Long userId) {
        AtomicInteger count = connectionCounts.get(userId);

        if (count == null) {
            return false;
        }

        int remaining = count.decrementAndGet();

        if (remaining <= 0) {
            connectionCounts.remove(userId);
            return true;
        }

        return false;
    }

    public boolean isOnline(Long userId) {
        AtomicInteger count = connectionCounts.get(userId);

        return count != null && count.get() > 0;
    }
}
