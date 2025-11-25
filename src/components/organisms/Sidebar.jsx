import React from "react";
import Navigation from "@/components/organisms/Navigation";

const Sidebar = ({ className = "" }) => {
  return (
    <aside className={`w-64 glass-effect border-r border-white/20 ${className}`}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold gradient-text">Navigation</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your classroom</p>
        </div>
        <Navigation />
      </div>
    </aside>
  );
};

export default Sidebar;