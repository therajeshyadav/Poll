# Real-Time Polling Backend

## Tech
- Node.js + Express
- PostgreSQL + Prisma
- Socket.IO

## Setup
1. Create `.env` with:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
PORT=3000
```
2. Install deps: `npm install`
3. Run migrations: `npx prisma migrate deploy`
4. Start dev: `npm run dev`

## API
- POST `/users` { name, email, password }
- GET `/users/:id`
- POST `/polls` { question, creatorId, options: ["...", "..."] }
- GET `/polls`
- GET `/polls/:id`
- PUT `/polls/:id` { question }
- DELETE `/polls/:id`
- POST `/votes` { userId, pollOptionId }

## Realtime
- Connect via Socket.IO
- Join a poll room to receive live results:
```
socket.emit('joinPoll', pollId);
```
- Receive updates scoped to that poll:
```
socket.on('broadcastResults', (payload) => {
  // payload: { pollId, results: [{ optionId, text, votes }] }
});
```
