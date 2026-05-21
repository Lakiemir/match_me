package com.matchme.privacy;

import com.matchme.auth.UserRepository;
import com.matchme.connection.ConnectionRequest;
import com.matchme.connection.ConnectionRequestRepository;
import com.matchme.connection.ConnectionRepository;
import com.matchme.recommendation.RecommendationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Central place for deciding whether one profile can be viewed by another user.
@Service
public class ProfileAccessService {

    private final UserRepository userRepository;
    private final RecommendationService recommendationService;
    private final ConnectionRequestRepository connectionRequestRepository;
    private final ConnectionRepository connectionRepository;

    public ProfileAccessService(
            UserRepository userRepository,
            RecommendationService recommendationService,
            ConnectionRequestRepository connectionRequestRepository,
            ConnectionRepository connectionRepository
    ) {
        this.userRepository = userRepository;
        this.recommendationService = recommendationService;
        this.connectionRequestRepository = connectionRequestRepository;
        this.connectionRepository = connectionRepository;
    }

    @Transactional(readOnly = true)
    public boolean canViewProfile(Long viewerUserId, Long targetUserId) {
        if (viewerUserId == null || targetUserId == null) {
            return false;
        }

        if (!userRepository.existsById(viewerUserId) || !userRepository.existsById(targetUserId)) {
            return false;
        }

        if (viewerUserId.equals(targetUserId)) {
            return true;
        }

        return recommendationService.canViewRecommendedUser(viewerUserId, targetUserId)
                || hasPendingRequestBetweenUsers(viewerUserId, targetUserId)
                || hasConnectionBetweenUsers(viewerUserId, targetUserId);
    }

    private boolean hasPendingRequestBetweenUsers(Long firstUserId, Long secondUserId) {
        return connectionRequestRepository.existsByIdRequesterUserIdAndIdReceiverUserIdAndStatus(
                firstUserId,
                secondUserId,
                ConnectionRequest.STATUS_PENDING
        ) || connectionRequestRepository.existsByIdRequesterUserIdAndIdReceiverUserIdAndStatus(
                secondUserId,
                firstUserId,
                ConnectionRequest.STATUS_PENDING
        );
    }

    private boolean hasConnectionBetweenUsers(Long firstUserId, Long secondUserId) {
        Long userAId = Math.min(firstUserId, secondUserId);
        Long userBId = Math.max(firstUserId, secondUserId);

        return connectionRepository.existsByIdUserAIdAndIdUserBId(userAId, userBId);
    }
}
