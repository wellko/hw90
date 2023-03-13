export interface DrawDot {
	x: number;
	y: number;
	color: string;
}

export interface IncomingMessage {
	type: string;
	payload: DrawDot;
}

export type Coordinates = Omit<DrawDot, 'color'>;