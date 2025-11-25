import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class GradeService {
  constructor() {
    this.tableName = 'grades_c';
    this.lookupFields = ['student_id_c'];
  }

  prepareLookupFields(data) {
    const prepared = {...data};
    this.lookupFields.forEach(fieldName => {
      if (prepared[fieldName] !== undefined && prepared[fieldName] !== null) {
        // Handle both object and direct ID inputs
        prepared[fieldName] = prepared[fieldName]?.Id || parseInt(prepared[fieldName]);
      }
    });
    return prepared;
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "assignment_name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "student_id_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
      toast.error("Failed to fetch grades");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "assignment_name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "student_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch grade");
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "assignment_name_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "max_score_c"}},
          {"field": {"Name": "percentage_c"}},
          {"field": {"Name": "letter_grade_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "student_id_c"}}
        ],
        where: [
          {
            "FieldName": "student_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(studentId)]
          }
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching student grades:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(gradeData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const percentage = Math.round((gradeData.score_c / gradeData.max_score_c) * 100);
      const letterGrade = this.calculateLetterGrade(percentage);

      const preparedData = this.prepareLookupFields({
        assignment_name_c: gradeData.assignment_name_c,
        category_c: gradeData.category_c,
        score_c: gradeData.score_c,
        max_score_c: gradeData.max_score_c,
        percentage_c: percentage,
        letter_grade_c: letterGrade,
        notes_c: gradeData.notes_c || "",
        date_c: gradeData.date_c || new Date().toISOString().split('T')[0],
        student_id_c: gradeData.student_id_c
      });

      const params = {
        records: [preparedData]
      };

      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Grade created successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      toast.error("Failed to create grade");
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = this.prepareLookupFields({
        Id: parseInt(id),
        ...updateData
      });

      // Recalculate percentage and letter grade if score or maxScore updated
      if (updateData.score_c && updateData.max_score_c) {
        preparedData.percentage_c = Math.round((updateData.score_c / updateData.max_score_c) * 100);
        preparedData.letter_grade_c = this.calculateLetterGrade(preparedData.percentage_c);
      }

      const params = {
        records: [preparedData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Grade updated successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
      toast.error("Failed to update grade");
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Grade deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      toast.error("Failed to delete grade");
      return false;
    }
  }

  calculateLetterGrade(percentage) {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
  }

  async calculateGPA(studentId) {
    try {
      const studentGrades = await this.getByStudentId(studentId);
      
      if (studentGrades.length === 0) return 0;
      
      const gradePoints = {
        "A+": 4.0, "A": 4.0, "A-": 3.7,
        "B+": 3.3, "B": 3.0, "B-": 2.7,
        "C+": 2.3, "C": 2.0, "C-": 1.7,
        "D+": 1.3, "D": 1.0, "D-": 0.7,
        "F": 0.0
      };
      
      const totalPoints = studentGrades.reduce((sum, grade) => {
        return sum + (gradePoints[grade.letter_grade_c] || 0);
      }, 0);
      
      return Math.round((totalPoints / studentGrades.length) * 100) / 100;
    } catch (error) {
      console.error("Error calculating GPA:", error);
      return 0;
    }
  }
}

export default new GradeService();