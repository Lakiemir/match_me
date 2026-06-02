package com.matchme.chat;

import com.matchme.auth.JwtService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;
    private final JwtService jwtService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(
            ChatService chatService,
            JwtService jwtService,
            SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.jwtService = jwtService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public List<ChatResponse> getMyChats(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);

        return chatService.getUserChats(userId);
    }

    @PostMapping("/with/{otherUserId}")
    public ChatResponse startChat(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long otherUserId) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        Chat chat = chatService.getOrCreateChat(userId, otherUserId);

        return chatService.mapToChatResponse(chat, userId);
    }

    @GetMapping("/{chatId}/messages")
    public Page<MessageResponse> getMessages(
            @PathVariable Long chatId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PageableDefault(size = 20) Pageable pageable) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);

        return chatService.getChatHistory(chatId, userId, pageable);
    }

    @PostMapping("/{chatId}/messages")
    public MessageResponse sendMessage(
            @PathVariable Long chatId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @Valid @RequestBody SendMessageRequest request) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);

        MessageResponse savedMessage = chatService.sendMessage(chatId, userId, request.content());
        Chat chat = chatService.getChatForParticipant(chatId, userId);
        Long receiverId = chat.getOtherUser(userId).getId();

        // Everyone viewing the chat gets the new message immediately.
        messagingTemplate.convertAndSend("/topic/chat/" + chatId, savedMessage);

        // Both chat lists can move this chat to the top without polling.
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chats",
                chatService.mapToChatResponse(chat, userId));

        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/chats",
                chatService.mapToChatResponse(chat, receiverId));

        long unreadCount = chatService.countUnreadMessages(chatId, receiverId);

        // The receiver gets a private unread signal.
        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/unread",
                new UnreadSignalResponse(chatId, unreadCount));

        return savedMessage;
    }

    private Long getUserIdFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing token");
        }

        String token = authorizationHeader.substring("Bearer ".length()).trim();

        try {
            return jwtService.getUserIdFromToken(token);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }
}
