import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available",
  description = "Get started by adding your first item",
  actionText = "Add New",
  onAction,
  icon = "Database",
  className = "" 
}) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}>
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
            <ApperIcon 
              name={icon} 
              className="w-12 h-12 text-primary"
            />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20 animate-pulse"></div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold gradient-text">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {onAction && (
          <button
            onClick={onAction}
            className="premium-button inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;