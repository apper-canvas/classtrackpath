import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import GradeForm from "@/components/organisms/GradeForm";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import gradeService from "@/services/api/gradeService";

const Grades = () => {
  const { globalSearch } = useOutletContext() || {};
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [editGrade, setEditGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [studentGrades, setStudentGrades] = useState([]);
  const [studentGPA, setStudentGPA] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      loadStudentGrades();
    }
  }, [selectedStudent]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setGrades(gradesData);
      
      if (studentsData.length > 0) {
        setSelectedStudent(studentsData[0]);
      }
    } catch (error) {
      setError(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadStudentGrades = async () => {
    if (!selectedStudent) return;
    
    try {
      const [grades, gpa] = await Promise.all([
        gradeService.getByStudentId(selectedStudent.Id),
        gradeService.calculateGPA(selectedStudent.Id)
      ]);
      
      setStudentGrades(grades);
      setStudentGPA(gpa);
    } catch (error) {
      toast.error("Failed to load student grades");
    }
  };

  const handleAddGrade = () => {
    if (!selectedStudent) {
      toast.error("Please select a student first");
      return;
    }
    setEditGrade(null);
    setShowGradeForm(true);
  };

  const handleEditGrade = (grade) => {
    setEditGrade(grade);
    setShowGradeForm(true);
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await gradeService.delete(gradeId);
        setStudentGrades(prev => prev.filter(g => g.Id !== gradeId));
        // Recalculate GPA
        if (selectedStudent) {
          const newGPA = await gradeService.calculateGPA(selectedStudent.Id);
          setStudentGPA(newGPA);
        }
        toast.success("Grade deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete grade");
      }
    }
  };

  const handleGradeSubmit = (newGrade) => {
    if (editGrade) {
      setStudentGrades(prev => prev.map(g => g.Id === editGrade.Id ? newGrade : g));
    } else {
      setStudentGrades(prev => [...prev, newGrade]);
    }
    
    // Recalculate GPA
    if (selectedStudent) {
      gradeService.calculateGPA(selectedStudent.Id).then(setStudentGPA);
    }
    
    setShowGradeForm(false);
    setEditGrade(null);
  };

  const getGradeColor = (letterGrade) => {
    if (letterGrade.startsWith("A")) return "success";
    if (letterGrade.startsWith("B")) return "info";
    if (letterGrade.startsWith("C")) return "warning";
    if (letterGrade.startsWith("D")) return "warning";
    return "danger";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Quiz": "HelpCircle",
      "Test": "FileText",
      "Homework": "Home",
      "Project": "Briefcase",
      "Lab": "FlaskConical",
      "Essay": "PenTool",
      "Participation": "Users"
    };
    return icons[category] || "BookOpen";
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Grades</h1>
          <p className="text-gray-600">Manage student assignments and grades</p>
        </div>
        <Button
          onClick={handleAddGrade}
          className="flex items-center gap-2"
          disabled={!selectedStudent}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Grade
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                {student.firstName} {student.lastName}
              </option>
            ))}
          </Select>
          
          {selectedStudent && (
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <img
                  src={selectedStudent.photoUrl}
                  alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-white shadow-md"
                />
                <h4 className="mt-2 font-medium text-gray-900">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h4>
                <p className="text-sm text-gray-600">{selectedStudent.studentId}</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Current GPA</p>
                <p className="text-2xl font-bold gradient-text">
                  {studentGPA.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Grades List */}
        <div className="lg:col-span-3">
          {!selectedStudent ? (
            <Empty 
              title="Select a Student"
              description="Choose a student from the list to view and manage their grades"
              icon="BookOpen"
            />
          ) : studentGrades.length === 0 ? (
            <Empty 
              title="No Grades Yet"
              description="This student doesn't have any grades recorded. Add their first assignment grade."
              actionText="Add Grade"
              onAction={handleAddGrade}
              icon="BookOpen"
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedStudent.firstName}'s Grades ({studentGrades.length} assignments)
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {studentGrades.map((grade, index) => (
                  <motion.div
                    key={grade.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                          <ApperIcon 
                            name={getCategoryIcon(grade.category)} 
                            className="w-5 h-5 text-white" 
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{grade.assignmentName}</h4>
                          <p className="text-sm text-gray-600">{grade.category} • {grade.date}</p>
                          {grade.notes && (
                            <p className="text-sm text-gray-500 mt-1">{grade.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {grade.score}/{grade.maxScore}
                          </p>
                          <p className="text-sm text-gray-600">{grade.percentage}%</p>
                        </div>
                        
                        <Badge variant={getGradeColor(grade.letterGrade)}>
                          {grade.letterGrade}
                        </Badge>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleEditGrade(grade)}
                            className="p-2"
                          >
                            <ApperIcon name="Edit2" className="w-4 h-4" />
                          </Button>
                          <Button
                            size="small"
                            variant="ghost"
                            onClick={() => handleDeleteGrade(grade.Id)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Grade Form Modal */}
      <AnimatePresence>
        {showGradeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowGradeForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <GradeForm
                studentId={selectedStudent?.Id}
                onSubmit={handleGradeSubmit}
                onCancel={() => setShowGradeForm(false)}
                editGrade={editGrade}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Grades;