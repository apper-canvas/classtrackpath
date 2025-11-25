import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onSearch }) => {
  const navigate = useNavigate();

  const handleAddStudent = () => {
    navigate("/students");
  };

  return (
    <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold gradient-text">ClassTrack</h1>
            <p className="text-sm text-gray-600">Student Management System</p>
          </div>
          
          <div className="flex items-center gap-4">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search students..."
              className="w-64 hidden md:block"
            />
            
            <Button
              onClick={handleAddStudent}
              className="flex items-center gap-2"
            >
              <ApperIcon name="UserPlus" className="w-4 h-4" />
              <span className="hidden sm:inline">Add Student</span>
            </Button>
            
            <button className="p-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;