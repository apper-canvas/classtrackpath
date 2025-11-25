import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import studentService from "@/services/api/studentService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import StudentTable from "@/components/organisms/StudentTable";
import FormField from "@/components/molecules/FormField";

const Students = () => {
  const { globalSearch } = useOutletContext() || {};
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  
const [formData, setFormData] = useState({
    Name: "",
    Tags: "",
    first_name_c: "",
    last_name_c: "",
    student_id_c: "",
    email_c: "",
    phone_c: "",
    grade_level_c: "",
    photo_url_c: "",
    enrollment_date_c: ""
  });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [globalSearch, students, filterStatus]);

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      setError(error.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...students];

// Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(student => 
        student.status_c?.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Apply search filter
    if (globalSearch) {
      filtered = filtered.filter(student =>
        student.first_name_c?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.last_name_c?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.student_id_c?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        student.email_c?.toLowerCase().includes(globalSearch.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.first_name_c?.trim() || !formData.last_name_c?.trim()) {
      toast.error("First name and last name are required");
      return;
    }
    try {
const studentData = {
        ...formData,
        Name: formData.Name || `${formData.first_name_c} ${formData.last_name_c}`,
        photoUrl: formData.photoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      };

      let result;
      if (editStudent) {
        result = await studentService.update(editStudent.Id, studentData);
        setStudents(prev => prev.map(s => s.Id === editStudent.Id ? result : s));
        toast.success("Student updated successfully");
      } else {
        result = await studentService.create(studentData);
        setStudents(prev => [...prev, result]);
        toast.success("Student added successfully");
      }

      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save student");
    }
  };

  const handleEdit = (student) => {
    setEditStudent(student);
setFormData({
      Name: student.Name || "",
      Tags: student.Tags || "",
      first_name_c: student.first_name_c || "",
      last_name_c: student.last_name_c || "",
      student_id_c: student.student_id_c || "",
      email_c: student.email_c || "",
      phone_c: student.phone_c || "",
      grade_level_c: student.grade_level_c || "",
      photo_url_c: student.photo_url_c || "",
      enrollment_date_c: student.enrollment_date_c || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(studentId);
        setStudents(prev => prev.filter(s => s.Id !== studentId));
        toast.success("Student deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete student");
      }
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };

  const resetForm = () => {
    setFormData({
Name: "",
      Tags: "",
      first_name_c: "",
      last_name_c: "",
      student_id_c: "",
      email_c: "",
      phone_c: "",
      grade_level_c: "",
      photo_url_c: "",
      enrollment_date_c: ""
    });
    setEditStudent(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Students</h1>
          <p className="text-gray-600">Manage your class roster</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="UserPlus" className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Students</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <div className="text-sm text-gray-600 ml-auto">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </Card>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Empty 
          title="No students found"
          description={globalSearch || filterStatus !== "all" 
            ? "No students match your search criteria" 
            : "Get started by adding your first student to the class roster"
          }
          actionText="Add Student"
          onAction={() => setShowForm(true)}
          icon="Users"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add/Edit Student Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editStudent ? "Edit Student" : "Add New Student"}
                  </h2>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resetForm}
                    className="p-2"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField
                    label="Name"
                    name="Name"
                    value={formData.Name}
                    onChange={handleInputChange}
                    className="md:col-span-2"
                    required
                  />

                  <FormField
                    label="Tags"
                    name="Tags"
                    value={formData.Tags}
                    onChange={handleInputChange}
                    placeholder="Enter comma-separated tags"
                    className="md:col-span-2"
                  />

                  <FormField
                    label="First Name"
                    name="first_name_c"
                    value={formData.first_name_c}
                    onChange={handleInputChange}
                    required
                  />

                  <FormField
                    label="Last Name"
                    name="last_name_c"
                    value={formData.last_name_c}
                    onChange={handleInputChange}
                    required
                  />

                  <FormField
                    label="Student ID"
                    name="student_id_c"
                    value={formData.student_id_c}
                    onChange={handleInputChange}
                    required
                  />

                  <FormField
                    label="Grade Level"
                    type="select"
                    name="grade_level_c"
                    value={formData.grade_level_c}
                    onChange={handleInputChange}
                    options={[
                      { value: "9th Grade", label: "9th Grade" },
                      { value: "10th Grade", label: "10th Grade" },
                      { value: "11th Grade", label: "11th Grade" },
                      { value: "12th Grade", label: "12th Grade" }
                    ]}
                    required
                  />

                  <FormField
                    label="Email"
                    name="email_c"
                    type="email"
                    value={formData.email_c}
                    onChange={handleInputChange}
                    required
                  />

                  <FormField
                    label="Phone"
                    name="phone_c"
                    value={formData.phone_c}
                    onChange={handleInputChange}
                  />

                  <FormField
                    label="Photo URL"
                    name="photo_url_c"
                    value={formData.photo_url_c}
                    onChange={handleInputChange}
                    className="md:col-span-2"
                  />

                  <FormField
                    label="Enrollment Date"
                    name="enrollment_date_c"
                    type="date"
                    value={formData.enrollment_date_c}
                    onChange={handleInputChange}
                    className="md:col-span-2"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editStudent ? "Update Student" : "Add Student"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setSelectedStudent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedStudent(null)}
                    className="p-2"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>

<div className="flex items-center gap-6">
                  <img
                    src={selectedStudent.photo_url_c || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                    alt={`${selectedStudent.first_name_c || ''} ${selectedStudent.last_name_c || ''}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedStudent.Name || `${selectedStudent.first_name_c} ${selectedStudent.last_name_c}`}
                    </h3>
                    <p className="text-gray-600">{selectedStudent.student_id_c}</p>
                    <p className="text-gray-600">{selectedStudent.grade_level_c}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900">{selectedStudent.Name || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <p className="text-gray-900">{selectedStudent.Tags || "No tags"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedStudent.email_c}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedStudent.phone_c || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enrollment Date
                    </label>
                    <p className="text-gray-900">{selectedStudent.enrollment_date_c}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <p className="text-gray-900">{selectedStudent.status_c}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner
                    </label>
                    <p className="text-gray-900">{selectedStudent.Owner?.Name || "System"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created On
                    </label>
                    <p className="text-gray-900">{selectedStudent.CreatedOn ? new Date(selectedStudent.CreatedOn).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Created By
                    </label>
                    <p className="text-gray-900">{selectedStudent.CreatedBy?.Name || "System"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modified On
                    </label>
                    <p className="text-gray-900">{selectedStudent.ModifiedOn ? new Date(selectedStudent.ModifiedOn).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modified By
                    </label>
<p className="text-gray-900">{selectedStudent.ModifiedBy?.Name || "System"}</p>
                  </div>
                </div>
              </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedStudent(null);
                      handleEdit(selectedStudent);
                    }}
                  >
                    Edit Student
                  </Button>
<Button
                    variant="outline"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;