import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

type ConnectionId = {
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

type ConnectionCard = {
  user: UserSummary;
  profile: UserProfile;
};

const API_BASE_URL = "";

export function ConnectionsPage() {
  const [cards, setCards] = useState<ConnectionCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadConnectionCard = useCallback(async (userId: number, token: string) => {
    // /connections returns ids only, so we fetch profile display data separately.
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [userResponse, profileResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/users/${userId}`, { headers }),
      fetch(`${API_BASE_URL}/api/users/${userId}/profile`, { headers }),
    ]);

    if (!userResponse.ok || !profileResponse.ok) {
      throw new Error("Could not load connection details.");
    }

    return {
      user: (await userResponse.json()) as UserSummary,
      profile: (await profileResponse.json()) as UserProfile,
    };
  }, []);

  const loadConnections = useCallback(async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setMessage("Log in first to see connections.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/connections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        sessionStorage.removeItem("token");
        setMessage("Your login expired. Log in again.");
        return;
      }

      if (!response.ok) {
        throw new Error("Could not load connections.");
      }

      const connections = (await response.json()) as ConnectionId[];

      const loadedCards = await Promise.all(
        connections.map((connection) => loadConnectionCard(connection.id, token)),
      );

      setCards(loadedCards);
      setMessage(loadedCards.length === 0 ? "No connections yet." : "");
    } catch {
      setMessage("Could not load connections.");
    } finally {
      setIsLoading(false);
    }
  }, [loadConnectionCard]);

  useEffect(() => {
    // Defer the API load so React does not see direct state updates inside the effect body
    const timeoutId = window.setTimeout(() => {
      void loadConnections();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadConnections]);


  async function disconnect(userId: number) {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setMessage("Log in first to disconnect.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not disconnect.");
      }

      setCards((currentCards) => currentCards.filter((card) => card.user.id !== userId));
      setMessage("Disconnected.");
    } catch {
      setMessage("Could not disconnect.");
    }
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <p className="muted-text">Loading connections...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Connections</p>
        <h2>Your connected people</h2>
        <p className="muted-text">
          Connected users can view each other's profiles and start or resume chat.
        </p>
      </div>

      {message && <p className="muted-text">{message}</p>}

      {cards.length === 0 ? (
        <section className="empty-state">
          <h3>No connections yet</h3>
          <p>Accept a request to create your first connection.</p>
        </section>
      ) : (
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
                </div>

                <div className="card-actions">
                  <Link
                    className="button button-secondary"
                    to={`/connections/${card.user.id}`}
                  >
                    Open profile
                  </Link>

                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => disconnect(card.user.id)}
                  >
                    Disconnect
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
