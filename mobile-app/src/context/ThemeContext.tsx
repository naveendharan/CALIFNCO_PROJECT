import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeColors {
  isDark: boolean;
  bg: string;
  card: string;
  cardHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryHover: string;
  border: string;
  borderSubtle: string;
  badgeBg: string;
  badgeText: string;
  accent: string;
  accentGreen: string;
  accentOrange: string;
  accentRed: string;
  inputBg: string;
  navBg: string;
}

const lightTheme: ThemeColors = {
  isDark: false,
  bg: '#f8fafc',
  card: '#ffffff',
  cardHover: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  primary: '#0284c7', // Sky Cyan
  primaryLight: '#e0f2fe',
  primaryHover: '#0369a1',
  border: '#e2e8f0',
  borderSubtle: '#f1f5f9',
  badgeBg: '#e0f2fe',
  badgeText: '#0369a1',
  accent: '#06b6d4',
  accentGreen: '#10b981',
  accentOrange: '#f59e0b',
  accentRed: '#ef4444',
  inputBg: '#ffffff',
  navBg: '#ffffff'
};

const darkTheme: ThemeColors = {
  isDark: true,
  bg: '#0b1329',
  card: '#131e3a',
  cardHover: '#1c2a4f',
  text: '#f8fafc',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  primary: '#38bdf8', // Neon Sky Cyan
  primaryLight: '#082f49',
  primaryHover: '#7dd3fc',
  border: '#1e293b',
  borderSubtle: '#172554',
  badgeBg: '#0c4a6e',
  badgeText: '#7dd3fc',
  accent: '#22d3ee',
  accentGreen: '#34d399',
  accentOrange: '#fbbf24',
  accentRed: '#f87171',
  inputBg: '#1e293b',
  navBg: '#0f172a'
};

interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors: darkTheme,
  isDark: true,
  toggleTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(true); // Default to sleek dark mode

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const colors = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
