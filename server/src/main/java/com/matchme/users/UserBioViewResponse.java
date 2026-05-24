package com.matchme.users;

import com.matchme.bio.HobbyResponse;

import java.util.List;

// Public bio data used to explain recommendation cards.
public record UserBioViewResponse(
        Long id,
        Integer maxDistanceKm,
        String availability,
        String activityPreference,
        String lookingFor,
        boolean gpsEnabled,
        boolean gpsLocationSet,
        Integer distanceKm,
        List<HobbyResponse> hobbies
) {
}
