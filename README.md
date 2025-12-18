Real-Time Room Chat (WebSocket)
A lightweight, real-time chat application built with Node.js, TypeScript, and WebSockets. The project supports multiple chat rooms, allowing users to communicate in isolated environments.

Features
* Real-time Communication: Bidirectional data flow using the WebSocket protocol.
* Room-based Isolation: Users only receive messages from others in the same room.
* JSON-based Protocol: Structured messaging for "join", "message", and "system" events.
* User Tracking: Backend state management using Map to track active connections and user metadata.
* Responsive UI: A clean chat interface built with React and Tailwind CSS.

  
Tech Stack
Backend
* Runtime: Node.js
* Language: TypeScript
* Server: Express
* WebSocket Library: ws

Frontend
* Framework: React (Next.js)
* Styling: Tailwind CSS
* State Management: React Hooks (useRef, useState, useEffect)

Git clone
```Bash
git clone https://github.com/your-username/websocket-chat.git
cd websocket-chat
```

Backend install
```Bash
cd backend
npm install
npm run dev
```

Frontend install
```Bash
cd frontend
npm install
npm run dev
```
