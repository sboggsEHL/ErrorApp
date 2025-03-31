import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { StatusData } from '@/types';
import Card from '@/components/ui/Card';

/**
 * Custom tooltip component for the pie chart
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card text-card-foreground p-2 border border-border rounded shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm">
          Count: <span className="font-medium">{payload[0].value}</span>
        </p>
        <p className="text-sm">
          Percentage: <span className="font-medium">
            {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Custom label component for the pie chart
 */
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * HttpStatusPieChart component props
 */
interface HttpStatusPieChartProps {
  /** HTTP status data */
  data: StatusData[];
  /** Function to handle status click */
  onStatusClick: (status: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pie chart showing HTTP status codes
 */
export const HttpStatusPieChart: React.FC<HttpStatusPieChartProps> = ({
  data,
  onStatusClick,
  className = '',
}) => {
  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  // Add total to each data item for tooltip
  const dataWithTotal = data.map(item => ({
    ...item,
    total
  }));
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card title="HTTP Status Codes" className={className}>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="HTTP Status Codes" className={className}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              onClick={(data) => onStatusClick(data.name)}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-sm text-center text-muted-foreground">
        Click on any status code to filter errors with that HTTP status
      </div>
    </Card>
  );
};

export default HttpStatusPieChart;