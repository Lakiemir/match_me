package com.matchme.bio;

import com.matchme.auth.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class BioService {

    private final BioRepository bioRepository;
    private final HobbyRepository hobbyRepository;
    private final UserRepository userRepository;

    public BioService(
            BioRepository bioRepository,
            HobbyRepository hobbyRepository,
            UserRepository userRepository
    ) {
        this.bioRepository = bioRepository;
        this.hobbyRepository = hobbyRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<HobbyResponse> getHobbies() {
        return hobbyRepository.findAllByOrderByIdAsc()
                .stream()
                .map(this::toHobbyResponse)
                .toList();
    }

    @Transactional
    public BioResponse getMyBio(Long userId) {
        UserBio bio = getOrCreateBio(userId);
        return toResponse(bio);
    }

    @Transactional
    public BioResponse saveMyBio(Long userId, BioRequest request) {
        UserBio bio = getOrCreateBio(userId);

        String availability = cleanText(request.availability());
        String activityPreference = cleanText(request.activityPreference());
        String lookingFor = cleanText(request.lookingFor());

        validateAllowed("availability", availability, List.of("", "weeknights", "weekends", "flexible"));
        validateAllowed("activityPreference", activityPreference, List.of("", "outdoor", "indoor", "both"));
        validateAllowed("lookingFor", lookingFor, List.of("", "friendship", "date", "activity_partner", "professional"));

        Set<Hobby> hobbies = loadSelectedHobbies(request.hobbyIds());

        boolean gpsEnabled = request.gpsEnabled() != null ? request.gpsEnabled() : bio.isGpsEnabled();
        Double latitude = request.latitude() != null ? request.latitude() : bio.getLatitude();
        Double longitude = request.longitude() != null ? request.longitude() : bio.getLongitude();

        validateGpsLocation(gpsEnabled, latitude, longitude);

        bio.update(
                request.maxDistanceKm(),
                availability,
                activityPreference,
                lookingFor,
                gpsEnabled,
                latitude,
                longitude,
                hobbies
        );

        return toResponse(bio);
    }

    private UserBio getOrCreateBio(Long userId) {
        ensureUserExists(userId);

        return bioRepository.findById(userId)
                .orElseGet(() -> bioRepository.save(new UserBio(userId)));
    }

    private void ensureUserExists(Long userId) {
        // Reject tokens that point to a deleted user.
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user");
        }
    }

    private Set<Hobby> loadSelectedHobbies(List<Long> hobbyIds) {
        Set<Long> uniqueIds = new LinkedHashSet<>(hobbyIds);
        List<Hobby> hobbies = hobbyRepository.findAllById(uniqueIds);

        if (hobbies.size() != uniqueIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown hobby selected");
        }

        return new LinkedHashSet<>(hobbies);
    }

    private void validateAllowed(String fieldName, String value, List<String> allowedValues) {
        if (!allowedValues.contains(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid " + fieldName);
        }
    }

    private void validateGpsLocation(boolean gpsEnabled, Double latitude, Double longitude) {
        if (!gpsEnabled) {
            return;
        }

        if (latitude == null || longitude == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "GPS location is missing");
        }

        if (latitude < -90 || latitude > 90) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid latitude");
        }

        if (longitude < -180 || longitude > 180) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid longitude");
        }
    }

    private String cleanText(String value) {
        if (value == null) {
            return "";
        }

        return value.trim();
    }

    private BioResponse toResponse(UserBio bio) {
        List<HobbyResponse> hobbies = bio.getHobbies()
                .stream()
                .map(this::toHobbyResponse)
                .toList();

        return new BioResponse(
                bio.getUserId(),
                bio.getMaxDistanceKm(),
                bio.getAvailability(),
                bio.getActivityPreference(),
                bio.getLookingFor(),
                bio.isGpsEnabled(),
                bio.hasGpsLocation(),
                hobbies,
                bio.isComplete()
        );
    }

    private HobbyResponse toHobbyResponse(Hobby hobby) {
        return new HobbyResponse(hobby.getId(), hobby.getName());
    }
}
