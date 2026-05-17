package com.matchme.auth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Gives us database methods for users without writing SQL by hand.
public interface UserRepository extends JpaRepository<User, Long> {

    // Used during registration to reject duplicate emails.
    boolean existsByEmail(String email);

    // Used during login to load the user by email.
    Optional<User> findByEmail(String email);
}
