import React from 'react';
import { RootCauseData } from '@/types';
import Card from '@/components/ui/Card';

/**
 * RootCauseAnalysisTable component props
 */
interface RootCauseAnalysisTableProps {
  /** Root cause analysis data */
  data: RootCauseData[];
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * Table showing root cause analysis
 */
export const RootCauseAnalysisTable: React.FC<RootCauseAnalysisTableProps> = ({
  data,
  className = '',
  fullWidth = true,
}) => {
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card title="Root Cause Analysis" className={className} fullWidth={fullWidth}>
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Root Cause Analysis" className={className} fullWidth={fullWidth}>
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Root Cause</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Probability</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Evidence</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.map((cause) => (
              <tr key={cause.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: cause.color }}
                    />
                    <span className="font-medium">{cause.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span 
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      cause.probability === 'High' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {cause.probability}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">{cause.evidence}</td>
                <td className="px-6 py-4 text-sm text-foreground">{cause.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RootCauseAnalysisTable;