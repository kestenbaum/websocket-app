import express, { Express } from 'express';
import cors from 'cors';
import { WebSocketServer, WebSocket, RawData } from 'ws';
import http from 'http';

const app: Express = express();
const server = http.createServer(app);
const wss = new WebSocketServer({server, path: '/ws'});

type User = {
	id: string;
	name: string;
	room: string;
}
const users = new Map<WebSocket, User>();
const PORT: string | 4000 = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

wss.on('connection', (socket: WebSocket): void => {
	socket.on('message', (rawData: RawData): null | undefined => {
		try {
			const data = JSON.parse(rawData.toString());
			if (data.type === "join") {
				users.set(socket, {
					id: Math.random().toString(36).substring(7),
					name: data.name || 'unknown',
					room: data.room || 'general',
				})
				return;
			}

			const sender: User | undefined = users.get(socket);
			if (!sender) return null;

			wss.clients.forEach((client): void => {
				const recipient: User | undefined = users.get(client);

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
			const error: Error | null = e instanceof Error ? e : null;
			console.error(error);
		}
	});

	socket.on('close', (): void => {
		users.delete(socket);
		console.log('Client disconnected');
	});
});

app.get('/', (req, res) => {
	res.send('Websocket');
})

server.listen(PORT, (): void => {
	console.log(`Server running on port ${PORT}`);
});
