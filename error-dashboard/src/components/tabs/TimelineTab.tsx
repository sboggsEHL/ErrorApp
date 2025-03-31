import React from 'react';
import { MinuteData, CriticalEventData } from '@/types';
import CriticalTimeline from '@/components/data-display/CriticalTimeline';
import ErrorVolumeBarChart from '@/components/charts/ErrorVolumeBarChart';

/**
 * TimelineTab component props
 */
interface TimelineTabProps {
  /** Error data by minute */
  errorsByMinute: MinuteData[];
  /** Critical events data */
  criticalEvents: CriticalEventData[];
  /** Function to handle time click */
  onTimeClick: (time: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Timeline tab component
 */
export const TimelineTab: React.FC<TimelineTabProps> = ({
  errorsByMinute,
  criticalEvents,
  onTimeClick,
  className = '',
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      <CriticalTimeline 
        events={criticalEvents} 
        onTimeClick={onTimeClick} 
      />
      
      <ErrorVolumeBarChart 
        data={errorsByMinute} 
        onTimeClick={onTimeClick} 
      />
    </div>
  );
};

export default TimelineTab;