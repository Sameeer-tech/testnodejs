import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLoginSuccess = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentPage('chat');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login');
  };

  const handleSwitchPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {token && user ? (
        <Chat user={user} onLogout={handleLogout} />
      ) : (
        <>
          {currentPage === 'login' ? (
            <Login onLoginSuccess={handleLoginSuccess} onSwitchPage={handleSwitchPage} />
          ) : (
            <Register onRegisterSuccess={handleLoginSuccess} onSwitchPage={handleSwitchPage} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
