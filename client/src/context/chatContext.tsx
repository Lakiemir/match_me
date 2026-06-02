import { useCallback, useState } from "react";
import type { ReactNode } from "react";
import { ChatContext } from "./chat-context";
import { chatService, type Chat, type PresenceSignal, type UnreadSignal } from "../services/chatServices";
import { webSocketService } from "../services/websocketService";

function sortChatsByRecent(chats: Chat[]) {
  return [...chats].sort((first, second) => {
    return new Date(second.lastMessageAt).getTime() - new Date(first.lastMessageAt).getTime();
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Record<number, boolean>>({});
  const [isConnected, setIsConnected] = useState(false);

  const upsertChat = useCallback((nextChat: Chat) => {
    setChats((currentChats) => {
      const withoutOld = currentChats.filter((chat) => chat.id !== nextChat.id);
      return sortChatsByRecent([nextChat, ...withoutOld]);
    });
  }, []);

  const markChatRead = useCallback((chatId: number) => {
    setChats((currentChats) =>
      currentChats.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)),
    );
  }, []);

  const setUserOnline = useCallback((userId: number, online: boolean) => {
    setOnlineUsers((currentUsers) => ({
      ...currentUsers,
      [userId]: online,
    }));
  }, []);

  const loadChats = useCallback(async (token: string) => {
    const loadedChats = await chatService.getChats(token);
    setChats(sortChatsByRecent(loadedChats));
  }, []);

  const connectWebSocket = useCallback(
    async (token: string) => {
      await webSocketService.connect(token);
      setIsConnected(true);

      chatService.subscribeToChatUpdates((chat) => {
        upsertChat(chat);
      });

      chatService.subscribeToUnread((signal: UnreadSignal) => {
        setChats((currentChats) =>
          currentChats.map((chat) =>
            chat.id === signal.chatId ? { ...chat, unreadCount: signal.unreadCount } : chat,
          ),
        );
      });

      chatService.subscribeToPresence((signal: PresenceSignal) => {
        setUserOnline(signal.userId, signal.online);
      });
    },
    [setUserOnline, upsertChat],
  );

  const disconnectWebSocket = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
    setOnlineUsers({});
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        onlineUsers,
        isConnected,
        loadChats,
        connectWebSocket,
        disconnectWebSocket,
        upsertChat,
        markChatRead,
        setUserOnline,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
