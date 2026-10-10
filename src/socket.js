import { io } from 'socket.io-client';

// Keep connection alive across route changes
// export const socket = io('http://localhost:3001', {
  export const socket = io('https://sankalpcode-backend.onrender.com', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
});