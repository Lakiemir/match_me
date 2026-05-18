package com.matchme.bio;

import java.util.List;

// JSON returned to the frontend for bio screens.
public record BioResponse(
        Long userId,
        Integer maxDistanceKm,
        String availability,
        String activityPreference,
        String lookingFor,
        List<HobbyResponse> hobbies,
        boolean complete
) {
}
