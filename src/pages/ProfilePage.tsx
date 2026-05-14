export function ProfilePage() {
  return (
    <div className="page-stack">
      <div>
        <p className="eyebrow">Profile</p>
        <h2>My profile</h2>
        <p className="muted-text">
          You must complete your profile before seeing recommendations.
        </p>
      </div>

      <section className="profile-preview">
        <div className="avatar">👤</div>

        <div>
          <h3>Your name will appear here</h3>
          <p>
            Profile picture upload, about me text and location will be added in
            the profile feature task.
          </p>
        </div>
      </section>
    </div>
  );
}