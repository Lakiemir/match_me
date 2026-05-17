package com.matchme.profile;

import com.matchme.auth.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProfileResponse getMyProfile(Long userId) {
        // Create an empty profile automatically when a logged-in user opens the page.
        Profile profile = getOrCreateProfile(userId);
        return toResponse(profile);
    }

    @Transactional
    public ProfileResponse saveMyProfile(Long userId, ProfileRequest request) {
        Profile profile = getOrCreateProfile(userId);

        // Clean fields before saving so spaces do not count as completed data.
        String name = cleanRequiredText(request.name());
        String aboutMe = cleanRequiredText(request.aboutMe());
        String city = cleanRequiredText(request.city());
        String pictureLink = cleanOptionalText(request.pictureLink());

        profile.update(name, aboutMe, city, pictureLink);

        return toResponse(profile);
    }

    @Transactional
    public ProfileResponse removeMyPicture(Long userId) {
        Profile profile = getOrCreateProfile(userId);

        // Only clears the picture link, not the rest of the profile.
        profile.removePicture();

        return toResponse(profile);
    }

    public void requireCompleteProfile(Long userId) {
        // Later recommendations/connections tasks should call this before allowing access.
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Complete your profile first"
                ));

        if (!profile.isComplete()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Complete your profile first"
            );
        }
    }

    private Profile getOrCreateProfile(Long userId) {
        ensureUserExists(userId);

        return profileRepository.findById(userId)
                .orElseGet(() -> profileRepository.save(new Profile(userId)));
    }

    private void ensureUserExists(Long userId) {
        // Reject tokens that point to a user that no longer exists.
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user");
        }
    }

    private String cleanRequiredText(String value) {
        if (value == null) {
            return "";
        }

        return value.trim();
    }

    private String cleanOptionalText(String value) {
        if (value == null || value.trim().isBlank()) {
            return null;
        }

        return value.trim();
    }

    private ProfileResponse toResponse(Profile profile) {
        return new ProfileResponse(
                profile.getUserId(),
                profile.getName(),
                profile.getAboutMe(),
                profile.getCity(),
                profile.getPictureLink(),
                profile.isComplete()
        );
    }
}
