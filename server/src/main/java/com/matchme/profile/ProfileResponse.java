package com.matchme.profile;

// JSON returned to the frontend for profile screens.
public record ProfileResponse(
        Long userId,
        String name,
        String aboutMe,
        String city,
        String pictureLink,
        boolean complete
) {
}
