# 🎳 MatchMe Hobbies

### A modern full-stack social matching platform built around hobbies, interests, preferences, and real-time connections

MatchMe Hobbies helps people discover compatible connections based on shared interests, lifestyle preferences, and location. Users can build profiles, receive recommendations, connect with others, and chat in real time.

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🔐 | Secure authentication | Register and log in with JWT authentication and bcrypt password protection |
| 👤 | User profiles | Create and edit profile information, profile picture, and about me section |
| 🌱 | Interests & preferences | Define hobbies, availability, activity preferences, and more |
| 📍 | Location filtering | Recommendations are filtered by city/location preferences |
| ✨ | Smart recommendations | Discover people with strong compatibility scores |
| ❌ | Dismiss matches | Dismissed profiles are not shown again |
| 🤝 | Connections | Send, accept, reject, and remove connections |
| 💬 | Real-time chat | Instant messaging between connected users |
| 🔔 | Unread notifications | New messages appear instantly with unread indicators |
| 🛡️ | Privacy protection | Profiles are only visible when access is allowed |
| 📱 | Responsive design | Optimized for desktop, tablet, and mobile browsers |
| 🧪 | Seed users | Load 100+ fictitious users for testing and review |

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=flat-square&logo=socketdotio&logoColor=white)

---

## 🧩 Project Overview

- Full-stack social recommendation platform
- Recommendation-based profile discovery
- JWT-secured authentication flow
- Real-time chat using WebSocket + STOMP
- REST API with ids-first fetching pattern
- PostgreSQL relational database
- Responsive GitHub-inspired dark UI
- Feature-based development workflow with pull requests

---

## 🏗️ Architecture Decisions

MatchMe Hobbies uses a monorepo architecture with separate `client/`, `server/`, and `database/` folders to keep frontend, backend, and database responsibilities clearly organized while maintaining a unified development workflow.

The backend follows a layered modular monolith architecture using Java Spring Boot, where features such as authentication, profiles, recommendations, connections, and chat are implemented as internal modules inside a single backend application.

This approach was selected because the project features are tightly connected, share the same PostgreSQL data model and security rules, and require centralized JWT authentication, privacy handling, recommendation logic, and realtime communication through WebSocket/STOMP.

More complex architectures such as microservices, clean architecture, hexagonal architecture, CQRS, or event-driven systems were evaluated but not selected because they would add unnecessary operational and abstraction complexity for the current product scope and requirements.

---

## 🗺️ Main Routes

| Route | Description |
|---|---|
| `/` | Dashboard |
| `/register` | Create account |
| `/login` | Log in |
| `/profile` | User profile |
| `/bio` | Interests and preferences |
| `/recommendations` | Recommended users |
| `/requests` | Incoming connection requests |
| `/connections` | Connected users |
| `/chats` | Chat list |
| `/chats/:id` | Chat conversation |

---

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd matchme-web
```

---

## 💻 Frontend

Frontend source code is located in:

```txt
client/
```

Install dependencies:

```bash
cd client
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

---

## ☕ Backend

Backend source code is located in:

```txt
server/
```

Run the backend server:

```bash
cd server
./mvnw spring-boot:run
```

Backend URL:

```txt
http://localhost:8080
```

---

## 🐘 PostgreSQL

Database-related scripts and setup are located in:

```txt
database/
```

Create a PostgreSQL database:

```txt
matchme
```

Configure database environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=matchme
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## 📘 Usage Guide

### 👤 Create an account

- Register using email and password
- Log in securely
- Complete your profile

### 🌱 Configure your interests

- Add hobbies and preferences
- Select your location
- Define what type of people you want to connect with

### ✨ Discover matches

- Browse recommended users
- Dismiss unwanted recommendations
- Send connection requests

### 🤝 Manage connections

- Accept or reject requests
- Open connected profiles
- Disconnect at any time

### 💬 Chat in real time

- Start or resume conversations
- Receive instant messages
- See unread message indicators

---

## 🔒 Privacy Rules

Profiles are visible only when:

- Users are recommended
- A connection request exists
- Users are connected

Private information such as email addresses is never exposed to other users.

Unauthorized profile access returns:

```txt
HTTP 404
```

---

## ⚡ API Structure

| Endpoint | Description |
|---|---|
| `/users/{id}` | Basic user info |
| `/users/{id}/profile` | About me / profile information |
| `/users/{id}/bio` | Interests and recommendation data |
| `/me` | Current authenticated user |
| `/recommendations` | Recommendation ids only |
| `/connections` | Connected user ids only |

---

## 💬 Real-Time Features

- Instant chat message delivery
- Unread message notifications
- Live chat ordering by recent activity
- Shared chat history between users

Realtime communication uses:

```txt
WebSocket + STOMP
```

without polling.

---

## 🧪 Seed Users

The project includes a seed/reload system for testing and review.

Example:

```bash
./seed.sh
```

This loads:

```txt
100+ fictitious users
```

with different hobbies, preferences, and locations.

---

## 📱 Responsive Design

The interface is optimized for:

- Desktop browsers
- Tablets
- Mobile devices

---

## 🚀 Bonus Features

| Bonus | Description |
|---|---|
| 🟢 Online status | Online/offline indicators in profiles and chats |
| ⌨️ Typing indicator | Live typing feedback during conversations |
| 📍 GPS radius filtering | Browser geolocation, saved coordinates, and radius-based recommendations without PostGIS |
| 🧠 Advanced matching | Enhanced recommendation scoring and weighting |
---

## 🤝 The Matchmakers

| Team member | Gitea |
|---|---|
| Oluwaseun Olumide Kayode | https://gitea.kood.tech/oluwaseunkayode |
| Emirs Abdulins | https://gitea.kood.tech/emirabdulin |
| Jorge Guzman | https://gitea.kood.tech/jorgeguzmanrojas |

### Testing GPS radius locally

Browser GPS can fail on some laptops even when Chrome permission is allowed. For a reliable local demo, use Chrome DevTools:

1. Open `http://localhost:5173/bio`.
2. Open DevTools with `Cmd + Option + I`.
3. Go to `More tools -> Sensors`.
4. Set Location to `Other...`.
5. Use Tallinn test coordinates:
   - Latitude: `59.4370`
   - Longitude: `24.7536`
   - Timezone ID: `Europe/Tallinn`
   - Locale: `et-EE`
6. Click `Use my current location`.
7. Click `Save bio`.

When GPS is enabled, MatchMe stores the coordinates privately and filters recommendations by the current user's maximum distance. If GPS is disabled, recommendations use the normal city matching fallback.

Recommendation cards show an approximate distance in kilometers when GPS radius matching is active for both users. Exact latitude and longitude are never shown in public profile responses.
