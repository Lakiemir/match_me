import { useEffect, useMemo, useState } from "react";

type Hobby = {
  id: number;
  name: string;
};

type Bio = {
  id: number;
  maxDistanceKm: number;
  availability: string;
  activityPreference: string;
  lookingFor: string;
  gpsEnabled: boolean;
  gpsLocationSet: boolean;
  latitude: number | null;
  longitude: number | null;
  hobbies: Hobby[];
  complete: boolean;
};

const API_BASE_URL = "http://localhost:8080";

const emptyBio: Bio = {
  id: 0,
  maxDistanceKm: 20,
  availability: "",
  activityPreference: "",
  lookingFor: "",
  gpsEnabled: false,
  gpsLocationSet: false,
  latitude: null,
  longitude: null,
  hobbies: [],
  complete: false,
};

const availabilityOptions = [
  { value: "", label: "Choose availability" },
  { value: "weeknights", label: "Weeknights" },
  { value: "weekends", label: "Weekends" },
  { value: "flexible", label: "Flexible" },
];

const activityOptions = [
  { value: "", label: "Choose activity preference" },
  { value: "outdoor", label: "Outdoor" },
  { value: "indoor", label: "Indoor" },
  { value: "both", label: "Both" },
];

const lookingForOptions = [
  { value: "", label: "Choose what you are looking for" },
  { value: "friendship", label: "Friendship" },
  { value: "date", label: "Date" },
  { value: "activity_partner", label: "Activity partner" },
  { value: "professional", label: "Professional" },
];

export function BioPage() {
  const [bio, setBio] = useState<Bio>(emptyBio);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [selectedHobbyIds, setSelectedHobbyIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function loadBioPage() {
      setIsLoading(true);
      setMessage("");

      try {
        const hobbiesResponse = await fetch(`${API_BASE_URL}/api/hobbies`);

        if (!hobbiesResponse.ok) {
          throw new Error("Could not load hobbies.");
        }

        const hobbiesData = (await hobbiesResponse.json()) as Hobby[];
        setHobbies(hobbiesData);
      } catch {
        setMessage("Could not load hobbies.");
        setIsLoading(false);
        return;
      }

      if (!token) {
        setMessage("Log in first to save your bio.");
        setIsLoading(false);
        return;
      }

      try {
        const bioResponse = await fetch(`${API_BASE_URL}/api/me/bio`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (bioResponse.status === 401) {
          localStorage.removeItem("token");
          setMessage("Your login expired. Log in again to save your bio.");
          setIsLoading(false);
          return;
        }

        if (!bioResponse.ok) {
          throw new Error("Could not load bio.");
        }

        const bioData = (await bioResponse.json()) as Bio;
        const nextBio = {
          ...emptyBio,
          ...bioData,
          gpsEnabled: bioData.gpsEnabled ?? false,
          gpsLocationSet: bioData.gpsLocationSet ?? false,
          latitude: null,
          longitude: null,
          complete:
            bioData.maxDistanceKm > 0 &&
            bioData.availability.trim() !== "" &&
            bioData.activityPreference.trim() !== "" &&
            bioData.lookingFor.trim() !== "" &&
            bioData.hobbies.length >= 3,
        };

        setBio(nextBio);
        setSelectedHobbyIds(nextBio.hobbies.map((hobby) => hobby.id));
      } catch {
        setMessage("Could not load your saved bio.");
      } finally {
        setIsLoading(false);
      }
    }

    // Hobbies are public options, but saved bio needs a valid login token.
    void loadBioPage();
  }, [token]);

  const selectedCount = selectedHobbyIds.length;

  const selectedHobbiesText = useMemo(() => {
    if (selectedCount === 0) {
      return "Choose at least 3 hobbies.";
    }

    return `${selectedCount} hobbies selected.`;
  }, [selectedCount]);

  const locationStatusText =
    bio.gpsEnabled && bio.gpsLocationSet
      ? "GPS radius matching is on."
      : bio.gpsEnabled
        ? "GPS radius matching will turn on after location is saved."
        : "City matching is used until GPS is enabled.";

  function updateField(field: keyof Bio, value: string | number | boolean | null) {
    setBio((currentBio) => ({
      ...currentBio,
      [field]: value,
    }));
  }

  function toggleHobby(hobbyId: number) {
    setSelectedHobbyIds((currentIds) => {
      if (currentIds.includes(hobbyId)) {
        return currentIds.filter((id) => id !== hobbyId);
      }

      return [...currentIds, hobbyId];
    });
  }

  function useBrowserLocation() {
    if (!navigator.geolocation) {
      setMessage("Your browser does not support location sharing.");
      return;
    }

    setIsLocating(true);
    setMessage("Waiting for browser location permission...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setBio((currentBio) => ({
          ...currentBio,
          gpsEnabled: true,
          gpsLocationSet: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setMessage("Location ready. Save your bio to use GPS recommendations.");
        setIsLocating(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setMessage("Location is blocked. Allow location in browser and system settings, then try again.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setMessage("Your device could not find a location. Try again or check system location settings.");
        } else if (error.code === error.TIMEOUT) {
          setMessage("Location lookup timed out. Try again.");
        } else {
          setMessage("Location is unavailable.");
        }

        setIsLocating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 300000,
      },
    );
  }

  function disableGpsLocation() {
    setBio((currentBio) => ({
      ...currentBio,
      gpsEnabled: false,
      gpsLocationSet: false,
      latitude: null,
      longitude: null,
    }));
    setMessage("GPS matching is off. Save your bio to use city matching.");
  }

  async function saveBio(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const currentToken = localStorage.getItem("token");

    if (!currentToken) {
      setMessage("Log in first to save your bio.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/me/bio`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maxDistanceKm: bio.maxDistanceKm,
          availability: bio.availability,
          activityPreference: bio.activityPreference,
          lookingFor: bio.lookingFor,
          gpsEnabled: bio.gpsEnabled,
          latitude: bio.latitude,
          longitude: bio.longitude,
          hobbyIds: selectedHobbyIds,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setMessage("Your login expired. Log in again to save your bio.");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not save bio.");
      }

      const data = (await response.json()) as Bio;
      setBio({
        ...emptyBio,
        ...data,
        latitude: null,
        longitude: null,
      });
      setSelectedHobbyIds(data.hobbies.map((hobby) => hobby.id));
      setMessage(data.complete ? "Bio saved." : "Bio saved, but it is not complete yet.");
    } catch {
      setMessage("Could not save bio.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <p className="muted-text">Loading bio...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Bio & preferences</p>
        <h2>My matching bio</h2>
        <p className="muted-text">
          Choose hobbies and preferences so MatchMe can recommend better people.
        </p>
      </div>

      <section className="bio-summary">
        <div>
          <h3>{bio.complete ? "Complete bio" : "Incomplete bio"}</h3>
          <p className="muted-text">{selectedHobbiesText}</p>
        </div>

        <span className={bio.complete ? "status-complete" : "status-incomplete"}>
          {bio.complete ? "Ready for matching" : "Needs more info"}
        </span>
      </section>

      <form className="form-card bio-form" onSubmit={saveBio}>
        <label>
          Maximum distance in km for GPS recommendations
          <input
            type="number"
            min={1}
            max={500}
            value={bio.maxDistanceKm}
            onChange={(event) => updateField("maxDistanceKm", Number(event.target.value))}
          />
        </label>

        <section className="gps-panel">
          <div>
            <h3>GPS radius matching</h3>
            <p className="muted-text">{locationStatusText}</p>
          </div>

          <div className="gps-actions">
            <button
              className="button button-secondary"
              type="button"
              onClick={useBrowserLocation}
              disabled={isLocating}
            >
              {isLocating ? "Finding location..." : "Use my current location"}
            </button>

            <button
              className="ghost-button"
              type="button"
              onClick={disableGpsLocation}
              disabled={!bio.gpsEnabled}
            >
              Use city instead
            </button>
          </div>
        </section>

        <label>
          Availability
          <select
            value={bio.availability}
            onChange={(event) => updateField("availability", event.target.value)}
          >
            {availabilityOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Activity preference
          <select
            value={bio.activityPreference}
            onChange={(event) => updateField("activityPreference", event.target.value)}
          >
            {activityOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Looking for
          <select
            value={bio.lookingFor}
            onChange={(event) => updateField("lookingFor", event.target.value)}
          >
            {lookingForOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="bio-hobbies">
          <div>
            <h3>Hobbies</h3>
            <p className="muted-text">Choose at least 3 hobbies.</p>
          </div>

          <div className="hobby-grid">
            {hobbies.map((hobby) => {
              const isSelected = selectedHobbyIds.includes(hobby.id);

              return (
                <button
                  className={isSelected ? "hobby-chip hobby-chip-selected" : "hobby-chip"}
                  type="button"
                  key={hobby.id}
                  onClick={() => toggleHobby(hobby.id)}
                >
                  {hobby.name}
                </button>
              );
            })}
          </div>
        </div>

        <button className="button button-primary" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save bio"}
        </button>

        {message && <p className="muted-text">{message}</p>}
      </form>
    </div>
  );
}
