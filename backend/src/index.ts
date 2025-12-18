import express from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server, path: '/ws'});

type User = {
	id: string;
	name: string;
	room: string;
}
const users = new Map<WebSocket, User>();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

wss.on('connection', (socket: WebSocket) => {
	console.log('Client connected');
	socket.on('message', (rawData) => {
		try {
			const data = JSON.parse(rawData.toString());
			if (data.type === "join") {
				users.set(socket, {
					id: Math.random().toString(36).substring(7),
					name: data.name || 'unknown',
					room: data.room || 'general',
				})
				console.log(`${data.name} joined ${data.room}`);
				return;
			}

			const sender = users.get(socket);
			if (!sender) return null;

			wss.clients.forEach((client) => {
				const recipient = users.get(client);

				if (client.readyState === client.OPEN && recipient?.room === sender.room) {
					client.send(JSON.stringify({
						type: "message",
						author: sender.name,
						text: data.text,
						timestamp: new Date().toLocaleTimeString(),
					}));
				}
			});
		} catch (e) {
			const error = e instanceof Error ? e : null;
			console.error(error);
		}
	});

	socket.on('close', () => {
		users.delete(socket);
		console.log('Client disconnected');
	});
});

app.get('/', (req, res) => {
	res.send('Websocket');
})

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
