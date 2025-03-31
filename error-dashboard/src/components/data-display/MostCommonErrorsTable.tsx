import React from 'react';
import { CommonErrorData } from '@/types';
import { useThemeColors } from '@/utils/themeUtils';
import Card from '@/components/ui/Card';

/**
 * MostCommonErrorsTable component props
 */
interface MostCommonErrorsTableProps {
  /** Most common errors data */
  data: CommonErrorData[];
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * Table showing the most common errors
 */
export const MostCommonErrorsTable: React.FC<MostCommonErrorsTableProps> = ({
  data,
  className = '',
  fullWidth = true,
}) => {
  const { getCategoryColor, getSeverityColor } = useThemeColors();
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card title="Top 5 Most Common Errors" className={className} fullWidth={fullWidth}>
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Top 5 Most Common Errors" className={className} fullWidth={fullWidth}>
      <p className="text-sm text-muted-foreground mb-3">
        These are the most frequently occurring errors and should be prioritized for troubleshooting
      </p>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Error Message</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Count</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Severity</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.map((error, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
                <td className="px-4 py-3 text-sm truncate max-w-md">{error.message}</td>
                <td className="px-4 py-3 text-sm font-bold">{error.count}</td>
                <td className="px-4 py-3">
                  {error.category && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getCategoryColor(error.category) }}
                    >
                      {error.category}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {error.severity && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getSeverityColor(error.severity) }}
                    >
                      {error.severity.charAt(0).toUpperCase() + error.severity.slice(1)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default MostCommonErrorsTable;