const bioPoints = [
  "Hobbies",
  "Location",
  "Availability",
  "Social style",
  "Activity preference",
  "Looking for",
];

export function BioPage() {
  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Bio & preferences</p>
        <h2>Tell MatchMe what matters to you.</h2>
        <p className="muted-text">
          Based on your preferences, you will get recommendations to connect.
        </p>
      </div>

      <section className="tag-grid">
        {bioPoints.map((point) => (
          <article className="tag-card" key={point}>
            <span>✓</span>
            <p>{point}</p>
          </article>
        ))}
      </section>
    </div>
  );
}