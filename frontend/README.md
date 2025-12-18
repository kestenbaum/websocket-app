Frontend Install
```Bash
cd backend
npm install
npm run dev
```

Message Protocol
The client and server communicate using JSON objects. Every message must have a type property.

1. Join Room
Sent by the client to register a name and enter a room.
```Bash
{
  "type": "join",
  "name": "Alex",
  "room": "dev-room"
}
```

2. Chat Message
Sent by the client or broadcasted by the server.
```
{
  "type": "message",
  "author": "Alex",
  "text": "Hello, world!",
  "timestamp": "14:20:05"
}
```
