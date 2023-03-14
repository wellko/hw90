import {WebSocket} from 'ws';

export interface ActiveConnections {
	[id: string]: WebSocket
}

export interface IncomingMessage {
	type: string;
	payload: string | IncomingDot[];
}

export interface IncomingDot {
	x: number;
	y: number;
	color: string;
}