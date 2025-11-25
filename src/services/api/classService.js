import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class ClassService {
  constructor() {
    this.tableName = 'classes_c';
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
          {"field": {"Name": "academic_year_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "period_c"}},
          {"field": {"Name": "grading_scale_c"}}
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
      console.error("Error fetching classes:", error?.response?.data?.message || error);
      toast.error("Failed to fetch classes");
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
          {"field": {"Name": "academic_year_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "period_c"}},
          {"field": {"Name": "grading_scale_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch class");
      return null;
    }
  }

  async create(classData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = {
        academic_year_c: classData.academic_year_c,
        subject_c: classData.subject_c,
        period_c: classData.period_c,
        grading_scale_c: classData.grading_scale_c || ""
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
          console.error(`Failed to create ${failed.length} classes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Class created successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error);
      toast.error("Failed to create class");
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
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
          console.error(`Failed to update ${failed.length} classes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Class updated successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error);
      toast.error("Failed to update class");
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
          console.error(`Failed to delete ${failed.length} classes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Class deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error);
      toast.error("Failed to delete class");
      return false;
    }
  }
}

export default new ClassService();
export default new ClassService();