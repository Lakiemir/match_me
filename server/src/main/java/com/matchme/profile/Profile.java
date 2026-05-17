package com.matchme.profile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// Stores the editable public profile for one user.
@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false)
    private String name = "";

    @Column(name = "about_me", nullable = false, columnDefinition = "TEXT")
    private String aboutMe = "";

    @Column(nullable = false)
    private String city = "";

    @Column(name = "picture_link", columnDefinition = "TEXT")
    private String pictureLink;

    @Column(nullable = false)
    private boolean complete = false;

    protected Profile() {
    }

    public Profile(Long userId) {
        this.userId = userId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public String getCity() {
        return city;
    }

    public String getPictureLink() {
        return pictureLink;
    }

    public boolean isComplete() {
        return complete;
    }

    public void update(String name, String aboutMe, String city, String pictureLink) {
        // Save cleaned profile fields from the request.
        this.name = name;
        this.aboutMe = aboutMe;
        this.city = city;
        this.pictureLink = pictureLink;

        // Profile picture is optional, but name/about/city are required for completion.
        this.complete = !name.isBlank() && !aboutMe.isBlank() && !city.isBlank();
    }

    public void removePicture() {
        // Removing the picture keeps the profile complete if required text fields exist.
        this.pictureLink = null;
    }
}
