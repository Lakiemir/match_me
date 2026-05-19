package com.matchme.users;

// Basic public user data for recommendation cards.
public record UserSummaryResponse(
        Long id,
        String name,
        String pictureLink
) {
}
