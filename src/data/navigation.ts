export type NavigationItem = {
  label: string;
  path: string;
  icon: string;
};

// Main navigation used by the sidebar
export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", path: "/", icon: "🏠" },
  { label: "Profile", path: "/profile", icon: "👤" },
  { label: "Bio", path: "/bio", icon: "🌱" },
  { label: "Recommendations", path: "/recommendations", icon: "✨" },
  { label: "Requests", path: "/requests", icon: "📩" },
  { label: "Connections", path: "/connections", icon: "🤝" },
  { label: "Chats", path: "/chats", icon: "💬" },
];