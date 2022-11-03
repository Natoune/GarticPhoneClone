import { useEffect, useState } from 'react';
import { setToLS, getFromLS } from '../utils/storage';

export const useTheme = () => {
    const themes = getFromLS('all-themes');
    const [theme, setTheme] = useState(themes.data.main);
    const [themeLoaded, setThemeLoaded] = useState(false);

    const setMode = mode => {
        setToLS('theme', mode)
        setTheme(mode);
    };

    useEffect(() =>{
        const localTheme = getFromLS('theme');
        localTheme ? setTheme(localTheme) : setTheme(themes.data.main);
        setThemeLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { theme, themeLoaded, setMode };
};