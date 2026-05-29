import SockJS from 'sockjs-client';
import {Client} from '@stomp/stompjs';
import type {StompSubscription} from '@stomp/stompjs';
class WebSocketService{
    private client: Client | null = null;
    private subscriptions: Map<string, StompSubscription> = new Map();
    private connectionPromise: Promise<void> | null = null;

    connect(token: string): Promise<void> {
        if (this.connectionPromise) return this.connectionPromise;
        this.connectionPromise = new Promise((resolve, reject) => {
            const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
            this.client = new Client({
                webSocketFactory: () => new SockJS(wsUrl),
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,

                onConnect: () => {
                    console.log('WebSocket успешно подключен');
                    resolve();
                },
                onStompError: (frame) => {
                    console.error('Ошибка STOMP:', frame.headers['message']);
                    reject(new Error(frame.headers['message']));
                },
                onWebSocketError: (error) => {
                    console.error('Ошибка соединения WebSocket:', error);
                },
                onWebSocketClose: () => {
                    console.warn('Соединение закрыто');
                }
            });
            this.client.activate();
        });
        return this.connectionPromise;
    }

    async subscribe(destination: string, callback: (message: any) => void) {
        await this.connectionPromise;

        if (!this.client || !this.client.connected) {
            console.error('Не удалось подписаться: нет соединения с сервером');
            return;
        }

        if (this.subscriptions.has(destination)) {
            this.unsubscribe(destination);
        }
        const subscription = this.client.subscribe(destination, (message) => {
            callback(JSON.parse(message.body));
        });

        this.subscriptions.set(destination, subscription);
    }

    unsubscribe(destination: string) {
        const subscription = this.subscriptions.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
            console.log(`Отписка от ${destination} выполнена`);
        }
    }

    async send(destination: string, body: any) {
        await this.connectionPromise;

        if (!this.client || !this.client.connected) {
            console.error('Невозможно отправить сообщение: WebSocket отключен');
            return;
        }

        this.client.publish({
            destination,
            body: JSON.stringify(body)
        });
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.connectionPromise = null;
            this.subscriptions.clear();
            console.log('WebSocket отключен вручную');
        }
    }
}
export const webSocketService = new WebSocketService();