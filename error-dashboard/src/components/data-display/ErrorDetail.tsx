import React from 'react';
import { ErrorData } from '@/types';
import { useThemeColors } from '@/utils/themeUtils';
import { formatTimestamp } from '@/utils/filterUtils';
import Card from '@/components/ui/Card';

/**
 * ErrorDetail component props
 */
interface ErrorDetailProps {
  /** Error data */
  error: ErrorData;
  /** Function to close the detail view */
  onClose: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component for displaying detailed error information
 */
export const ErrorDetail: React.FC<ErrorDetailProps> = ({
  error,
  onClose,
  className = '',
}) => {
  const { getCategoryColor, getStatusColor, getSeverityColor } = useThemeColors();
  
  /**
   * Format value for display
   */
  const formatValue = (key: string, value: any) => {
    if (key === 'details_json' && value) {
      try {
        return <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/30 p-2 rounded overflow-auto max-h-40">{JSON.stringify(JSON.parse(value), null, 2)}</pre>;
      } catch {
        return value;
      }
    }
    
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">null</span>;
    }
    
    if (typeof value === 'object') {
      return <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/30 p-2 rounded overflow-auto max-h-40">{JSON.stringify(value, null, 2)}</pre>;
    }
    
    return value.toString();
  };

  return (
    <Card 
      title="Error Details" 
      className={className}
      action={
        <button 
          className="px-3 py-1 bg-muted hover:bg-muted/80 rounded text-sm font-medium"
          onClick={onClose}
        >
          Back to List
        </button>
      }
    >
      <div className="mb-4">
        <div className="border border-border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 font-medium">
            Error Message
          </div>
          <div className="p-3 bg-card">
            <p className="font-medium">{error.error_message || 'No error message'}</p>
            {error.full_log && (
              <pre className="mt-2 text-sm whitespace-pre-wrap font-mono bg-muted/30 p-2 rounded overflow-auto max-h-40">{error.full_log}</pre>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-md font-medium mb-2">Basic Information</h3>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-1 pr-2 text-sm font-medium text-muted-foreground">Time</td>
                <td className="py-1 text-sm">{formatTimestamp(error.timestamp)}</td>
              </tr>
              <tr>
                <td className="py-1 pr-2 text-sm font-medium text-muted-foreground">Category</td>
                <td className="py-1 text-sm">
                  {error.category && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getCategoryColor(error.category) }}
                    >
                      {error.category}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-1 pr-2 text-sm font-medium text-muted-foreground">Severity</td>
                <td className="py-1 text-sm">
                  {error.severity && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getSeverityColor(error.severity) }}
                    >
                      {error.severity}
                    </span>
                  )}
                </td>
              </tr>
              {error.status_code && (
                <tr>
                  <td className="py-1 pr-2 text-sm font-medium text-muted-foreground">Status Code</td>
                  <td className="py-1 text-sm">
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: getStatusColor(error.status_code) }}
                    >
                      HTTP {error.status_code}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Additional Properties</h3>
          <div className="overflow-auto max-h-40 border border-border rounded">
            <table className="w-full">
              <tbody>
                {Object.entries(error)
                  .filter(([key]) => !['timestamp', 'time_key', 'severity', 'category', 'error_message', 'full_log', 'status_code', 'id'].includes(key))
                  .map(([key, value]) => (
                    <tr key={key} className="border-b border-border last:border-0">
                      <td className="py-1 px-2 text-sm font-medium text-muted-foreground">{key}</td>
                      <td className="py-1 px-2 text-sm">{formatValue(key, value)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ErrorDetail;