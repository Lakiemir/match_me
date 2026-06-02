package com.matchme.chat;

import com.matchme.auth.User;
import jakarta.persistence.*;

import java.time.OffsetDateTime;


@Entity
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_a_id", nullable = false)
    private User userA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_b_id", nullable = false)
    private User userB;

    @Column(name = "last_message_at", nullable = false)
    private OffsetDateTime lastMessageAt = OffsetDateTime.now();

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    protected Chat() {
    }

    public Long getId() {
        return id;
    }

    public User getUserA() {
        return userA;
    }

    public User getUserB() {
        return userB;
    }

    public OffsetDateTime getLastMessageAt() {
        return lastMessageAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setUserA(User userA) {
        this.userA = userA;
    }

    public void setUserB(User userB) {
        this.userB = userB;
    }

    public void setLastMessageAt(OffsetDateTime lastMessageAt) {
        this.lastMessageAt = lastMessageAt;
    }

    public boolean hasParticipant(Long userId) {
        return userA.getId().equals(userId) || userB.getId().equals(userId);
    }

    public User getOtherUser(Long currentUserId) {
        if (userA.getId().equals(currentUserId)) {
            return userB;
        }

        return userA;
    }
}
