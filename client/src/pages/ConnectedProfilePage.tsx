import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

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

const API_BASE_URL = "http://localhost:8080";

export function ConnectedProfilePage() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [connectedProfile, setConnectedProfile] = useState<ConnectedProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadConnectedProfile = useCallback(async () => {
        const token = localStorage.getItem("token");

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
    }, [userId]);

    useEffect(() => {
        // Defer the API load so React does not see direct state updates inside the effect body
        const timeoutId = window.setTimeout(() => {
            void loadConnectedProfile();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [loadConnectedProfile]);


    async function disconnect() {
        const token = localStorage.getItem("token");

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

    return (
        <div className="page-stack">
            <div>
                <p className="eyebrow">Connected profile</p>
                <h2>{connectedProfile.user.name}</h2>
                <p className="muted-text">{connectedProfile.profile.city}</p>
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
                    <Link
                        className="button button-primary"
                        to={`/chats/${connectedProfile.user.id}`}
                    >
                        Start chat
                    </Link>

                    <button
                        className="button button-secondary"
                        type="button"
                        onClick={disconnect}
                    >
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
