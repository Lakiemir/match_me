package com.matchme.profile;

import org.springframework.data.jpa.repository.JpaRepository;

// Gives database access to the profiles table.
public interface ProfileRepository extends JpaRepository<Profile, Long> {
}
