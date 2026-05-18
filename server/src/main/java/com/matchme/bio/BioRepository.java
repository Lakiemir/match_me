package com.matchme.bio;

import org.springframework.data.jpa.repository.JpaRepository;

// Gives database access to the user_bios table.
public interface BioRepository extends JpaRepository<UserBio, Long> {
}
