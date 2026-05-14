import { Pill } from "../components/Pill";

export function HomePage() {
  return (
    <div className="board-page">
      <header className="board-header">
        <h2>Find people who share your interests</h2>
        <p>Discover nearby people, connect, and start conversations.</p>
      </header>

      <section className="board-card">
        <div className="board-row">
          <div>
            <Pill color="green">Profile</Pill>
            <span className="row-text">Add your picture, location and about me.</span>
          </div>
          <button className="ghost-button">Open</button>
        </div>

        <div className="board-row">
          <div>
            <Pill color="yellow">Interests</Pill>
            <span className="row-text">Choose hobbies, availability and preferences.</span>
          </div>
          <button className="ghost-button">Edit</button>
        </div>

        <div className="board-row">
          <div>
            <Pill color="blue">Matches</Pill>
            <span className="row-text">See people who match what you are looking for.</span>
          </div>
          <button className="ghost-button">View</button>
        </div>

        <div className="board-row">
          <div>
            <Pill color="purple">Connections</Pill>
            <span className="row-text">Manage the people you are connected with.</span>
          </div>
          <button className="ghost-button">Manage</button>
        </div>

        <div className="board-row">
          <div>
            <Pill color="red">Unread</Pill>
            <span className="row-text">You have new chat messages waiting.</span>
          </div>
          <button className="ghost-button">Chats</button>
        </div>
      </section>
    </div>
  );
}