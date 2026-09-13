# 🎳 MatchMe Hobbies

### A full-stack social matching platform built around hobbies, preferences, location, and real-time connections

MatchMe Hobbies helps people discover compatible connections based on shared interests, lifestyle preferences, and location. Users can build profiles, receive scored recommendations, connect with others, and chat in real time.

---

## 🧩 Project Overview

MatchMe Hobbies is a monorepo with separate frontend, backend, and database areas:

```txt
matchme-web/
├── client/              React + TypeScript frontend
├── server/              Java Spring Boot backend
├── database/
│   ├── init/            Database schema
│   └── seed/            Fictitious users
├── postman/             API collection and environment
├── docker-compose.yml   Full app runtime
└── seed.sh              Reload seed users
```

The backend is a layered Spring Boot application. Features such as auth, profiles, bio, recommendations, privacy, connections, and chat are kept in focused packages while sharing the same PostgreSQL database and JWT security flow.

### ✨ Features

| | Feature | Description |
|---|---|---|
| 🔐 | Secure authentication | Users register and log in with a unique email and password. Passwords are protected with BCrypt and sessions use JWT. |
| 👤 | User profiles | Users can create and edit their public profile with name, about me, city, and profile picture. |
| 🌱 | Bio and preferences | Users configure hobbies, availability, activity preference, looking-for, distance, and optional GPS location. |
| 📍 | Location filtering | Recommendations use city matching by default and GPS radius matching when the user enables browser location. |
| ✨ | Recommendations | Matches are found with shared hobbies, availability, activity preference, looking-for, and location rules. Strongest matches appear first. |
| ❌ | Dismiss matches | Dismissed recommendations are saved and are not shown again. |
| 🤝 | Connections | Users can send connection requests, accept or reject incoming requests, and disconnect later. |
| 💬 | Real-time chat | Connected users can start or resume one shared chat history. New messages arrive instantly through WebSocket + STOMP. |
| 🟢 | Presence | Profile and chat views show online/offline status based on active WebSocket connections. |
| 🔔 | Unread notifications | Unread badges update in real time when messages arrive. |
| ⌨️ | Typing indicator | Chat shows when the other user is typing and clears after they stop. |
| 🛡️ | Privacy protection | Profiles are only visible when access is allowed. Private data such as email and password hashes is not exposed. |
| 📱 | Responsive design | The UI is built to work on desktop, tablet, and mobile browsers. |
| 🧪 | Seed users | Reviewers can load 150 fictitious users to test matching with realistic data. |

### 🛠️ Tech Stack

| Area | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Java, Spring Boot |
| Database | PostgreSQL |
| Auth | JWT, BCrypt |
| Realtime | WebSocket, STOMP, SockJS |
| Runtime | Docker Compose |

### 👫 Recommendation Logic

Recommendations are intentionally simple. The backend first removes users who are not valid candidates, then scores the remaining users, sorts the strongest matches first, and returns only their ids.

| Step | What happens |
|---|---|
| 1 | The current user must have a complete profile and complete bio. |
| 2 | The candidate must also have a complete profile and complete bio. |
| 3 | The candidate must be in the same city unless the current user has GPS matching enabled and saved coordinates. |
| 4 | If GPS matching is active, the candidate must also have saved GPS coordinates and must be inside the current user's maximum radius. |
| 5 | The candidate must not have been dismissed before. |
| 6 | The candidate must share at least one hobby with the current user. |
| 7 | The candidate receives a compatibility score. |
| 8 | Weak matches below the minimum score are removed. |
| 9 | Matches are sorted by highest score first. |
| 10 | The endpoint returns a maximum of 10 recommendation ids. |

The scoring starts only after the location and shared-hobby checks pass.

| Match signal | Score |
|---|---:|
| Base score for a possible match | `4` |
| Each shared hobby | `+3` |
| Compatible availability | `+2` |
| Compatible activity preference | `+2` |
| Same looking-for goal | `+2` |

A recommendation must reach at least `10 points`.

---

## 🚀 Setup And Installation

### Run The Full App With Docker

Docker Compose runs the full application: PostgreSQL, backend, and frontend.

| Action | Command |
|---|---|
| Start everything | `docker compose up --build` |
| Open frontend | `http://localhost:5173` |
| Backend API | `http://localhost:8080` |
| PostgreSQL | `localhost:5433` |
| Stop containers | `docker compose down` |
| Stop containers from an older compose file | `docker compose down --remove-orphans` |
| Stop and delete database volume | `docker compose down -v` |
| Rebuild with fresh base images | `docker compose build --pull --no-cache` |
| Start after rebuilding | `docker compose up` |

Docker Desktop must be open before running Docker commands.

### Seed Users

The project includes a tracked seed script for review.

```bash
./seed.sh
```

This reloads 150 fictitious users with different cities, hobbies, preferences, and profile pictures.

| Seed login | Password |
|---|---|
| `seed001@matchme.test` | `password123` |
| `seed002@matchme.test` | `password123` |
| `seed003@matchme.test` | `password123` |

Use seed users to test recommendations, connection requests, chat, unread badges, typing indicators, online/offline status, and GPS matching.

### Review Data Modes

| Scenario | How to run it | Expected result |
|---|---|---|
| Empty system | `docker compose down -v`, then `docker compose up --build`. Do not run `seed.sh`. | App starts with no users. |
| Single user | Register one user, complete profile and bio. | App works and recommendations can be empty. |
| Few users | Register 2-3 users manually and complete their profiles and bios. | Good matches appear, poor matches are avoided. |
| Many users | Run `./seed.sh`. | 150 users are available for a richer review demo. |

### Local Development Without Docker

Use these defaults if running services manually:

| Setting | Value |
|---|---|
| Database | `matchme` |
| User | `matchme_user` |
| Password | `mp01` |
| Port | `5433` |

Start PostgreSQL before running the backend locally:

```bash
docker compose up -d postgres
```

Backend:

```bash
cd server
./mvnw spring-boot:run
```

Frontend:

```bash
cd client
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

### Build Checks

| Area | Command |
|---|---|
| Backend tests | `cd server && ./mvnw test` |
| Frontend build | `cd client && npm run build` |

---

## 📘 Usage Guide

### Browser Flow

| Step | What to do | What to check |
|---|---|---|
| 1 | Register and log in. | Auth works and the app opens protected pages. |
| 2 | Complete `/profile`. | Name, about me, city, and picture save correctly. |
| 3 | Complete `/bio`. | Hobbies, availability, activity preference, looking-for, distance, and GPS options save correctly. |
| 4 | Open `/recommendations`. | Up to 10 strongest matches appear. Emails are not shown. |
| 5 | Dismiss a match. | The user disappears and does not return. |
| 6 | Send a connection request. | The other user can see it under requests. |
| 7 | Accept or reject the request. | Accepted users become connections; rejected users do not. |
| 8 | Open a connected profile. | Profile is visible and chat can start or resume. |
| 9 | Chat in two browser sessions. | Messages, unread badges, chat ordering, typing, and presence update in real time. |
| 10 | Load older chat messages. | Chat history is paginated instead of loading everything at once. |


### API Structure

| Endpoint | Returns |
|---|---|
| `POST /api/auth/register` | Creates a user |
| `POST /api/auth/login` | JWT session token |
| `POST /api/auth/logout` | Stateless logout endpoint |
| `GET /api/users/{id}` | `id`, name, profile picture link |
| `GET /api/users/{id}/profile` | `id`, about me, city |
| `GET /api/users/{id}/bio` | `id`, biographical data |
| `GET /api/me` | Shortcut to authenticated user's summary |
| `GET /api/me/profile` | Shortcut to authenticated user's profile |
| `GET /api/me/bio` | Shortcut to authenticated user's bio |
| `GET /api/recommendations` | Maximum 10 recommendation ids only |
| `POST /api/recommendations/{id}/dismiss` | Dismisses a recommendation |
| `GET /api/connections` | Connected user ids only |
| `POST /api/connections/requests/{id}` | Sends a connection request |
| `GET /api/connections/requests/incoming` | Incoming pending requests |
| `POST /api/connections/requests/{id}/accept` | Accepts a request |
| `POST /api/connections/requests/{id}/reject` | Rejects a request |
| `DELETE /api/connections/{id}` | Disconnects from a user |
| `GET /api/chats` | Chat list, most recent first |
| `POST /api/chats/with/{id}` | Starts or resumes a chat |
| `GET /api/chats/{id}/messages?page=0&size=20` | Paginated chat messages |
| `POST /api/chats/{id}/messages` | Sends a message |
| `GET /api/presence/{id}` | Online/offline state |


---

## 🚀 Bonus Features

| Bonus | Description |
|---|---|
| 🟢 Online/offline status | Shows whether the other user has an active WebSocket connection. |
| ⌨️ Typing indicator | Shows typing state in the chat view and clears after the user stops typing. |
| 📍 GPS radius filtering | Uses browser geolocation, stored coordinates, and the user's max radius. |

---

## 🤝 The Matchmakers

| Team member | Gitea |
|---|---|
| Oluwaseun Olumide Kayode | https://gitea.kood.tech/oluwaseunkayode |
| Emirs Abdulins | https://gitea.kood.tech/emirabdulin |
| Jorge Guzman | https://gitea.kood.tech/jorgeguzmanrojas |
