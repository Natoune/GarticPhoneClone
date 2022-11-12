import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import CryptoJS from 'crypto-js';
import * as j2h from 'json2html';
import '../styles/Admin.css';

function Admin() {
    let socket = io((process.env.REACT_APP_SOCKETIO_SERVER || 'http://localhost:3001/'), {
		transports: ['websocket', 'polling']
	});

    const navigate = useNavigate();
    const { user, password } = useParams();

    let rooms = {};

    setInterval(() => {
        socket.emit('admin', user, password, CryptoJS.MD5(JSON.stringify(rooms)).toString(), response => {
            if (response.error) {
                return navigate('/');
            } else {
                rooms = response;
                document.getElementById('obj').innerHTML = j2h.render(response);
            }
        });
    }, 1000);
    setTimeout(() => {
        document.getElementById('display').style.display = 'block';
    }, 1100);

	return(
        <>
        <div id='display' style={{ display: 'none' }}>
            <h1 style={{ fontSize: '200%', fontFamily: 'Black', textAlign: 'center' }}>Admin page</h1>
            <h2 style={{ fontSize: '200%', textAlign: 'center' }}>Rooms:</h2>
            <div id='obj'></div>
        </div>
        </>
    );
}

export default Admin;