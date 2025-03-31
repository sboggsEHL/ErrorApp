import { ErrorData } from '@/types';

/**
 * Filter errors based on selected criteria
 */
export const filterErrors = (
  errors: ErrorData[],
  selectedCategory: string | null,
  selectedTime: string | null,
  selectedStatus: string | null,
  selectedSeverity: string | null
): ErrorData[] => {
  if (!errors.length) return [];
  
  let filtered = [...errors];
  
  // Filter by category
  if (selectedCategory) {
    filtered = filtered.filter(err => err.category === selectedCategory);
  }
  
  // Filter by time
  if (selectedTime) {
    filtered = filtered.filter(err => err.time_key === selectedTime);
  }
  
  // Filter by status code
  if (selectedStatus) {
    const statusCode = parseInt(selectedStatus.replace('HTTP ', ''));
    filtered = filtered.filter(err => err.status_code === statusCode);
  }
  
  // Filter by severity
  if (selectedSeverity) {
    filtered = filtered.filter(err => err.severity === selectedSeverity.toLowerCase());
  }
  
  return filtered;
};

/**
 * Get active filters as an array of objects
 */
export const getActiveFilters = (
  selectedCategory: string | null,
  selectedTime: string | null,
  selectedStatus: string | null,
  selectedSeverity: string | null
) => {
  const filters = [];
  
  if (selectedCategory) {
    filters.push({
      type: 'category',
      value: selectedCategory,
      label: `Category: ${selectedCategory}`,
    });
  }
  
  if (selectedTime) {
    filters.push({
      type: 'time',
      value: selectedTime,
      label: `Time: ${selectedTime}`,
    });
  }
  
  if (selectedStatus) {
    filters.push({
      type: 'status',
      value: selectedStatus,
      label: `Status: ${selectedStatus}`,
    });
  }
  
  if (selectedSeverity) {
    filters.push({
      type: 'severity',
      value: selectedSeverity,
      label: `Severity: ${selectedSeverity}`,
    });
  }
  
  return filters;
};

/**
 * Check if any filters are active
 */
export const hasActiveFilters = (
  selectedCategory: string | null,
  selectedTime: string | null,
  selectedStatus: string | null,
  selectedSeverity: string | null
): boolean => {
  return !!(selectedCategory || selectedTime || selectedStatus || selectedSeverity);
};

/**
 * Sort errors by timestamp (newest first)
 */
export const sortErrorsByTimestamp = (errors: ErrorData[]): ErrorData[] => {
  return [...errors].sort((a, b) => {
    const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
    const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Format timestamp for display
 */
export const formatTimestamp = (timestamp: string | undefined): string => {
  if (!timestamp) return 'Unknown';
  return timestamp.replace('T', ' ').substring(0, 19);
};