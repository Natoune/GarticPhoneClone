import React, { useState, useEffect } from 'react'
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from '../themes/GlobalStyles';
import { useTheme } from '../themes/useTheme';
import ThemeSelector from '../themes/ThemeSelector';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { delFromLS, getFromLS, setToLS } from '../utils/storage';

function Room() {
	const {theme, themeLoaded} = useTheme();
	const [selectedTheme, setSelectedTheme] = useState(theme);

	useEffect(() => {
		setSelectedTheme(theme);
	}, [theme, themeLoaded]);

	const { room } = useParams();
	const navigate = useNavigate();
	let socket = io((process.env.REACT_APP_SOCKETIO_SERVER || 'http://localhost:3001/'), {
		transports: ['websocket', 'polling']
	});

	let receivedData = false;
	socket.emit('enterRoom', room, getFromLS('name'), getFromLS('admin'), response => {
		if (typeof response.error !== "undefined") {
			if (response.error === 'user_already_exists' || response.error === 'invalid_room' || response.error === 'room_full')
				setToLS('error', response);
			delFromLS('admin');
			return navigate('/');
		}
		receivedData = true;
	});

	setTimeout(() => {
		if (!receivedData) {
			delFromLS('admin');
			setToLS('error', {
				error: 'socket.io_timeout',
				message: 'Le serveur n\'a pas répondu dans le délai imparti. Veuillez réessayer.'
			});
			return navigate('/');
		}
	}, 3000);

	return (
		<>
		{
		themeLoaded && <ThemeProvider theme={ selectedTheme }>
			<ThemeSelector setter={ setSelectedTheme } />
			<GlobalStyles/>
			<div className="App">
				<header className="App-header">
					<h1>Test</h1>
				</header>
			</div>
		</ThemeProvider>
		}
		</>
	);
}

export default Room;