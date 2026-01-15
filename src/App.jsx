import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import LandingPage from './components/LandingPage';
import GameRoom from './components/GameRoom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://poker-orjq.onrender.com';
const socket = io(BACKEND_URL, {
  transports: ['polling'],
  path: '/socket.io'
});

function App() {
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [initialRoomId, setInitialRoomId] = useState('');

  useEffect(() => {
    // Check URL for room ID
    const params = new URLSearchParams(window.location.search);
    const roomIdParam = params.get('room');
    if (roomIdParam) {
      setInitialRoomId(roomIdParam);
    }

    socket.on('room-update', (updatedRoom) => {
      setRoom(updatedRoom);
    });

    socket.on('error', (msg) => {
      alert(msg);
      setIsJoined(false); // Go back to landing page if room not found
    });

    return () => {
      socket.off('room-update');
      socket.off('error');
    };
  }, []);

  const handleCreateRoom = (roomId, initialChips, name) => {
    setPlayerName(name);
    socket.emit('create-room', { roomId, initialChips });
    socket.emit('join-room', { roomId, playerName: name });
    setIsJoined(true);
  };

  const handleJoinRoom = (roomId, name) => {
    setPlayerName(name);
    socket.emit('join-room', { roomId, playerName: name });
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen">
      {!isJoined ? (
        <LandingPage 
          onCreate={handleCreateRoom} 
          onJoin={handleJoinRoom} 
          initialRoomId={initialRoomId}
        />
      ) : (
        room && <GameRoom room={room} socket={socket} playerName={playerName} />
      )}
    </div>
  );
}

export default App;
