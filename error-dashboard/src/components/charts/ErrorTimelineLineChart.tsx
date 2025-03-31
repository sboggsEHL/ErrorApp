import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MinuteData } from '@/types';
import { useChartConfig } from '@/utils/chartUtils';
import Card from '@/components/ui/Card';

/**
 * Custom tooltip component for the line chart
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
 * ErrorTimelineLineChart component props
 */
interface ErrorTimelineLineChartProps {
  /** Error data by minute */
  data: MinuteData[];
  /** Additional CSS classes */
  className?: string;
  /** Full width flag */
  fullWidth?: boolean;
}

/**
 * Line chart showing errors over time
 */
export const ErrorTimelineLineChart: React.FC<ErrorTimelineLineChartProps> = ({
  data,
  className = '',
  fullWidth = true,
}) => {
  const { chartMargins, getTimelineColors, formatTimeLabel } = useChartConfig();
  const colors = getTimelineColors();
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card title="Error Timeline" className={className} fullWidth={fullWidth}>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Error Timeline" className={className} fullWidth={fullWidth}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={chartMargins}
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
            <Line 
              type="monotone" 
              dataKey="errors" 
              name="Errors"
              stroke={colors.errors} 
              activeDot={{ r: 8 }} 
            />
            <Line 
              type="monotone" 
              dataKey="warnings" 
              name="Warnings"
              stroke={colors.warnings} 
            />
            <Line 
              type="monotone" 
              dataKey="http_errors" 
              name="HTTP Errors"
              stroke={colors.http_errors} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ErrorTimelineLineChart;