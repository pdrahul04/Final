import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import type { Task, TaskPriority, TaskStatus } from "../../types";
import { Plus, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useState } from "react";
import { deleteTask, updateTaskStatus } from "../../store/slices/tasksSlice";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableTask from "./DraggableTask";
import TaskModal from "./TaskModal";

// Droppable Column Component
const DroppableColumn: React.FC<{
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
      className={`board-column ${isOver ? "drag-over" : ""}`}
    >
      <div className="column-header" style={{ borderTopColor: color }}>
        <h3>{title}</h3>
        <div className="column-actions">
          <span className="task-count">{taskCount}</span>
          <button className="add-task-btn" onClick={onAddTask} title="Add task">
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className={`column-content ${isOver ? "drag-over" : ""}`}>
        {children}
      </div>
    </div>
  );
};

const TaskBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTaskMenu, setShowTaskMenu] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Filter tasks for current project
  const projectTasks = tasks.filter(
    (task) => task.projectId === currentProject?.id
  );

  // Group tasks by status
  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: projectTasks.filter((task) => task.status === "todo"),
    in_progress: projectTasks.filter((task) => task.status === "in_progress"),
    in_review: projectTasks.filter((task) => task.status === "in_review"),
    done: projectTasks.filter((task) => task.status === "done"),
  };

  // Column configuration
  const columns:{ status: TaskStatus; title: string; color: string }[]  = [
    { status: "todo", title: "To Do", color: "#6c757d" },
    { status: "in_progress", title: "In Progress", color: "#007bff" },
    { status: "in_review", title: "In Review", color: "#ffc107" },
    { status: "done", title: "Done", color: "#28a745" },
  ];

  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "#28a745";
      case "medium":
        return "#ffc107";
      case "high":
        return "#fd7e14";
      default:
        return "#6c757d";
    }
  };

  // Handle task status change
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    setShowTaskMenu(null);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    setShowTaskMenu(null);
  };

  // Handle create task
  const handleCreateTask = (columnStatus: TaskStatus) => {
    setShowCreateModal(true);
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = projectTasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
    setShowTaskMenu(null); // Close any open menus
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Only update if status actually changed
    const task = projectTasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      dispatch(updateTaskStatus({ id: taskId, status: newStatus }));
    }
  };

  if (!currentProject) {
    return (
      <div className="task-board-empty">
        <h2>No Project Selected</h2>
        <p>Please select a project from the dashboard to view tasks.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-board">
        <div className="task-board-header">
          <h1>{currentProject.name} - Task Board</h1>
          <p>Manage your tasks across different stages</p>
        </div>

        <div className="board-columns">
          {columns.map((column) => (
            <DroppableColumn
              key={column.status}
              status={column.status}
              title={column.title}
              color={column.color}
              taskCount={tasksByStatus[column.status].length}
              onAddTask={() => handleCreateTask(column.status as TaskStatus)}
            >
              <SortableContext
                items={tasksByStatus[column.status].map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                {tasksByStatus[column.status].map((task) => (
                  <DraggableTask
                    key={task.id}
                    task={task}
                    getPriorityColor={getPriorityColor}
                    showTaskMenu={showTaskMenu}
                    onMenuToggle={(taskId) =>
                      setShowTaskMenu(showTaskMenu === taskId ? null : taskId)
                    }
                    onEdit={setSelectedTask}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteTask}
                    columns={columns}
                  />
                ))}

                {tasksByStatus[column.status].length === 0 && (
                  <div className="empty-column">
                    <p>No tasks in {column.title.toLowerCase()}</p>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        handleCreateTask(column.status as TaskStatus)
                      }
                    >
                      <Plus size={14} />
                      Add first task
                    </button>
                  </div>
                )}
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>

        {/* Task Modal */}
        {(selectedTask || showCreateModal) && (
          <TaskModal
            task={selectedTask}
            isOpen={true}
            onClose={() => {
              setSelectedTask(null);
              setShowCreateModal(false);
            }}
            defaultStatus={showCreateModal ? "todo" : undefined}
          />
        )}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask ? (
          <div className="task-card dragging">
            <div className="task-header">
              <div
                className="task-priority"
                style={{
                  backgroundColor: getPriorityColor(
                    activeTask.priority as TaskPriority
                  ),
                }}
              />
            </div>
            <div className="task-content">
              <h4>{activeTask.title}</h4>
              {activeTask.description && (
                <p className="task-description">{activeTask.description}</p>
              )}
            </div>
            <div className="task-footer">
              {activeTask.assignee && (
                <div className="task-assignee">
                  <User size={12} />
                  <span>{activeTask.assignee}</span>
                </div>
              )}
              <span className="task-id">#{activeTask.id.slice(-6)}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;
