package com.matchme.users;

import com.matchme.bio.BioRepository;
import com.matchme.bio.Hobby;
import com.matchme.bio.HobbyResponse;
import com.matchme.bio.UserBio;
import com.matchme.privacy.ProfileAccessService;
import com.matchme.profile.Profile;
import com.matchme.profile.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UsersService {

    private final ProfileRepository profileRepository;
    private final BioRepository bioRepository;
    private final ProfileAccessService profileAccessService;

    public UsersService(
            ProfileRepository profileRepository,
            BioRepository bioRepository,
            ProfileAccessService profileAccessService
    ) {
        this.profileRepository = profileRepository;
        this.bioRepository = bioRepository;
        this.profileAccessService = profileAccessService;
    }

    @Transactional(readOnly = true)
    public UserSummaryResponse getUser(Long viewerUserId, Long targetUserId) {
        requireAllowed(viewerUserId, targetUserId);
        Profile profile = getProfile(targetUserId);

        return new UserSummaryResponse(
                profile.getUserId(),
                profile.getName(),
                profile.getPictureLink()
        );
    }

    @Transactional(readOnly = true)
    public UserProfileViewResponse getUserProfile(Long viewerUserId, Long targetUserId) {
        requireAllowed(viewerUserId, targetUserId);
        Profile profile = getProfile(targetUserId);

        return new UserProfileViewResponse(
                profile.getUserId(),
                profile.getAboutMe(),
                profile.getCity()
        );
    }

    @Transactional(readOnly = true)
    public UserBioViewResponse getUserBio(Long viewerUserId, Long targetUserId) {
        requireAllowed(viewerUserId, targetUserId);

        UserBio bio = bioRepository.findById(targetUserId)
                .filter(UserBio::isComplete)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<HobbyResponse> hobbies = bio.getHobbies()
                .stream()
                .map(this::toHobbyResponse)
                .toList();

        return new UserBioViewResponse(
                bio.getUserId(),
                bio.getMaxDistanceKm(),
                bio.getAvailability(),
                bio.getActivityPreference(),
                bio.getLookingFor(),
                hobbies
        );
    }

    private void requireAllowed(Long viewerUserId, Long targetUserId) {
        if (!profileAccessService.canViewProfile(viewerUserId, targetUserId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    private Profile getProfile(Long userId) {
        return profileRepository.findById(userId)
                .filter(Profile::isComplete)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private HobbyResponse toHobbyResponse(Hobby hobby) {
        return new HobbyResponse(hobby.getId(), hobby.getName());
    }
}
