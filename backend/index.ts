import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';

const crypto = require('crypto');
import {ActiveConnections, IncomingDot, IncomingMessage} from "./types";

let dots:IncomingDot[] = [];

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
	ws.on('message', (msg) => {
		const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;
		switch (decodedMessage.type) {
			case 'SEND_DOT':
				console.log(dots)
				const dot = decodedMessage.payload as IncomingDot[];
				dots = dots.concat(dot)
				Object.keys(activeConnections).forEach(connId => {
					const conn = activeConnections[connId];
					conn.send(JSON.stringify({
						type: 'NEW_DOT',
						payload: decodedMessage.payload,
					}));
				});
				break;
			case 'GET_DOTS':
				Object.keys(activeConnections).forEach(connId => {
					const conn = activeConnections[connId];
					conn.send(JSON.stringify({
						type: 'NEW_DOT',
						payload: dots,
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