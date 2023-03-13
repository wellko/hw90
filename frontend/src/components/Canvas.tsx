import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Coordinates, DrawDot} from "../types";

interface props {
	color: string;
	painted: DrawDot[];
	onDraw(coords: Coordinates, color: string): void;
}


const Canvas: React.FC<props> = ({color, painted, onDraw}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [mousePosition, setMousePosition] = useState<Coordinates | undefined>(undefined);

	const startPaint = useCallback((event: MouseEvent) => {
		const coordinates = getCoordinates(event);
		if (coordinates) {
			setMousePosition(coordinates);
			setIsDrawing(true);
		}
	}, []);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		const context = canvas.getContext('2d');
		if (context && painted) {
			painted.map(el => draw({x: el.x, y: el.y}, el.color, false))
		}
	}, [painted])

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		canvas.addEventListener('mousedown', startPaint);
		return () => {
			canvas.removeEventListener('mousedown', startPaint);
		};
	}, [startPaint]);

	const paint = useCallback(
		(event: MouseEvent) => {
			if (isDrawing) {
				const newMousePosition = getCoordinates(event);
				if (mousePosition && newMousePosition) {
					setMousePosition(newMousePosition);
					draw(mousePosition, color, true);
				}
			}
		},
		[isDrawing, mousePosition]
	);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		canvas.addEventListener('mousemove', paint);
		return () => {
			canvas.removeEventListener('mousemove', paint);
		};
	}, [paint]);

	const exitPaint = useCallback(() => {
		setIsDrawing(false);
		setMousePosition(undefined);
	}, []);

	useEffect(() => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		canvas.addEventListener('mouseup', exitPaint);
		return () => {
			canvas.removeEventListener('mouseup', exitPaint);
		};
	}, [exitPaint]);

	const getCoordinates = (event: MouseEvent): Coordinates | undefined => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		return {x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop};
	};

	const draw = (MousePosition: Coordinates, color: string, sending: boolean) => {
		if (!canvasRef.current) {
			return;
		}
		const canvas: HTMLCanvasElement = canvasRef.current;
		const context = canvas.getContext('2d');
		if (context) {
			context.beginPath();
			context.arc(MousePosition.x, MousePosition.y, 10, 0, 2 * Math.PI);
			context.fillStyle = color;
			context.fill();
			context.closePath();
			if(sending){
				onDraw(MousePosition, color);
			}
		}
	};

	return <canvas ref={canvasRef} width={window.innerWidth} height='600' style={{borderTop: '2px solid black', borderBottom: '2px solid black'}}/>;
};


export default Canvas;