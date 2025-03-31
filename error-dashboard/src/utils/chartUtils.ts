import { useThemeColors } from './themeUtils';
import { CategoryData, StatusData, SeverityData, MinuteData } from '@/types';

/**
 * Hook to get chart configuration and helper functions
 */
export const useChartConfig = () => {
  const { colors, getCategoryColor, getStatusColor, getSeverityColor } = useThemeColors();
  
  /**
   * Common chart margins
   */
  const chartMargins = {
    top: 5,
    right: 30,
    left: 20,
    bottom: 5,
  };
  
  /**
   * Extended chart margins for vertical charts
   */
  const verticalChartMargins = {
    top: 5,
    right: 30,
    left: 60,
    bottom: 5,
  };
  
  /**
   * Custom tooltip styles
   */
  const tooltipStyle = {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: '4px',
    padding: '8px 12px',
    color: colors.cardForeground,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };
  
  /**
   * Format percentage for pie chart labels
   */
  const formatPieChartLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };
  
  /**
   * Get colors for error categories chart
   */
  const getCategoryChartColors = (data: CategoryData[]) => {
    return data.map(entry => getCategoryColor(entry.name));
  };
  
  /**
   * Get colors for HTTP status chart
   */
  const getStatusChartColors = (data: StatusData[]) => {
    return data.map(entry => {
      const code = parseInt(entry.name.replace('HTTP ', ''));
      return getStatusColor(code);
    });
  };
  
  /**
   * Get colors for severity distribution chart
   */
  const getSeverityChartColors = (data: SeverityData[]) => {
    return data.map(entry => getSeverityColor(entry.name.toLowerCase()));
  };
  
  /**
   * Get line colors for timeline chart
   */
  const getTimelineColors = () => {
    return {
      errors: colors.error,
      warnings: colors.warning,
      http_errors: colors.info,
      participant_errors: '#ff9f43',
      call_errors: '#5f27cd',
    };
  };
  
  /**
   * Format time for x-axis labels
   */
  const formatTimeLabel = (time: string) => {
    // If time is in format HH:MM:SS, return HH:MM
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
      return time.substring(0, 5);
    }
    return time;
  };
  
  /**
   * Get domain for y-axis based on data
   */
  const getYAxisDomain = (data: MinuteData[], keys: string[]) => {
    const maxValue = Math.max(
      ...data.map(item => 
        Math.max(...keys.map(key => (item as any)[key] || 0))
      )
    );
    
    // Add 10% padding to the top
    return [0, Math.ceil(maxValue * 1.1)];
  };
  
  return {
    chartMargins,
    verticalChartMargins,
    tooltipStyle,
    formatPieChartLabel,
    getCategoryChartColors,
    getStatusChartColors,
    getSeverityChartColors,
    getTimelineColors,
    formatTimeLabel,
    getYAxisDomain,
    colors,
  };
};