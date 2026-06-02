import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private connectionPromise: Promise<void> | null = null;

  connect(token: string): Promise<void> {
    if (this.client?.connected) {
      return Promise.resolve();
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const wsUrl = import.meta.env.VITE_WS_URL || "/ws";

      this.client = new Client({
        webSocketFactory: () => new SockJS(wsUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          resolve();
        },

        onStompError: (frame) => {
          reject(new Error(frame.headers.message || "WebSocket error"));
        },

        onWebSocketClose: () => {
          this.connectionPromise = null;
          this.subscriptions.clear();
        },
      });

      this.client.activate();
    });

    return this.connectionPromise;
  }

  async subscribe<T>(destination: string, callback: (message: T) => void) {
    await this.connectionPromise;

    if (!this.client?.connected) {
      return;
    }

    if (this.subscriptions.has(destination)) {
      this.unsubscribe(destination);
    }

    const subscription = this.client.subscribe(destination, (message: IMessage) => {
      callback(JSON.parse(message.body) as T);
    });

    this.subscriptions.set(destination, subscription);
  }

  unsubscribe(destination: string) {
    const subscription = this.subscriptions.get(destination);

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  async send(destination: string, body: unknown) {
    await this.connectionPromise;

    if (!this.client?.connected) {
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
    }

    this.client = null;
    this.connectionPromise = null;
    this.subscriptions.clear();
  }
}

export const webSocketService = new WebSocketService();
