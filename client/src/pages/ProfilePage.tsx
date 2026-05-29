import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

type UserSummary = {
  id: number;
  name: string;
  pictureLink: string | null;
};

type UserProfile = {
  id: number;
  aboutMe: string;
  city: string;
};

type Profile = {
  userId: number;
  name: string;
  aboutMe: string;
  city: string;
  pictureLink: string | null;
  complete: boolean;
};

const emptyProfile: Profile = {
  userId: 0,
  name: "",
  aboutMe: "",
  city: "",
  pictureLink: null,
  complete: false,
};

const API_BASE_URL = "http://localhost:8080";

function isProfileComplete(profile: Profile) {
  return Boolean(profile.name.trim() && profile.aboutMe.trim() && profile.city.trim());
}

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setMessage("Log in first to edit your profile.");
        setIsLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [meResponse, profileResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/me`, { headers }),
          fetch(`${API_BASE_URL}/api/me/profile`, { headers }),
        ]);

        if (!meResponse.ok || !profileResponse.ok) {
          throw new Error("Could not load profile.");
        }

        const meData = (await meResponse.json()) as UserSummary;
        const profileData = (await profileResponse.json()) as UserProfile;

        const nextProfile = {
          userId: meData.id,
          name: meData.name,
          aboutMe: profileData.aboutMe,
          city: profileData.city,
          pictureLink: meData.pictureLink,
          complete: false,
        };

        setProfile({
          ...nextProfile,
          complete: isProfileComplete(nextProfile),
        });
      } catch {
        setMessage("Could not load profile.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [token]);

  function updateField(field: keyof Profile, value: string) {
    setProfile((currentProfile) => {
      const nextProfile = {
        ...currentProfile,
        [field]: value,
      };

      return {
        ...nextProfile,
        complete: isProfileComplete(nextProfile),
      };
    });

    if (field === "pictureLink") {
      setImageFailed(false);
    }
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setMessage("Log in first to save your profile.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/me/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          aboutMe: profile.aboutMe,
          city: profile.city,
          pictureLink: profile.pictureLink,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save profile.");
      }

      const data = (await response.json()) as Profile;
      setProfile(data);
      setImageFailed(false);
      setMessage(
        data.complete ? "Profile saved." : "Profile saved, but it is not complete yet.",
      );
    } catch {
      setMessage("Could not save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removePicture() {
    if (!token) {
      setMessage("Log in first to remove your profile picture.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/me/profile/picture`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not remove picture.");
      }

      const data = (await response.json()) as Profile;
      setProfile(data);
      setImageFailed(false);
      setMessage("Profile picture removed.");
    } catch {
      setMessage("Could not remove profile picture.");
    } finally {
      setIsSaving(false);
    }
  }

  const hasPicture = Boolean(profile.pictureLink) && !imageFailed;

  if (isLoading) {
    return (
      <div className="page-stack">
        <p className="muted-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Profile</p>
        <h2>My profile</h2>
        <p className="muted-text">
          Complete your profile before using recommendations or connections.
        </p>
      </div>

      <section className="profile-preview">
        <div className="profile-avatar">
          {hasPicture ? (
            <img
              src={profile.pictureLink ?? ""}
              alt="Profile"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <span>👤</span>
          )}
        </div>

        <div className="profile-summary">
          <h3>{profile.name || "Your name will appear here"}</h3>
          <p>{profile.city || "Your city will appear here"}</p>

          <span className={profile.complete ? "status-complete" : "status-incomplete"}>
            {profile.complete ? "Complete profile" : "Incomplete profile"}
          </span>
        </div>
      </section>

      <form className="form-card profile-form" onSubmit={saveProfile}>
        <label>
          Name
          <input
            value={profile.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Your name"
            maxLength={100}
          />
        </label>

        <label>
          About me
          <textarea
            value={profile.aboutMe}
            onChange={(event) => updateField("aboutMe", event.target.value)}
            placeholder="Write a short introduction"
            rows={5}
            maxLength={2000}
          />
        </label>

        <label>
          City
          <input
            value={profile.city}
            onChange={(event) => updateField("city", event.target.value)}
            placeholder="Tallinn"
            maxLength={100}
          />
        </label>

        <label>
          Profile picture link
          <input
            value={profile.pictureLink ?? ""}
            onChange={(event) => updateField("pictureLink", event.target.value)}
            placeholder="https://example.com/photo.jpg"
            maxLength={2000}
          />
        </label>

        <div className="profile-actions">
          <button className="button button-primary" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save profile"}
          </button>

          <button
            className="button button-secondary"
            type="button"
            onClick={removePicture}
            disabled={isSaving || !profile.pictureLink}
          >
            Remove picture
          </button>
        </div>

        {message && <p className="muted-text">{message}</p>}
      </form>

      <div className="form-card" style={{ marginTop: '2rem' }}>
        <h3>Connect and Chat</h3>
        <p className="muted-text" style={{ marginBottom: '1rem' }}>
          To start chatting with another user, find them through recommendations or connections, then use the chat button on their profile.
        </p>
        <NavLink to="/recommendations" className="button button-primary">
          Find Users to Chat With
        </NavLink>
      </div>
    </div>
  );
}
