import { Link, useParams } from "react-router-dom";

export function ChatPage() {
  const { chatId } = useParams();

  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Chat detail</p>
        <h2>Chat: {chatId}</h2>
        <p className="muted-text">
          Real-time chat with STOMP/WebSocket will be added later.
        </p>
      </div>

      <section className="chat-box">
        <div className="message message-other">
          <p>Hello! This is a placeholder message.</p>
          <span>10:30</span>
        </div>

        <div className="message message-me">
          <p>Later this will come from the backend.</p>
          <span>10:31</span>
        </div>
      </section>

      <div className="chat-input-row">
        <input placeholder="Write a message..." />
        <button className="button button-primary" type="button">
          Send
        </button>
      </div>

      <Link className="text-link" to="/chats">
        Back to chats
      </Link>
    </div>
  );
}