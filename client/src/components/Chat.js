import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

// Get API URL from environment or use localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [room, setRoom] = useState('general');
  const [customRoom, setCustomRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.emit('join_room', {
      room: room,
      username: user.username
    });

    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [room, user.username]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    setLoading(true);

    try {
      // Send through socket.io for real-time
      socket.emit('send_message', {
        room: room,
        message: inputMessage,
        username: user.username
      });

      // Save to database
      await axios.post('/api/messages/save', {
        sender: user.id,
        username: user.username,
        message: inputMessage,
        room: room
      });

      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = () => {
    if (customRoom.trim()) {
      setRoom(customRoom);
      setMessages([]);
      setCustomRoom('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <h1>💬 Chat Room</h1>
          <p>Room: <strong>{room}</strong></p>
        </div>
        <div className="header-right">
          <p className="user-info">👤 {user.username}</p>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-sidebar">
          <h3>Rooms</h3>
          <button
            className={room === 'general' ? 'room-btn active' : 'room-btn'}
            onClick={() => { setRoom('general'); setMessages([]); }}
          >
            #general
          </button>
          <button
            className={room === 'random' ? 'room-btn active' : 'room-btn'}
            onClick={() => { setRoom('random'); setMessages([]); }}
          >
            #random
          </button>
          <button
            className={room === 'suggestions' ? 'room-btn active' : 'room-btn'}
            onClick={() => { setRoom('suggestions'); setMessages([]); }}
          >
            #suggestions
          </button>

          <div className="custom-room">
            <input
              type="text"
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value)}
              placeholder="Room name"
            />
            <button onClick={handleJoinRoom}>Join</button>
          </div>
        </div>

        <div className="chat-content">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation! 👋</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.username === user.username ? 'own' : 'other'}`}
                >
                  <div className="message-header">
                    <strong>{msg.username}</strong>
                    <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="message-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              autoFocus
            />
            <button type="submit" disabled={loading || !inputMessage.trim()}>
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
