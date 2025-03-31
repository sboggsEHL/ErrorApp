import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { ThemeColor } from '@/types';

/**
 * ThemeSwitcher component props
 */
interface ThemeSwitcherProps {
  className?: string;
}

/**
 * ThemeSwitcher component that allows switching between different themes
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className = '' }) => {
  const { theme, setTheme, isDarkMode, setDarkMode } = useTheme();

  /**
   * Theme options with their display names and colors
   */
  const themeOptions: { value: ThemeColor; label: string; color: string }[] = [
    { value: 'default', label: 'Default', color: 'bg-primary' },
    { value: 'green', label: 'Green', color: 'bg-[hsl(143,62%,27%)]' },
    { value: 'red', label: 'Red', color: 'bg-[hsl(0,74.7%,15.5%)]' },
    { value: 'purple', label: 'Purple', color: 'bg-[hsl(243.4,75.4%,58.6%)]' },
    { value: 'blue', label: 'Blue', color: 'bg-[hsl(217.2,91.2%,59.8%)]' },
  ];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="theme-switcher">
        {themeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              console.log('Theme button clicked:', option.value);
              setTheme(option.value);
            }}
            className={`theme-button group ${theme === option.value ? 'active' : ''}`}
            title={option.label}
            aria-label={`Switch to ${option.label} theme`}
          >
            <span className={`block w-6 h-6 rounded-md ${option.color} shadow-lg transition-transform group-hover:scale-110`} />
          </button>
        ))}
      </div>

      <button
        onClick={() => setDarkMode(!isDarkMode)}
        className="theme-button group relative px-4 py-2"
        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        <span className="relative z-10 text-sm font-medium text-primary-foreground">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
        <div className="absolute inset-0 rounded-md bg-primary opacity-10 group-hover:opacity-20 transition-opacity" />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
