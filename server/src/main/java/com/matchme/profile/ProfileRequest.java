package com.matchme.profile;

import jakarta.validation.constraints.Size;

// JSON body used when the user saves their own profile
public record ProfileRequest(
        @Size(max = 100)
        String name,

        @Size(max = 2000)
        String aboutMe,

        @Size(max = 100)
        String city,

        // Supports normal image URLs and small browser-uploaded data URLs
        @Size(max = 1500000)
        String pictureLink
) {
}
