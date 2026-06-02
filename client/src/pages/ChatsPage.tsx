import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useChatContext } from "../context/useChatContext";

function formatChatTime(dateString: string) {
  return new Date(dateString).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatsPage() {
  const { token } = useAuth();
  const { chats, loadChats, onlineUsers } = useChatContext();

  async function refreshChats() {
    if (token) {
      await loadChats(token);
    }
  }

  return (
    <div className="page-stack">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Chats</p>
          <h2>Recent chats</h2>
          <p className="muted-text">Chats are ordered with the most recently active chat first.</p>
        </div>

        <button className="button button-secondary" type="button" onClick={refreshChats}>
          Refresh
        </button>
      </div>

      {chats.length === 0 ? (
        <section className="empty-state">
          <h3>No chats yet</h3>
          <p className="muted-text">Open a connected profile to start a conversation.</p>
        </section>
      ) : (
        <section className="card-list">
          {chats.map((chat) => (
            <article className="match-card chat-list-card" key={chat.id}>
              <div className="avatar">
                {chat.otherPictureLink ? (
                  <img src={chat.otherPictureLink} alt={chat.otherName} />
                ) : (
                  <span>👤</span>
                )}
              </div>

              <div className="chat-list-main">
                <div className="chat-list-title">
                  <h3>{chat.otherName || `User #${chat.otherUserId}`}</h3>
                  <span className={onlineUsers[chat.otherUserId] ? "status-online" : "status-offline"}>
                    {onlineUsers[chat.otherUserId] ? "Online" : "Offline"}
                  </span>
                </div>

                <p className="muted-text chat-preview">
                  {chat.lastMessageContent || "No messages yet"}
                </p>
              </div>

              <div className="chat-list-side">
                <span className="muted-text">{formatChatTime(chat.lastMessageAt)}</span>
                {chat.unreadCount > 0 && <span className="unread-badge">{chat.unreadCount}</span>}
                <Link className="button button-secondary" to={`/chats/${chat.id}`}>
                  Open
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
