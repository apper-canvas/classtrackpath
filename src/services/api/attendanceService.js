import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class AttendanceService {
  constructor() {
    this.tableName = 'attendance_c';
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
const client = getApperClient();
      if (!client) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "recorded_at_c"}},
          {"field": {"Name": "student_id_c"}}
        ]
      };
      
const apperClient = await getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
      toast.error("Failed to fetch attendance");
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "recorded_at_c"}},
          {"field": {"Name": "student_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch attendance record");
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "recorded_at_c"}},
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

const apperClient = await getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching student attendance:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDate(date) {
    try {
const client = getApperClient();
      if (!client) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "recorded_at_c"}},
          {"field": {"Name": "student_id_c"}}
        ],
        where: [
          {
            "FieldName": "date_c",
            "Operator": "EqualTo",
            "Values": [date]
          }
        ]
      };

const apperClient = await getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance by date:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = this.prepareLookupFields({
        date_c: attendanceData.date_c,
        status_c: attendanceData.status_c,
        notes_c: attendanceData.notes_c || "",
        recorded_at_c: new Date().toISOString(),
        student_id_c: attendanceData.student_id_c
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
          console.error(`Failed to create ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Attendance marked successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error);
      toast.error("Failed to mark attendance");
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
        ...updateData,
        recorded_at_c: new Date().toISOString()
      });

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
          console.error(`Failed to update ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Attendance updated successfully');
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error);
      toast.error("Failed to update attendance");
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
          console.error(`Failed to delete ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success('Attendance deleted successfully');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error);
      toast.error("Failed to delete attendance");
      return false;
    }
  }

  async calculateAttendanceRate(studentId, startDate = null, endDate = null) {
    try {
      let records = await this.getByStudentId(studentId);
      
      if (startDate) {
        records = records.filter(record => record.date_c >= startDate);
      }
      if (endDate) {
        records = records.filter(record => record.date_c <= endDate);
      }
      
      if (records.length === 0) return 100;
      
      const presentCount = records.filter(record => 
        record.status_c === "Present" || record.status_c === "Tardy"
      ).length;
      
      return Math.round((presentCount / records.length) * 100);
    } catch (error) {
      console.error("Error calculating attendance rate:", error);
      return 0;
    }
  }

  async markAttendance(studentId, date, status, notes = "") {
    try {
const client = getApperClient();
      if (!client) {
        throw new Error('ApperClient not initialized');
      }

      // Check if record already exists for this student and date
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "student_id_c"}}
        ],
        where: [
          {
            "FieldName": "student_id_c",
            "Operator": "EqualTo",
            "Values": [parseInt(studentId)]
          },
          {
            "FieldName": "date_c",
            "Operator": "EqualTo",
            "Values": [date]
          }
        ]
      };

const apperClient = await getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const existingRecords = response.data || [];
      
      if (existingRecords.length > 0) {
        // Update existing record
        const existingRecord = existingRecords[0];
        return await this.update(existingRecord.Id, {
          status_c: status,
          notes_c: notes
        });
      } else {
        // Create new record
        return await this.create({
          student_id_c: parseInt(studentId),
          date_c: date,
          status_c: status,
          notes_c: notes
        });
      }
    } catch (error) {
      console.error("Error marking attendance:", error?.response?.data?.message || error);
      toast.error("Failed to mark attendance");
      return null;
    }
  }
}

export default new AttendanceService();