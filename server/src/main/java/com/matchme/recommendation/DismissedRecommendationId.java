package com.matchme.recommendation;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

// Composite key for one dismissed recommendation.
@Embeddable
public class DismissedRecommendationId implements Serializable {

    @Column(name = "dismisser_user_id")
    private Long dismisserUserId;

    @Column(name = "dismissed_user_id")
    private Long dismissedUserId;

    protected DismissedRecommendationId() {
    }

    public DismissedRecommendationId(Long dismisserUserId, Long dismissedUserId) {
        this.dismisserUserId = dismisserUserId;
        this.dismissedUserId = dismissedUserId;
    }

    public Long getDismisserUserId() {
        return dismisserUserId;
    }

    public Long getDismissedUserId() {
        return dismissedUserId;
    }

    @Override
    public boolean equals(Object value) {
        if (this == value) {
            return true;
        }

        if (!(value instanceof DismissedRecommendationId other)) {
            return false;
        }

        return Objects.equals(dismisserUserId, other.dismisserUserId)
                && Objects.equals(dismissedUserId, other.dismissedUserId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(dismisserUserId, dismissedUserId);
    }
}
