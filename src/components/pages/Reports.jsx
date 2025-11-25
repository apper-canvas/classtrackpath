import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";
import attendanceService from "@/services/api/attendanceService";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [reportType, setReportType] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reportData, setReportData] = useState({
    overviewStats: {
      totalStudents: 0,
      averageGPA: 0,
      averageAttendance: 0,
      gradeDistribution: {}
    },
    gradeAnalysis: [],
    attendanceAnalysis: [],
    studentPerformance: []
  });

  useEffect(() => {
    loadReportData();
  }, []);

  useEffect(() => {
    generateReports();
  }, [students, grades, attendance]);

  const loadReportData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, gradesData, attendanceData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll(),
        attendanceService.getAll()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
      setAttendance(attendanceData);
    } catch (error) {
      setError(error.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const generateReports = async () => {
    if (students.length === 0) return;

    try {
      // Overview Stats
      const activeStudents = students.filter(s => s.status === "Active");
      
      // Calculate average GPA
      const gpaPromises = activeStudents.slice(0, 5).map(student => 
        gradeService.calculateGPA(student.Id)
      );
      const gpas = await Promise.all(gpaPromises);
      const validGpas = gpas.filter(gpa => gpa > 0);
      const averageGPA = validGpas.length > 0 
        ? validGpas.reduce((sum, gpa) => sum + gpa, 0) / validGpas.length
        : 0;

      // Calculate average attendance
      const attendancePromises = activeStudents.slice(0, 5).map(student => 
        attendanceService.calculateAttendanceRate(student.Id)
      );
      const attendanceRates = await Promise.all(attendancePromises);
      const validRates = attendanceRates.filter(rate => rate > 0);
      const averageAttendance = validRates.length > 0
        ? validRates.reduce((sum, rate) => sum + rate, 0) / validRates.length
        : 0;

      // Grade distribution
      const gradeDistribution = grades.reduce((acc, grade) => {
        const letter = grade.letterGrade?.charAt(0) || "F";
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
      }, {});

      // Grade analysis by category
      const gradeAnalysis = grades.reduce((acc, grade) => {
        const category = grade.category;
        if (!acc[category]) {
          acc[category] = { total: 0, sum: 0 };
        }
        acc[category].total += 1;
        acc[category].sum += grade.percentage;
        return acc;
      }, {});

      const gradeChartData = Object.keys(gradeAnalysis).map(category => ({
        category,
        average: Math.round(gradeAnalysis[category].sum / gradeAnalysis[category].total)
      }));

      // Attendance analysis by month
      const attendanceByMonth = attendance.reduce((acc, record) => {
        const month = record.date.substring(0, 7); // YYYY-MM
        if (!acc[month]) {
          acc[month] = { present: 0, absent: 0, tardy: 0 };
        }
        acc[month][record.status.toLowerCase()] += 1;
        return acc;
      }, {});

      const attendanceChartData = Object.keys(attendanceByMonth).map(month => ({
        month,
        rate: Math.round((attendanceByMonth[month].present / 
          (attendanceByMonth[month].present + attendanceByMonth[month].absent + attendanceByMonth[month].tardy)) * 100)
      }));

      setReportData({
        overviewStats: {
          totalStudents: activeStudents.length,
          averageGPA: Math.round(averageGPA * 100) / 100,
          averageAttendance: Math.round(averageAttendance),
          gradeDistribution
        },
        gradeAnalysis: gradeChartData,
        attendanceAnalysis: attendanceChartData,
        studentPerformance: activeStudents.slice(0, 10).map(student => ({
          ...student,
          gpa: gpas[activeStudents.indexOf(student)] || 0,
          attendanceRate: attendanceRates[activeStudents.indexOf(student)] || 0
        }))
      });
    } catch (error) {
      console.error("Failed to generate reports:", error);
    }
  };

  const exportReport = () => {
    const reportContent = generateReportText();
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `class-report-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateReportText = () => {
    const { overviewStats, studentPerformance } = reportData;
    
    return `
CLASS PERFORMANCE REPORT
Generated: ${new Date().toLocaleDateString()}

OVERVIEW STATISTICS
===================
Total Students: ${overviewStats.totalStudents}
Average GPA: ${overviewStats.averageGPA}
Average Attendance: ${overviewStats.averageAttendance}%

GRADE DISTRIBUTION
==================
${Object.entries(overviewStats.gradeDistribution)
  .map(([grade, count]) => `${grade}: ${count} students`)
  .join('\n')}

STUDENT PERFORMANCE
===================
${studentPerformance
  .map(student => `${student.firstName} ${student.lastName} - GPA: ${student.gpa}, Attendance: ${student.attendanceRate}%`)
  .join('\n')}
    `.trim();
  };

  const gradeChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false }
    },
    colors: ["#2563eb"],
    xaxis: {
      categories: reportData.gradeAnalysis.map(item => item.category)
    },
    yaxis: {
      title: { text: "Average Score %" }
    },
    title: {
      text: "Average Grades by Category"
    }
  };

  const gradeChartSeries = [{
    name: "Average Score",
    data: reportData.gradeAnalysis.map(item => item.average)
  }];

  const attendanceChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false }
    },
    colors: ["#10b981"],
    xaxis: {
      categories: reportData.attendanceAnalysis.map(item => item.month)
    },
    yaxis: {
      title: { text: "Attendance Rate %" }
    },
    title: {
      text: "Monthly Attendance Trends"
    }
  };

  const attendanceChartSeries = [{
    name: "Attendance Rate",
    data: reportData.attendanceAnalysis.map(item => item.rate)
  }];

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadReportData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Reports</h1>
          <p className="text-gray-600">Analyze class performance and generate reports</p>
        </div>
        <Button
          onClick={exportReport}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Download" className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Report Type Selection */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Report Type:</label>
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-48"
          >
            <option value="overview">Class Overview</option>
            <option value="grades">Grade Analysis</option>
            <option value="attendance">Attendance Trends</option>
            <option value="student">Student Performance</option>
          </Select>
        </div>
      </Card>

      {/* Overview Report */}
      {reportType === "overview" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={reportData.overviewStats.totalStudents}
              icon="Users"
              color="blue"
            />
            <StatCard
              title="Average GPA"
              value={reportData.overviewStats.averageGPA.toFixed(2)}
              icon="BookOpen"
              color="green"
            />
            <StatCard
              title="Attendance Rate"
              value={`${reportData.overviewStats.averageAttendance}%`}
              icon="Calendar"
              color="yellow"
            />
            <StatCard
              title="Grade Distribution"
              value={`${Object.keys(reportData.overviewStats.gradeDistribution).length} levels`}
              icon="BarChart3"
              color="purple"
            />
          </div>

          {/* Grade Distribution Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(reportData.overviewStats.gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-sm text-gray-600">Grade {grade}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Grade Analysis Report */}
      {reportType === "grades" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <Chart
              options={gradeChartOptions}
              series={gradeChartSeries}
              type="bar"
              height={400}
            />
          </Card>
        </motion.div>
      )}

      {/* Attendance Analysis Report */}
      {reportType === "attendance" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <Chart
              options={attendanceChartOptions}
              series={attendanceChartSeries}
              type="line"
              height={400}
            />
          </Card>
        </motion.div>
      )}

      {/* Student Performance Report */}
      {reportType === "student" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Student Performance Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportData.studentPerformance.map((student, index) => (
                    <motion.tr
                      key={student.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={student.photoUrl}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {student.firstName} {student.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.gpa.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.attendanceRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.gpa >= 3.5 && student.attendanceRate >= 90 
                            ? "bg-green-100 text-green-800"
                            : student.gpa >= 3.0 && student.attendanceRate >= 80
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {student.gpa >= 3.5 && student.attendanceRate >= 90 
                            ? "Excellent"
                            : student.gpa >= 3.0 && student.attendanceRate >= 80
                            ? "Good"
                            : "Needs Attention"
                          }
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;