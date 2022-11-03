import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    :root {
        --bg-color: ${({ theme }) => theme.colors.body};
        --color: ${({ theme }) => theme.colors.text};
        --button-text: ${({ theme }) => theme.colors.button.text};
        --button-shadow: ${({ theme }) => theme.colors.button.shadow};
        --button-icon: ${({ theme }) => theme.colors.button.icon};
    }
`;