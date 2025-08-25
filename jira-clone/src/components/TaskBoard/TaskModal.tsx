import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { createTask, updateTask } from "../../store/slices/tasksSlice";
import {
  X,
  Save,
  User,
  Flag,
  Calendar,
  PanelRightDashedIcon,
} from "lucide-react";
import type { Task, TaskPriority, TaskStatus } from "../../types";
import { selectActiveUsers } from "../../store/slices/usersSlice";
import { Modal } from "../UI/Modal/Modal";
import { FormField, Input, Select, Textarea } from "../UI/Form/Form";
import { Button } from "../UI/Button/Button";

interface TaskModalProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  defaultStatus,
}) => {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector((state) => state.projects);
  const { sprints } = useAppSelector((state) => state.sprints);
  const activeUsers = useAppSelector(selectActiveUsers);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    assignee: string;
    reporter: string;
  }>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assignee: "",
    reporter: "",
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
        assignee: task.assignee || "",
        reporter: task.reporter || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        assignee: "",
        reporter: "",
      });
    }
    setErrors({});
  }, [task, defaultStatus]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Task title must be at least 3 characters";
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
        dispatch(
          updateTask({
            id: task.id,
            updates: {
              title: formData.title.trim(),
              description: formData.description.trim(),
              priority: formData.priority,
              status: formData.status,
              assignee: formData.assignee.trim() || undefined,
              reporter: formData.reporter.trim() || undefined,
            },
          })
        );
      } else {
        // Create new task - for Scrum projects, assign to active sprint
        let sprintId: string | undefined = undefined;

        if (currentProject.type === "scrum") {
          const activeSprint = sprints.find(
            (sprint) =>
              sprint.projectId === currentProject.id &&
              sprint.status === "active"
          );
          sprintId = activeSprint?.id;
        }

        dispatch(
          createTask({
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            projectId: currentProject.id,
            sprintId: sprintId,
            assignee: formData.assignee.trim() || undefined,
            reporter: formData.reporter.trim() || undefined,
          })
        );
      }

      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (
    field: string,
    value: string | TaskPriority | TaskStatus
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
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

  const actions = (
    <div style={{ display: "flex", gap: "12px", paddingTop: "1rem" }}>
      <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button type="submit" loading={isSubmitting} icon={Save} form="task-form">
        {task ? "Update Task" : "Create Task"}
      </Button>
    </div>
  );

  const userOptions = activeUsers.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.role})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "Create New Task"}
      actions={actions}
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Task Title"
          id="taskTitle"
          required
          error={errors.title}
        >
          <Input
            id="taskTitle"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter task title"
            disabled={isSubmitting}
            error={errors.title}
          />
        </FormField>

        <FormField label="Description" id="taskDescription">
          <Textarea
            id="taskDescription"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe the task (optional)"
            rows={4}
            disabled={isSubmitting}
          />
        </FormField>

        <div className="form-row">
          <FormField label="Priority" id="taskPriority" icon={Flag}>
            <Select
              id="taskPriority"
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              options={priorityOptions}
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="Status" id="taskStatus" icon={Calendar}>
            <Select
              id="taskStatus"
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              options={statusOptions}
              disabled={isSubmitting}
            />
          </FormField>
        </div>

        <FormField label="Assignee" id="taskAssignee" icon={User}>
          <Select
            id="taskAssignee"
            value={formData.assignee || ""}
            onChange={(e) => handleInputChange("assignee", e.target.value)}
            options={userOptions}
            placeholder="Unassigned"
            disabled={isSubmitting}
          />
        </FormField>
      </form>
    </Modal>
  );
};

export default TaskModal;
