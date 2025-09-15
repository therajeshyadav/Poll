import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import voteRoutes from './routes/voteRoutes.js';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// mount votes route after `io` exists
app.use('/votes', voteRoutes(io));

io.on('connection', (socket) => {
  console.log('Client connected');

  // client subscribes to a specific poll room to receive live results
  socket.on('joinPoll', (pollId) => {
    const room = `poll:${pollId}`;
    socket.join(room);
  });

  // optional: allow client to leave a poll room
  socket.on('leavePoll', (pollId) => {
    const room = `poll:${pollId}`;
    socket.leave(room);
  });

  socket.on('vote', (data) => {
    // Broadcast updated results to all clients
    io.emit('broadcastResults', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
