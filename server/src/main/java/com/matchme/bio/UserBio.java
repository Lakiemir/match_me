package com.matchme.bio;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

import java.util.LinkedHashSet;
import java.util.Set;

// Stores matching preferences for one user.
@Entity
@Table(name = "user_bios")
public class UserBio {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "max_distance_km", nullable = false)
    private Integer maxDistanceKm = 20;

    @Column(nullable = false)
    private String availability = "";

    @Column(name = "activity_preference", nullable = false)
    private String activityPreference = "";

    @Column(name = "looking_for", nullable = false)
    private String lookingFor = "";

    @Column(nullable = false)
    private boolean complete = false;

    @ManyToMany
    @JoinTable(
            name = "user_hobbies",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "hobby_id")
    )
    private Set<Hobby> hobbies = new LinkedHashSet<>();

    protected UserBio() {
    }

    public UserBio(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public Integer getMaxDistanceKm() {
        return maxDistanceKm;
    }

    public String getAvailability() {
        return availability;
    }

    public String getActivityPreference() {
        return activityPreference;
    }

    public String getLookingFor() {
        return lookingFor;
    }

    public boolean isComplete() {
        return complete;
    }

    public Set<Hobby> getHobbies() {
        return hobbies;
    }

    public void update(
            Integer maxDistanceKm,
            String availability,
            String activityPreference,
            String lookingFor,
            Set<Hobby> hobbies
    ) {
        this.maxDistanceKm = maxDistanceKm;
        this.availability = availability;
        this.activityPreference = activityPreference;
        this.lookingFor = lookingFor;
        this.hobbies = hobbies;

        // Bio is complete when the user has enough matching data.
        this.complete =
                hobbies.size() >= 3
                        && maxDistanceKm > 0
                        && !availability.isBlank()
                        && !activityPreference.isBlank()
                        && !lookingFor.isBlank();
    }
}
