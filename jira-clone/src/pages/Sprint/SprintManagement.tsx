import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { startSprint, completeSprint, deleteSprint } from '../../store/slices/sprintsSlice';
import { 
  Play, 
  Square, 
  Calendar, 
  Clock, 
  Target, 
  Users, 
  BarChart3,
  Trash2,
  Edit
} from 'lucide-react';
import { formatDate } from '../../utils/localStorage';
import type { SprintStatus } from '../../types';

const SprintManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector(state => state.projects);
  const { tasks } = useAppSelector(state => state.tasks);
  const { sprints } = useAppSelector(state => state.sprints);
  
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <div className="sprint-management-empty">
        <h2>No Project Selected</h2>
        <p>Please select a project from the dashboard to manage sprints.</p>
      </div>
    );
  }

  // Filter sprints for current project
  const projectSprints = sprints.filter(sprint => sprint.projectId === currentProject.id);
  const projectTasks = tasks.filter(task => task.projectId === currentProject.id);

  // Get sprint statistics
  const getSprintStats = (sprintId: string) => {
    const sprintTasks = projectTasks.filter(task => task.sprintId === sprintId);
    const completedTasks = sprintTasks.filter(task => task.status === 'done');
    
    return {
      totalTasks: sprintTasks.length,
      completedTasks: completedTasks.length,
      completionRate: sprintTasks.length > 0 ? Math.round((completedTasks.length / sprintTasks.length) * 100) : 0
    };
  };

  // Get status color
  const getStatusColor = (status: SprintStatus) => {
    switch (status) {
      case 'planned': return '#6c757d';
      case 'active': return '#007bff';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  // Get status icon
  const getStatusIcon = (status: SprintStatus) => {
    switch (status) {
      case 'planned': return Calendar;
      case 'active': return Play;
      case 'completed': return Square;
      default: return Calendar;
    }
  };

  // Handle sprint actions
  const handleStartSprint = (sprintId: string) => {
    dispatch(startSprint(sprintId));
  };

  const handleCompleteSprint = (sprintId: string) => {
    dispatch(completeSprint(sprintId));
  };

  const handleDeleteSprint = (sprintId: string) => {
    if (window.confirm('Are you sure you want to delete this sprint? This action cannot be undone.')) {
      dispatch(deleteSprint(sprintId));
    }
  };

  // Calculate days remaining for active sprints
  const getDaysRemaining = (endDate?: string) => {
    if (!endDate) return null;
    
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  return (
    <div className="sprint-management">
      <div className="sprint-management-header">
        <div className="sprint-title">
          <h1>{currentProject.name} - Sprint Management</h1>
          <p>Track and manage your sprints</p>
        </div>
      </div>

      {projectSprints.length === 0 ? (
        <div className="empty-sprints-management">
          <Target size={64} />
          <h2>No Sprints Created</h2>
          <p>Go to the Backlog to create your first sprint and start planning your work.</p>
        </div>
      ) : (
        <div className="sprints-overview">
          {/* Active Sprint Highlight */}
          {projectSprints.find(s => s.status === 'active') && (
            <div className="active-sprint-section">
              <h2>
                <Play size={20} />
                Active Sprint
              </h2>
              {projectSprints
                .filter(sprint => sprint.status === 'active')
                .map(sprint => {
                  const stats = getSprintStats(sprint.id);
                  const daysRemaining = getDaysRemaining(sprint.endDate);
                  
                  return (
                    <div key={sprint.id} className="active-sprint-card">
                      <div className="sprint-card-header">
                        <div className="sprint-info">
                          <h3>{sprint.name}</h3>
                          <p>{sprint.description}</p>
                        </div>
                        <div className="sprint-progress">
                          <div className="progress-circle">
                            <span>{stats.completionRate}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sprint-metrics">
                        <div className="metric">
                          <BarChart3 size={16} />
                          <span>{stats.completedTasks}/{stats.totalTasks} tasks completed</span>
                        </div>
                        {daysRemaining !== null && (
                          <div className="metric">
                            <Clock size={16} />
                            <span>
                              {daysRemaining > 0 
                                ? `${daysRemaining} days remaining`
                                : daysRemaining === 0 
                                  ? 'Ends today'
                                  : `${Math.abs(daysRemaining)} days overdue`
                              }
                            </span>
                          </div>
                        )}
                        {sprint.startDate && (
                          <div className="metric">
                            <Calendar size={16} />
                            <span>Started {formatDate(sprint.startDate)}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="sprint-actions">
                        <button 
                          className="btn btn-success"
                          onClick={() => handleCompleteSprint(sprint.id)}
                        >
                          <Square size={16} />
                          Complete Sprint
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* All Sprints List */}
          <div className="all-sprints-section">
            <h2>All Sprints</h2>
            <div className="sprints-grid">
              {projectSprints.map(sprint => {
                const StatusIcon = getStatusIcon(sprint.status);
                const stats = getSprintStats(sprint.id);
                const statusColor = getStatusColor(sprint.status);
                
                return (
                  <div 
                    key={sprint.id} 
                    className={`sprint-card ${sprint.status === 'active' ? 'active' : ''}`}
                  >
                    <div className="sprint-card-header">
                      <div className="sprint-status-badge" style={{ backgroundColor: statusColor }}>
                        <StatusIcon size={14} />
                        <span>{sprint.status}</span>
                      </div>
                      <div className="sprint-menu">
                        <button 
                          className="btn-icon"
                          onClick={() => handleDeleteSprint(sprint.id)}
                          title="Delete sprint"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="sprint-content">
                      <h3>{sprint.name}</h3>
                      <p>{sprint.description}</p>
                      
                      <div className="sprint-stats">
                        <div className="stat">
                          <Users size={16} />
                          <span>{stats.totalTasks} tasks</span>
                        </div>
                        <div className="stat">
                          <BarChart3 size={16} />
                          <span>{stats.completionRate}% complete</span>
                        </div>
                      </div>

                      {(sprint.startDate || sprint.endDate) && (
                        <div className="sprint-dates">
                          {sprint.startDate && (
                            <div className="date">
                              <Calendar size={14} />
                              <span>Started: {formatDate(sprint.startDate)}</span>
                            </div>
                          )}
                          {sprint.endDate && (
                            <div className="date">
                              <Calendar size={14} />
                              <span>Ends: {formatDate(sprint.endDate)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="sprint-actions">
                      {sprint.status === 'planned' && (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStartSprint(sprint.id)}
                        >
                          <Play size={14} />
                          Start Sprint
                        </button>
                      )}
                      {sprint.status === 'active' && (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleCompleteSprint(sprint.id)}
                        >
                          <Square size={14} />
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SprintManagement;