import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { BioPage } from "./pages/BioPage";
import { ChatPage } from "./pages/ChatPage";
import { ChatsPage } from "./pages/ChatsPage";
import { ConnectionsPage } from "./pages/ConnectionsPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { RequestsPage } from "./pages/RequestsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/bio" element={<BioPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/connections" element={<ConnectionsPage />} />
        <Route path="/chats" element={<ChatsPage />} />
        <Route path="/chats/:chatId" element={<ChatPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}