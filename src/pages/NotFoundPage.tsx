import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="empty-state">
      <h2>Page not found</h2>
      <p>This frontend route does not exist.</p>
      <Link className="button button-primary" to="/">
        Go to dashboard
      </Link>
    </div>
  );
}