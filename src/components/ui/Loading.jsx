import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="glass-effect rounded-xl p-6 mb-8 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="glass-effect rounded-xl p-6 animate-pulse"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  <div className="h-6 w-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                </div>
                <div className="h-8 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                <div className="h-2 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="glass-effect rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="h-10 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200/50">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-6 animate-pulse">
                <div className="flex items-center space-x-6">
                  <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-3 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                  <div className="h-8 w-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;