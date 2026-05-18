package com.matchme.bio;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Gives database access to the fixed hobbies table.
public interface HobbyRepository extends JpaRepository<Hobby, Long> {

    List<Hobby> findAllByOrderByIdAsc();
}
