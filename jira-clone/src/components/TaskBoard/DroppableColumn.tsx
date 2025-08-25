import { useDroppable } from "@dnd-kit/core";
import type { TaskStatus } from "../../types";
import { Plus } from "lucide-react";

// Droppable Column Component
export const DroppableColumn: React.FC<{
  status: TaskStatus;
  title: string;
  color: string;
  taskCount: number;
  onAddTask: () => void;
  children: React.ReactNode;
}> = ({ status, title, color, taskCount, onAddTask, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`board-column ${isOver ? 'drag-over' : ''}`}
    >
      <div className="column-header" style={{ borderTopColor: color }}>
        <h3>{title}</h3>
        <div className="column-actions">
          <span className="task-count">{taskCount}</span>
          <button 
            className="add-task-btn"
            onClick={onAddTask}
            title="Add task"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className={`column-content ${isOver ? 'drag-over' : ''}`}>
        {children}
      </div>
    </div>
  );
};