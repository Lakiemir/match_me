package com.matchme.users;

import com.matchme.auth.UserRepository;
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

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final BioRepository bioRepository;
    private final ProfileAccessService profileAccessService;

    public UsersService(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            BioRepository bioRepository,
            ProfileAccessService profileAccessService
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.bioRepository = bioRepository;
        this.profileAccessService = profileAccessService;
    }

    @Transactional
    public UserSummaryResponse getUser(Long viewerUserId, Long targetUserId) {
        requireAllowed(viewerUserId, targetUserId);
        Profile profile = getProfileForView(viewerUserId, targetUserId);

        return new UserSummaryResponse(
                profile.getUserId(),
                profile.getName(),
                profile.getPictureLink()
        );
    }

    @Transactional
    public UserProfileViewResponse getUserProfile(Long viewerUserId, Long targetUserId) {
        requireAllowed(viewerUserId, targetUserId);
        Profile profile = getProfileForView(viewerUserId, targetUserId);

        return new UserProfileViewResponse(
                profile.getUserId(),
                profile.getAboutMe(),
                profile.getCity()
        );
    }

    @Transactional
    public UserBioViewResponse getUserBio(Long viewerUserId, Long targetUserId) {
        requireAllowed(viewerUserId, targetUserId);
        UserBio bio = getBioForView(viewerUserId, targetUserId);

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

    private Profile getProfileForView(Long viewerUserId, Long targetUserId) {
        if (viewerUserId.equals(targetUserId)) {
            ensureUserExists(targetUserId);

            // The owner can read an incomplete profile so the edit page can load.
            return profileRepository.findById(targetUserId)
                    .orElseGet(() -> profileRepository.save(new Profile(targetUserId)));
        }

        return profileRepository.findById(targetUserId)
                .filter(Profile::isComplete)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private UserBio getBioForView(Long viewerUserId, Long targetUserId) {
        if (viewerUserId.equals(targetUserId)) {
            ensureUserExists(targetUserId);

            // The owner can read an incomplete bio so the edit page can load.
            return bioRepository.findById(targetUserId)
                    .orElseGet(() -> bioRepository.save(new UserBio(targetUserId)));
        }

        return bioRepository.findById(targetUserId)
                .filter(UserBio::isComplete)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void ensureUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user");
        }
    }

    private HobbyResponse toHobbyResponse(Hobby hobby) {
        return new HobbyResponse(hobby.getId(), hobby.getName());
    }
}
