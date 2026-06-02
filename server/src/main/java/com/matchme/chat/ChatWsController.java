package com.matchme.chat;

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

    public ChatWsController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chats/{chatId}/send")
    public void sendMessage(
            @DestinationVariable Long chatId,
            @Payload WsSendMessageRequest request,
            Principal principal) {
        Long senderId = Long.valueOf(principal.getName());

        MessageResponse savedMessage = chatService.sendMessage(chatId, senderId, request.content());
        Chat chat = chatService.getChatForParticipant(chatId, senderId);
        Long receiverId = chat.getOtherUser(senderId).getId();

        // Kept from the original idea: everyone viewing the chat gets the new message immediately 
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, savedMessage);

        // Added so both chat lists can move this chat to the top without polling
        messagingTemplate.convertAndSendToUser(
                senderId.toString(),
                "/queue/chats",
                chatService.mapToChatResponse(chat, senderId));

        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/chats",
                chatService.mapToChatResponse(chat, receiverId));

        long unreadCount = chatService.countUnreadMessages(chatId, receiverId);

        // Kept from the original idea: the receiver gets a private unread signal
        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/unread",
                new UnreadSignalResponse(chatId, unreadCount));
    }

    @MessageMapping("/chats/{chatId}/typing")
    public void typing(
            @DestinationVariable Long chatId,
            @Payload TypingRequest request,
            Principal principal) {
        Long userId = Long.valueOf(principal.getName());

        // Verifies the sender is part of the chat before broadcasting typing state
        chatService.getChatForParticipant(chatId, userId);

        messagingTemplate.convertAndSend(
                "/topic/chat/" + chatId + "/typing",
                new TypingSignalResponse(chatId, userId, request.typing()));
    }
}
