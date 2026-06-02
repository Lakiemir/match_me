import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useChatContext } from "../context/useChatContext";
import { chatService, type ChatMessage, type TypingSignal } from "../services/chatServices";

const MESSAGE_PAGE_SIZE = 20;

function formatMessageTime(dateString: string) {
  return new Date(dateString).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatPage() {
  const { chatId } = useParams();
  const numericChatId = Number(chatId);

  const { token, userId } = useAuth();
  const { chats, onlineUsers, markChatRead, setUserOnline } = useChatContext();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [typingUserId, setTypingUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [readyChatId, setReadyChatId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasOlderMessages, setHasOlderMessages] = useState(false);

  const isChatReady = readyChatId === numericChatId;

  // Реф для автоматического скролла вниз при новых сообщениях
  const chatBoxRef = useRef<HTMLElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToBottomRef = useRef(true);
  const typingTimeoutRef = useRef<number | null>(null);
  const stopTypingTimeoutRef = useRef<number | null>(null);

  const currentChat = useMemo(() => {
    return chats.find((chat) => chat.id === numericChatId);
  }, [chats, numericChatId]);

  const loadHistory = useCallback(async () => {
    if (!token || !numericChatId) {
      return;
    }

    try {
      setIsLoading(true);
      setStatusMessage("");

      // 1. Загрузка первой страницы истории сообщений (REST API)
      const page = await chatService.getMessages(numericChatId, token, 0, MESSAGE_PAGE_SIZE);

      // Разворачиваем массив, чтобы старые были сверху, новые снизу
      setMessages([...page.content].reverse());
      setCurrentPage(page.number);
      setHasOlderMessages(!page.last);
      shouldScrollToBottomRef.current = true;
      markChatRead(numericChatId);
    } catch {
      setStatusMessage("Could not load chat history.");
    } finally {
      setIsLoading(false);
    }
  }, [markChatRead, numericChatId, token]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHistory();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadHistory]);

  useEffect(() => {
    async function loadPresence() {
      if (!token || !currentChat) {
        return;
      }

      try {
        const presence = await chatService.getPresence(currentChat.otherUserId, token);
        setUserOnline(presence.userId, presence.online);
      } catch {
        // Presence is helpful, but chat can still work without this first state.
      }
    }

    void loadPresence();
  }, [currentChat, setUserOnline, token]);

  useEffect(() => {
    if (!numericChatId) {
      return;
    }

    let cancelled = false;

    async function subscribeToCurrentChat() {
      // 2. Подписка на WebSocket для получения новых сообщений в реальном времени
      await chatService.subscribeToChat(numericChatId, (newMessage) => {
        if (cancelled) {
          return;
        }

        // Добавляем новое сообщение в конец списка
        shouldScrollToBottomRef.current = true;

        setMessages((currentMessages) => {
          if (currentMessages.some((message) => message.id === newMessage.id)) {
            return currentMessages;
          }

          return [...currentMessages, newMessage];
        });

        markChatRead(numericChatId);
      });

      await chatService.subscribeToTyping(numericChatId, (signal: TypingSignal) => {
        if (cancelled || signal.userId === userId) {
          return;
        }

        setTypingUserId(signal.typing ? signal.userId : null);

        if (typingTimeoutRef.current) {
          window.clearTimeout(typingTimeoutRef.current);
        }

        if (signal.typing) {
          typingTimeoutRef.current = window.setTimeout(() => {
            setTypingUserId(null);
          }, 2500);
        }
      });

      if (!cancelled) {
        setReadyChatId(numericChatId);
      }
    }

    void subscribeToCurrentChat();

    return () => {
      cancelled = true;

      // Отписываемся при выходе из чата (unmount компонента)
      chatService.unsubscribeFromChat(numericChatId);
      chatService.unsubscribeFromTyping(numericChatId);

      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      if (stopTypingTimeoutRef.current) {
        window.clearTimeout(stopTypingTimeoutRef.current);
      }
    };
  }, [markChatRead, numericChatId, userId]);

  useEffect(() => {
    // 3. Авто-скролл вниз при изменении массива messages
    if (shouldScrollToBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldScrollToBottomRef.current = false;
    }
  }, [messages]);

  async function loadOlderMessages() {
    if (!token || !numericChatId || isLoadingOlder || !hasOlderMessages) {
      return;
    }

    setIsLoadingOlder(true);
    setStatusMessage("");

    try {
      const nextPageNumber = currentPage + 1;
      const page = await chatService.getMessages(
        numericChatId,
        token,
        nextPageNumber,
        MESSAGE_PAGE_SIZE,
      );

      const olderMessages = [...page.content].reverse();

      setMessages((currentMessages) => {
        const existingIds = new Set(currentMessages.map((message) => message.id));
        const newOlderMessages = olderMessages.filter((message) => !existingIds.has(message.id));

        return [...newOlderMessages, ...currentMessages];
      });

      window.requestAnimationFrame(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = 0;
        }
      });

      setCurrentPage(page.number);
      setHasOlderMessages(!page.last);
    } catch {
      setStatusMessage("Could not load older messages.");
    } finally {
      setIsLoadingOlder(false);
    }
  }

  function handleTyping(nextValue: string) {
    setMessageText(nextValue);

    if (!numericChatId || !isChatReady) {
      return;
    }

    chatService.sendTyping(numericChatId, Boolean(nextValue.trim()));

    if (stopTypingTimeoutRef.current) {
      window.clearTimeout(stopTypingTimeoutRef.current);
    }

    stopTypingTimeoutRef.current = window.setTimeout(() => {
      chatService.sendTyping(numericChatId, false);
    }, 1200);
  }

  // 4. Отправка сообщения
  async function handleSendMessage(event: React.FormEvent) {
    event.preventDefault();

    const content = messageText.trim();

    if (!content || !numericChatId || !token || !isChatReady) {
      return;
    }

    // Очищаем поле ввода
    setMessageText("");

    try {
      const savedMessage = await chatService.sendMessageRest(numericChatId, content, token);

      shouldScrollToBottomRef.current = true;

      setMessages((currentMessages) => {
        if (currentMessages.some((message) => message.id === savedMessage.id)) {
          return currentMessages;
        }

        return [...currentMessages, savedMessage];
      });

      chatService.sendTyping(numericChatId, false);
      markChatRead(numericChatId);
    } catch {
      setStatusMessage("Could not send message.");
    }
  }

  return (
    <div className="page-stack chat-page">
      {/* Шапка чата */}
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Chat detail</p>
          <h2>{currentChat?.otherName || `Chat #${chatId}`}</h2>
          {currentChat && (
            <p className={onlineUsers[currentChat.otherUserId] ? "status-online" : "status-offline"}>
              {onlineUsers[currentChat.otherUserId] ? "Online" : "Offline"}
            </p>
          )}
        </div>

        <Link className="button button-secondary" to="/chats">
          Back to chats
        </Link>
      </div>

      {statusMessage && <p className="muted-text">{statusMessage}</p>}

      {!isLoading && hasOlderMessages && (
        <button
          className="button button-secondary"
          type="button"
          onClick={loadOlderMessages}
          disabled={isLoadingOlder}
        >
          {isLoadingOlder ? "Loading older messages..." : "Load older messages"}
        </button>
      )}

      {/* Зона сообщений */}
      <section className="chat-box real-chat-box" ref={chatBoxRef}>
        {isLoading ? (
          <p className="muted-text">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="muted-text">No messages yet. Send the first one.</p>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === userId;

            return (
              <div
                className={isMine ? "message message-me" : "message message-other"}
                key={message.id}
              >
                <p>{message.content}</p>
                <span>{formatMessageTime(message.createdAt)}</span>
              </div>
            );
          })
        )}

        {typingUserId && <p className="typing-indicator">Typing...</p>}

        {/* Невидимый элемент для прокрутки вниз */}
        <div ref={messagesEndRef} />
      </section>

      {/* Поле ввода */}
      <form className="chat-input-row" onSubmit={handleSendMessage}>
        <input
          value={messageText}
          onChange={(event) => handleTyping(event.target.value)}
          placeholder="Write a message..."
          disabled={!isChatReady}
        />
        <button
          className="button button-primary"
          type="submit"
          disabled={!messageText.trim() || !isChatReady}
        >
          Send
        </button>
      </form>
    </div>
  );
}
