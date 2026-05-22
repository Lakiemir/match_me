import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const API_BASE_URL = "http://localhost:8080";

type LoginResponse = {
  token: string;
  type: string;
};

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const state = location.state as LocationState | null;
  const redirectPath = state?.from?.pathname ?? "/profile";

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        setMessage("Invalid email or password.");
        return;
      }

      const data = (await response.json()) as LoginResponse;

      // Store the JWT and move the user into the protected app.
      login(data.token);
      navigate(redirectPath, { replace: true });
    } catch {
      setMessage("Could not log in. Check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <div>
        <p className="eyebrow">Authentication</p>
        <h2>Log in</h2>
        <p className="muted-text">
          Log in with your email and password to access your profile, matches,
          requests and chats.
        </p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            required
          />
        </label>

        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>

        {message && <p className="muted-text">{message}</p>}

        <p className="muted-text">
          No account yet?{" "}
          <Link className="text-link" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
