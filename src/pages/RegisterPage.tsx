export function RegisterPage() {
  return (
    <div className="form-page">
      <div>
        <p className="eyebrow">Authentication</p>
        <h2>Create account</h2>
        <p className="muted-text">
          This page will later register users with unique email and bcrypt
          password storage.
        </p>
      </div>

      <form className="form-card">
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input type="password" placeholder="Create a password" />
        </label>

        <label>
          Confirm password
          <input type="password" placeholder="Repeat password" />
        </label>

        <button className="button button-primary" type="button">
          Register
        </button>
      </form>
    </div>
  );
}