import React from 'react';

/**
 * Card component props
 */
interface CardProps {
  /** Card title */
  title?: string;
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Optional action button or element */
  action?: React.ReactNode;
  /** Full width flag */
  fullWidth?: boolean;
  /** Card icon */
  icon?: React.ReactNode;
  /** Card background color */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Material-style Card component for dashboard elements
 */
export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  action,
  fullWidth = false,
  icon,
  color = 'default',
}) => {
  const colorClasses = {
    default: 'bg-white dark:bg-gray-900',
    primary: 'bg-white dark:bg-gray-900 border-t-4 border-primary',
    success: 'bg-white dark:bg-gray-900 border-t-4 border-green-500',
    warning: 'bg-white dark:bg-gray-900 border-t-4 border-yellow-500',
    danger: 'bg-white dark:bg-gray-900 border-t-4 border-red-500',
    info: 'bg-white dark:bg-gray-900 border-t-4 border-blue-500',
  };

  return (
    <div
      className={`rounded-lg shadow-md transition-all hover:shadow-lg ${colorClasses[color]} ${
        fullWidth ? 'col-span-full' : ''
      } ${className}`}
    >
      {(title || action || icon) && (
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {icon && <div className="text-gray-500 dark:text-gray-400">{icon}</div>}
            {title && (
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                {title}
              </h3>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Card;
