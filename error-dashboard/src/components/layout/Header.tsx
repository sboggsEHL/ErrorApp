import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { BellIcon, SearchIcon, MenuIcon, UserIcon } from 'lucide-react';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 dark:text-gray-400 md:hidden mr-4 focus:outline-none"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Search bar */}
        <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
          <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-40"
          />
        </div>
        
        {/* Theme switcher */}
        <ThemeSwitcher />
        
        {/* Notification icon */}
        <button className="relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        {/* User avatar */}
        <button className="flex items-center text-gray-700 dark:text-gray-300">
          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
