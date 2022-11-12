import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
    width: 95%;
    margin: 20px auto;
    display: block;
    background-color: rgba(255, 255, 255, 0.7);
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 7px 0px;
    color: var(--sub-color);
    border-radius: 25px;
    font-size: 70%;
    text-transform: none;
`;

const Img = styled.img`
    width: 14%;
    position: absolute;
    left: 10%;
    top: 50%;
    transform: translateY(-50%);
`;


function Author() {
    return (
        <>
        <Card>
            <Img src='https://acdmufyyhq.cloudimg.io/v7/a.natoune.tk/logo/logo.png?radius=500' alt='avatar' />
            <h2 style={{ fontSize: '2rem', color: 'var(--button-text)', cursor: 'pointer' }} onClick={() => window.open('https://natoune.tk/')}>NATOUNE</h2>
            <p style={{ marginTop: '-5px', marginBottom: '15px' }}>Développeur</p>
            <a href='https://github.com/Natoune' rel='noreferrer' target='_blank' style={{ color: '#000', textDecoration: 'underline' }}>Github</a><br/>
            <a href='https://twitter.com/@Nat0une_' rel='noreferrer' target='_blank' style={{ color: '#000', textDecoration: 'underline' }}>Twitter</a><br/>
            <a href='mailto:contact@natoune.tk' rel='noreferrer' target='_blank' style={{ color: '#000', textDecoration: 'underline' }}
            onMouseOver={() => document.getElementById('mail').style.display = 'inline'}
            onMouseLeave={() => document.getElementById('mail').style.display = 'none'}>
                Mail<span id='mail' style={{ display: 'none' }}>&nbsp;(contact@natoune.tk)</span>
            </a>
        </Card>
        </>
    );
}

export default Author;
