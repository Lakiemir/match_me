package com.matchme.connection;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

// Composite key for an accepted connection.
@Embeddable
public class ConnectionId implements Serializable {

    @Column(name = "user_a_id")
    private Long userAId;

    @Column(name = "user_b_id")
    private Long userBId;

    protected ConnectionId() {
    }

    public ConnectionId(Long userAId, Long userBId) {
        this.userAId = userAId;
        this.userBId = userBId;
    }

    public Long getUserAId() {
        return userAId;
    }

    public Long getUserBId() {
        return userBId;
    }

    @Override
    public boolean equals(Object value) {
        if (this == value) {
            return true;
        }

        if (!(value instanceof ConnectionId other)) {
            return false;
        }

        return Objects.equals(userAId, other.userAId)
                && Objects.equals(userBId, other.userBId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userAId, userBId);
    }
}
