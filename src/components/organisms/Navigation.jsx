import React from "react";
import NavItem from "@/components/molecules/NavItem";

const Navigation = ({ className = "" }) => {
  const navItems = [
    { to: "", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "students", icon: "Users", label: "Students" },
    { to: "grades", icon: "BookOpen", label: "Grades" },
{ to: "attendance", icon: "Calendar", label: "Attendance" },
    { to: "activities", icon: "Activity", label: "Activities" },
    { to: "reports", icon: "BarChart3", label: "Reports" }
  ];

  return (
    <nav className={`space-y-2 ${className}`}>
      {navItems.map((item) => (
        <NavItem 
          key={item.to || "home"}
          to={item.to === "" ? "/" : `/${item.to}`}
          icon={item.icon}
        >
          {item.label}
        </NavItem>
      ))}
    </nav>
  );
};

export default Navigation;