import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { TabType } from '@/types';
import { GitMergeIcon, HomeIcon, BarChart2Icon, AlertTriangleIcon, ClockIcon, ActivityIcon } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  title: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab,
  title
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Check on initial render
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get dashboard stats based on the active tab
  const getDashboardStats = () => {
    switch(activeTab) {
      case 'summary':
        return [
          { name: 'Total Errors', value: '379', icon: <BarChart2Icon className="w-5 h-5 text-primary" /> },
          { name: 'Categories', value: '5', icon: <GitMergeIcon className="w-5 h-5 text-green-500" /> },
          { name: 'Time Span', value: '55 min', icon: <ClockIcon className="w-5 h-5 text-yellow-500" /> },
        ];
      case 'timeline':
        return [
          { name: 'Time Span', value: '55 min', icon: <ClockIcon className="w-5 h-5 text-blue-500" /> },
          { name: 'Events', value: '17', icon: <ActivityIcon className="w-5 h-5 text-indigo-500" /> }
        ];
      case 'errors':
        return [
          { name: 'Error Types', value: '8', icon: <AlertTriangleIcon className="w-5 h-5 text-red-500" /> },
          { name: 'Examples', value: '15', icon: <HomeIcon className="w-5 h-5 text-orange-500" /> },
        ];
      default:
        return [
          { name: 'Patterns', value: '4', icon: <GitMergeIcon className="w-5 h-5 text-purple-500" /> }
        ];
    }
  };

  return (
    <div className="flex bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header 
          toggleSidebar={toggleSidebar} 
          title={title} 
        />
        
        {/* Dashboard stats */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 transition-all ${
          sidebarOpen ? 'md:ml-64' : ''
        }`}>
          {getDashboardStats().map((stat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="mr-4 p-3 rounded-full bg-gray-100 dark:bg-gray-700">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</h3>
                </div>
              </div>
              <div className="text-gray-400 dark:text-gray-500">
                <ActivityIcon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Main content */}
        <main className={`flex-1 p-4 overflow-auto transition-all ${
          sidebarOpen ? 'md:ml-64' : ''
        }`}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 min-h-[calc(100vh-13rem)]">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className={`py-4 px-6 bg-white dark:bg-gray-800 shadow-inner border-t border-gray-200 dark:border-gray-700 transition-all ${
          sidebarOpen ? 'md:ml-64' : ''
        }`}>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Error Analysis Dashboard. All rights reserved.
          </div>
        </footer>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default MainLayout;
