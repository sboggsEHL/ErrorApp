import React, { useState, useEffect } from 'react';
import {
  ErrorData,
  TabType,
  MinuteData,
  CriticalEventData,
  CategoryData,
  StatusData,
  RootCauseData,
  SeverityData,
  CommonErrorData
} from '@/types';
import { useThemeColors } from '@/utils/themeUtils';
import { filterErrors, hasActiveFilters } from '@/utils/filterUtils';
import { generateAllSampleData } from '@/utils/sampleData';

import MainLayout from '@/components/layout/MainLayout';
import ActiveFilters from '@/components/ui/ActiveFilters';
import ErrorDetail from '@/components/data-display/ErrorDetail';
import FilteredErrorsList from '@/components/data-display/FilteredErrorsList';
import SummaryTab from '@/components/tabs/SummaryTab';
import TimelineTab from '@/components/tabs/TimelineTab';
import ErrorDetailsTab from '@/components/tabs/ErrorDetailsTab';
import PatternsTab from '@/components/tabs/PatternsTab';

/**
 * Main ErrorDashboard component
 */
const ErrorDashboard: React.FC = () => {
  // Theme colors (used by charts)
  const themeColors = useThemeColors();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  
  // Data state
  const [errorData, setErrorData] = useState<ErrorData[]>([]);
  const [timelineData, setTimelineData] = useState<MinuteData[]>([]);
  const [criticalEvents, setCriticalEvents] = useState<CriticalEventData[]>([]);
  const [errorExamples, setErrorExamples] = useState<Record<string, string>>({});
  const [errorsByCategory, setErrorsByCategory] = useState<CategoryData[]>([]);
  const [errorsByMinute, setErrorsByMinute] = useState<MinuteData[]>([]);
  const [errorsByStatus, setErrorsByStatus] = useState<StatusData[]>([]);
  const [cascadePatterns, setCascadePatterns] = useState<ErrorData[][]>([]);
  const [rootCauses, setRootCauses] = useState<RootCauseData[]>([]);
  const [severityDistribution, setSeverityDistribution] = useState<SeverityData[]>([]);
  const [mostCommonErrors, setMostCommonErrors] = useState<CommonErrorData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [filteredErrors, setFilteredErrors] = useState<ErrorData[]>([]);
  
  // Detail view state
  const [detailView, setDetailView] = useState<boolean>(false);
  const [selectedError, setSelectedError] = useState<ErrorData | null>(null);

  // Load and process sample data
  useEffect(() => {
    const loadSampleData = () => {
      try {
        setIsLoading(true);
        
        // Generate sample data
        console.log('Generating sample data for dashboard');
        const sampleData = generateAllSampleData();
        
        // Set state with sample data
        setErrorData(sampleData.errors);
        setTimelineData(sampleData.timelineData);
        setCriticalEvents(sampleData.criticalEvents);
        setErrorExamples(sampleData.errorExamples);
        setErrorsByCategory(sampleData.errorsByCategory);
        setErrorsByMinute(sampleData.timelineData);
        setErrorsByStatus(sampleData.errorsByStatus);
        setCascadePatterns(sampleData.cascadePatterns);
        setRootCauses(sampleData.rootCauses);
        setSeverityDistribution(sampleData.severityDistribution);
        setMostCommonErrors(sampleData.mostCommonErrors);
        
        console.log('Sample data loaded successfully');
      } catch (error) {
        console.error('Error generating sample data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSampleData();
  }, []);

  // Filter errors based on selected criteria
  useEffect(() => {
    if (!errorData.length) return;
    
    const filtered = filterErrors(
      errorData,
      selectedCategory,
      selectedTime,
      selectedStatus,
      selectedSeverity
    );
    
    setFilteredErrors(filtered);
  }, [errorData, selectedCategory, selectedTime, selectedStatus, selectedSeverity]);

  // Handle selection of different dimensions for drill-down
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setDetailView(false);
    setSelectedError(null);
  };
  
  const handleTimeClick = (time: string) => {
    setSelectedTime(time === selectedTime ? null : time);
    setDetailView(false);
    setSelectedError(null);
  };
  
  const handleStatusClick = (status: string) => {
    setSelectedStatus(status === selectedStatus ? null : status);
    setDetailView(false);
    setSelectedError(null);
  };
  
  const handleSeverityClick = (severity: string) => {
    setSelectedSeverity(severity === selectedSeverity ? null : severity);
    setDetailView(false);
    setSelectedError(null);
  };
  
  const handleErrorClick = (error: ErrorData) => {
    setSelectedError(error);
    setDetailView(true);
  };
  
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedTime(null);
    setSelectedStatus(null);
    setSelectedSeverity(null);
    setDetailView(false);
    setSelectedError(null);
  };

  // Get the page title based on active tab
  const getPageTitle = () => {
    switch(activeTab) {
      case 'summary': return 'Dashboard Overview';
      case 'timeline': return 'Error Timeline';
      case 'errors': return 'Error Details';
      case 'patterns': return 'Error Patterns';
      default: return 'Dashboard';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium">Analyzing error data...</div>
        </div>
      </div>
    );
  }

  // Render main content based on current state
  const renderContent = () => {
    if (detailView && selectedError) {
      return (
        <ErrorDetail
          error={selectedError}
          onClose={() => setDetailView(false)}
        />
      );
    } 
      
    if (hasActiveFilters(selectedCategory, selectedTime, selectedStatus, selectedSeverity)) {
      return (
        <FilteredErrorsList
          errors={filteredErrors}
          onErrorClick={handleErrorClick}
        />
      );
    }
    
    switch (activeTab) {
      case 'summary':
        return (
          <SummaryTab
            errorsByCategory={errorsByCategory}
            severityDistribution={severityDistribution}
            errorsByMinute={errorsByMinute}
            rootCauses={rootCauses}
            mostCommonErrors={mostCommonErrors}
            onCategoryClick={handleCategoryClick}
            onSeverityClick={handleSeverityClick}
          />
        );
      
      case 'timeline':
        return (
          <TimelineTab
            errorsByMinute={errorsByMinute}
            criticalEvents={criticalEvents}
            onTimeClick={handleTimeClick}
          />
        );
      
      case 'errors':
        return (
          <ErrorDetailsTab
            errorsByStatus={errorsByStatus}
            errorsByCategory={errorsByCategory}
            errorExamples={errorExamples}
            onStatusClick={handleStatusClick}
            onCategoryClick={handleCategoryClick}
          />
        );
      
      case 'patterns':
        return (
          <PatternsTab
            cascadePatterns={cascadePatterns}
            errorData={errorData}
            timelineData={timelineData}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <MainLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      title={getPageTitle()}
    >
      {/* Active filters - shown only when filters are applied */}
      {hasActiveFilters(selectedCategory, selectedTime, selectedStatus, selectedSeverity) && (
        <div className="mb-6">
          <ActiveFilters
            selectedCategory={selectedCategory}
            selectedTime={selectedTime}
            selectedStatus={selectedStatus}
            selectedSeverity={selectedSeverity}
            setSelectedCategory={setSelectedCategory}
            setSelectedTime={setSelectedTime}
            setSelectedStatus={setSelectedStatus}
            setSelectedSeverity={setSelectedSeverity}
            resetFilters={handleResetFilters}
            filteredCount={filteredErrors.length}
          />
        </div>
      )}
      
      {/* Main content area */}
      {renderContent()}
    </MainLayout>
  );
};

export default ErrorDashboard;
