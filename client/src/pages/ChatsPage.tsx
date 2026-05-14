import { Link } from "react-router-dom";

export function ChatsPage() {
  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Chats</p>
        <h2>Recent chats</h2>
        <p className="muted-text">
          Chats must be ordered with the most recently active chat first.
        </p>
      </div>

      <section className="card-list">
        <article className="match-card">
          <div className="avatar">💬</div>
          <div>
            <h3>Example chat</h3>
            <p>Placeholder chat preview with unread icon later.</p>
          </div>
          <Link className="button button-secondary" to="/chats/example-chat">
            Open
          </Link>
        </article>
      </section>
    </div>
  );
}