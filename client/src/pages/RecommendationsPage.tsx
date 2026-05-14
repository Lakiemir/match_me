const placeholderMatches = [
  "Board game partner",
  "Weekend hiking friend",
  "Live music companion",
];

export function RecommendationsPage() {
  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Recommendations</p>
        <h2>Recommended people</h2>
        <p className="muted-text">
          Later this page will fetch /recommendations first, then load user and
          bio data by id.
        </p>
      </div>

      <section className="card-list">
        {placeholderMatches.map((match) => (
          <article className="match-card" key={match}>
            <div className="avatar">👤</div>
            <div>
              <h3>{match}</h3>
              <p>Placeholder recommendation card.</p>
            </div>
            <div className="card-actions">
              <button className="button button-secondary" type="button">
                Dismiss
              </button>
              <button className="button button-primary" type="button">
                Connect
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}