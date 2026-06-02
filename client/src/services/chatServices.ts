import { webSocketService } from "./websocketService";

const API_BASE_URL = "";

export type Chat = {
    id: number;
    otherUserId: number;
    otherName: string;
    otherPictureLink: string | null;
    lastMessageContent: string;
    lastMessageAt: string;
    unreadCount: number;
};

export type ChatMessage = {
    id: number;
    chatId: number;
    senderId: number;
    content: string;
    createdAt: string;
    read: boolean;
};

export type MessagePage = {
    content: ChatMessage[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
};

export type UnreadSignal = {
    chatId: number;
    unreadCount: number;
};

export type TypingSignal = {
    chatId: number;
    userId: number;
    typing: boolean;
};

export type PresenceSignal = {
    userId: number;
    online: boolean;
};

function authHeaders(token: string) {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

class ChatService {
    async getChats(token: string): Promise<Chat[]> {
        const response = await fetch(`${API_BASE_URL}/api/chats`, {
            headers: authHeaders(token),
        });

        if (!response.ok) {
            throw new Error("Could not load chats.");
        }

        return response.json() as Promise<Chat[]>;
    }

    async startChat(otherUserId: number, token: string): Promise<Chat> {
        const response = await fetch(`${API_BASE_URL}/api/chats/with/${otherUserId}`, {
            method: "POST",
            headers: authHeaders(token),
        });

        if (!response.ok) {
            throw new Error("Could not start chat.");
        }

        return response.json() as Promise<Chat>;
    }

    async getMessages(chatId: number, token: string, page = 0, size = 20): Promise<MessagePage> {
        const response = await fetch(
            `${API_BASE_URL}/api/chats/${chatId}/messages?page=${page}&size=${size}`,
            {
                headers: authHeaders(token),
            },
        );

        if (!response.ok) {
            throw new Error("Could not load messages.");
        }

        return response.json() as Promise<MessagePage>;
    }

    async getPresence(userId: number, token: string): Promise<PresenceSignal> {
        const response = await fetch(`${API_BASE_URL}/api/presence/${userId}`, {
            headers: authHeaders(token),
        });

        if (!response.ok) {
            throw new Error("Could not load presence.");
        }

        return response.json() as Promise<PresenceSignal>;
    }

    subscribeToChat(chatId: number, onMessageReceived: (message: ChatMessage) => void) {
        // Kept from the original flow: subscribe to the chat topic while the chat page is open.
        return webSocketService.subscribe<ChatMessage>(`/topic/chat/${chatId}`, onMessageReceived);
    }



    unsubscribeFromChat(chatId: number) {
        webSocketService.unsubscribe(`/topic/chat/${chatId}`);
    }

    subscribeToTyping(chatId: number, onTypingReceived: (signal: TypingSignal) => void) {
        return webSocketService.subscribe<TypingSignal>(`/topic/chat/${chatId}/typing`, onTypingReceived);
    }



    unsubscribeFromTyping(chatId: number) {
        webSocketService.unsubscribe(`/topic/chat/${chatId}/typing`);
    }

    subscribeToChatUpdates(onChatUpdate: (chat: Chat) => void) {
        webSocketService.subscribe<Chat>("/user/queue/chats", onChatUpdate);
    }

    subscribeToUnread(onUnreadReceived: (signal: UnreadSignal) => void) {
        webSocketService.subscribe<UnreadSignal>("/user/queue/unread", onUnreadReceived);
    }

    subscribeToPresence(onPresenceReceived: (signal: PresenceSignal) => void) {
        webSocketService.subscribe<PresenceSignal>("/topic/presence", onPresenceReceived);
    }

    async sendMessageRest(chatId: number, content: string, token: string): Promise<ChatMessage> {
        const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/messages`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error("Could not send message.");
        }

        return response.json() as Promise<ChatMessage>;
    }

    sendMessage(chatId: number, content: string) {
        webSocketService.send(`/app/chats/${chatId}/send`, { content });
    }

    sendTyping(chatId: number, typing: boolean) {
        webSocketService.send(`/app/chats/${chatId}/typing`, { typing });
    }

}

export const chatService = new ChatService();
