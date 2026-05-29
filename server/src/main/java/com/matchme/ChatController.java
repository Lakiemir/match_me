package com.matchme;

import com.matchme.auth.User;
import com.matchme.auth.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<ChatResponse>> getMyChats(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        List<ChatResponse> chats = chatService.getUserChats(userId).stream()
                .map(chat -> mapToChatResponse(chat, userId))
                .collect(Collectors.toList());
        return ResponseEntity.ok(chats);
    }

    @PostMapping("/with/{otherUserId}")
    public ResponseEntity<ChatResponse> startChat(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PathVariable Long otherUserId
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        Chat chat = chatService.getOrCreateChat(userId, otherUserId);
        return ResponseEntity.ok(mapToChatResponse(chat, userId));
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @PathVariable Long chatId,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorizationHeader,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Long userId = getUserIdFromAuthorizationHeader(authorizationHeader);
        Page<MessageResponse> messages = chatService.getChatHistory(chatId, userId, pageable)
                .map(msg -> new MessageResponse(
                        msg.getId(),
                        msg.getSender().getId(),
                        msg.getContent(),
                        msg.getCreatedAt(),
                        msg.isRead()
                ));
        return ResponseEntity.ok(messages);
    }

    private ChatResponse mapToChatResponse(Chat chat, Long currentUserId) {
        User otherUser = chat.getOtherUser(currentUserId);
        long unreadCount = chatService.countUnreadMessages(chat.getId(), currentUserId);
        return new ChatResponse(
                chat.getId(),
                otherUser.getId(),
                otherUser.getEmail(),
                chat.getLastMessageAt(),
                unreadCount
        );
    }

    private Long getUserIdFromAuthorizationHeader(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing token");
        }
        String token = authorizationHeader.substring("Bearer ".length()).trim();
        try {
            return jwtService.getUserIdFromToken(token);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }
}