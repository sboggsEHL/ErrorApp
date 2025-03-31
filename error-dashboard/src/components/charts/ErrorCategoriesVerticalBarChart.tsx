import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CategoryData } from '@/types';
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
        <p className="text-sm">
          Count: <span className="font-medium">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * ErrorCategoriesVerticalBarChart component props
 */
interface ErrorCategoriesVerticalBarChartProps {
  /** Error category data */
  data: CategoryData[];
  /** Function to handle category click */
  onCategoryClick: (category: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Vertical bar chart showing error categories
 */
export const ErrorCategoriesVerticalBarChart: React.FC<ErrorCategoriesVerticalBarChartProps> = ({
  data,
  onCategoryClick,
  className = '',
}) => {
  const { verticalChartMargins } = useChartConfig();
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <Card title="Error Categories" className={className}>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Error Categories" className={className}>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={verticalChartMargins}
            onClick={(data) => {
              if (data && data.activePayload && data.activePayload.length > 0) {
                onCategoryClick(data.activePayload[0].payload.name);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" cursor="pointer">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-sm text-center text-muted-foreground">
        Click on any category to see errors of that specific type
      </div>
    </Card>
  );
};

export default ErrorCategoriesVerticalBarChart;