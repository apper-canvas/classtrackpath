import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

const TABLE_NAME = 'activities_c';

// Get all activities
export const getAll = async (filters = {}) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      throw new Error("ApperClient not initialized");
    }

    const params = {
      fields: [
        { "field": { "Name": "Id" } },
        { "field": { "Name": "title_c" } },
        { "field": { "Name": "activity_type_c" } },
        { "field": { "Name": "due_date_c" } },
        { "field": { "Name": "status_c" } },
        { "field": { "Name": "priority_c" } },
        { "field": { "Name": "description_c" } },
        { "field": { "Name": "related_to_c" } },
        { "field": { "Name": "CreatedOn" } },
        { "field": { "Name": "ModifiedOn" } }
      ],
      orderBy: [{ "fieldName": "due_date_c", "sorttype": "DESC" }],
      pagingInfo: { "limit": 100, "offset": 0 }
    };

    // Add filters if provided
    if (filters.status && filters.status !== 'All') {
      params.where = params.where || [];
      params.where.push({
        "FieldName": "status_c",
        "Operator": "EqualTo",
        "Values": [filters.status],
        "Include": true
      });
    }

    if (filters.type && filters.type !== 'All') {
      params.where = params.where || [];
      params.where.push({
        "FieldName": "activity_type_c",
        "Operator": "EqualTo",
        "Values": [filters.type],
        "Include": true
      });
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching activities:", error?.response?.data?.message || error);
    return [];
  }
};

// Get activity by ID
export const getById = async (id) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      throw new Error("ApperClient not initialized");
    }

    const params = {
      fields: [
        { "field": { "Name": "Id" } },
        { "field": { "Name": "title_c" } },
        { "field": { "Name": "activity_type_c" } },
        { "field": { "Name": "due_date_c" } },
        { "field": { "Name": "status_c" } },
        { "field": { "Name": "priority_c" } },
        { "field": { "Name": "description_c" } },
        { "field": { "Name": "related_to_c" } },
        { "field": { "Name": "CreatedOn" } },
        { "field": { "Name": "ModifiedOn" } }
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, id, params);

    if (!response?.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
    return null;
  }
};

// Create new activity
export const create = async (activityData) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      throw new Error("ApperClient not initialized");
    }

    // Filter only updateable fields and non-empty values
    const record = {};
    if (activityData.title_c) record.title_c = activityData.title_c;
    if (activityData.activity_type_c) record.activity_type_c = activityData.activity_type_c;
    if (activityData.due_date_c) record.due_date_c = activityData.due_date_c;
    if (activityData.status_c) record.status_c = activityData.status_c;
    if (activityData.priority_c) record.priority_c = activityData.priority_c;
    if (activityData.description_c) record.description_c = activityData.description_c;
    if (activityData.related_to_c) record.related_to_c = parseInt(activityData.related_to_c);

    const params = {
      records: [record]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} activities: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success('Activity created successfully');
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error creating activity:", error?.response?.data?.message || error);
    toast.error("Failed to create activity");
    return null;
  }
};

// Update activity
export const update = async (id, activityData) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      throw new Error("ApperClient not initialized");
    }

    // Filter only updateable fields and non-empty values
    const record = { Id: parseInt(id) };
    if (activityData.title_c) record.title_c = activityData.title_c;
    if (activityData.activity_type_c) record.activity_type_c = activityData.activity_type_c;
    if (activityData.due_date_c) record.due_date_c = activityData.due_date_c;
    if (activityData.status_c) record.status_c = activityData.status_c;
    if (activityData.priority_c) record.priority_c = activityData.priority_c;
    if (activityData.description_c) record.description_c = activityData.description_c;
    if (activityData.related_to_c) record.related_to_c = parseInt(activityData.related_to_c);

    const params = {
      records: [record]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} activities: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error.message}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success('Activity updated successfully');
        return successful[0].data;
      }
    }

    return null;
  } catch (error) {
    console.error("Error updating activity:", error?.response?.data?.message || error);
    toast.error("Failed to update activity");
    return null;
  }
};

// Delete activity
export const deleteActivity = async (id) => {
  try {
    const apperClient = await getApperClient();
    if (!apperClient) {
      throw new Error("ApperClient not initialized");
    }

    const params = {
      RecordIds: [parseInt(id)]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} activities: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        toast.success('Activity deleted successfully');
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error deleting activity:", error?.response?.data?.message || error);
    toast.error("Failed to delete activity");
    return false;
  }
};