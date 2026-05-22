package com.matchme.connection;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;

// Stores a request from one user to another.
@Entity
@Table(name = "connection_requests")
public class ConnectionRequest {

    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_ACCEPTED = "ACCEPTED";
    public static final String STATUS_REJECTED = "REJECTED";

    @EmbeddedId
    private ConnectionRequestId id;

    @Column(nullable = false)
    private String status = STATUS_PENDING;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected ConnectionRequest() {
    }

    public ConnectionRequest(Long requesterUserId, Long receiverUserId) {
        this.id = new ConnectionRequestId(requesterUserId, receiverUserId);
        this.status = STATUS_PENDING;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public ConnectionRequestId getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void markPending() {
        this.status = STATUS_PENDING;
        this.updatedAt = Instant.now();
    }

    public void accept() {
        this.status = STATUS_ACCEPTED;
        this.updatedAt = Instant.now();
    }

    public void reject() {
        this.status = STATUS_REJECTED;
        this.updatedAt = Instant.now();
    }
}
