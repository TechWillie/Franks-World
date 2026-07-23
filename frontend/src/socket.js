import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? window.location.origin
    : 'http://localhost:8000');

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('✅ SOCKET CONNECTED:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ SOCKET CONNECT ERROR:', err.message);
});

socket.on('disconnect', (reason) => {
  console.warn('⚠️ SOCKET DISCONNECTED:', reason);
});