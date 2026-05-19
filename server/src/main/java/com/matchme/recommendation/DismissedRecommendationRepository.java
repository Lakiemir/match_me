package com.matchme.recommendation;

import org.springframework.data.jpa.repository.JpaRepository;

// Gives database access to dismissed recommendations.
public interface DismissedRecommendationRepository
        extends JpaRepository<DismissedRecommendation, DismissedRecommendationId> {

    boolean existsByIdDismisserUserIdAndIdDismissedUserId(Long dismisserUserId, Long dismissedUserId);
}
