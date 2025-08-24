import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { createTask, updateTask } from "../../store/slices/tasksSlice";
import { X, Save, User, Flag, Calendar } from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "../../types";

interface TaskModalProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, defaultStatus }) => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector(state => state.projects);
  const { sprints } = useAppSelector(state => state.sprints);
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    assignee: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assignee: "",
  });


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        assignee: ''
      });
    }
    setErrors({});
  }, [task, defaultStatus]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !currentProject) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (task) {
        // Update existing task
        dispatch(updateTask({
          id: task.id,
          updates: {
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            status: formData.status,
            assignee: formData.assignee.trim() || undefined
          }
        }));
      } else {
        // Create new task - for Scrum projects, assign to active sprint
        let sprintId: string | undefined = undefined;
        
        if (currentProject.type === 'scrum') {
          const activeSprint = sprints.find(sprint => 
            sprint.projectId === currentProject.id && sprint.status === 'active'
          );
          sprintId = activeSprint?.id;
        }
        
        dispatch(createTask({
          title: formData.title.trim(),
          description: formData.description.trim(),
          priority: formData.priority,
          projectId: currentProject.id,
          sprintId: sprintId,
          assignee: formData.assignee.trim() || undefined
        }));
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | TaskPriority | TaskStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Priority options
   const priorityOptions = [
    { value: "low", label: "Low", color: "#28a745" },
    { value: "medium", label: "Medium", color: "#ffc107" },
    { value: "high", label: "High", color: "#fd7e14" },
  ];

  // Status options
  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "in_review", label: "In Review" },
    { value: "done", label: "Done" },
  ];
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Task Title */}
          <div className="form-group">
            <label htmlFor="taskTitle" className="form-label">
              Task Title *
            </label>
            <input
              id="taskTitle"
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter task title"
              disabled={isSubmitting}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Task Description */}
          <div className="form-group">
            <label htmlFor="taskDescription" className="form-label">
              Description
            </label>
            <textarea
              id="taskDescription"
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the task (optional)"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Priority and Status Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="taskPriority" className="form-label">
                <Flag size={16} />
                Priority
              </label>
              <select
                id="taskPriority"
                className="form-select"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as TaskPriority)}
                disabled={isSubmitting}
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="taskStatus" className="form-label">
                <Calendar size={16} />
                Status
              </label>
              <select
                id="taskStatus"
                className="form-select"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as TaskStatus)}
                disabled={isSubmitting}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee */}
          <div className="form-group">
            <label htmlFor="taskAssignee" className="form-label">
              <User size={16} />
              Assignee
            </label>
            <input
              id="taskAssignee"
              type="text"
              className="form-input"
              value={formData.assignee}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              placeholder="Enter assignee name (optional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Form Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Save size={16} />
              {isSubmitting ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;