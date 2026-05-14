export function RequestsPage() {
  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Connection requests</p>
        <h2>Incoming requests</h2>
        <p className="muted-text">
          Users will be able to accept or reject connection requests here.
        </p>
      </div>

      <section className="empty-state">
        <h3>No requests yet</h3>
        <p>Connection request logic will be added in a later feature.</p>
      </section>
    </div>
  );
}