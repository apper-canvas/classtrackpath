import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleGlobalSearch = (searchTerm) => {
    setGlobalSearch(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:block" />
        
        {/* Mobile Sidebar */}
        <MobileSidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with mobile menu button */}
          <div className="glass-effect border-b border-white/20 sticky top-0 z-30">
            <div className="flex items-center px-4 lg:px-6 py-4">
              {/* Mobile menu button */}
              <button
                onClick={handleMobileMenuToggle}
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200 lg:hidden mr-4"
              >
                <ApperIcon name="Menu" className="w-5 h-5" />
              </button>
              
              {/* Header content */}
              <div className="flex-1">
                <Header onSearch={handleGlobalSearch} />
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 lg:px-6 py-6">
              <Outlet context={{ globalSearch }} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;