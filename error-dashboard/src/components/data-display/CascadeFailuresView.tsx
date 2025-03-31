import React, { useState } from 'react';
import { ErrorData } from '@/types';
import { useThemeColors } from '@/utils/themeUtils';
import Card from '@/components/ui/Card';

/**
 * CascadeFailuresView component props
 */
interface CascadeFailuresViewProps {
  /** Cascade patterns data */
  data: ErrorData[][];
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * View showing cascade failure patterns
 */
export const CascadeFailuresView: React.FC<CascadeFailuresViewProps> = ({
  data,
  className = '',
  fullWidth = false,
}) => {
  // State to track expanded cascades
  const [expandedCascades, setExpandedCascades] = useState<Record<number, boolean>>({});
  const { getCategoryColor } = useThemeColors();
  
  // Toggle expanded state for a cascade
  const toggleExpanded = (index: number) => {
    setExpandedCascades(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Calculate time difference between first and last error in a cascade
  const calculateTimeDifference = (cascade: ErrorData[]): string => {
    try {
      if (!Array.isArray(cascade) || cascade.length === 0) {
        return 'unknown time period';
      }

      const lastError = cascade[cascade.length - 1];
      const firstError = cascade[0];
      
      if (!lastError?.timestamp || !firstError?.timestamp) {
        return 'unknown time period';
      }
      
      const endTime = new Date(lastError.timestamp);
      const startTime = new Date(firstError.timestamp);
      return `${endTime.getTime() - startTime.getTime()}ms`;
    } catch {
      return 'unknown time period';
    }
  };
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card title="Cascade Failure Patterns" className={className} fullWidth={fullWidth}>
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">No cascade patterns detected</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Cascade Failure Patterns" className={className} fullWidth={fullWidth}>
      <p className="mb-4">Identified {data.length} potential error cascades (3+ errors within 500ms)</p>
      
      <div>
        {data.slice(0, 3).map((cascade, index) => (
          <div key={index} className="mb-4 border border-border rounded-md overflow-hidden">
            <div 
              className="bg-muted/50 p-3 font-medium flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpanded(index)}
            >
              <span>Cascade Pattern #{index + 1}</span>
              <span className="text-sm text-muted-foreground">
                {expandedCascades[index] ? '▼' : '▶'}
              </span>
            </div>
            {expandedCascades[index] && (
              <div className="p-3 bg-card">
                <p className="text-sm mb-2">
                  {cascade.length} errors in {calculateTimeDifference(cascade)}
                </p>
                
                <div className="overflow-auto max-h-60">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Message</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {cascade.map((error, errorIndex) => (
                        <tr key={errorIndex} className={errorIndex % 2 === 0 ? 'bg-card' : 'bg-muted/20'}>
                          <td className="px-3 py-2 text-sm">
                            {error.timestamp?.split('T')[1]?.split('.')[0] || 'unknown'}
                          </td>
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
                          <td className="px-3 py-2 text-sm truncate max-w-xs">
                            {error.error_message || 'No message'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CascadeFailuresView;