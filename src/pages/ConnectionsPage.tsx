export function ConnectionsPage() {
  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Connections</p>
        <h2>Your connected people</h2>
        <p className="muted-text">
          Connected users will be able to see each other's profiles and start or
          resume a chat.
        </p>
      </div>

      <section className="empty-state">
        <h3>No connections yet</h3>
        <p>Accept a request later to create your first connection.</p>
      </section>
    </div>
  );
}