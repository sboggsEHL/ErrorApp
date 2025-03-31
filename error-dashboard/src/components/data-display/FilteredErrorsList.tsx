import React from 'react';
import { ErrorData } from '@/types';
import { useThemeColors } from '@/utils/themeUtils';
import { formatTimestamp } from '@/utils/filterUtils';
import Card from '@/components/ui/Card';

/**
 * FilteredErrorsList component props
 */
interface FilteredErrorsListProps {
  /** Filtered error data */
  errors: ErrorData[];
  /** Function to handle error click */
  onErrorClick: (error: ErrorData) => void;
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * Component for displaying a list of filtered errors
 */
export const FilteredErrorsList: React.FC<FilteredErrorsListProps> = ({
  errors,
  onErrorClick,
  className = '',
  fullWidth = true,
}) => {
  const { getCategoryColor, getSeverityColor } = useThemeColors();
  
  // If no errors, show empty state
  if (!errors || errors.length === 0) {
    return (
      <Card title="Filtered Errors" className={className} fullWidth={fullWidth}>
        <div className="text-center p-4">
          <p className="text-muted-foreground">No errors match the selected filters</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Filtered Errors" className={className} fullWidth={fullWidth}>
      <div className="overflow-auto max-h-96">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Severity</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {errors.slice(0, 100).map((error, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                <td className="px-3 py-2 text-sm">{formatTimestamp(error.timestamp)}</td>
                <td className="px-3 py-2">
                  {error.category && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getCategoryColor(error.category) }}
                    >
                      {error.category}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {error.severity && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getSeverityColor(error.severity) }}
                    >
                      {error.severity}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm truncate max-w-xs">{error.error_message || 'No message'}</td>
                <td className="px-3 py-2 text-sm">
                  <button
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800"
                    onClick={() => onErrorClick(error)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {errors.length > 100 && (
          <div className="text-center p-2 text-sm text-muted-foreground">
            Showing 100 of {errors.length} errors
          </div>
        )}
      </div>
    </Card>
  );
};

export default FilteredErrorsList;