package com.matchme.connection;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

// Composite key for one connection request.
@Embeddable
public class ConnectionRequestId implements Serializable {

    @Column(name = "requester_user_id")
    private Long requesterUserId;

    @Column(name = "receiver_user_id")
    private Long receiverUserId;

    protected ConnectionRequestId() {
    }

    public ConnectionRequestId(Long requesterUserId, Long receiverUserId) {
        this.requesterUserId = requesterUserId;
        this.receiverUserId = receiverUserId;
    }

    public Long getRequesterUserId() {
        return requesterUserId;
    }

    public Long getReceiverUserId() {
        return receiverUserId;
    }

    @Override
    public boolean equals(Object value) {
        if (this == value) {
            return true;
        }

        if (!(value instanceof ConnectionRequestId other)) {
            return false;
        }

        return Objects.equals(requesterUserId, other.requesterUserId)
                && Objects.equals(receiverUserId, other.receiverUserId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(requesterUserId, receiverUserId);
    }
}
