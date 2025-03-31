import React from 'react';
import { ErrorData, MinuteData } from '@/types';
import CascadeFailuresView from '@/components/data-display/CascadeFailuresView';
import ErrorPatternAnalysisView from '@/components/data-display/ErrorPatternAnalysisView';

/**
 * PatternsTab component props
 */
interface PatternsTabProps {
  /** Cascade patterns data */
  cascadePatterns: ErrorData[][];
  /** Error data */
  errorData: ErrorData[];
  /** Timeline data */
  timelineData: MinuteData[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * Error patterns tab component
 */
export const PatternsTab: React.FC<PatternsTabProps> = ({
  cascadePatterns,
  errorData,
  timelineData,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      <CascadeFailuresView data={cascadePatterns} />
      
      <ErrorPatternAnalysisView 
        errorData={errorData} 
        timelineData={timelineData} 
      />
    </div>
  );
};

export default PatternsTab;