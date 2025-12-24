import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Cek local storage dulu, kalau tidak ada default ke Dark Mode (true)
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? JSON.parse(saved) : true; 
    });

    const toggleTheme = () => setIsDark(prev => !prev);

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(isDark));
        // Update style body langsung
        document.body.style.backgroundColor = isDark ? '#0f172a' : '#f8fafc';
        document.body.style.color = isDark ? '#f8fafc' : '#1e293b';
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};