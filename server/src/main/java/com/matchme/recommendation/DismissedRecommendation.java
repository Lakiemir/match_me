package com.matchme.recommendation;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

// Stores one candidate the user dismissed.
@Entity
@Table(name = "dismissed_recommendations")
public class DismissedRecommendation {

    @EmbeddedId
    private DismissedRecommendationId id;

    protected DismissedRecommendation() {
    }

    public DismissedRecommendation(Long dismisserUserId, Long dismissedUserId) {
        this.id = new DismissedRecommendationId(dismisserUserId, dismissedUserId);
    }

    public DismissedRecommendationId getId() {
        return id;
    }
}
