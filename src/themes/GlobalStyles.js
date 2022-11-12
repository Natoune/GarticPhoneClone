import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    :root {
        --bg-color: ${({ theme }) => theme.colors.body};
        --color: ${({ theme }) => theme.colors.text};
        --sub-color: ${({ theme }) => theme.colors.sub};
        --button-text: ${({ theme }) => theme.colors.button.text};
        --button-shadow: ${({ theme }) => theme.colors.button.shadow};
        --button-icon: ${({ theme }) => theme.colors.button.icon};
        --button2-text: ${({ theme }) => theme.colors.button2.text};
        --button2-background: ${({ theme }) => theme.colors.button2.background};
    }
`;