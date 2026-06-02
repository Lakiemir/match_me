package com.matchme.chat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Получение истории сообщений чата с пагинацией
    Page<ChatMessage> findByChatIdOrderByCreatedAtDesc(Long chatId, Pageable pageable);

    // Added so the chat list can show a simple last-message preview.
    Optional<ChatMessage> findFirstByChatIdOrderByCreatedAtDesc(Long chatId);

    // Подсчет непрочитанных сообщений в чате для конкретного получателя
    long countByChatIdAndSenderIdNotAndReadFalse(Long chatId, Long senderId);

    // Added so opening a chat can mark received messages as read.
    List<ChatMessage> findByChatIdAndSenderIdNotAndReadFalse(Long chatId, Long senderId);
}
