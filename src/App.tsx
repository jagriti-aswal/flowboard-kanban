import React, { useEffect, useState } from 'react';
import BoardPage from './pages/BoardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import { socket } from './services/socket';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {

  const { token } = useAuth();

  const [isSignup, setIsSignup] =
    useState(false);

  useEffect(() => {

    socket.on('connect', () => {
      console.log(
        '✅ Connected to backend:',
        socket.id
      );
    });

    socket.on('disconnect', () => {
      console.log(
        '❌ Disconnected from backend'
      );
    });

    return () => {

      socket.off('connect');
      socket.off('disconnect');

    };

  }, []);

  if (token) {
    return <BoardPage />;
  }

  return isSignup ? (
    <SignupPage
      onSwitchToLogin={() =>
        setIsSignup(false)
      }
    />
  ) : (
    <LoginPage
      onSwitchToSignup={() =>
        setIsSignup(true)
      }
    />
  );

};

export default App;