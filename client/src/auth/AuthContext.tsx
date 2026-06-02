import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./auth-context";

const TOKEN_KEY = "token";

function getUserIdFromToken(token: string | null): number | null {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      sub?: string;
    };

    return decoded.sub ? Number(decoded.sub) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem(TOKEN_KEY);
  });

  function login(nextToken: string) {
    // Save the JWT so protected pages can use it after refresh.
    sessionStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
  }

  function logout() {
    // JWT logout is client-side: remove the saved token.
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  const value = useMemo(
    () => ({
      token,
      userId: getUserIdFromToken(token),
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
