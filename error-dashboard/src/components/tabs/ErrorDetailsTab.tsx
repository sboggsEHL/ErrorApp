import React from 'react';
import { StatusData, CategoryData } from '@/types';
import HttpStatusPieChart from '@/components/charts/HttpStatusPieChart';
import ErrorCategoriesVerticalBarChart from '@/components/charts/ErrorCategoriesVerticalBarChart';
import ErrorExamplesList from '@/components/data-display/ErrorExamplesList';

/**
 * ErrorDetailsTab component props
 */
interface ErrorDetailsTabProps {
  /** HTTP status data */
  errorsByStatus: StatusData[];
  /** Error categories data */
  errorsByCategory: CategoryData[];
  /** Error examples data */
  errorExamples: Record<string, string>;
  /** Function to handle status click */
  onStatusClick: (status: string) => void;
  /** Function to handle category click */
  onCategoryClick: (category: string) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Error details tab component
 */
export const ErrorDetailsTab: React.FC<ErrorDetailsTabProps> = ({
  errorsByStatus,
  errorsByCategory,
  errorExamples,
  onStatusClick,
  onCategoryClick,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      <HttpStatusPieChart 
        data={errorsByStatus} 
        onStatusClick={onStatusClick} 
      />
      
      <ErrorCategoriesVerticalBarChart 
        data={errorsByCategory} 
        onCategoryClick={onCategoryClick} 
      />
      
      <div className="col-span-1 md:col-span-2">
        <ErrorExamplesList data={errorExamples} />
      </div>
    </div>
  );
};

export default ErrorDetailsTab;