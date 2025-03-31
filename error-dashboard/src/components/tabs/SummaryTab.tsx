import React from 'react';
import { CategoryData, SeverityData, MinuteData, RootCauseData, CommonErrorData } from '@/types';
import ErrorCategoriesBarChart from '@/components/charts/ErrorCategoriesBarChart';
import ErrorTimelineLineChart from '@/components/charts/ErrorTimelineLineChart';
import SeverityDistributionPieChart from '@/components/charts/SeverityDistributionPieChart';
import MostCommonErrorsTable from '@/components/data-display/MostCommonErrorsTable';
import RootCauseAnalysisTable from '@/components/data-display/RootCauseAnalysisTable';

interface SummaryTabProps {
  errorsByCategory: CategoryData[];
  severityDistribution: SeverityData[];
  errorsByMinute: MinuteData[];
  rootCauses: RootCauseData[];
  mostCommonErrors: CommonErrorData[];
  onCategoryClick: (category: string) => void;
  onSeverityClick: (severity: string) => void;
}

const SummaryTab: React.FC<SummaryTabProps> = ({
  errorsByCategory,
  severityDistribution,
  errorsByMinute,
  rootCauses,
  mostCommonErrors,
  onCategoryClick,
  onSeverityClick,
}) => {
  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Error Categories</h3>
          <div className="h-64">
            <ErrorCategoriesBarChart 
              data={errorsByCategory} 
              onCategoryClick={onCategoryClick} 
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Severity Distribution</h3>
          <div className="h-64">
            <SeverityDistributionPieChart 
              data={severityDistribution} 
              onSeverityClick={onSeverityClick} 
            />
          </div>
        </div>
      </div>
      
      {/* Timeline Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Error Timeline</h3>
        <div className="h-72">
          <ErrorTimelineLineChart 
            data={errorsByMinute} 
          />
        </div>
      </div>
      
      {/* Data Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Most Common Errors</h3>
          <MostCommonErrorsTable data={mostCommonErrors} />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-200">Root Cause Analysis</h3>
          <RootCauseAnalysisTable data={rootCauses} />
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
