import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { createProject } from '../../store/slices/projectsSlice';
import type { CreateProjectFormData, ProjectType } from '../../types';
import { CheckSquare, FileText, FolderPlus, Zap } from 'lucide-react';

interface ProjectCreationFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({ onCancel, onSuccess }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<CreateProjectFormData>({
    name: '',
    description: '',
    type: 'task'
  });
  const [errors, setErrors] = useState<Partial<CreateProjectFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<CreateProjectFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      dispatch(createProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        type: formData.type
      }));
      
      onSuccess();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof CreateProjectFormData, value: string | ProjectType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Project type options with descriptions
  const projectTypes = [
    {
      type: 'task',
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Simple task board for managing work items with To Do, In Progress, and Done columns.'
    },
    {
      type: 'scrum',
      icon: Zap,
      title: 'Scrum',
      description: 'Agile project with backlog, sprints, and advanced planning features.'
    },
    {
      type: 'blank',
      icon: FileText,
      title: 'Blank Project',
      description: 'Start with an empty project and customize it as needed.'
    }
  ];

  return (
    <div className="project-creation-form">
      <div className="form-header">
        <FolderPlus className="form-icon" />
        <h2>Create New Project</h2>
        <p>Choose a project type and provide basic information to get started.</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {/* Project Name */}
        <div className="form-group">
          <label htmlFor="projectName" className="form-label">
            Project Name *
          </label>
          <input
            id="projectName"
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter project name"
            disabled={isSubmitting}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        {/* Project Description */}
        <div className="form-group">
          <label htmlFor="projectDescription" className="form-label">
            Description *
          </label>
          <textarea
            id="projectDescription"
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your project"
            rows={3}
            disabled={isSubmitting}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        {/* Project Type Selection */}
        <div className="form-group">
          <label className="form-label">Project Type *</label>
          <div className="project-type-grid">
            {projectTypes.map(({ type, icon: Icon, title, description }) => (
              <div
                key={type}
                className={`project-type-card ${formData.type === type ? 'selected' : ''}`}
                onClick={() => handleInputChange('type', type)}
              >
                <div className="project-type-header">
                  <Icon className="project-type-icon" />
                  <h4>{title}</h4>
                </div>
                <p>{description}</p>
                <div className="project-type-radio">
                  <input
                    type="radio"
                    name="projectType"
                    value={type}
                    checked={formData.type === type}
                    onChange={() => handleInputChange('type', type)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectCreationForm;