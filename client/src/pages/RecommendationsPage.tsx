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

      setCards((currentCards) => currentCards.filter((card) => card.user.id !== userId));
      setMessage("Recommendation dismissed.");
    } catch {
      setMessage("Could not dismiss recommendation.");
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

                <button className="button button-primary" type="button" disabled>
                  Connect later
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
