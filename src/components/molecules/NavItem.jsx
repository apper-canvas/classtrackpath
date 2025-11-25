import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, children, className = "" }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
          isActive 
            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-r-2 border-primary" 
            : "text-gray-600 hover:bg-gray-50 hover:text-primary",
          className
        )
      }
    >
      <ApperIcon 
        name={icon} 
        className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" 
      />
      <span className="font-medium">{children}</span>
    </NavLink>
  );
};

export default NavItem;