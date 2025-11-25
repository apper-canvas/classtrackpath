import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class StudentService {
  constructor() {
    this.tableName = 'students_c';
  }

async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "enrollment_date_c"}}
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
      console.error("Error fetching students:", error?.response?.data?.message || error);
      toast.error("Failed to fetch students");
      return [];
    }
  }

async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "enrollment_date_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch student");
      return null;
    }
  }

async create(studentData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = {
Name: studentData.Name || `${studentData.first_name_c} ${studentData.last_name_c}`,
        Tags: studentData.Tags || "",
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        student_id_c: studentData.student_id_c,
        email_c: studentData.email_c,
        phone_c: studentData.phone_c || "",
        grade_level_c: studentData.grade_level_c,
        status_c: "Active",
        photo_url_c: studentData.photo_url_c || "",
        enrollment_date_c: studentData.enrollment_date_c || new Date().toISOString().split('T')[0]
      };

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
          console.error(`Failed to create ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Student created successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      toast.error("Failed to create student");
      return null;
    }
  }

async update(id, updateData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = {
        Id: parseInt(id),
        ...updateData
      };

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
          console.error(`Failed to update ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Student updated successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
      toast.error("Failed to update student");
      return null;
    }
  }

async delete(id) {
    try {
      const apperClient = await getApperClient();
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
          console.error(`Failed to delete ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Student deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      toast.error("Failed to delete student");
      return false;
    }
  }

async search(query) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const searchTerm = query.toLowerCase();
      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "enrollment_date_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "first_name_c",
                  "operator": "Contains",
                  "values": [searchTerm]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "last_name_c", 
                  "operator": "Contains",
                  "values": [searchTerm]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "student_id_c",
                  "operator": "Contains", 
                  "values": [searchTerm]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "email_c",
                  "operator": "Contains",
                  "values": [searchTerm]
                }
              ],
              "operator": "OR"
            }
          ]
        }]
      };

      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching students:", error?.response?.data?.message || error);
      return [];
    }
  }

async getByStatus(status) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
{"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "photo_url_c"}},
          {"field": {"Name": "enrollment_date_c"}}
        ],
        where: [
          {
            "FieldName": "status_c",
            "Operator": "EqualTo",
            "Values": [status]
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
      console.error("Error fetching students by status:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new StudentService();