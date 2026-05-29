import { webSocketService } from "./websocketService";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
class ChatService {
    async getChats(token: string) {
        const response = await fetch(`${API_URL}/chats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Ошибка при загрузке списка чатов');

        }
        return response.json();
    }

    async getMessages(chatId: number, token: string, page = 0, size = 20) {
        const response = await fetch(`${API_URL}/chats/${chatId}/messages?page=${page}&size=${size}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok){
            throw new Error('Ошибка при загрузке сообщений');

        }
        return response.json();
    }
    subscribeToChat(chatId: number, onMessageReceived: (message: any) => void){
        const topic = `/topic/chat/${chatId}`;
        webSocketService.subscribe(topic, onMessageReceived);
    }
    unsubscribeFromChat(chatId: number) {
        webSocketService.unsubscribe(`/topic/chat/${chatId}`);
    }
    subscribeToNotifications(userId: number, onNotificationReceived: (notification: any) => void){
        const topic = `/user/${userId}/queue/notifications`;
        webSocketService.subscribe(topic, onNotificationReceived);
    }
    sendMessage(chatId: number, senderId: number, content: string) {
        const destination = '/app/chat.send';

        const payload = {
            chatId,
            senderId,
            content,
            tempId: Date.now().toString()
        };
        webSocketService.send(destination, payload);
    }
}

export const chatService = new ChatService();