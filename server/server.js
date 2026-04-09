const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Determine allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://chat-app-frontend.vercel.app', 'https://chat-app-frontend-git-main.vercel.app']
  : ['http://localhost:3000'];

const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://uksameer2006_db_user:UF5BV8KgX3JZxjZd@test.lgqqyqm.mongodb.net/chat_app?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Models
const User = require('./models/User');
const Message = require('./models/Message');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chat App Backend is Running', 
    status: 'success',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      messages: '/api/messages',
      health: '/health'
    }
  });
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join_room', (data) => {
    socket.join(data.room);
    socket.emit('receive_message', {
      message: `User ${data.username} has joined the chat`,
      username: 'System',
      timestamp: new Date()
    });
  });

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', {
      message: data.message,
      username: data.username,
      timestamp: new Date()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
