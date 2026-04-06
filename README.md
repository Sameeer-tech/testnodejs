# Chat Application - Login & Chat System

A full-stack chat application built with **React**, **Node.js**, **Express**, and **MongoDB Atlas**. Features real-time messaging and user authentication.

## Project Structure

```
testnodejs/
├── server/                 # Backend (Node.js + Express)
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   └── Message.js
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication endpoints
│   │   └── messages.js    # Chat message endpoints
│   ├── server.js          # Main server file
│   └── package.json
└── client/                # Frontend (React)
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Chat.js
    │   │   └── *.css
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## MongoDB Connection

Your MongoDB URI is already configured in both `.env` and `server.js`:
```
mongodb+srv://uksameer2006_db_user:UF5BV8KgX3JZxjZd@test.lgqqyqm.mongodb.net/chat_app?retryWrites=true&w=majority
```

**Note:** This connection string connects to: `test.lgqqyqm.mongodb.net` cluster with database `chat_app`

## Features

✅ **User Authentication**
- User Registration with password hashing (bcryptjs)
- User Login with JWT tokens
- Session management with localStorage

✅ **Real-time Chat**
- Multiple chat rooms (#general, #random, #suggestions)
- Custom room creation
- Real-time messaging with Socket.io
- Message history stored in MongoDB

✅ **Modern UI**
- Beautiful gradient design
- Responsive layout (mobile-friendly)
- Real-time message updates
- User presence indication

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

## Running the Application

### Option A: Run Both Servers (Recommended)

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
```
Backend will run on: `http://localhost:5000`

**Terminal 2 - Start Frontend Development Server:**
```bash
cd client
npm start
```
Frontend will run on: `http://localhost:3000`

### Testing the Application

1. **Open Browser:** Go to `http://localhost:3000`

2. **Create Account:**
   - Click "Sign Up"
   - Enter username, email, and password
   - Click "Sign Up"

3. **Login:**
   - Use the credentials you just created
   - Click "Login"

4. **Start Chatting:**
   - You'll be in the #general room by default
   - Type a message and click "Send"
   - Try switching between different rooms
   - Create a custom room by entering a name and clicking "Join"

5. **Test Real-Time Messaging:**
   - Open multiple browser windows/tabs
   - Login with different accounts
   - Send messages between accounts
   - Watch real-time updates!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Messages
- `GET /api/messages/:room` - Get messages for a room
- `POST /api/messages/save` - Save a new message

## Real-Time Events (Socket.io)

- `join_room` - User joins a chat room
- `send_message` - User sends a message
- `receive_message` - Receive messages from other users

## Environment Variables

Create a `.env` file in the `server` folder (optional, defaults are set):

```env
PORT=5000
MONGODB_URI=mongodb+srv://uksameer2006_db_user:UF5BV8KgX3JZxjZd@test.lgqqyqm.mongodb.net/chat_app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_change_this_in_production
```

## Deployment to Free Hosting 🚀

Your app is ready to deploy for FREE! Complete deployment guides included:

### 📊 Choose Your Guide:

1. **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** ⚡ (RECOMMENDED)
   - **Time:** ~20 minutes
   - Step-by-step checklist format
   - Best for getting live quickly

2. **[DEPLOY_DETAILED_GUIDE.md](DEPLOY_DETAILED_GUIDE.md)** 📖
   - **Time:** ~30 minutes  
   - With detailed explanations
   - Perfect for first-time deployers

3. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** 🎯
   - **Time:** Reference guide
   - Technical deep-dive
   - Troubleshooting tips

### Free Hosting Stack:
- **Backend:** [Render.com](https://render.com) (Free tier)
- **Frontend:** [Vercel.com](https://vercel.com) (Free tier)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier)

## Troubleshooting

**Port 5000 already in use?**
```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**MongoDB Connection Failed?**
- Verify your MongoDB Atlas IP whitelist includes your current IP
- Check connection string has the correct password
- Ensure database `chat_app` exists or create it

**Socket.io Connection Issues?**
- Check browser console for CORS errors
- Verify backend is running on port 5000
- Update frontend socket URL if different port

## Technologies Used

- **Backend:** Express.js, Node.js, MongoDB, Mongoose, Socket.io, JWT, bcryptjs
- **Frontend:** React, Axios, Socket.io-client
- **Styling:** CSS3 with gradients and animations

## License

MIT

---

**Ready to test!** Follow the "Running the Application" section above.
