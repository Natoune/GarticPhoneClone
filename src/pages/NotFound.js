import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

const Div = styled.div`
	width: 100%;
	height: 100vh;
`;

function NotFound() {
	const navigate = useNavigate();

	window.onload = () => navigate('/');

	return(
		<Div onClick={() => navigate('/') }>
			<a href="/" style={{ opacity: 0 }}>404 | Page Not Found</a>
		</Div>
	);
}

export default NotFound;