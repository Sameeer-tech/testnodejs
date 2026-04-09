const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Determine allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://chat-app-frontend.vercel.app', 
      'https://chat-app-frontend-git-main.vercel.app',
      process.env.RAILWAY_DOMAIN || 'http://localhost:5000'
    ]
  : ['http://localhost:3000', 'http://localhost:5000'];

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

// Serve React static files
const publicPath = path.join(__dirname, './public');
const buildPath = path.join(__dirname, './public');

console.log('__dirname:', __dirname);
console.log('Public path:', publicPath);

// Check if build folder exists
if (fs.existsSync(publicPath)) {
  console.log('✓ Public folder found at:', publicPath);
  app.use(express.static(publicPath));
} else {
  console.warn('✗ Public folder not found at:', publicPath);
  console.warn('Current working directory:', process.cwd());
  try {
    const contents = fs.readdirSync(__dirname);
    console.warn('Contents of __dirname:', contents);
  } catch (err) {
    console.error('Could not read __dirname:', err.message);
  }
}

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

// Serve React app for all other routes (must be after all API routes)
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(buildPath, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      console.error('index.html not found at:', indexPath);
      return res.status(404).json({ 
        error: 'Application not found',
        path: indexPath
      });
    }
    
    res.sendFile(indexPath);
  } catch (err) {
    console.error('Error serving React app:', err);
    res.status(500).json({ 
      error: 'Server error',
      message: err.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});
