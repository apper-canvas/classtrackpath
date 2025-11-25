import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, className = "" }) => {
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "present":
        return "success";
      case "inactive":
      case "absent":
        return "danger";
      case "tardy":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Badge 
      variant={getStatusVariant(status)} 
      className={className}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;