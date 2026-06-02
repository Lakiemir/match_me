import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useChatContext } from "../context/useChatContext";
import { chatService } from "../services/chatServices";

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

type ConnectedProfile = {
  user: UserSummary;
  profile: UserProfile;
  bio: UserBio;
};

const API_BASE_URL = "";

export function ConnectedProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { onlineUsers, upsertChat } = useChatContext();

  const [connectedProfile, setConnectedProfile] = useState<ConnectedProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [presenceLoaded, setPresenceLoaded] = useState(false);

  const loadConnectedProfile = useCallback(async () => {
    if (!token || !userId) {
      setMessage("Could not load connected profile.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [userResponse, profileResponse, bioResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/users/${userId}`, { headers }),
        fetch(`${API_BASE_URL}/api/users/${userId}/profile`, { headers }),
        fetch(`${API_BASE_URL}/api/users/${userId}/bio`, { headers }),
      ]);

      if (!userResponse.ok || !profileResponse.ok || !bioResponse.ok) {
        throw new Error("Could not load connected profile.");
      }

      setConnectedProfile({
        user: (await userResponse.json()) as UserSummary,
        profile: (await profileResponse.json()) as UserProfile,
        bio: (await bioResponse.json()) as UserBio,
      });
    } catch {
      setMessage("Could not load connected profile.");
    } finally {
      setIsLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    // Defer the API load so React does not see direct state updates inside the effect body
    const timeoutId = window.setTimeout(() => {
      void loadConnectedProfile();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadConnectedProfile]);

  useEffect(() => {
    async function loadPresence() {
      if (!token || !userId) {
        return;
      }

      try {
        await chatService.getPresence(Number(userId), token);
      } finally {
        setPresenceLoaded(true);
      }
    }

    void loadPresence();
  }, [token, userId]);

  async function startChat() {
    if (!token || !connectedProfile) {
      setMessage("Could not start chat.");
      return;
    }

    try {
      const chat = await chatService.startChat(connectedProfile.user.id, token);
      upsertChat(chat);
      navigate(`/chats/${chat.id}`);
    } catch {
      setMessage("Could not start chat.");
    }
  }

  async function disconnect() {
    if (!token || !connectedProfile) {
      setMessage("Could not disconnect.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/connections/${connectedProfile.user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Could not disconnect.");
      }

      navigate("/connections");
    } catch {
      setMessage("Could not disconnect.");
    }
  }

  if (isLoading) {
    return (
      <div className="page-stack">
        <p className="muted-text">Loading connected profile...</p>
      </div>
    );
  }

  if (!connectedProfile) {
    return (
      <div className="page-stack">
        <p className="muted-text">{message || "Connected profile not found."}</p>
        <Link className="text-link" to="/connections">
          Back to connections
        </Link>
      </div>
    );
  }

  const hasPicture = Boolean(connectedProfile.user.pictureLink);
  const isOnline = onlineUsers[connectedProfile.user.id];

  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Connected profile</p>
        <h2>{connectedProfile.user.name}</h2>
        <p className="muted-text">{connectedProfile.profile.city}</p>
        {presenceLoaded && (
          <p className={isOnline ? "status-online" : "status-offline"}>
            {isOnline ? "Online" : "Offline"}
          </p>
        )}
      </div>

      {message && <p className="muted-text">{message}</p>}

      <section className="match-card recommendation-card">
        <div className="avatar">
          {hasPicture ? (
            <img
              src={connectedProfile.user.pictureLink ?? ""}
              alt={connectedProfile.user.name}
            />
          ) : (
            <span>👤</span>
          )}
        </div>

        <div className="recommendation-content">
          <h3>{connectedProfile.user.name}</h3>
          <p>{connectedProfile.profile.aboutMe}</p>

          <div className="recommendation-tags">
            <span>{connectedProfile.bio.availability}</span>
            <span>{connectedProfile.bio.activityPreference}</span>
            <span>{connectedProfile.bio.lookingFor}</span>
          </div>

          <p className="muted-text">
            {connectedProfile.bio.hobbies.map((hobby) => hobby.name).join(", ")}
          </p>
        </div>

        <div className="card-actions">
          <button className="button button-primary" type="button" onClick={startChat}>
            Start chat
          </button>

          <button className="button button-secondary" type="button" onClick={disconnect}>
            Disconnect
          </button>
        </div>
      </section>

      <Link className="text-link" to="/connections">
        Back to connections
      </Link>
    </div>
  );
}
