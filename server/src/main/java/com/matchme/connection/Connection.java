package com.matchme.connection;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.OffsetDateTime;

// Stores one accepted connection between two users.
@Entity
@Table(name = "connections")
public class Connection {

    @EmbeddedId
    private ConnectionId id;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    protected Connection() {
    }

    public Connection(Long firstUserId, Long secondUserId) {
        Long userAId = Math.min(firstUserId, secondUserId);
        Long userBId = Math.max(firstUserId, secondUserId);
        this.id = new ConnectionId(userAId, userBId);
    }

    public ConnectionId getId() {
        return id;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
