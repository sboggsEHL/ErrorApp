import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeColor } from '@/types';

/**
 * Theme context type definition
 */
interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
  isDarkMode: boolean;
  setDarkMode: (isDark: boolean) => void;
}

/**
 * Create the theme context with default values
 */
const ThemeContext = createContext<ThemeContextType>({
  theme: 'default',
  setTheme: () => {},
  isDarkMode: false,
  setDarkMode: () => {},
});

/**
 * Theme provider props
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Available theme colors
 */
export const themeColors = ['default', 'green', 'red', 'purple', 'blue'];

/**
 * ThemeProvider component that manages theme state
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Get initial theme from localStorage or use default
  const [theme, setTheme] = useState<ThemeColor>(() => {
    const savedTheme = localStorage.getItem('theme-color');
    return (savedTheme as ThemeColor) || 'default';
  });

  // Get initial dark mode from localStorage or system preference
  const [isDarkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme-color', theme);
  }, [theme]);

  // Update localStorage when dark mode changes
  useEffect(() => {
    console.log('Dark mode changed to:', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('dark-mode', isDarkMode.toString());
    
    // Toggle dark class on document
    document.documentElement.classList.toggle('dark', isDarkMode);
    
    // Log the current state
    console.log('Dark mode class applied:', isDarkMode);
    console.log('Current classes on documentElement:', document.documentElement.className);
    
    // Make sure data-theme attribute is still set
    const currentTheme = document.documentElement.getAttribute('data-theme');
    console.log('Current data-theme attribute:', currentTheme);
  }, [isDarkMode]);

  // Apply theme when theme changes
  useEffect(() => {
    console.log('Theme changed to:', theme);
    
    // Apply theme by setting data-theme attribute
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update CSS variables based on theme
    const root = document.documentElement;
    root.style.setProperty('--theme-hue', getThemeHue(theme));
    
    // Force a repaint to ensure styles are applied
    const bodyElement = document.body;
    if (bodyElement) {
      // Temporarily hide the body to avoid flickering
      const originalDisplay = bodyElement.style.display;
      bodyElement.style.display = 'none';
      
      // Trigger a reflow
      void bodyElement.offsetHeight;
      
      // Restore the original display
      bodyElement.style.display = originalDisplay;
    }
  }, [theme]);

  // Helper function to get theme hue
  const getThemeHue = (theme: ThemeColor): string => {
    switch (theme) {
      case 'green':
        return '142';
      case 'red':
        return '0';
      case 'purple':
        return '263.4';
      case 'blue':
      case 'default':
      default:
        return '217.2';
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use the theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
