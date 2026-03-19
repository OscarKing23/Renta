import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { DarkColors, LightColors, ThemeColors } from './colors';

interface ThemeContextValue {
    colors: ThemeColors;
    isLightMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    colors: DarkColors,
    isLightMode: false,
    toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLightMode, setIsLightMode] = useState(false);

    const toggleTheme = useCallback(() => {
        setIsLightMode((prev) => !prev);
    }, []);

    const value = useMemo<ThemeContextValue>(
        () => ({
            colors: isLightMode ? LightColors : DarkColors,
            isLightMode,
            toggleTheme,
        }),
        [isLightMode, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
