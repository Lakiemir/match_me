package com.matchme.chat;

import com.matchme.auth.User;
import jakarta.persistence.*;

import java.time.OffsetDateTime;

// Stores one message in one chat, including read state and creation time.
@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    protected ChatMessage() {
    }

    public Long getId() {
        return id;
    }

    public Chat getChat() {
        return chat;
    }

    public User getSender() {
        return sender;
    }

    public String getContent() {
        return content;
    }

    public boolean isRead() {
        return read;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setChat(Chat chat) {
        this.chat = chat;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void markRead() {
        this.read = true;
    }
}
