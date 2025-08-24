import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Edit, Trash2, User } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '../../types';

interface DraggableTaskProps {
  task: Task;
  getPriorityColor: (priority: TaskPriority) => string;
  showTaskMenu: string | null;
  onMenuToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  columns: Array<{ status: TaskStatus; title: string; color: string }>;
}

const DraggableTask: React.FC<DraggableTaskProps> = ({
  task,
  getPriorityColor,
  showTaskMenu,
  onMenuToggle,
  onEdit,
  onStatusChange,
  onDelete,
  columns
}) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-header">
        <div 
          className="task-priority"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
          title={`Priority: ${task.priority}`}
        />
        <button 
          className="task-menu-btn"
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle(task.id);
          }}
        >
          <MoreHorizontal size={16} />
        </button>
        
        {showTaskMenu === task.id && (
          <div className="task-menu">
            <button onClick={() => onEdit(task)}>
              <Edit size={14} />
              Edit
            </button>
            <div className="menu-divider" />
            <div className="status-submenu">
              <span>Move to:</span>
              {columns.filter(col => col.status !== task.status).map(col => (
                <button 
                  key={col.status}
                  onClick={() => onStatusChange(task.id, col.status)}
                >
                  {col.title}
                </button>
              ))}
            </div>
            <div className="menu-divider" />
            <button 
              className="delete-btn"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="task-content" onClick={() => onEdit(task)}>
        <h4>{task.title}</h4>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      <div className="task-footer">
        {task.assignee && (
          <div className="task-assignee">
            <User size={12} />
            <span>{task.assignee}</span>
          </div>
        )}
        <span className="task-id">#{task.id.slice(-6)}</span>
      </div>
    </div>
  );
};

export default DraggableTask;