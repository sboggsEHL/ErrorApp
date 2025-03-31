import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { HomeIcon, PieChartIcon, ClockIcon, AlertTriangleIcon, ActivityIcon, SettingsIcon } from 'lucide-react';
import { TabType } from '@/types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, isDarkMode } = useTheme();
  
  const menuItems = [
    { id: 'summary' as TabType, label: 'Dashboard', icon: HomeIcon },
    { id: 'timeline' as TabType, label: 'Timeline', icon: ClockIcon },
    { id: 'errors' as TabType, label: 'Error Details', icon: AlertTriangleIcon },
    { id: 'patterns' as TabType, label: 'Error Patterns', icon: ActivityIcon },
  ];

  const primaryColor = isDarkMode 
    ? 'rgba(var(--theme-hue), 70%, 45%, 1)' 
    : 'rgba(var(--theme-hue), 70%, 45%, 1)';

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 shadow-lg fixed left-0 top-0 z-10 flex flex-col transition-all">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold flex items-center">
          <AlertTriangleIcon className="mr-2 text-primary" />
          <span>Error Analyzer</span>
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-3 ${
                  activeTab === item.id ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                }`} />
                {item.label}
                
                {activeTab === item.id && (
                  <div className="ml-auto w-1.5 h-5 rounded-full bg-primary" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full flex items-center px-4 py-3 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
          <SettingsIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
