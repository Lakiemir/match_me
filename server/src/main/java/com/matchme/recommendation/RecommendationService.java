package com.matchme.recommendation;

import com.matchme.bio.UserBio;
import com.matchme.bio.BioRepository;
import com.matchme.bio.Hobby;
import com.matchme.profile.Profile;
import com.matchme.profile.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final int MIN_SCORE = 10;

    private final ProfileRepository profileRepository;
    private final BioRepository bioRepository;
    private final DismissedRecommendationRepository dismissedRepository;

    public RecommendationService(
            ProfileRepository profileRepository,
            BioRepository bioRepository,
            DismissedRecommendationRepository dismissedRepository
    ) {
        this.profileRepository = profileRepository;
        this.bioRepository = bioRepository;
        this.dismissedRepository = dismissedRepository;
    }

    @Transactional(readOnly = true)
    public List<RecommendationIdResponse> getRecommendations(Long userId) {
        Profile currentProfile = getCompleteProfile(userId);
        UserBio currentBio = getCompleteBio(userId);

        return profileRepository.findAll()
                .stream()
                .filter(candidateProfile -> !candidateProfile.getUserId().equals(userId))
                .filter(Profile::isComplete)
                .filter(candidateProfile -> locationAllowed(currentProfile, currentBio, candidateProfile))
                .filter(candidateProfile -> !isDismissed(userId, candidateProfile.getUserId()))
                .map(candidateProfile -> toMatch(currentProfile, currentBio, candidateProfile))
                .filter(match -> match.score() >= MIN_SCORE)
                .sorted(Comparator.comparingInt(RecommendationMatch::score).reversed()
                        .thenComparing(RecommendationMatch::userId))
                .limit(10)
                .map(match -> new RecommendationIdResponse(match.userId()))
                .toList();
    }

    @Transactional
    public void dismissRecommendation(Long userId, Long dismissedUserId) {
        if (userId.equals(dismissedUserId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot dismiss yourself");
        }

        if (!profileRepository.existsById(dismissedUserId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recommendation not found");
        }

        if (!dismissedRepository.existsByIdDismisserUserIdAndIdDismissedUserId(userId, dismissedUserId)) {
            dismissedRepository.save(new DismissedRecommendation(userId, dismissedUserId));
        }
    }

    @Transactional(readOnly = true)
    public boolean canViewRecommendedUser(Long viewerUserId, Long targetUserId) {
        if (viewerUserId.equals(targetUserId)) {
            return true;
        }

        if (isDismissed(viewerUserId, targetUserId)) {
            return false;
        }

        Profile viewerProfile = getCompleteProfileOrNull(viewerUserId);
        Profile targetProfile = getCompleteProfileOrNull(targetUserId);
        UserBio viewerBio = getCompleteBioOrNull(viewerUserId);

        if (viewerProfile == null || targetProfile == null || viewerBio == null
                || !locationAllowed(viewerProfile, viewerBio, targetProfile)) {
            return false;
        }

        RecommendationMatch match = toMatch(viewerProfile, viewerBio, targetProfile);
        return match.score() >= MIN_SCORE;
    }

    private RecommendationMatch toMatch(Profile currentProfile, UserBio currentBio, Profile candidateProfile) {
        UserBio candidateBio = getCompleteBioOrNull(candidateProfile.getUserId());

        if (candidateBio == null) {
            return new RecommendationMatch(candidateProfile.getUserId(), 0);
        }

        int sharedHobbies = countSharedHobbies(currentBio, candidateBio);

        if (sharedHobbies == 0) {
            return new RecommendationMatch(candidateProfile.getUserId(), 0);
        }

        int score = 4;
        score += sharedHobbies * 3;

        if (availabilityCompatible(currentBio, candidateBio)) {
            score += 2;
        }

        if (activityCompatible(currentBio, candidateBio)) {
            score += 2;
        }

        if (currentBio.getLookingFor().equals(candidateBio.getLookingFor())) {
            score += 2;
        }

        return new RecommendationMatch(candidateProfile.getUserId(), score);
    }

    private Profile getCompleteProfile(Long userId) {
        Profile profile = getCompleteProfileOrNull(userId);

        if (profile == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Complete your profile first");
        }

        return profile;
    }

    private UserBio getCompleteBio(Long userId) {
        UserBio bio = getCompleteBioOrNull(userId);

        if (bio == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Complete your bio first");
        }

        return bio;
    }

    private Profile getCompleteProfileOrNull(Long userId) {
        return profileRepository.findById(userId)
                .filter(Profile::isComplete)
                .orElse(null);
    }

    private UserBio getCompleteBioOrNull(Long userId) {
        return bioRepository.findById(userId)
                .filter(UserBio::isComplete)
                .orElse(null);
    }

    private boolean locationAllowed(Profile currentProfile, UserBio currentBio, Profile candidateProfile) {
        // Default behavior stays city matching until the user enables GPS radius matching.
        if (!currentBio.hasGpsLocation()) {
            return sameCity(currentProfile, candidateProfile);
        }

        UserBio candidateBio = getCompleteBioOrNull(candidateProfile.getUserId());

        if (candidateBio == null || !candidateBio.hasGpsLocation()) {
            return false;
        }

        return distanceKm(
                currentBio.getLatitude(),
                currentBio.getLongitude(),
                candidateBio.getLatitude(),
                candidateBio.getLongitude()
        ) <= currentBio.getMaxDistanceKm();
    }

    private boolean sameCity(Profile currentProfile, Profile candidateProfile) {
        return currentProfile.getCity().trim().equalsIgnoreCase(candidateProfile.getCity().trim());
    }

    private double distanceKm(double firstLatitude, double firstLongitude, double secondLatitude, double secondLongitude) {
        double earthRadiusKm = 6371.0;
        double latitudeDistance = Math.toRadians(secondLatitude - firstLatitude);
        double longitudeDistance = Math.toRadians(secondLongitude - firstLongitude);

        double a = Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2)
                + Math.cos(Math.toRadians(firstLatitude)) * Math.cos(Math.toRadians(secondLatitude))
                * Math.sin(longitudeDistance / 2) * Math.sin(longitudeDistance / 2);

        return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private boolean isDismissed(Long userId, Long candidateUserId) {
        return dismissedRepository.existsByIdDismisserUserIdAndIdDismissedUserId(userId, candidateUserId);
    }

    private int countSharedHobbies(UserBio currentBio, UserBio candidateBio) {
        Set<Long> currentHobbyIds = currentBio.getHobbies()
                .stream()
                .map(Hobby::getId)
                .collect(Collectors.toSet());

        int shared = 0;

        for (Hobby hobby : candidateBio.getHobbies()) {
            if (currentHobbyIds.contains(hobby.getId())) {
                shared++;
            }
        }

        return shared;
    }

    private boolean availabilityCompatible(UserBio currentBio, UserBio candidateBio) {
        return currentBio.getAvailability().equals(candidateBio.getAvailability())
                || currentBio.getAvailability().equals("flexible")
                || candidateBio.getAvailability().equals("flexible");
    }

    private boolean activityCompatible(UserBio currentBio, UserBio candidateBio) {
        return currentBio.getActivityPreference().equals(candidateBio.getActivityPreference())
                || currentBio.getActivityPreference().equals("both")
                || candidateBio.getActivityPreference().equals("both");
    }

    private record RecommendationMatch(Long userId, int score) {
    }
}
