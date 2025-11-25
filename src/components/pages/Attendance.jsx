import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import AttendanceCalendar from "@/components/organisms/AttendanceCalendar";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";

const Attendance = () => {
  const { globalSearch } = useOutletContext() || {};
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState({
    attendanceRate: 0,
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    tardyDays: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadAttendanceStats();
    }
  }, [selectedStudent]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const studentsData = await studentService.getAll();
      setStudents(studentsData);
      
      if (studentsData.length > 0) {
        setSelectedStudent(studentsData[0]);
      }
    } catch (error) {
      setError(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadAttendanceStats = async () => {
    if (!selectedStudent) return;
    
    try {
      const [attendanceRecords, attendanceRate] = await Promise.all([
        attendanceService.getByStudentId(selectedStudent.Id),
        attendanceService.calculateAttendanceRate(selectedStudent.Id)
      ]);
      
const presentDays = attendanceRecords.filter(r => r.status_c === "Present").length;
      const absentDays = attendanceRecords.filter(r => r.status_c === "Absent").length;
      const tardyDays = attendanceRecords.filter(r => r.status_c === "Tardy").length;
      const totalDays = attendanceRecords.length;
      
      setAttendanceStats({
        attendanceRate,
        totalDays,
        presentDays,
        absentDays,
        tardyDays
      });
    } catch (error) {
      toast.error("Failed to load attendance statistics");
    }
  };

  const handleAttendanceChange = () => {
    loadAttendanceStats();
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Attendance</h1>
        <p className="text-gray-600">Track and manage student attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Student Selection & Stats */}
        <div className="space-y-6">
          {/* Student Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Student</h3>
            <Select
              value={selectedStudent?.Id || ""}
              onChange={(e) => {
                const student = students.find(s => s.Id === parseInt(e.target.value));
                setSelectedStudent(student);
              }}
            >
              <option value="">Select a student...</option>
              {students.map((student) => (
<option key={student.Id} value={student.Id}>
                  {student.first_name_c} {student.last_name_c}
                </option>
              ))}
            </Select>
            
            {selectedStudent && (
              <div className="mt-6 text-center">
                <img
src={selectedStudent.photo_url_c}
                  alt={`${selectedStudent.first_name_c} ${selectedStudent.last_name_c}`}
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-white shadow-md"
                />
                <h4 className="mt-2 font-medium text-gray-900">
                  {selectedStudent.first_name_c} {selectedStudent.last_name_c}
                </h4>
                <p className="text-sm text-gray-600">{selectedStudent.student_id_c}</p>
              </div>
            )}
          </Card>

          {/* Attendance Stats */}
          {selectedStudent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <StatCard
                title="Attendance Rate"
                value={`${attendanceStats.attendanceRate}%`}
                icon="TrendingUp"
                color={attendanceStats.attendanceRate >= 90 ? "green" : attendanceStats.attendanceRate >= 80 ? "yellow" : "red"}
              />
              
              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Present</span>
                    </div>
                    <span className="font-medium text-gray-900">{attendanceStats.presentDays}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Tardy</span>
                    </div>
                    <span className="font-medium text-gray-900">{attendanceStats.tardyDays}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Absent</span>
                    </div>
                    <span className="font-medium text-gray-900">{attendanceStats.absentDays}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Total Days</span>
                      <span className="font-semibold text-gray-900">{attendanceStats.totalDays}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Attendance Calendar */}
        <div className="lg:col-span-3">
          {!selectedStudent ? (
            <Empty 
              title="Select a Student"
              description="Choose a student from the list to view and manage their attendance"
              icon="Calendar"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AttendanceCalendar
                studentId={selectedStudent.Id}
                onAttendanceChange={handleAttendanceChange}
              />
              
              <Card className="mt-6 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How to use</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="MousePointer" className="w-4 h-4 text-primary" />
                    <span>Click on any past date to mark attendance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="RotateCcw" className="w-4 h-4 text-primary" />
                    <span>Click multiple times to cycle through statuses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" className="w-4 h-4 text-primary" />
                    <span>Future dates are disabled for editing</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;