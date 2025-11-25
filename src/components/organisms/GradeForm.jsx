import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import gradeService from "@/services/api/gradeService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";

const GradeForm = ({ studentId, onSubmit, onCancel, editGrade = null }) => {
const [formData, setFormData] = useState({
    name: "",
    tags: "",
    assignmentName: "",
    category: "",
    score: "",
    maxScore: "100",
    notes: "",
    description: "",
    status: "",
    gradeCode: "",
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "Quiz", label: "Quiz" },
    { value: "Test", label: "Test" },
    { value: "Homework", label: "Homework" },
    { value: "Project", label: "Project" },
    { value: "Lab", label: "Lab" },
    { value: "Essay", label: "Essay" },
    { value: "Participation", label: "Participation" }
  ];

  useEffect(() => {
if (editGrade) {
setFormData({
        name: editGrade.Name || "",
        tags: editGrade.Tags || "",
        assignmentName: editGrade.assignment_name_c || "",
        category: editGrade.category_c || "",
        score: editGrade.score_c?.toString() || "",
        maxScore: editGrade.max_score_c?.toString() || "100",
        notes: editGrade.notes_c || "",
        description: editGrade.description_c || "",
        status: editGrade.status_c || "",
        gradeCode: editGrade.grade_code_c || "",
      });
    }
  }, [editGrade]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.assignmentName.trim()) {
      toast.error("Assignment name is required");
      return;
    }
    
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }
    
    if (!formData.score || isNaN(formData.score)) {
      toast.error("Valid score is required");
      return;
    }
    
    if (!formData.maxScore || isNaN(formData.maxScore)) {
      toast.error("Valid max score is required");
      return;
    }

    setLoading(true);
    
    try {
const gradeData = {
        Name: formData.name.trim(),
        Tags: formData.tags.trim(),
        student_id_c: studentId,
        assignment_name_c: formData.assignmentName.trim(),
        category_c: formData.category,
        score_c: parseFloat(formData.score),
        max_score_c: parseFloat(formData.maxScore),
        notes_c: formData.notes.trim(),
        description_c: formData.description.trim(),
        status_c: formData.status,
        grade_code_c: formData.gradeCode.trim(),
        date_c: new Date().toISOString().split('T')[0]
      };

      let result;
      if (editGrade) {
        result = await gradeService.update(editGrade.Id, gradeData);
        toast.success("Grade updated successfully");
      } else {
        result = await gradeService.create(gradeData);
        toast.success("Grade added successfully");
      }

      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      toast.error(error.message || "Failed to save grade");
    } finally {
      setLoading(false);
    }
  };

  const percentage = formData.score && formData.maxScore 
    ? Math.round((parseFloat(formData.score) / parseFloat(formData.maxScore)) * 100)
    : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
          <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          {editGrade ? "Edit Grade" : "Add Grade"}
        </h3>
      </div>

<form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter grade name"
            required
          />

          <FormField
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Enter tags (comma-separated)"
          />

          <FormField
            label="Assignment Name"
            name="assignmentName"
            value={formData.assignmentName}
            onChange={handleInputChange}
            placeholder="Enter assignment name"
            required
          />

          <FormField
            type="select"
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categories}
            required
          />

          <FormField
            label="Score"
            name="score"
            type="number"
            value={formData.score}
            onChange={handleInputChange}
            placeholder="Enter score"
            min="0"
            step="0.1"
            required
          />

          <FormField
            label="Max Score"
            name="maxScore"
            type="number"
            value={formData.maxScore}
            onChange={handleInputChange}
            placeholder="Enter max score"
            min="1"
            step="0.1"
required
          />
        </div>

        <div>
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Enter grade description"
            rows={3}
          />
        </div>

        <div>
          <FormField
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            options={[
              { value: "", label: "Select Status" },
              { value: "Draft", label: "Draft" },
              { value: "Published", label: "Published" },
              { value: "Final", label: "Final" }
            ]}
          />
        </div>

        <div>
          <FormField
            label="Grade Code"
            name="gradeCode"
            value={formData.gradeCode}
            onChange={(e) => setFormData({...formData, gradeCode: e.target.value})}
            placeholder="Enter grade code (e.g., MATH101)"
          />
        </div>

        {editGrade && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Owner"
              name="owner"
              value={editGrade.Owner?.Name || "N/A"}
              readOnly
            />

            <FormField
              label="Created By"
              name="createdBy"
              value={editGrade.CreatedBy?.Name || "N/A"}
              readOnly
            />

            <FormField
              label="Created On"
              name="createdOn"
              value={editGrade.CreatedOn ? new Date(editGrade.CreatedOn).toLocaleDateString() : "N/A"}
              readOnly
            />

            <FormField
              label="Modified By"
              name="modifiedBy"
              value={editGrade.ModifiedBy?.Name || "N/A"}
              readOnly
            />

            <FormField
              label="Modified On"
              name="modifiedOn"
              value={editGrade.ModifiedOn ? new Date(editGrade.ModifiedOn).toLocaleDateString() : "N/A"}
              readOnly
            />
          </div>
        )}

{formData.score && formData.maxScore && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Calculated Grade</p>
              <p className="text-2xl font-bold gradient-text">{percentage}%</p>
              <p className="text-sm text-gray-600">
                Letter Grade: {gradeService.calculateLetterGrade(percentage)}
              </p>
            </div>
          </div>
        )}

        <FormField
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Add any notes or comments..."
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                Saving...
              </div>
            ) : (
              editGrade ? "Update Grade" : "Add Grade"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default GradeForm;