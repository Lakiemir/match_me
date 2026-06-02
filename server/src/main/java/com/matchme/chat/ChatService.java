package com.matchme.chat;

import com.matchme.auth.User;
import com.matchme.auth.UserRepository;
import com.matchme.connection.ConnectionRepository;
import com.matchme.profile.Profile;
import com.matchme.profile.ProfileRepository;
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
    private final ConnectionRepository connectionRepository;
    private final ProfileRepository profileRepository;

    public ChatService(
            ChatRepository chatRepository,
            ChatMessageRepository messageRepository,
            UserRepository userRepository,
            ConnectionRepository connectionRepository,
            ProfileRepository profileRepository) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Chat getOrCreateChat(Long userId1, Long userId2) {
        requireConnected(userId1, userId2);

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

    @Transactional(readOnly = true)
    public List<ChatResponse> getUserChats(Long userId) {
        return chatRepository.findAllByUserIdOrderByRecent(userId)
                .stream()
                .map(chat -> mapToChatResponse(chat, userId))
                .toList();
    }

    @Transactional
    public Page<MessageResponse> getChatHistory(Long chatId, Long userId, Pageable pageable) {
        Chat chat = getChatForParticipant(chatId, userId);

        // Opening a chat marks received messages as read.
        List<ChatMessage> unreadMessages = messageRepository
                .findByChatIdAndSenderIdNotAndReadFalse(chat.getId(), userId);

        unreadMessages.forEach(ChatMessage::markRead);

        return messageRepository.findByChatIdOrderByCreatedAtDesc(chat.getId(), pageable)
                .map(this::toMessageResponse);
    }

    @Transactional
    public MessageResponse sendMessage(Long chatId, Long senderId, String rawContent) {
        Chat chat = getChatForParticipant(chatId, senderId);
        String content = rawContent == null ? "" : rawContent.trim();

        if (content.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Message cannot be empty");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sender not found"));

        ChatMessage message = new ChatMessage();
        message.setChat(chat);
        message.setSender(sender);
        message.setContent(content);
        message.setCreatedAt(OffsetDateTime.now());

        chat.setLastMessageAt(message.getCreatedAt());
        chatRepository.save(chat);

        return toMessageResponse(messageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public long countUnreadMessages(Long chatId, Long userId) {
        getChatForParticipant(chatId, userId);

        return messageRepository.countByChatIdAndSenderIdNotAndReadFalse(chatId, userId);
    }

    @Transactional(readOnly = true)
    public Chat getChatForParticipant(Long chatId, Long userId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found"));

        if (!chat.hasParticipant(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chat not found");
        }

        return chat;
    }

    public ChatResponse mapToChatResponse(Chat chat, Long currentUserId) {
        User otherUser = chat.getOtherUser(currentUserId);

        Profile otherProfile = profileRepository.findById(otherUser.getId())
                .orElseGet(() -> new Profile(otherUser.getId()));

        String lastMessageContent = messageRepository.findFirstByChatIdOrderByCreatedAtDesc(chat.getId())
                .map(ChatMessage::getContent)
                .orElse("");

        long unreadCount = messageRepository.countByChatIdAndSenderIdNotAndReadFalse(
                chat.getId(),
                currentUserId);

        return new ChatResponse(
                chat.getId(),
                otherUser.getId(),
                otherProfile.getName(),
                otherProfile.getPictureLink(),
                lastMessageContent,
                chat.getLastMessageAt(),
                unreadCount);
    }

    private void requireConnected(Long userId1, Long userId2) {
        if (userId1.equals(userId2)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot chat with yourself");
        }

        if (!userRepository.existsById(userId2)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        Long userAId = Math.min(userId1, userId2);
        Long userBId = Math.max(userId1, userId2);

        if (!connectionRepository.existsByIdUserAIdAndIdUserBId(userAId, userBId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    private MessageResponse toMessageResponse(ChatMessage message) {
        return new MessageResponse(
                message.getId(),
                message.getChat().getId(),
                message.getSender().getId(),
                message.getContent(),
                message.getCreatedAt(),
                message.isRead());
    }
}
