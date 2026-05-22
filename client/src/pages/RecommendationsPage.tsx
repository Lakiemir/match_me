import { useCallback, useEffect, useState } from "react";

type RecommendationId = {
  id: number;
};

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

type Hobby = {
  id: number;
  name: string;
};

type UserBio = {
  id: number;
  maxDistanceKm: number;
  availability: string;
  activityPreference: string;
  lookingFor: string;
  hobbies: Hobby[];
};

type RecommendationCard = {
  user: UserSummary;
  profile: UserProfile;
  bio: UserBio;
};

const API_BASE_URL = "http://localhost:8080";

export function RecommendationsPage() {
  const [cards, setCards] = useState<RecommendationCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRecommendationCard = useCallback(async (userId: number, token: string) => {
    // The recommendations endpoint only gives ids, so we fetch the visible profile details separately.
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [userResponse, profileResponse, bioResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/users/${userId}`, { headers }),
      fetch(`${API_BASE_URL}/api/users/${userId}/profile`, { headers }),
      fetch(`${API_BASE_URL}/api/users/${userId}/bio`, { headers }),
    ]);

    if (!userResponse.ok || !profileResponse.ok || !bioResponse.ok) {
      throw new Error("Could not load recommendation details.");
    }

    return {
      user: (await userResponse.json()) as UserSummary,
      profile: (await profileResponse.json()) as UserProfile,
      bio: (await bioResponse.json()) as UserBio,
    };
  }, []);

  const loadRecommendations = useCallback(async () => {
    // All protected API calls use the JWT saved by the login page.
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Log in first to see recommendations.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        setMessage("Your login expired. Log in again.");
        return;
      }

      if (response.status === 403) {
        setMessage("Complete your profile and bio before viewing recommendations.");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load recommendations.");
      }

      const recommendations = (await response.json()) as RecommendationId[];

      // Convert recommendation ids into full cards the user can read and act on.
      const loadedCards = await Promise.all(
        recommendations.map((recommendation) =>
          loadRecommendationCard(recommendation.id, token),
        ),
      );

      setCards(loadedCards);
      setMessage(loadedCards.length === 0 ? "No strong recommendations found yet." : "");
    } catch {
      setMessage("Could not load recommendations.");
    } finally {
      setIsLoading(false);
    }
  }, [loadRecommendationCard]);

  useEffect(() => {
    // Load recommendations once when the page opens.
    const timeoutId = window.setTimeout(() => {
      void loadRecommendations();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadRecommendations]);

  async function dismissRecommendation(userId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Log in first to dismiss recommendations.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations/${userId}/dismiss`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not dismiss recommendation.");
      }

      // Remove the dismissed user immediately so the UI matches the saved action.
      setCards((currentCards) => currentCards.filter((card) => card.user.id !== userId));
      setMessage("Recommendation dismissed.");
    } catch {
      setMessage("Could not dismiss recommendation.");
    }
  }

  async function sendConnectionRequest(userId: number) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Log in first to send connection requests.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/requests/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 409) {
        setMessage("A connection request already exists.");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not send connection request.");
      }

      // After sending a request, the person moves out of recommendations and into requests/connections flow.
      setCards((currentCards) => currentCards.filter((card) => card.user.id !== userId));
      setMessage("Connection request sent.");
    } catch {
      setMessage("Could not send connection request.");
    }
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <p className="muted-text">Loading recommendations...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Recommendations</p>
        <h2>Recommended people</h2>
        <p className="muted-text">
          Recommendations use city, shared hobbies, availability, activity preference and
          what people are looking for.
        </p>
      </div>

      {message && <p className="muted-text">{message}</p>}

      <section className="card-list">
        {cards.map((card) => {
          const hasPicture = Boolean(card.user.pictureLink);

          return (
            <article className="match-card recommendation-card" key={card.user.id}>
              <div className="avatar">
                {hasPicture ? (
                  <img src={card.user.pictureLink ?? ""} alt={card.user.name} />
                ) : (
                  <span>👤</span>
                )}
              </div>

              <div className="recommendation-content">
                <h3>{card.user.name}</h3>
                <p className="muted-text">{card.profile.city}</p>
                <p>{card.profile.aboutMe}</p>

                <div className="recommendation-tags">
                  <span>{card.bio.availability}</span>
                  <span>{card.bio.activityPreference}</span>
                  <span>{card.bio.lookingFor}</span>
                </div>

                <p className="muted-text">
                  {card.bio.hobbies.map((hobby) => hobby.name).join(", ")}
                </p>
              </div>

              <div className="card-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => dismissRecommendation(card.user.id)}
                >
                  Dismiss
                </button>

                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => sendConnectionRequest(card.user.id)}
                >
                  Connect
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
