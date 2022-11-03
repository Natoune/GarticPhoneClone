import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/index.css';
import Home from './pages/Home';
import Room from './pages/Room';
import reportWebVitals from './reportWebVitals';

import { ChakraProvider } from "@chakra-ui/react";

import * as themes from './themes/schema.json';
import { setToLS } from './utils/storage';
import NotFound from './pages/NotFound';

const Index = () => {
    setToLS('all-themes', themes.default);
    return(
		<ChakraProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route index element={<Home />} />
					<Route path="r/:room" element={<Room />} />
					<Route path="*" element={<NotFound />} />
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
