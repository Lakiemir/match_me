package com.matchme.bio;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
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

        Boolean gpsEnabled,

        @DecimalMin("-90.0")
        @DecimalMax("90.0")
        Double latitude,

        @DecimalMin("-180.0")
        @DecimalMax("180.0")
        Double longitude,

        @NotNull
        List<Long> hobbyIds
) {
}
