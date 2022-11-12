import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from '../../themes/GlobalStyles';
import { useTheme } from '../../themes/useTheme';
import ThemeSelector from '../../themes/ThemeSelector';
import { IoMdSend } from 'react-icons/io';
import { BsFillChatRightFill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { delFromLS, getFromLS, setToLS } from '../../utils/storage';
import BounceLoader from 'react-spinners/BounceLoader';

Modal.setAppElement('#root');

function Game() {
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
    let users;
    let roomObject;

    // Modals
	const [chatModalIsOpen, setChatModalIsOpen] = useState(false);

	async function openChatModal() {
		await setChatModalIsOpen(true);
		document.querySelector('.chatModal').parentElement.style.background = 'transparent';
		refreshChat();
	}
	function closeChatModal() {
		setChatModalIsOpen(false);
	}

    setInterval(() => {
		// socket.on('refreshRoom', () => refreshRoom());
		socket.on('refreshChat', () => refreshChat());
	}, 1000);

    let lastHeight = window.innerHeight;
	const onLoad = () => {
		// resize
		if (window.innerHeight < 800)
			document.querySelector('.App').style.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) * 1.2 + 'px';
		lastHeight = window.innerHeight;

		if (typeof getFromLS('name') === 'undefined' || typeof getFromLS('avatar') === 'undefined' || typeof getFromLS('userId') === 'undefined') {
			return navigate('/');
		}

        let receivedData = false;
		socket.emit('getRoom', room, getFromLS('userId'), response => {
			receivedData = true;

			if (typeof response.error !== "undefined") {
				if (response.error === 'user_doesnt_exist' || response.error === 'invalid_room')
					setToLS('error', response);
				delFromLS('admin');
				return navigate('/');
			}

            roomObject = response;

			dataUpdate(response);
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
		}, process.env.REACT_APP_SOCKETIO_TIMEOUT);
	}

    const sendMessage = () => {
        console.log('send');
		socket.emit('sendMessageInChat', room, document.querySelector('.chatModal input').value, getFromLS('userId'));
		document.querySelector('.chatModal input').value = '';
	}

    const refreshChat = () => {
        console.log('refresh');
		socket.emit('getChat', room, response => {
            if (typeof document.querySelector('.chatModal') !== 'undefined') {
                document.querySelector('.chatModal .messages').innerHTML = '<h1>Début de la conversation</h1>';

                Object.values(response).forEach((m) => {
                    if (m.id === getFromLS('userId'))
                        document.querySelector('.chatModal .messages').innerHTML += `<div class="message sended"><p style="color:var(--sub-color)">Vous</p><p>${m.message}</p></div>`;
                    else
                        document.querySelector('.chatModal .messages').innerHTML += `<div class="message"><p style="color:var(--sub-color);text-transform:uppercase">${m.name}</p><p>${m.message}</p></div>`;
                });
            }
		});
	}

    const dataUpdate = () => {
        users = roomObject.users;
		let user = roomObject.users.find(u => u.id === getFromLS('userId'));
		document.getElementById('usersCount').innerHTML = users.length;
		document.getElementById('maxUsersCount').innerHTML = roomObject.params.maxUsers;
		document.querySelector('.players').innerHTML = '';

		if (user.banned) {
			setToLS('error', {
				error: 'banned',
				message: 'Vous avez été banni de cette partie !'
			});
			return window.location.replace('/');
		}

        document.querySelector('.loader').remove();
    }

	return(
        <>
		{
		themeLoaded && <ThemeProvider theme={ selectedTheme }>
			<ThemeSelector setter={ setSelectedTheme } />
			<GlobalStyles/>
            <img style={{ display: 'none' }} src='/load.gif' alt='' onLoad={onLoad}/>
			<div className="App" onMouseMove={() => {
				if (window.innerHeight < 800) {
					if (lastHeight !== window.innerHeight) {
						document.querySelector(".App").style.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) * 1.2 + "px";
						lastHeight = window.innerHeight;
					}
				} else {
					document.querySelector('.App').style.height = '100vh';
				}
			}}>
                <div className='loader'>
					<BounceLoader className='loader-span' color='#ffffff' />
				</div>
				<div>
					<button className='chatButton' onClick={openChatModal}>
						<BsFillChatRightFill size={32} />
					</button>
					<Modal
						isOpen={chatModalIsOpen}
						onRequestClose={closeChatModal}
						contentLabel="Example Modal"
						className='chatModal'
					>
						<h1>Chat</h1>
						<div className='messages'></div>
						<input type='text' onKeyDown={e => {
							if (e.key === "Enter") sendMessage();
						}}></input>
						<button onClick={sendMessage}>
							<IoMdSend size={32} />
						</button>
					</Modal>
				</div>
				<header className="App-header">
				</header>
			</div>
		</ThemeProvider>
		}
		</>
    );
}

export default Game;