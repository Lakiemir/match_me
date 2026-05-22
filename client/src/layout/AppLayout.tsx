import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { navigationItems } from "../data/navigation";

const API_BASE_URL = "http://localhost:8080";

export function AppLayout() {
  const { isAuthenticated, logout, token } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    // Backend logout is stateless, but calling it keeps the UI aligned with the API.
    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => undefined);
    }

    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <p className="brand-title">MatchMe</p>
            <p className="brand-subtitle">Hobbies</p>
          </div>
        </div>

        {isAuthenticated && (
          <nav className="nav-list" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-active" : "nav-link"
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <h1>MatchMe Hobbies</h1>
            <p>Meet people through hobbies, preferences and location.</p>
          </div>

          <div className="auth-actions">
            {isAuthenticated ? (
              <button
                className="button button-secondary"
                type="button"
                onClick={handleLogout}
              >
                Log out
              </button>
            ) : (
              <>
                <NavLink to="/login" className="button button-secondary">
                  Log in
                </NavLink>
                <NavLink to="/register" className="button button-primary">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </header>

        <section className="page-panel">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
