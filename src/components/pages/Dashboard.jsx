import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import StudentTable from "@/components/organisms/StudentTable";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";

const Dashboard = () => {
  const { globalSearch } = useOutletContext() || {};
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageGPA: 0,
    attendanceRate: 0,
    activeStudents: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (globalSearch) {
      const filtered = students.filter(student =>
        student.firstName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.lastName.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.studentId.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(globalSearch.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [globalSearch, students]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, allGrades, allAttendance] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      
      // Calculate stats
      const activeStudents = studentsData.filter(s => s.status === "Active").length;
      
      // Calculate average GPA
      const gradePromises = studentsData.slice(0, 5).map(student => 
        gradeService.calculateGPA(student.Id)
      );
      const gpas = await Promise.all(gradePromises);
      const validGpas = gpas.filter(gpa => gpa > 0);
      const averageGPA = validGpas.length > 0 
        ? validGpas.reduce((sum, gpa) => sum + gpa, 0) / validGpas.length
        : 0;

      // Calculate attendance rate
      const attendancePromises = studentsData.slice(0, 5).map(student => 
        attendanceService.calculateAttendanceRate(student.Id)
      );
      const attendanceRates = await Promise.all(attendancePromises);
      const validRates = attendanceRates.filter(rate => rate > 0);
      const averageAttendance = validRates.length > 0
        ? validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length
        : 0;

      setStats({
        totalStudents: studentsData.length,
        averageGPA: Math.round(averageGPA * 100) / 100,
        attendanceRate: Math.round(averageAttendance),
        activeStudents
      });

      // Generate recent activity
      const activity = [
        { id: 1, type: "grade", message: "Emma Johnson received an A on Math Quiz 1", time: "2 hours ago" },
        { id: 2, type: "attendance", message: "5 students marked present today", time: "3 hours ago" },
        { id: 3, type: "student", message: "Ryan Kim enrolled in Biology 101", time: "1 day ago" },
        { id: 4, type: "grade", message: "Sofia Rodriguez submitted History Essay", time: "1 day ago" }
      ];
      setRecentActivity(activity);

    } catch (error) {
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (student) => {
    // Navigate to student detail view
    console.log("View student:", student);
  };

  const handleEditStudent = (student) => {
    // Navigate to edit student form
    console.log("Edit student:", student);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        setStudents(prev => prev.filter(s => s.Id !== studentId));
        setFilteredStudents(prev => prev.filter(s => s.Id !== studentId));
        // Recalculate stats after deletion
        loadDashboardData();
      } catch (error) {
        console.error("Failed to delete student:", error);
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening in your classroom.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          color="blue"
          trend="up"
          trendValue="+2 this week"
        />
        <StatCard
          title="Average GPA"
          value={stats.averageGPA.toFixed(2)}
          icon="BookOpen"
          color="green"
          trend="up"
          trendValue="+0.1 this month"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          color="yellow"
          trend="neutral"
          trendValue="Same as last week"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon="UserCheck"
          color="purple"
          trend="up"
          trendValue="+1 new enrollment"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Students</h2>
            {globalSearch && (
              <p className="text-sm text-gray-600">
                Showing {filteredStudents.length} of {students.length} students
              </p>
            )}
          </div>
          
          {filteredStudents.length === 0 ? (
            <Empty 
              title="No students found"
              description={globalSearch ? "No students match your search criteria" : "Get started by adding your first student"}
              actionText="Add Student"
              icon="Users"
            />
          ) : (
            <StudentTable
              students={filteredStudents.slice(0, 5)}
              onViewDetails={handleViewStudent}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          )}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="glass-effect rounded-xl p-6 space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors duration-200"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 leading-relaxed">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;