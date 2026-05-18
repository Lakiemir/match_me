package com.matchme.bio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Fixed hobby option shown in the frontend.
@Entity
@Table(name = "hobbies")
public class Hobby {

    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    protected Hobby() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
