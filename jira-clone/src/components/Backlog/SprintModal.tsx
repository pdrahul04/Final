import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { createSprint } from '../../store/slices/sprintsSlice';
import { X, Save, Calendar, Target } from 'lucide-react';
import type { CreateSprintFormData } from '../../types';

interface SprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SprintModal: React.FC<SprintModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector(state => state.projects);
  
  const [formData, setFormData] = useState<CreateSprintFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Sprint name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Sprint name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Sprint description is required';
    }

    // Validate dates if provided
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
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
      dispatch(createSprint({
        name: formData.name.trim(),
        description: formData.description.trim(),
        projectId: currentProject.id,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined
      }));
      
      onClose();
    } catch (error) {
      console.error('Failed to create sprint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof CreateSprintFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Get suggested sprint name
  const getSuggestedSprintName = () => {
    const sprintNumber = Math.floor(Math.random() * 100) + 1;
    return `Sprint ${sprintNumber}`;
  };

  // Auto-fill sprint name if empty
  const handleNameFocus = () => {
    if (!formData.name) {
      setFormData(prev => ({ ...prev, name: getSuggestedSprintName() }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Sprint</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Sprint Name */}
          <div className="form-group">
            <label htmlFor="sprintName" className="form-label">
              <Target size={16} />
              Sprint Name *
            </label>
            <input
              id="sprintName"
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onFocus={handleNameFocus}
              placeholder="Enter sprint name"
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Sprint Description */}
          <div className="form-group">
            <label htmlFor="sprintDescription" className="form-label">
              Description *
            </label>
            <textarea
              id="sprintDescription"
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the sprint goals and objectives"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Date Range */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">
                <Calendar size={16} />
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                className="form-input"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate" className="form-label">
                <Calendar size={16} />
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                className={`form-input ${errors.endDate ? 'error' : ''}`}
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                disabled={isSubmitting}
              />
              {errors.endDate && <span className="error-message">{errors.endDate}</span>}
            </div>
          </div>

          {/* Sprint Tips */}
          <div className="sprint-tips">
            <h4>Sprint Planning Tips:</h4>
            <ul>
              <li>Keep sprints between 1-4 weeks long</li>
              <li>Define clear, achievable goals</li>
              <li>Add tasks from the backlog after creating the sprint</li>
              <li>Start the sprint when your team is ready to begin</li>
            </ul>
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
              {isSubmitting ? 'Creating...' : 'Create Sprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SprintModal;