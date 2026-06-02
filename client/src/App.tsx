import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/useAuth";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { useChatContext } from "./context/useChatContext";
import { AppLayout } from "./layout/AppLayout";
import { BioPage } from "./pages/BioPage";
import { ChatPage } from "./pages/ChatPage";
import { ChatsPage } from "./pages/ChatsPage";
import { ConnectedProfilePage } from "./pages/ConnectedProfilePage";
import { ConnectionsPage } from "./pages/ConnectionsPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RequestsPage } from "./pages/RequestsPage";

export default function App() {
  const { token, isAuthenticated } = useAuth();
  const { connectWebSocket, disconnectWebSocket, loadChats } = useChatContext();

  useEffect(() => {
    if (isAuthenticated && token) {
      void connectWebSocket(token);
      void loadChats(token);
    } else {
      disconnectWebSocket();
    }
  }, [isAuthenticated, token, connectWebSocket, disconnectWebSocket, loadChats]);

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bio" element={<BioPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/connections/:userId" element={<ConnectedProfilePage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/chats/:chatId" element={<ChatPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
