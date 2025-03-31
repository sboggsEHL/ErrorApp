import React from 'react';
import { getActiveFilters } from '@/utils/filterUtils';

/**
 * ActiveFilters component props
 */
interface ActiveFiltersProps {
  /** Selected category filter */
  selectedCategory: string | null;
  /** Selected time filter */
  selectedTime: string | null;
  /** Selected status filter */
  selectedStatus: string | null;
  /** Selected severity filter */
  selectedSeverity: string | null;
  /** Function to set category filter */
  setSelectedCategory: (category: string | null) => void;
  /** Function to set time filter */
  setSelectedTime: (time: string | null) => void;
  /** Function to set status filter */
  setSelectedStatus: (status: string | null) => void;
  /** Function to set severity filter */
  setSelectedSeverity: (severity: string | null) => void;
  /** Function to reset all filters */
  resetFilters: () => void;
  /** Number of filtered errors */
  filteredCount: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ActiveFilters component for displaying and managing active filters
 */
export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedCategory,
  selectedTime,
  selectedStatus,
  selectedSeverity,
  setSelectedCategory,
  setSelectedTime,
  setSelectedStatus,
  setSelectedSeverity,
  resetFilters,
  filteredCount,
  className = '',
}) => {
  // Get active filters
  const activeFilters = getActiveFilters(
    selectedCategory,
    selectedTime,
    selectedStatus,
    selectedSeverity
  );

  // If no active filters, don't render anything
  if (activeFilters.length === 0) {
    return null;
  }

  /**
   * Handle removing a filter
   */
  const handleRemoveFilter = (type: string) => {
    switch (type) {
      case 'category':
        setSelectedCategory(null);
        break;
      case 'time':
        setSelectedTime(null);
        break;
      case 'status':
        setSelectedStatus(null);
        break;
      case 'severity':
        setSelectedSeverity(null);
        break;
    }
  };

  return (
    <div className={`p-3 bg-card border border-border rounded ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          <span className="font-medium text-foreground">Active Filters:</span>
          
          {activeFilters.map((filter) => (
            <span 
              key={filter.type}
              className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-medium flex items-center cursor-pointer hover:bg-accent/90"
              onClick={() => handleRemoveFilter(filter.type)}
            >
              {filter.label}
              <span className="ml-1">×</span>
            </span>
          ))}
        </div>
        
        <button
          className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium hover:bg-secondary/90 transition-colors"
          onClick={resetFilters}
        >
          Clear All
        </button>
      </div>
      
      <div className="mt-2">
        <p className="text-sm text-muted-foreground">
          Found {filteredCount} errors matching your criteria
        </p>
      </div>
    </div>
  );
};

export default ActiveFilters;
