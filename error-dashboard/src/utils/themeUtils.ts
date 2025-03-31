import { useTheme, themeColors } from '@/context/ThemeProvider';

/**
 * Hook to get theme-aware colors for charts and UI elements
 */
export const useThemeColors = () => {
  const { theme, isDarkMode } = useTheme();
  
  /**
   * Get color based on error category
   */
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Participant Deletion': return isDarkMode ? '#ff6b6b' : '#ff4d4d';
      case 'Call Update': return isDarkMode ? '#feca57' : '#ffb300';
      case 'HTTP Error': return isDarkMode ? '#ff9f43' : '#ff8000';
      case 'Retry Operation': return isDarkMode ? '#1dd1a1' : '#00b894';
      default: return isDarkMode ? '#5f27cd' : '#4834d4';
    }
  };
  
  /**
   * Get color based on HTTP status code
   */
  const getStatusColor = (code: number) => {
    if (code >= 500) return isDarkMode ? '#ff6b6b' : '#ff4d4d'; // Error
    if (code >= 400) return isDarkMode ? '#feca57' : '#ffb300'; // Warning
    if (code >= 300) return isDarkMode ? '#54a0ff' : '#2e86de'; // Info
    return isDarkMode ? '#1dd1a1' : '#00b894'; // Success
  };
  
  /**
   * Get color based on severity
   */
  const getSeverityColor = (severity: string) => {
    switch(severity.toLowerCase()) {
      case 'error': return isDarkMode ? '#ff6b6b' : '#ff4d4d';
      case 'warning': return isDarkMode ? '#feca57' : '#ffb300';
      case 'info': return isDarkMode ? '#54a0ff' : '#2e86de';
      default: return isDarkMode ? '#a5b1c2' : '#8395a7';
    }
  };
  
  /**
   * Get color for timeline event type
   */
  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'info': return isDarkMode ? '#54a0ff' : '#2e86de';
      case 'warning': return isDarkMode ? '#feca57' : '#ffb300';
      case 'error': return isDarkMode ? '#ff6b6b' : '#ff4d4d';
      case 'critical': return isDarkMode ? '#5f27cd' : '#4834d4';
      default: return isDarkMode ? '#a5b1c2' : '#8395a7';
    }
  };
  
  /**
   * Get base colors for the current theme from CSS variables
   */
  const getBaseColors = () => {
    // Get computed styles to access CSS variables
    const styles = getComputedStyle(document.documentElement);
    
    // Helper function to get CSS variable
    const getCssVar = (name: string) => styles.getPropertyValue(`--${name}`).trim();
    
    // Get the theme hue
    const themeHue = getCssVar('theme-hue');
    
    // Convert HSL values from CSS variables to HSL color strings
    const hslToString = (value: string) => {
      if (!value) return '';
      return `hsl(${value})`;
    };
    
    // Generate theme-based colors
    return {
      primary: hslToString(getCssVar('primary')),
      secondary: hslToString(getCssVar('secondary')),
      accent: hslToString(getCssVar('accent')),
      error: hslToString(getCssVar('destructive')),
      warning: `hsl(${themeHue === '0' ? '30' : themeHue}, 92%, 50%)`,
      info: `hsl(${themeHue === '0' ? '210' : themeHue}, 91%, 60%)`,
      success: `hsl(${themeHue === '0' ? '142' : themeHue}, 76%, 36%)`,
      background: hslToString(getCssVar('background')),
      foreground: hslToString(getCssVar('foreground')),
      card: hslToString(getCssVar('card')),
      cardForeground: hslToString(getCssVar('card-foreground')),
      border: hslToString(getCssVar('border')),
      muted: hslToString(getCssVar('muted')),
      mutedForeground: hslToString(getCssVar('muted-foreground')),
      
      // Chart colors based on theme hue
      chart1: `hsl(${themeHue}, 70%, 50%)`,
      chart2: `hsl(${themeHue}, 60%, 60%)`,
      chart3: `hsl(${themeHue}, 50%, 70%)`,
      chart4: `hsl(${themeHue}, 40%, 80%)`,
      chart5: `hsl(${themeHue}, 30%, 90%)`,
    };
  };
  
  return {
    getCategoryColor,
    getStatusColor,
    getSeverityColor,
    getEventTypeColor,
    colors: getBaseColors(),
    isDarkMode,
  };
};