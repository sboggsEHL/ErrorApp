import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MinuteData } from '@/types';
import { useChartConfig } from '@/utils/chartUtils';
import Card from '@/components/ui/Card';

/**
 * Custom tooltip component for the bar chart
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card text-card-foreground p-2 border border-border rounded shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * ErrorVolumeBarChart component props
 */
interface ErrorVolumeBarChartProps {
  /** Error data by minute */
  data: MinuteData[];
  /** Function to handle time click */
  onTimeClick: (time: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * Bar chart showing error volume over time
 */
export const ErrorVolumeBarChart: React.FC<ErrorVolumeBarChartProps> = ({
  data,
  onTimeClick,
  className = '',
  fullWidth = true,
}) => {
  const { chartMargins, getTimelineColors, formatTimeLabel } = useChartConfig();
  const colors = getTimelineColors();
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card title="Error Volume Over Time" className={className} fullWidth={fullWidth}>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Error Volume Over Time" className={className} fullWidth={fullWidth}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={chartMargins}
            onClick={(data) => {
              if (data && data.activePayload && data.activePayload.length > 0) {
                onTimeClick(data.activePayload[0].payload.time);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTimeLabel}
              minTickGap={30}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="errors" 
              name="Errors" 
              fill={colors.errors} 
              cursor="pointer" 
            />
            <Bar 
              dataKey="warnings" 
              name="Warnings" 
              fill={colors.warnings} 
              cursor="pointer" 
            />
            <Bar 
              dataKey="participant_errors" 
              name="Participant Errors" 
              fill={colors.participant_errors} 
              cursor="pointer" 
            />
            <Bar 
              dataKey="call_errors" 
              name="Call Errors" 
              fill={colors.call_errors} 
              cursor="pointer" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-sm text-center text-muted-foreground">
        Click on any bar to filter errors from that time period
      </div>
    </Card>
  );
};

export default ErrorVolumeBarChart;