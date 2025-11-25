import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className = "" 
}) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}>
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <ApperIcon 
              name="AlertTriangle" 
              className="w-12 h-12 text-red-600"
            />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full blur opacity-20 animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        {onRetry && (
          <div className="space-y-4">
            <button
              onClick={onRetry}
              className="premium-button inline-flex items-center gap-2"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4" />
              Try Again
            </button>
            <p className="text-sm text-gray-500">
              If this problem persists, please contact support
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorView;