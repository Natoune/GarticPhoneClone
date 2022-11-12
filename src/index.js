import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/index.css';
import Home from './pages/Home';
import Lobby from './pages/Room/Lobby';
import reportWebVitals from './reportWebVitals';

import { ChakraProvider } from "@chakra-ui/react";

import * as themes from './themes/schema.json';
import { setToLS, getFromLS } from './utils/storage';
import Game from './pages/Room/Game';
import Admin from './pages/Admin';

const Index = () => {
    setToLS('all-themes', themes.default);
	if (typeof getFromLS('userId') === 'undefined' || getFromLS('userId').length < 8) {
		let id = '';
		for (let i = 0; i < 8; i++) {
			id += Math.floor(Math.random() * 10).toString();
		}
		setToLS('userId', id);
	}
    return(
		<ChakraProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route index element={<Home />} />
					<Route path="/:room/login" element={<Home />} />
					<Route path="/:room/game" element={<Game />} />
					<Route path="/:room" element={<Lobby />} />
					<Route path="/admin/:user/:password" element={<Admin />} />
					<Route path="*" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</ChakraProvider>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
    	<Index />
  	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
