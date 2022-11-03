import React from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

function RoomsList() {
	let socket = io((process.env.REACT_APP_SOCKETIO_SERVER || 'http://localhost:3001/'), {
		transports: ['websocket', 'polling']
	});
    const navigate = useNavigate();

    const getPublicRooms = () => {
        socket.emit('getPublicRooms', response => {
            document.getElementById('roomCount').innerHTML = response.rooms.length;
    
            document.querySelector('.rooms').innerHTML = '';
            for (let i in response.rooms) {
                let room = response.rooms[i];
                document.querySelector('.rooms').innerHTML += `<div class="room" onclick="window.location.replace('/r/${room.id}')"><p class="id">${room.id}</p><p class="users">Nombre de joueurs: ${room.users.length}/${room.maxUsers}</p></div>`
            }
        });
    }

	return (
        <>
        <label htmlFor='joinWithCode' className='joinWithCodeLabel'>Rejoindre une partie avec un code</label>
        <input type="text" className="joinWithCode" id="joinWithCode" placeholder="ABCDEF" />
        <button className="joinWithCodeButton" onClick={() => {
            navigate('/r/'+document.getElementById('joinWithCode').value);
        }}>
			<strong>Rejoindre</strong>
		</button>
        <img src='/load.gif' alt='' onLoad={getPublicRooms}/>
        <div className='roomsWrapper' onMouseMove={getPublicRooms}>
            <hr/>
            <h1>Liste des parties publiques (<span id='roomCount'>0</span>)</h1>
            <div className='rooms top' onScroll={() => {
                if (document.querySelector('.rooms').scrollTop < 10) {
                    document.querySelector('.rooms').setAttribute('class', 'rooms top');
                } else if (document.querySelector('.rooms').scrollTop > 10 && document.querySelector('.rooms').scrollTop < (document.querySelector('.rooms').childNodes.length - 3) * 75) {
                    document.querySelector('.rooms').setAttribute('class', 'rooms middle');
                } else {
                    document.querySelector('.rooms').setAttribute('class', 'rooms bottom');
                }
            }}></div>
        </div>
        </>
    );
}

export default RoomsList;