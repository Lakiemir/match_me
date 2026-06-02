import { useState } from "react";
import type { SyntheticEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const API_BASE_URL = "";

export function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords must match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status === 409) {
        setMessage("That email is already registered.");
        return;
      }

      if (!response.ok) {
        setMessage("Use a valid email and a password with at least 8 characters.");
        return;
      }

      // Registration creates the account. Login is a separate step.
      navigate("/login", {
        replace: true,
        state: { registeredEmail: email },
      });
    } catch {
      setMessage("Could not register. Check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-page">
      <div>
        <p className="eyebrow">Authentication</p>
        <h2>Create account</h2>
        <p className="muted-text">
          Register with a unique email and password. Passwords are protected by
          bcrypt in the backend.
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
            placeholder="At least 8 characters"
            minLength={8}
            maxLength={72}
            required
          />
        </label>

        <label>
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat password"
            minLength={8}
            maxLength={72}
            required
          />
        </label>

        <button className="button button-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        {message && <p className="muted-text">{message}</p>}

        <p className="muted-text">
          Already have an account?{" "}
          <Link className="text-link" to="/login">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
