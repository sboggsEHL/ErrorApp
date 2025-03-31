import React, { useState } from 'react';
import Card from '@/components/ui/Card';

/**
 * ErrorExamplesList component props
 */
interface ErrorExamplesListProps {
  /** Error examples data */
  data: Record<string, string>;
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * List of error examples with code blocks
 */
export const ErrorExamplesList: React.FC<ErrorExamplesListProps> = ({
  data,
  className = '',
  fullWidth = true,
}) => {
  // State to track expanded examples
  const [expandedExamples, setExpandedExamples] = useState<Record<string, boolean>>({});
  
  // Toggle expanded state for an example
  const toggleExpanded = (key: string) => {
    setExpandedExamples(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // If no data, show empty state
  if (!data || Object.keys(data).length === 0) {
    return (
      <Card title="Error Examples" className={className} fullWidth={fullWidth}>
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">No error examples available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Error Examples" className={className} fullWidth={fullWidth}>
      <div>
        {Object.entries(data).map(([key, example]) => (
          <div key={key} className="mb-4 border border-border rounded-md overflow-hidden">
            <div 
              className="bg-muted/50 p-3 font-medium flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpanded(key)}
            >
              <span>{key}</span>
              <span className="text-sm text-muted-foreground">
                {expandedExamples[key] ? '▼' : '▶'}
              </span>
            </div>
            {expandedExamples[key] && (
              <div className="p-3 bg-card">
                <pre className="whitespace-pre-wrap text-sm font-mono bg-muted/30 p-3 rounded overflow-auto max-h-60">
                  {example}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ErrorExamplesList;