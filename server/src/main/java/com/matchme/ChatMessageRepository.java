package com.matchme;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Получение истории сообщений чата с пагинацией
    Page<ChatMessage> findByChatIdOrderByCreatedAtDesc(Long chatId, Pageable pageable);

    // Подсчет непрочитанных сообщений в чате для конкретного получателя
    long countByChatIdAndSenderIdNotAndReadFalse(Long chatId, Long senderId);
}
