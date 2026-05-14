import { NavLink, Outlet } from "react-router-dom";
import { navigationItems } from "../data/navigation";

export function AppLayout() {
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
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <h1>MatchMe Hobbies</h1>
            <p>Meet people through hobbies, preferences and location.</p>
          </div>

          <div className="auth-actions">
            <NavLink to="/login" className="button button-secondary">
              Log in
            </NavLink>
            <NavLink to="/register" className="button button-primary">
              Register
            </NavLink>
          </div>
        </header>

        <section className="page-panel">
          <Outlet />
        </section>
      </main>
    </div>
  );
}