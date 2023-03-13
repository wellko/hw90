import {useEffect, useRef, useState} from 'react'
import {Coordinates, DrawDot, IncomingMessage} from "./types";
import {Button, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import Canvas from "./components/Canvas";

function App() {
	const [draw, setDraw] = useState<DrawDot[]>([]);
	const [color, setColor] = useState('');
	const [isLoggedIn, setLoggedIn] = useState(false);
	const ws = useRef<WebSocket | null>(null);
	const colors = ['DarkRed', 'FireBrick', 'Crimson', 'HotPink', 'DeepPink', 'MediumVioletRed', 'Tomato', 'OrangeRed', 'Gold', 'Magenta', 'Lime',
		'MediumSpringGreen', 'Cyan', 'Blue', 'Peru']

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:8000/draw');
		ws.current.onclose = () => console.log("ws closed");
		ws.current.onmessage = event => {
			const decodedMessage = JSON.parse(event.data) as IncomingMessage;
			if (decodedMessage.type === 'NEW_DOT') {
				setDraw((dots) => [...dots, decodedMessage.payload]);
			}
		};
		return () => {
			if (ws.current) {
				ws.current.close();
			}
		}
	}, []);

	const changeColor = (e: SelectChangeEvent) => {
		setColor(e.target.value);
	};

	const onDraw = (coords: Coordinates, color: string) => {
		if (!ws.current) return;
		ws.current.send(JSON.stringify({
			type: 'SEND_DOT',
			payload: {
				x: coords.x,
				y: coords.y,
				color: color,
			}
		}));
	}

	const setUserColor = (e: React.FormEvent) => {
		e.preventDefault();
		if (!ws.current) return;
		ws.current.send(JSON.stringify({
			type: 'SET_COLOR',
			payload: color
		}));
		setLoggedIn(true);
		console.log(isLoggedIn)
	};


	return (
		<div className="App">
			{!isLoggedIn ? <form onSubmit={setUserColor}>
				<Select value={color} onChange={changeColor} label='Color'>
					{colors.map(el => <MenuItem key={Math.random()} value={el.toLowerCase()}> {el} </MenuItem>)}
				</Select>
				<Button type='submit'>Join</Button>
			</form> : <Canvas color={color} painted={draw} onDraw={onDraw}/>}
		</div>
	)
}

export default App
