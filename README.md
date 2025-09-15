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

## Overview
Backend for a real-time polling app: create polls with options, users vote, and results update live per poll room via Socket.IO.

## Prerequisites
- Node.js 18+
- PostgreSQL 13+
Create a database (e.g., `polling_db`) and set `DATABASE_URL` accordingly.

## Migrate and Generate
```
npx prisma migrate deploy
npx prisma generate
```

## Example Requests
```
POST /users
{ "name": "Alice", "email": "alice@example.com", "password": "secret123" }

POST /polls
{ "question": "Best language?", "creatorId": 1, "options": ["JavaScript", "Python"] }

POST /votes
{ "userId": 1, "pollOptionId": 2 }

GET /polls/1  // returns options with votesCount
```

## Testing (Postman)
1) Create user → create poll → note option ids
2) WebSocket (Socket.IO): connect to `http://localhost:3000`
   - Send event `joinPoll` with message: `1`
   - Add listener `broadcastResults`
3) Cast a vote via `POST /votes`
4) Observe `broadcastResults` payload in the WS tab

## Schema
- User 1—* Poll (`creatorId`)
- Poll 1—* PollOption (`pollId`)
- User *—* PollOption via Vote (unique: `[userId, pollOptionId]`)

Fields:
- User: `id, name, email, passwordHash`
- Poll: `id, question, isPublished, createdAt, updatedAt`
- PollOption: `id, text`
- Vote: `id`
