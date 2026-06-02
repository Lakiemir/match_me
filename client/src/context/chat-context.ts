import { createContext } from "react";
import type { Chat } from "../services/chatServices";

export type ChatContextValue = {
    chats: Chat[];
    onlineUsers: Record<number, boolean>;
    isConnected: boolean;
    loadChats: (token: string) => Promise<void>;
    connectWebSocket: (token: string) => Promise<void>;
    disconnectWebSocket: () => void;
    upsertChat: (chat: Chat) => void;
    markChatRead: (chatId: number) => void;
    setUserOnline: (userId: number, online: boolean) => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);
