package com.matchme.connection;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

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

    protected ConnectionRequest() {
    }

    public ConnectionRequest(Long requesterUserId, Long receiverUserId) {
        this.id = new ConnectionRequestId(requesterUserId, receiverUserId);
        this.status = STATUS_PENDING;
    }

    public ConnectionRequestId getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }
}
