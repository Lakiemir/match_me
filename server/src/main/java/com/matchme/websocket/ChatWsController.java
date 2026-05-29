package com.matchme.websocket;
import com.matchme.Chat;
import com.matchme.ChatMessage;
import com.matchme.ChatService;
import com.matchme.MessageResponse;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller

public class ChatWsController {
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    public ChatWsController(ChatService chatService, SimpMessagingTemplate messagingTemplate){
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chats/{chatId}/send")
    public void sendMessage(
        @DestinationVariable Long chatId,
        @Payload WsSendMessageRequest request,
        Principal principal) {
            Long senderId = Long.valueOf(principal.getName());
            ChatMessage saved = chatService.sendMessage(chatId, senderId, request.content());
            MessageResponse messageResponse = new MessageResponse(
                saved.getId(),
                saved.getSender().getId(),
                saved.getContent(),
                saved.getCreatedAt(),
                saved.isRead()
            );
            messagingTemplate.convertAndSend("/topic/chat/" + chatId, messageResponse);
            Chat chat = chatService.getChatForParticipant(chatId, senderId);
            Long receiverId = chat.getOtherUser(senderId).getId();
            long unreadCount = chatService.countUnreadMessages(chatId, receiverId);
            messagingTemplate.convertAndSendToUser(receiverId.toString(),
            "/queue/unread", new UnreadSignalResponse(chatId, unreadCount));
            
        }
}
