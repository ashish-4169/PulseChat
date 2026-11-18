import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './App.css';

interface ChatMessage {
  chatId: string;
  name: string;
  message: string;
  upvotes: number;
  roomId: string;
}

const WS_URL =
  import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

function App() {
  const [name, setName] = useState('Ashish');
  const [roomId, setRoomId] = useState('room1');
  const [userId] = useState(() => crypto.randomUUID());

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const socketRef = useRef<WebSocket | null>(null);

  function connectRoom(e: FormEvent) {
    e.preventDefault();

    if (!name.trim() || !roomId.trim()) return;

    if (socketRef.current) {
      socketRef.current.close();
    }

    setMessages([]);
    setConnected(false);

    const socket = new WebSocket(WS_URL);

    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);

      socket.send(JSON.stringify({
        type: 'JOIN_ROOM',
        payload: {
          name,
          userId,
          roomId
        }
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'ADD_CHAT') {
          setMessages(prev => [
            ...prev,
            {
              chatId: data.payload.chatId,
              name: data.payload.name,
              message: data.payload.message,
              upvotes: data.payload.upvotes,
              roomId: data.payload.roomId
            }
          ]);
        }

        if (data.type === 'UPDATE_CHAT') {
          setMessages(prev =>
            prev.map(chat =>
              chat.chatId === data.payload.chatId
                ? { ...chat, upvotes: data.payload.upvotes }
                : chat
            )
          );
        }
      } catch (error) {
        console.error('Invalid server message:', error);
      }
    };

    socket.onclose = () => {
      if (socketRef.current === socket) {
        setConnected(false);
      }
    };

    socket.onerror = () => {
      setConnected(false);
      alert('Connection failed. Is the backend running?');
    };
  }

  function sendMessage(e: FormEvent) {
    e.preventDefault();

    if (!input.trim() || !socketRef.current || !connected) return;

    socketRef.current.send(JSON.stringify({
      type: 'SEND_MESSAGE',
      payload: {
        userId,
        roomId,
        message: input.trim()
      }
    }));

    setInput('');
  }

  function upvoteMessage(chatId: string) {
    if (!socketRef.current || !connected) return;

    socketRef.current.send(JSON.stringify({
      type: 'UPVOTE_MESSAGE',
      payload: {
        userId,
        roomId,
        chatId
      }
    }));
  }

  useEffect(() => {
    return () => {
      socketRef.current?.close();
    };
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">P</div>
          <h2>PulseChat</h2>
        </div>

        <div className="sidebar-section">
          <p className="section-label">WORKSPACE</p>

          <div className="room-item active">
            <span>#</span>
            General
          </div>

          <div className="room-item">
            <span>#</span>
            Development
          </div>

          <div className="room-item">
            <span>#</span>
            Random
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="avatar">
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{name}</strong>
            <p>{connected ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2># {roomId || 'General'}</h2>
            <p>Real-time conversations</p>
          </div>

          <div className={`status ${connected ? 'online' : ''}`}>
            <span></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </header>

        {!connected && (
          <form className="join-box" onSubmit={connectRoom}>
            <h2>Join a conversation</h2>
            <p>Enter your details to join a chat room.</p>

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
            />

            <input
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              placeholder="Room ID"
              required
            />

            <button type="submit">Join Room →</button>
          </form>
        )}

        <section className="chat-area">
          {connected && messages.length === 0 && (
            <div className="empty-state">
              <div>💬</div>
              <h2>Welcome to #{roomId}</h2>
              <p>
                Start the conversation. Your messages will appear here.
              </p>
            </div>
          )}

          {messages.map(chat => (
            <div className="message" key={chat.chatId}>
              <div className="message-avatar">
                {chat.name.charAt(0).toUpperCase()}
              </div>

              <div className="message-content">
                <strong>{chat.name}</strong>
                <p>{chat.message}</p>

                <button
                  className="upvote"
                  onClick={() => upvoteMessage(chat.chatId)}
                >
                  ▲ {chat.upvotes}
                </button>
              </div>
            </div>
          ))}
        </section>

        <form className="message-form" onSubmit={sendMessage}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              connected
                ? `Message #${roomId}...`
                : 'Join a room to start chatting'
            }
            disabled={!connected}
          />

          <button
            type="submit"
            disabled={!connected || !input.trim()}
          >
            Send ↑
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;