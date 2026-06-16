import React, { useEffect } from 'react';
import BoardPage from './pages/BoardPage';
import { socket } from './services/socket';

const App: React.FC = () => {

  useEffect(() => {

    socket.on('connect', () => {
      console.log('✅ Connected to backend:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from backend');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };

  }, []);

  return <BoardPage />;
};

export default App;