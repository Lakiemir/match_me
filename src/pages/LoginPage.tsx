export function LoginPage() {
  return (
    <div className="form-page">
      <div>
        <p className="eyebrow">Authentication</p>
        <h2>Log in</h2>
        <p className="muted-text">
          This form is visual only for now. JWT login will be added in the login
          feature task.
        </p>
      </div>

      <form className="form-card">
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input type="password" placeholder="Your password" />
        </label>

        <button className="button button-primary" type="button">
          Log in
        </button>
      </form>
    </div>
  );
}