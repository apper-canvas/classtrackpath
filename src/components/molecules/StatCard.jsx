import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  color = "blue",
  className = "" 
}) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600"
  };

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  };

  return (
    <Card className={`p-6 glass-effect hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold gradient-text">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus"} 
                className="w-4 h-4" 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 bg-gradient-to-br ${colors[color]} rounded-xl shadow-lg`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;