import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setCurrentPage('chat');
      } catch (err) {
        console.error('Error restoring session:', err);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

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

  if (loading) {
    return <div className="App"><p>Loading...</p></div>;
  }

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
