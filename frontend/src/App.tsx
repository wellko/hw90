import {useEffect, useRef, useState} from 'react'
import {Coordinates, DrawDot, IncomingMessage} from "./types";
import { Grid, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import Canvas from "./components/Canvas";

function App() {
	const [draw, setDraw] = useState<DrawDot[]>([]);
	const [color, setColor] = useState('black');
	const ws = useRef<WebSocket | null>(null);
	const colors = ['Black', 'DarkRed', 'FireBrick', 'Crimson', 'HotPink', 'DeepPink', 'MediumVioletRed', 'Tomato', 'OrangeRed', 'Gold', 'Magenta', 'Lime',
		'MediumSpringGreen', 'Cyan', 'Blue', 'Peru'];

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:8000/draw');
		ws.current.onclose = () => console.log("ws closed");
		ws.current.onopen = () => {
			if (ws.current){
				ws.current.send(JSON.stringify({
					type: 'GET_DOTS'
				}))
			}
		}
		ws.current.onmessage = event => {
			const decodedMessage = JSON.parse(event.data) as IncomingMessage;
			if (decodedMessage.type === 'NEW_DOT') {
				setDraw((dots) => dots.concat(decodedMessage.payload));
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
			payload: [{
				x: coords.x,
				y: coords.y,
				color: color,
			}]
		}));
	};

	const setUserColor = (e: React.FormEvent) => {
		e.preventDefault();
	};


	return (
		<>
			<Typography variant='h2' textAlign='center'>You can draw here</Typography>
				<form onSubmit={setUserColor}>
					<Grid container textAlign='center'>
						<Grid item xs={12}>
							<Typography variant='h2' textAlign='center'>Choice color</Typography>
						</Grid>
						<Grid item margin='auto' mt={2}>
							<Select value={color} onChange={changeColor} sx={{minWidth: '200px'}}>
								{colors.map(el => <MenuItem key={Math.random()}
															value={el.toLowerCase()}> {el} </MenuItem>)}
							</Select>
						</Grid>
					</Grid>
				</form>
					<Canvas color={color} painted={draw} onDraw={onDraw}/>
		</>
	)
}

export default App
