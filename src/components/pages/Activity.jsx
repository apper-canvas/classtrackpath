import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import * as activityService from '@/services/api/activityService';
import studentService from '@/services/api/studentService';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Select from '@/components/atoms/Select';
import Input from '@/components/atoms/Input';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import Empty from '@/components/ui/Empty';
import FormField from '@/components/molecules/FormField';

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    status: 'All',
    type: 'All'
  });

  const [formData, setFormData] = useState({
    title_c: '',
    activity_type_c: 'Task',
    due_date_c: '',
    status_c: 'Planned',
    priority_c: 'Medium',
    description_c: '',
    related_to_c: ''
  });

  const activityTypes = ['Meeting', 'Call', 'Email', 'Task', 'Other'];
  const statusOptions = ['Planned', 'Completed', 'Cancelled'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getAll(filters);
      setActivities(data);
    } catch (err) {
      setError("Failed to load activities");
      console.error("Error loading activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
    }
  };

  useEffect(() => {
    loadActivities();
    loadStudents();
  }, []);

  useEffect(() => {
    loadActivities();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormData({
      title_c: '',
      activity_type_c: 'Task',
      due_date_c: '',
      status_c: 'Planned',
      priority_c: 'Medium',
      description_c: '',
      related_to_c: ''
    });
    setEditingActivity(null);
    setShowForm(false);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      title_c: activity.title_c || '',
      activity_type_c: activity.activity_type_c || 'Task',
      due_date_c: activity.due_date_c ? activity.due_date_c.split('T')[0] : '',
      status_c: activity.status_c || 'Planned',
      priority_c: activity.priority_c || 'Medium',
      description_c: activity.description_c || '',
      related_to_c: activity.related_to_c?.Id || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title_c.trim()) {
      toast.error("Title is required");
      return;
    }

    setSubmitting(true);
    try {
      const submitData = {
        ...formData,
        due_date_c: formData.due_date_c ? `${formData.due_date_c}T00:00:00` : undefined
      };

      if (editingActivity) {
        await activityService.update(editingActivity.Id, submitData);
      } else {
        await activityService.create(submitData);
      }

      resetForm();
      loadActivities();
    } catch (err) {
      console.error("Error submitting activity:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (activity) => {
    if (!window.confirm(`Are you sure you want to delete "${activity.title_c}"?`)) {
      return;
    }

    try {
      await activityService.deleteActivity(activity.Id);
      loadActivities();
    } catch (err) {
      console.error("Error deleting activity:", err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Planned':
        return 'bg-blue-100 text-blue-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return <Loading className="min-h-screen" />;
  }

  if (error) {
    return (
      <ErrorView
        message={error}
        onRetry={loadActivities}
        className="min-h-screen"
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">Manage your educational activities</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="premium-button"
        >
          <ApperIcon name="Plus" size={16} />
          {showForm ? 'Cancel' : 'New Activity'}
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="All">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <Select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="All">All Types</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Activity Form */}
      {showForm && (
        <Card className="mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingActivity ? 'Edit Activity' : 'New Activity'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Title"
                type="text"
                required
                value={formData.title_c}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title_c: e.target.value
                }))}
              />
              <FormField
                label="Type"
                type="select"
                value={formData.activity_type_c}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  activity_type_c: e.target.value
                }))}
                options={activityTypes.map(type => ({ value: type, label: type }))}
              />
              <FormField
                label="Due Date"
                type="date"
                value={formData.due_date_c}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  due_date_c: e.target.value
                }))}
              />
              <FormField
                label="Status"
                type="select"
                value={formData.status_c}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  status_c: e.target.value
                }))}
                options={statusOptions.map(status => ({ value: status, label: status }))}
              />
              <FormField
                label="Priority"
                type="select"
                value={formData.priority_c}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  priority_c: e.target.value
                }))}
                options={priorityOptions.map(priority => ({ value: priority, label: priority }))}
              />
              <FormField
                label="Related Student"
                type="select"
                value={formData.related_to_c}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  related_to_c: e.target.value
                }))}
                options={[
                  { value: '', label: 'Select Student (Optional)' },
                  ...students.map(student => ({
                    value: student.Id,
                    label: `${student.first_name_c} ${student.last_name_c}`
                  }))
                ]}
              />
            </div>
            <FormField
              label="Description"
              type="textarea"
              value={formData.description_c}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description_c: e.target.value
              }))}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={submitting}
                className="premium-button"
              >
                {submitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} />
                    {editingActivity ? 'Update' : 'Create'} Activity
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Activities List */}
      {activities.length === 0 ? (
        <Empty
          title="No Activities Found"
          description="Create your first activity to get started"
          actionText="New Activity"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <Card key={activity.Id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 truncate">
                  {activity.title_c}
                </h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleEdit(activity)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ApperIcon name="Edit" size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(activity)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-gray-900">{activity.activity_type_c}</span>
                </div>
                {activity.due_date_c && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due:</span>
                    <span className="text-gray-900">
                      {format(new Date(activity.due_date_c), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                {activity.related_to_c?.Name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Student:</span>
                    <span className="text-gray-900 truncate">
                      {activity.related_to_c.Name}
                    </span>
                  </div>
                )}
                {activity.description_c && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {activity.description_c}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <Badge className={getPriorityColor(activity.priority_c)}>
                  {activity.priority_c}
                </Badge>
                <Badge className={getStatusColor(activity.status_c)}>
                  {activity.status_c}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activity;