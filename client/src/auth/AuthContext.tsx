import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./auth-context";

const TOKEN_KEY = "token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  function login(nextToken: string) {
    // Save the JWT so protected pages can use it after refresh.
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
  }

  function logout() {
    // JWT logout is client-side: remove the saved token.
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
