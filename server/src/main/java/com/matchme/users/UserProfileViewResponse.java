package com.matchme.users;

// Public profile data for recommendation cards.
public record UserProfileViewResponse(
        Long id,
        String aboutMe,
        String city
) {
}
