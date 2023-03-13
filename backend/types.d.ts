import {WebSocket} from 'ws';

export interface ActiveConnections {
	[id: string]: WebSocket
}

export interface IncomingMessage {
	type: string;
	payload: string;
}

export interface IncomingDot {
	coordinateX: number;
	coordinateY: number;
	color: string;
}