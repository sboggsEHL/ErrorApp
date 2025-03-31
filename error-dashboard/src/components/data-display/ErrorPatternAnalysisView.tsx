import React from 'react';
import { ErrorData, MinuteData } from '@/types';
import Card from '@/components/ui/Card';

/**
 * ErrorPatternAnalysisView component props
 */
interface ErrorPatternAnalysisViewProps {
  /** Error data */
  errorData: ErrorData[];
  /** Timeline data */
  timelineData: MinuteData[];
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * View showing error pattern analysis
 */
export const ErrorPatternAnalysisView: React.FC<ErrorPatternAnalysisViewProps> = ({
  errorData,
  timelineData,
  className = '',
  fullWidth = false,
}) => {
  // Calculate error density
  const errorDensity = timelineData.length > 0 
    ? (errorData.length / timelineData.length).toFixed(2) 
    : '0';
  
  // Find peak error minute
  const peakErrorMinute = timelineData.length > 0 
    ? [...timelineData].sort((a, b) => b.errors - a.errors)[0] 
    : null;
  
  // Calculate HTTP and participant error correlation
  const httpParticipantOverlap = timelineData.filter(m => m.http_errors > 0 && m.participant_errors > 0).length;
  
  // Check if call errors increased independently of HTTP errors
  const callErrorsIndependent = timelineData.filter(m => m.call_errors > 2 * m.http_errors).length > 0;
  
  // If no data, show empty state
  if (!errorData.length || !timelineData.length) {
    return (
      <Card title="Error Pattern Analysis" className={className} fullWidth={fullWidth}>
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">No data available for pattern analysis</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Error Pattern Analysis" className={className} fullWidth={fullWidth}>
      <div>
        <div className="mb-4 border border-border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 font-medium">
            Temporal Patterns
          </div>
          <div className="p-3 bg-card">
            <p className="mb-2">
              Error density: <span className="font-medium">{errorDensity}</span> errors per minute
            </p>
            {peakErrorMinute && (
              <p>
                Peak error minute: <span className="font-medium">{peakErrorMinute.time}</span> ({peakErrorMinute.errors} errors)
              </p>
            )}
          </div>
        </div>
        
        <div className="mb-4 border border-border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 font-medium">
            Correlation Analysis
          </div>
          <div className="p-3 bg-card">
            <p className="mb-2">
              HTTP errors strongly correlate with participant errors ({httpParticipantOverlap} minutes overlap)
            </p>
            <p>
              {callErrorsIndependent
                ? 'Call errors increased independently of HTTP errors in some time periods, suggesting client-side issues.'
                : 'Call errors closely tracked HTTP errors, suggesting API dependency.'
              }
            </p>
          </div>
        </div>
        
        <div className="border border-border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-3 font-medium">
            Error Distribution
          </div>
          <div className="p-3 bg-card">
            <p className="mb-2">
              Error types: {Object.entries(
                errorData.reduce((acc, error) => {
                  if (error.category) {
                    acc[error.category] = (acc[error.category] || 0) + 1;
                  }
                  return acc;
                }, {} as Record<string, number>)
              ).map(([category, count], index, array) => (
                <span key={category}>
                  <span className="font-medium">{category}</span> ({count})
                  {index < array.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
            <p>
              Severity distribution: {Object.entries(
                errorData.reduce((acc, error) => {
                  if (error.severity) {
                    acc[error.severity] = (acc[error.severity] || 0) + 1;
                  }
                  return acc;
                }, {} as Record<string, number>)
              ).map(([severity, count], index, array) => (
                <span key={severity}>
                  <span className="font-medium">{severity}</span> ({count})
                  {index < array.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ErrorPatternAnalysisView;