import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import attendanceService from "@/services/api/attendanceService";

const AttendanceCalendar = ({ studentId, onAttendanceChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (studentId) {
      loadAttendance();
    }
  }, [studentId, currentDate]);

  const loadAttendance = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      const data = await attendanceService.getByStudentId(studentId);
      setAttendance(data);
    } catch (error) {
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendance.find(record => record.date === dateStr);
  };

  const handleStatusClick = async (date, currentStatus) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const statusCycle = ["Present", "Absent", "Tardy", null];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const newStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    try {
      if (newStatus) {
        const result = await attendanceService.markAttendance(
          studentId,
          dateStr,
          newStatus
        );
        setAttendance(prev => {
          const filtered = prev.filter(record => record.date !== dateStr);
          return [...filtered, result];
        });
        toast.success(`Marked as ${newStatus.toLowerCase()}`);
      } else {
        // Remove attendance record
        const existingRecord = getAttendanceForDate(date);
        if (existingRecord) {
          await attendanceService.delete(existingRecord.Id);
          setAttendance(prev => prev.filter(record => record.date !== dateStr));
          toast.success("Attendance removed");
        }
      }
      
      if (onAttendanceChange) {
        onAttendanceChange();
      }
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Add empty cells for days before the start of the month
  const startDayOfWeek = getDay(monthStart);
  const emptyCells = Array(startDayOfWeek).fill(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-800 border-green-200";
      case "Absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "Tardy":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Present":
        return "Check";
      case "Absent":
        return "X";
      case "Tardy":
        return "Clock";
      default:
        return "Plus";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigateMonth(-1)}
            className="p-2"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => navigateMonth(1)}
            className="p-2"
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-12" />
        ))}
        
        {days.map((date) => {
          const attendanceRecord = getAttendanceForDate(date);
          const status = attendanceRecord?.status;
          const isToday = isSameDay(date, new Date());
          const isPastDate = date <= new Date();

          return (
            <motion.button
              key={date.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isPastDate && handleStatusClick(date, status)}
              disabled={!isPastDate || loading}
              className={`
                h-12 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center
                ${getStatusColor(status)}
                ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
                ${!isPastDate ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${isPastDate ? "hover:scale-105" : ""}
              `}
            >
              <span className="text-sm font-medium">
                {format(date, "d")}
              </span>
              {status && (
                <ApperIcon 
                  name={getStatusIcon(status)} 
                  className="w-3 h-3 mt-0.5" 
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-200 rounded"></div>
          <span className="text-sm text-gray-600">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-200 rounded"></div>
          <span className="text-sm text-gray-600">Tardy</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-200 rounded"></div>
          <span className="text-sm text-gray-600">Absent</span>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceCalendar;