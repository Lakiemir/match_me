import { createContext } from "react";

export type AuthContextValue = {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
