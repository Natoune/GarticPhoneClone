import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { FaPaintBrush } from "react-icons/fa";
import styled from "styled-components";
import _ from 'lodash';
import { useTheme } from './useTheme';
import { getFromLS } from '../utils/storage';

const ThemeSelector = styled.div`
    background: rgba(0, 0, 0, 0.65);
    position: absolute;
    top: -10px;
    right: -10px;
    padding: 10px 10px 0 0;
    border-radius: 15px;
    z-index: 999;
`;

const ThemeSelectorButton = styled.button`
    margin: 10px;
    margin-left: 14px;
    margin-bottom: 14px;
    background: none;
    border: none;
    color: #000;
    cursor: pointer;
`;

const ThemedButton = styled.button`
    border: 0;
    display: block;
    border-radius: 100%;
    margin-top: 7px;
    width: 25px;
    height: 25px;
    cursor: pointer;
`;

const Container = styled.ul`
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
    padding: 10px;
`;

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
    const themesFromStore = getFromLS('all-themes');
    const [data, setData] = useState(themesFromStore.data);
    const [themes, setThemes] = useState([]);
    const {setMode} = useTheme();

    const themeSwitcher = selectedTheme => {
        setMode(selectedTheme);
        props.setter(selectedTheme);
    };

    useEffect(() => {
        setThemes(_.keys(data));
    }, [data]);

    useEffect(() => {
        props.newTheme &&
            updateThemeCard(props.newTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateThemeCard = theme => {
        const key = _.keys(theme)[0];
        const updated = {...data, [key]:theme[key]};
        setData(updated);
    }

    const ThemeCard = props => {
        return(
                <ThemedButton onClick={ (theme) => themeSwitcher(props.theme) }
                    style={{background: `${data[_.camelCase(props.theme.name)].colors.body}`, 
                    color: `${data[_.camelCase(props.theme.name)].colors.text}`,}}>
                </ThemedButton>
        )
    }

    return (
        <ThemeSelector>
            <ThemeSelectorButton onClick={() => {
                if (document.getElementById('themeSelectorContainer').style.display === 'none') {
                    document.getElementById('themeSelectorContainer').style.display = 'block';
                } else {
                    document.getElementById('themeSelectorContainer').style.display = 'none';
                }
                
            }}>
                <IconContext.Provider value={{ className: "brush-icon" }}>
                    <FaPaintBrush/>
                </IconContext.Provider>
            </ThemeSelectorButton>
            <Container id="themeSelectorContainer" style={{display: 'none'}}>
            {
                themes.length > 0 && 
                    themes.map(theme =>(
                        <ThemeCard theme={data[theme]} key={data[theme].id} />
                    ))
            }
            </Container>
        </ThemeSelector>
    )
}