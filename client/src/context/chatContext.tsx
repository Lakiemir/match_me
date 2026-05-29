import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { chatService } from '../services/chatServices';
import { webSocketService } from '../services/websocketService';


export interface Chat {
  id: number;
  
  companionId: number; 
  companionName?: string; 
  companionAvatar?: string;
  lastMessageContent?: string;
  lastMessageAt?: string;
  unreadCount?: number;
}

interface ChatContextType {
  chats: Chat[];
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  isConnected: boolean;
  loadChats: (token: string) => Promise<void>;
  connectWebSocket: (token: string, userId: number) => Promise<void>;
  disconnectWebSocket: () => void;
  updateChatListWithNewMessage: (chatId: number, content: string, timestamp: string) => void;
}


const ChatContext = createContext<ChatContextType | undefined>(undefined);


export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  
  const loadChats = useCallback(async (token: string) => {
    try {
      const data = await chatService.getChats(token);
      setChats(data);
    } catch (error) {
      console.error('Ошибка при загрузке чатов:', error);
    }
  }, []);

  
  const connectWebSocket = useCallback(async (token: string, userId: number) => {
    try {
      await webSocketService.connect(token);
      setIsConnected(true);

      
      chatService.subscribeToNotifications(userId, (notification) => {
        console.log('Получено новое уведомление:', notification);
        
        
        if (notification.type === 'NEW_MESSAGE') {
          updateChatListWithNewMessage(
            notification.chatId, 
            notification.content, 
            new Date().toISOString()
          );
        }
      });
    } catch (error) {
      console.error('Не удалось подключиться к WebSocket', error);
      setIsConnected(false);
    }
  }, []);

  const disconnectWebSocket = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
  }, []);

  
  const updateChatListWithNewMessage = useCallback((chatId: number, content: string, timestamp: string) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(c => c.id === chatId);
      if (chatIndex === -1) return prevChats; 

      const updatedChat = { 
        ...prevChats[chatIndex], 
        lastMessageContent: content, 
        lastMessageAt: timestamp,
        unreadCount: (prevChats[chatIndex].unreadCount || 0) + 1 
      };

      
      const filteredChats = prevChats.filter(c => c.id !== chatId);
      return [updatedChat, ...filteredChats];
    });
  }, []);

  return (
    <ChatContext.Provider value={{ 
      chats, 
      setChats, 
      isConnected, 
      loadChats, 
      connectWebSocket, 
      disconnectWebSocket,
      updateChatListWithNewMessage 
    }}>
      {children}
    </ChatContext.Provider>
  );
};


export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext должен использоваться внутри ChatProvider');
  }
  return context;
};