import React from 'react';
import { useAppSelector } from '../../hooks/redux';
import { Plus, FolderOpen, CheckSquare, Zap, FileText } from 'lucide-react';
import { formatDate } from '../../utils/localStorage';
import type { ProjectType } from '../../types';

interface DashboardProps {
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateProject, onSelectProject }) => {
  const { projects, currentProject } = useAppSelector(state => state.projects);
  const { tasks } = useAppSelector(state => state.tasks);
  const { sprints } = useAppSelector(state => state.sprints);

  // Get project type icon
  const getProjectTypeIcon = (type: ProjectType) => {
    switch (type) {
      case 'task':
        return CheckSquare;
      case 'scrum':
        return Zap;
      case 'blank':
        return FileText;
      default:
        return FolderOpen;
    }
  };

  // Get project type display name
  const getProjectTypeName = (type: ProjectType) => {
    switch (type) {
      case 'task':
        return 'Task Management';
      case 'scrum':
        return 'Scrum';
      case 'blank':
        return 'Blank Project';
      default:
        return 'Unknown';
    }
  };

  // Get project statistics
  const getProjectStats = (projectId: string) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const projectSprints = sprints.filter(sprint => sprint.projectId === projectId);
    
    return {
      totalTasks: projectTasks.length,
      completedTasks: projectTasks.filter(task => task.status === 'done').length,
      totalSprints: projectSprints.length,
      activeSprints: projectSprints.filter(sprint => sprint.status === 'active').length
    };
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Project Dashboard</h1>
          <p>Manage your projects and track progress</p>
        </div>
        <button className="btn btn-primary" onClick={onCreateProject}>
          <Plus size={20} />
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={64} className="empty-icon" />
          <h2>No Projects Yet</h2>
          <p>Create your first project to get started with task management.</p>
          <button className="btn btn-primary" onClick={onCreateProject}>
            <Plus size={20} />
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => {
            const Icon = getProjectTypeIcon(project.type);
            const stats = getProjectStats(project.id);
            const isCurrentProject = currentProject?.id === project.id;

            return (
              <div
                key={project.id}
                className={`project-card ${isCurrentProject ? 'current' : ''}`}
                onClick={() => onSelectProject(project.id)}
              >
                <div className="project-card-header">
                  <div className="project-info">
                    <Icon className="project-icon" />
                    <div>
                      <h3>{project.name}</h3>
                      <span className="project-type">{getProjectTypeName(project.type)}</span>
                    </div>
                  </div>
                  {isCurrentProject && (
                    <span className="current-badge">Current</span>
                  )}
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-stats">
                  <div className="stat">
                    <span className="stat-value">{stats.totalTasks}</span>
                    <span className="stat-label">Tasks</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{stats.completedTasks}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                  {project.type === 'scrum' && (
                    <div className="stat">
                      <span className="stat-value">{stats.totalSprints}</span>
                      <span className="stat-label">Sprints</span>
                    </div>
                  )}
                </div>

                <div className="project-footer">
                  <span className="project-date">
                    Created {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;