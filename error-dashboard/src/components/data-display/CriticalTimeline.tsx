import React from 'react';
import { CriticalEventData } from '@/types';
import { useThemeColors } from '@/utils/themeUtils';
import { Clock, AlertTriangle, Terminal, ArrowDownCircle } from 'lucide-react';
import Card from '@/components/ui/Card';

/**
 * CriticalTimeline component props
 */
interface CriticalTimelineProps {
  /** Critical events data */
  events: CriticalEventData[];
  /** Function to handle time click */
  onTimeClick: (time: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * Component for displaying a timeline of critical events
 */
export const CriticalTimeline: React.FC<CriticalTimelineProps> = ({
  events,
  onTimeClick,
  className = '',
  fullWidth = true,
}) => {
  const { getEventTypeColor } = useThemeColors();
  
  /**
   * Render icon for event type
   */
  const renderEventIcon = (type: string) => {
    switch(type) {
      case 'info':
        return <Terminal size={16} />;
      case 'warning':
        return <AlertTriangle size={16} />;
      case 'error':
        return <AlertTriangle size={16} />;
      case 'critical':
        return <ArrowDownCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };
  
  // If no events, show empty state
  if (!events || events.length === 0) {
    return (
      <Card title="System Crash Timeline" className={className} fullWidth={fullWidth}>
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">No timeline events available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="System Crash Timeline" className={className} fullWidth={fullWidth}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {/* Timeline events */}
        <div className="space-y-6 relative">
          {events.map((event, index) => {
            const color = getEventTypeColor(event.type);
            
            return (
              <div 
                key={index} 
                className="ml-10 relative cursor-pointer hover:bg-muted/20 p-2 rounded transition-colors"
                onClick={() => onTimeClick(event.time)}
              >
                {/* Event icon */}
                <div 
                  className="absolute -left-10 w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ 
                    backgroundColor: `${color}20`,
                    color: color,
                    border: `2px solid ${color}`
                  }}
                >
                  {renderEventIcon(event.type)}
                </div>
                
                {/* Event time */}
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  {event.time}
                </div>
                
                {/* Event title */}
                <div 
                  className="text-base font-medium mb-1"
                  style={{ color }}
                >
                  {event.event}
                </div>
                
                {/* Event details */}
                <div className="text-sm text-foreground">
                  {event.details}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-3 text-sm text-center text-muted-foreground">
        Click on any timeline event to see errors from that specific time
      </div>
    </Card>
  );
};

export default CriticalTimeline;