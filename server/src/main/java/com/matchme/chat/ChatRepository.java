package com.matchme.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    // Поиск чата между двумя конкретными пользователями
    Optional<Chat> findByUserAIdAndUserBId(Long userAId, Long userBId);

    // Список всех чатов пользователя, отсортированный по времени последнего сообщения
    @Query("""
            SELECT c
            FROM Chat c
            WHERE c.userA.id = :userId OR c.userB.id = :userId
            ORDER BY c.lastMessageAt DESC
            """)
    List<Chat> findAllByUserIdOrderByRecent(Long userId);
}
