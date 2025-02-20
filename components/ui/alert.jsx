import React from 'react';

const Alert = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-50 text-blue-700 border-blue-200',
    destructive: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    success: 'bg-green-50 text-green-700 border-green-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription = ({ children }) => {
  return <div className="text-sm">{children}</div>;
};

export { Alert, AlertDescription };