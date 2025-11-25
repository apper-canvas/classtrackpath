import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";

const StudentTable = ({ 
  students, 
  onEdit, 
  onDelete, 
  onViewDetails,
  loading = false 
}) => {
  const [sortField, setSortField] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

const sortedStudents = [...students].sort((a, b) => {
let aValue = a[sortField] || a.Name || `${a.first_name_c} ${a.last_name_c}`;
    let bValue = b[sortField];
    
    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ApperIcon name="ChevronsUpDown" className="w-4 h-4 text-gray-400" />;
    return (
      <ApperIcon 
        name={sortDirection === "asc" ? "ChevronUp" : "ChevronDown"} 
        className="w-4 h-4 text-primary" 
      />
    );
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/4"></div>
                </div>
                <div className="w-20 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left">
<button
                  onClick={() => handleSort("Name")}
                  className="flex items-center gap-2 font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  Student
                  <SortIcon field="Name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
onClick={() => handleSort("student_id_c")}
                  className="flex items-center gap-2 font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  ID
                  <SortIcon field="student_id_c" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort("gradeLevel")}
                  className="flex items-center gap-2 font-medium text-gray-700 hover:text-primary transition-colors duration-200"
                >
                  Grade
                  <SortIcon field="gradeLevel" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedStudents.map((student, index) => (
              <motion.tr
                key={student.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
src={student.photo_url_c}
                      alt={student.Name || `${student.first_name_c} ${student.last_name_c}`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.Name || `${student.first_name_c} ${student.last_name_c}`}
                      </p>
                      <p className="text-sm text-gray-600">{student.email_c}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-sm text-gray-700">{student.student_id_c}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{student.grade_level_c}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={student.status_c} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => onViewDetails(student)}
                      className="p-2"
                    >
                      <ApperIcon name="Eye" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => onEdit(student)}
                      className="p-2"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      onClick={() => onDelete(student.Id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StudentTable;