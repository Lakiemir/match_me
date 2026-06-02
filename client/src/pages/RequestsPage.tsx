import { useCallback, useEffect, useState } from "react";

type ConnectionRequest = {
  senderUserId: number;
  receiverUserId: number;
  status: string;
  createdAt: string;
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

type IncomingRequestCard = {
  request: ConnectionRequest;
  user: UserSummary;
  profile: UserProfile;
};

const API_BASE_URL = "";

export function RequestsPage() {
  const [cards, setCards] = useState<IncomingRequestCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRequestCard = useCallback(async (request: ConnectionRequest, token: string) => {
    // Incoming requests only store ids, so we fetch sender details for display.
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const [userResponse, profileResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/users/${request.senderUserId}`, { headers }),
      fetch(`${API_BASE_URL}/api/users/${request.senderUserId}/profile`, { headers }),
    ]);

    if (!userResponse.ok || !profileResponse.ok) {
      throw new Error("Could not load request details.");
    }

    return {
      request,
      user: (await userResponse.json()) as UserSummary,
      profile: (await profileResponse.json()) as UserProfile,
    };
  }, []);

  const loadIncomingRequests = useCallback(async () => {
    // The backend uses the JWT to know whose incoming requests to return.
    const token = sessionStorage.getItem("token");

    if (!token) {
      setMessage("Log in first to see connection requests.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/requests/incoming`, {
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
        throw new Error("Could not load connection requests.");
      }

      const requests = (await response.json()) as ConnectionRequest[];

      // Convert raw requests into cards with the sender name, picture, and profile.
      const loadedCards = await Promise.all(
        requests.map((request) => loadRequestCard(request, token)),
      );

      setCards(loadedCards);
      setMessage(loadedCards.length === 0 ? "No incoming requests yet." : "");
    } catch {
      setMessage("Could not load connection requests.");
    } finally {
      setIsLoading(false);
    }
  }, [loadRequestCard]);

  useEffect(() => {
    // Load incoming requests once when the page opens.
    const timeoutId = window.setTimeout(() => {
      void loadIncomingRequests();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadIncomingRequests]);

  async function answerRequest(senderUserId: number, action: "accept" | "reject") {
    const token = sessionStorage.getItem("token");

    if (!token) {
      setMessage("Log in first to answer connection requests.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/connections/requests/${senderUserId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Could not update connection request.");
      }

      // Remove the answered request from the page because it is no longer pending.
      setCards((currentCards) =>
        currentCards.filter((card) => card.request.senderUserId !== senderUserId),
      );

      setMessage(action === "accept" ? "Connection request accepted." : "Connection request rejected.");
    } catch {
      setMessage("Could not update connection request.");
    }
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <p className="muted-text">Loading connection requests...</p>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Connection requests</p>
        <h2>Incoming requests</h2>
        <p className="muted-text">
          Review people who want to connect with you.
        </p>
      </div>

      {message && <p className="muted-text">{message}</p>}

      {cards.length === 0 ? (
        <section className="empty-state">
          <h3>No requests yet</h3>
          <p>When someone sends a connection request, it will appear here.</p>
        </section>
      ) : (
        <section className="card-list">
          {cards.map((card) => {
            const hasPicture = Boolean(card.user.pictureLink);

            return (
              <article className="match-card recommendation-card" key={card.request.senderUserId}>
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
                  <p className="muted-text">
                    Sent {new Date(card.request.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="card-actions">
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => answerRequest(card.request.senderUserId, "reject")}
                  >
                    Reject
                  </button>

                  <button
                    className="button button-primary"
                    type="button"
                    onClick={() => answerRequest(card.request.senderUserId, "accept")}
                  >
                    Accept
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
