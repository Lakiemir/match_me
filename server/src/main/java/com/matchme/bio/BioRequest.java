package com.matchme.bio;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

// JSON body used when the logged-in user saves bio preferences.
public record BioRequest(
        @NotNull
        @Min(1)
        @Max(500)
        Integer maxDistanceKm,

        @Size(max = 30)
        String availability,

        @Size(max = 30)
        String activityPreference,

        @Size(max = 30)
        String lookingFor,

        @NotNull
        List<Long> hobbyIds
) {
}
