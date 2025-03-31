import React from 'react';
import { TabType } from '@/types';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = (_props) => {
  // Mobile tabs are now handled by the sidebar, this component is not used
  // but kept for backward compatibility
  return null; 
};

export default TabNavigation;
