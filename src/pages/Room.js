import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Game from './Room/Game';
import Lobby from './Room/Lobby';

function Room() {
	let socket = io((process.env.REACT_APP_SOCKETIO_SERVER || 'http://localhost:3001/'), {
		transports: ['websocket', 'polling']
	});

	const { room } = useParams();

	const onLoad = () => {
		console.log(room);
		socket.emit('getRoomState', room, response => {
			console.log(response);
			if (!response) return(<Lobby/>);
			else return (<Game/>);
		});
	}

	return(onLoad);

	// return(
		// <img src='/load.gif' alt='' onLoad={onLoad}/>
	// );
}

export default Room;