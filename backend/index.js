import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({
		server,
		path: '/ws',
});

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

wss.on('connection', (socket) => {
		console.log('Client connected');
		socket.on('message', (message) => {
				wss.clients.forEach((client) => {
						if (client.readyState === client.OPEN) {
								client.send(`Echo: ${message}`);
						}
				});
		});
		
		socket.on('close', () => {
				console.log('Client disconnected');
		});
});

app.get('/', (req, res) => {
		res.send('Websocket');
})

server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
});
