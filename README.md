# PulseChat 💬

**A real-time, room-based chat application built using Node.js, WebSockets, React, and TypeScript.**

PulseChat allows users to join chat rooms, exchange messages instantly, and upvote messages. It uses WebSocket communication to enable real-time interaction between connected users.

## 🚀 Features

- **Real-time Messaging:** Send and receive messages instantly.
- **Room-based Chat:** Users can join rooms using a room ID.
- **Message Upvotes:** Upvote messages and see updated counts in real time.
- **Multi-user Communication:** Multiple users can communicate in the same room.
- **Responsive Interface:** Dark-themed React frontend.
- **WebSocket Communication:** Persistent connection between frontend and backend.

## 🛠️ Tech Stack

### Backend
- Node.js
- TypeScript
- WebSockets (`websocket` package)
- Zod

### Frontend
- React
- TypeScript
- Vite
- CSS

## 📁 Project Structure

```text
PulseChat/
├── src/
│   ├── messages/
│   │   ├── incomingMessages.ts
│   │   └── outgoingMessages.ts
│   ├── store/
│   │   ├── Store.ts
│   │   └── InMemoryStore.ts
│   ├── UserManager.ts
│   └── index.ts
├── client/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   └── package.json
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ashish-4169/PulseChat.git
cd PulseChat
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Build and start the backend

```bash
npm run build
npm start
```

The WebSocket server will run on:

```text
ws://localhost:8080/
```

### 4. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 5. Start the frontend

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173/
```

## 🧪 Testing

1. Open the application in two browser tabs.
2. Join the same room using the same room ID.
3. Enter different usernames.
4. Send a message from either tab.
5. Verify that the message appears in both tabs.
6. Upvote a message and verify that the updated count is reflected.

## 🏗️ Architecture

PulseChat follows a client-server architecture.

- **React Client:** Provides the user interface and sends WebSocket events.
- **WebSocket Server:** Receives incoming events and broadcasts updates.
- **UserManager:** Manages connected users and room-based communication.
- **InMemoryStore:** Manages chat messages and upvotes in memory.

### Supported Events

| Event | Description |
|---|---|
| `JOIN_ROOM` | Join a chat room |
| `SEND_MESSAGE` | Send a message |
| `UPVOTE_MESSAGE` | Upvote a message |
| `ADD_CHAT` | Receive a new message |
| `UPDATE_CHAT` | Receive updated message information |

## ⚠️ Current Limitations

- Chat data is stored in memory and is lost when the backend restarts.
- No database persistence yet.
- No user authentication system.
- The current implementation is intended as a learning and demonstration project.

## 👨‍💻 Author

**Ashish Kumar**

B.Tech Electrical Engineering  
National Institute of Technology, Agartala

GitHub: [ashish-4169](https://github.com/ashish-4169)
