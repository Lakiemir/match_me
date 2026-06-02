import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useChatContext } from "../context/useChatContext";
import { navigationItems } from "../data/navigation";
import { useChatContext } from "../context/chatContext";
import type { Chat } from "../context/chatContext";

const API_BASE_URL = "";

export function AppLayout() {
  const { isAuthenticated, logout, token } = useAuth();
  const { chats } = useChatContext();
  const navigate = useNavigate();
  const { chats } = useChatContext();
  
  const getTotalUnreadCount = (): number => {
    return chats.reduce((sum: number, chat: Chat) => sum + (chat.unreadCount || 0), 0);
  };

  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

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
                {item.path === "/chats" && totalUnread > 0 && (
                  <span className="nav-unread">{totalUnread}</span>
                )}
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
            {isAuthenticated && (
              <NavLink 
                to="/chats" 
                className="relative nav-link"
                title="Messages"
              >
                <span>💬</span>
                {getTotalUnreadCount() > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {getTotalUnreadCount()}
                  </span>
                )}
              </NavLink>
            )}
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
