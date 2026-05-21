package com.matchme.connection;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

// Stores one accepted connection between two users.
@Entity
@Table(name = "connections")
public class Connection {

    @EmbeddedId
    private ConnectionId id;

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
}
