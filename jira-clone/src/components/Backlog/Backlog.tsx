import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { createTask, moveTaskToSprint } from '../../store/slices/tasksSlice';
import { createSprint, startSprint, completeSprint } from '../../store/slices/sprintsSlice';
import { Plus, Play, Square, Calendar, Users, Target } from 'lucide-react';
import TaskModal from '../TaskBoard/TaskModal';
import SprintModal from './SprintModal';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { SprintStatus, Task, TaskPriority } from '../../types';
import { DndContext, DragOverlay, PointerSensor, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';

// Draggable Task Component for Backlog
const DraggableBacklogTask: React.FC<{
  task: Task;
  onEdit: (task: Task) => void;
}> = ({ task, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`backlog-task ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(task)}
    >
      <div className="task-priority-indicator" style={{ backgroundColor: getPriorityColor(task.priority) }} />
      <div className="task-content">
        <h4>{task.title}</h4>
        {task.description && <p>{task.description}</p>}
        <div className="task-meta">
          <span className="task-priority">{task.priority}</span>
          {task.assignee && <span className="task-assignee">@{task.assignee}</span>}
        </div>
      </div>
    </div>
  );
};

// Droppable Sprint Component
const DroppableSprint: React.FC<{
  sprint: any;
  tasks: Task[];
  onStartSprint: (sprintId: string) => void;
  onCompleteSprint: (sprintId: string) => void;
  onEditTask: (task: Task) => void;
  children: React.ReactNode;
}> = ({ sprint, tasks, onStartSprint, onCompleteSprint, onEditTask, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `sprint-${sprint.id}`,
  });

  const getSprintStatusColor = (status: SprintStatus) => {
    switch (status) {
      case 'planned': return '#6c757d';
      case 'active': return '#007bff';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getSprintStatusIcon = (status: SprintStatus) => {
    switch (status) {
      case 'planned': return Calendar;
      case 'active': return Play;
      case 'completed': return Square;
      default: return Calendar;
    }
  };

  const StatusIcon = getSprintStatusIcon(sprint.status);

  return (
    <div className={`sprint-container ${isOver ? 'drag-over' : ''}`}>
      <div className="sprint-header" style={{ borderLeftColor: getSprintStatusColor(sprint.status) }}>
        <div className="sprint-info">
          <div className="sprint-title">
            <StatusIcon size={16} />
            <h3>{sprint.name}</h3>
            <span className="sprint-status" style={{ color: getSprintStatusColor(sprint.status) }}>
              {sprint.status}
            </span>
          </div>
          <p className="sprint-description">{sprint.description}</p>
        </div>
        <div className="sprint-actions">
          {sprint.status === 'planned' && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onStartSprint(sprint.id)}
            >
              <Play size={14} />
              Start Sprint
            </button>
          )}
          {sprint.status === 'active' && (
            <button 
              className="btn btn-success btn-sm"
              onClick={() => onCompleteSprint(sprint.id)}
            >
              <Square size={14} />
              Complete Sprint
            </button>
          )}
        </div>
      </div>
      <div 
        ref={setNodeRef}
        className={`sprint-tasks ${isOver ? 'drag-over' : ''}`}
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="empty-sprint">
            <p>No tasks in this sprint</p>
            <span>Drag tasks from backlog to add them</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Backlog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector(state => state.projects);
  const { tasks } = useAppSelector(state => state.tasks);
  const { sprints } = useAppSelector(state => state.sprints);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (!currentProject) {
    return (
      <div className="backlog-empty">
        <h2>No Project Selected</h2>
        <p>Please select a project from the dashboard to manage backlog.</p>
      </div>
    );
  }

  // Filter tasks and sprints for current project
  const projectTasks = tasks.filter(task => task.projectId === currentProject.id);
  const projectSprints = sprints.filter(sprint => sprint.projectId === currentProject.id);
  
  // Get backlog tasks (tasks not assigned to any sprint)
  const backlogTasks = projectTasks.filter(task => !task.sprintId);
  
  // Get tasks for each sprint
  const getSprintTasks = (sprintId: string) => 
    projectTasks.filter(task => task.sprintId === sprintId);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = projectTasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Check if dropping on a sprint
    if (overId.startsWith('sprint-')) {
      const sprintId = overId.replace('sprint-', '');
      dispatch(moveTaskToSprint({ taskId, sprintId }));
    } else if (overId === 'backlog') {
      // Moving back to backlog
      dispatch(moveTaskToSprint({ taskId, sprintId: '' }));
    }
  };

  // Handle sprint actions
  const handleStartSprint = (sprintId: string) => {
    dispatch(startSprint(sprintId));
  };

  const handleCompleteSprint = (sprintId: string) => {
    dispatch(completeSprint(sprintId));
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="backlog">
        <div className="backlog-header">
          <div className="backlog-title">
            <h1>{currentProject.name} - Backlog</h1>
            <p>Manage your product backlog and plan sprints</p>
          </div>
          <div className="backlog-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowCreateTask(true)}
            >
              <Plus size={16} />
              Add Task
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateSprint(true)}
            >
              <Plus size={16} />
              Create Sprint
            </button>
          </div>
        </div>

        <div className="backlog-content">
          {/* Backlog Section */}
          <div className="backlog-section">
            <div className="section-header">
              <h2>
                <Target size={20} />
                Product Backlog
              </h2>
              <span className="task-count">{backlogTasks.length} tasks</span>
            </div>
            
            <BacklogDropZone tasks={backlogTasks} onEditTask={setSelectedTask} />
          </div>

          {/* Sprints Section */}
          <div className="sprints-section">
            <div className="section-header">
              <h2>
                <Calendar size={20} />
                Sprints
              </h2>
              <span className="sprint-count">{projectSprints.length} sprints</span>
            </div>

            {projectSprints.length === 0 ? (
              <div className="empty-sprints">
                <p>No sprints created yet</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateSprint(true)}
                >
                  <Plus size={16} />
                  Create Your First Sprint
                </button>
              </div>
            ) : (
              <div className="sprints-list">
                {projectSprints.map(sprint => {
                  const sprintTasks = getSprintTasks(sprint.id);
                  return (
                    <DroppableSprint
                      key={sprint.id}
                      sprint={sprint}
                      tasks={sprintTasks}
                      onStartSprint={handleStartSprint}
                      onCompleteSprint={handleCompleteSprint}
                      onEditTask={setSelectedTask}
                    >
                      {sprintTasks.map(task => (
                        <DraggableBacklogTask
                          key={task.id}
                          task={task}
                          onEdit={setSelectedTask}
                        />
                      ))}
                    </DroppableSprint>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {(selectedTask || showCreateTask) && (
          <TaskModal
            task={selectedTask}
            isOpen={true}
            onClose={() => {
              setSelectedTask(null);
              setShowCreateTask(false);
            }}
          />
        )}

        {showCreateSprint && (
          <SprintModal
            isOpen={true}
            onClose={() => setShowCreateSprint(false)}
          />
        )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="backlog-task dragging">
            <div className="task-priority-indicator" />
            <div className="task-content">
              <h4>{activeTask.title}</h4>
              {activeTask.description && <p>{activeTask.description}</p>}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

// Backlog Drop Zone Component
const BacklogDropZone: React.FC<{
  tasks: Task[];
  onEditTask: (task: Task) => void;
}> = ({ tasks, onEditTask }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'backlog',
  });

  return (
    <div 
      ref={setNodeRef}
      className={`backlog-tasks ${isOver ? 'drag-over' : ''}`}
    >
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map(task => (
          <DraggableBacklogTask
            key={task.id}
            task={task}
            onEdit={onEditTask}
          />
        ))}
      </SortableContext>
      
      {tasks.length === 0 && (
        <div className="empty-backlog">
          <Users size={48} />
          <h3>No tasks in backlog</h3>
          <p>Add tasks to start planning your sprints</p>
        </div>
      )}
    </div>
  );
};

export default Backlog;