// CustomAlert.tsx
import React from 'react';

interface CustomAlertProps {
  variant?: 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  variant = 'success',
  children,
}) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`p-4 md:mb-4 rounded-md border ${styles[variant]}`}>
      {children}
    </div>
  );
};

export default CustomAlert;
