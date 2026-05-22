import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Send logged-out users to login, then remember where they tried to go.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
