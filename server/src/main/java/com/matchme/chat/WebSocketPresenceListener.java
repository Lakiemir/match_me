package com.matchme.chat;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;

// Sends online/offline events when WebSocket sessions open or close.
@Component
public class WebSocketPresenceListener {

    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketPresenceListener(
            PresenceService presenceService,
            SimpMessagingTemplate messagingTemplate) {
        this.presenceService = presenceService;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleConnected(SessionConnectedEvent event) {
        Principal principal = event.getUser();

        if (principal == null) {
            return;
        }

        Long userId = Long.valueOf(principal.getName());

        if (presenceService.connect(userId)) {
            messagingTemplate.convertAndSend("/topic/presence", new PresenceResponse(userId, true));
        }
    }

    @EventListener
    public void handleDisconnected(SessionDisconnectEvent event) {
        Principal principal = event.getUser();

        if (principal == null) {
            return;
        }

        Long userId = Long.valueOf(principal.getName());

        if (presenceService.disconnect(userId)) {
            messagingTemplate.convertAndSend("/topic/presence", new PresenceResponse(userId, false));
        }
    }
}
