import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
const crypto = require('crypto');
import {ActiveConnections, IncomingMessage} from "./types";

const app = express();
expressWs(app);
const activeConnections: ActiveConnections = {};
const port = 8000;
app.use(cors());
const router = express.Router();
router.ws('/draw', (ws, req) => {
	const id = crypto.randomUUID();
	console.log('client connected! id=', id);
	activeConnections[id] = ws;
	ws.on('close', () => {
		console.log('client disconnected! id=', id);
		delete activeConnections[id];
	});
	let color = 'black';
	ws.on('message', (msg) => {
		const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
		switch (decodedMessage.type) {
			case 'SET_COLOR':
				color = decodedMessage.payload;
				break;
			case 'SEND_DOT':
				Object.keys(activeConnections).forEach(connId => {
					const conn = activeConnections[connId];
					conn.send(JSON.stringify({
						type: 'NEW_DOT',
						payload: decodedMessage.payload,
					}));
				});
				break;
			default:
				console.log('Unknown message type:', decodedMessage.type);
		}
	});
});
app.use(router);
app.listen(port, () => {
	console.log(`Server started on ${port} port!`);
});