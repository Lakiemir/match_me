package com.matchme;

import com.matchme.auth.User;
import com.matchme.auth.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    public ChatService(
            ChatRepository chatRepository,
            ChatMessageRepository messageRepository,
            UserRepository userRepository
    ) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Chat getOrCreateChat(Long userId1, Long userId2) {
        if (userId1.equals(userId2)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot chat with yourself");
        }

        Long userAId = Math.min(userId1, userId2);
        Long userBId = Math.max(userId1, userId2);

        return chatRepository.findByUserAIdAndUserBId(userAId, userBId)
                .orElseGet(() -> {
                    Chat newChat = new Chat();
                    User userA = userRepository.findById(userAId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
                    User userB = userRepository.findById(userBId)
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

                    newChat.setUserA(userA);
                    newChat.setUserB(userB);
                    newChat.setLastMessageAt(OffsetDateTime.now());
                    return chatRepository.save(newChat);
                });
    }

    @Transactional
    public ChatMessage sendMessage(Long chatId, Long senderId, String content) {
        Chat chat = getChatForParticipant(chatId, senderId);

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));

        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(sender);
        message.setContent(content);
        message.setCreatedAt(OffsetDateTime.now());

        chat.setLastMessageAt(message.getCreatedAt());
        chatRepository.save(chat);

        return messageRepository.save(message);
    }

    public List<Chat> getUserChats(Long userId) {
        return chatRepository.findAllByUserIdOrderByRecent(userId);
    }

    public Page<ChatMessage> getChatHistory(Long chatId, Long userId, Pageable pageable) {
        getChatForParticipant(chatId, userId);
        return messageRepository.findByChatIdOrderByCreatedAtDesc(chatId, pageable);
    }

    public long countUnreadMessages(Long chatId, Long userId) {
        getChatForParticipant(chatId, userId);
        return messageRepository.countByChatIdAndSenderIdNotAndReadFalse(chatId, userId);
    }

    public Chat getChatForParticipant(Long chatId, Long userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found"));

        if (!chat.getUserA().getId().equals(userId) && !chat.getUserB().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a participant of this chat");
        }

        return chat;
    }
    
}
