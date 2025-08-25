import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { store } from "../../store";
import TaskModal from "../TaskBoard/TaskModal";
import type { Task } from "../../types";

// Mock the hooks with correct path
vi.mock("../../hooks/redux", async () => {
  const actual = await vi.importActual("../../hooks/redux");
  return {
    ...actual,
    useAppSelector: vi.fn((selector: any) => {
      // Check if this is the selectActiveUsers selector
      const selectorString = selector.toString();
      if (selectorString.includes('selectActiveUsers') || selector.name === 'selectActiveUsers') {
        return [
          { id: "user-1", name: "John Smith", role: "developer" },
          { id: "user-2", name: "Sarah Johnson", role: "designer" },
        ];
      }
      
      // Default return for other selectors
      return {
        currentProject: { 
          id: "project-1", 
          name: "Test Project",
          type: "task",
          description: "Test Description",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01"
        },
        sprints: [],
      };
    }),
    useAppDispatch: () => vi.fn(),
  };
});

describe("TaskModal", () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );

    expect(screen.getByText(/Create New Task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assignee/i)).toBeInTheDocument();
  });

  it("shows validation error if title is empty", async () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );

    const submitButton = screen.getByRole("button", { name: /Create Task/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Task title is required/i)
    ).toBeInTheDocument();
  });

  it("shows validation error if title is too short", async () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );

    const titleInput = screen.getByLabelText(/Task Title/i);
    fireEvent.change(titleInput, { target: { value: "AB" } });

    const submitButton = screen.getByRole("button", { name: /Create Task/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Task title must be at least 3 characters/i)
    ).toBeInTheDocument();
  });

  it("pre-fills form when editing a task", () => {
    const existingTask: Task = {
      id: "task-1",
      title: "Fix login bug",
      description: "Fix the bug in login page",
      priority: "medium",
      status: "in_review",
      projectId: "project-1",
      assignee: "user-1",
      reporter: "user-2",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      position: 0
    };

    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} task={existingTask} />
      </Provider>
    );

    expect(screen.getByDisplayValue("Fix login bug")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fix the bug in login page")).toBeInTheDocument();

    // Check select values by their actual values
    const prioritySelect = screen.getByLabelText(/Priority/i) as HTMLSelectElement;
    const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement;
    const assigneeSelect = screen.getByLabelText(/Assignee/i) as HTMLSelectElement;

    expect(prioritySelect.value).toBe("medium");
    expect(statusSelect.value).toBe("in_review");
    expect(assigneeSelect.value).toBe("user-1");
  });

  it("updates form fields when user types", () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );

    const titleInput = screen.getByLabelText(/Task Title/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    fireEvent.change(titleInput, { target: { value: "New Task Title" } });
    fireEvent.change(descriptionInput, { target: { value: "New task description" } });

    expect(titleInput).toHaveValue("New Task Title");
    expect(descriptionInput).toHaveValue("New task description");
  });

  it("updates select fields when user changes them", () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );

    const prioritySelect = screen.getByLabelText(/Priority/i) as HTMLSelectElement;
    const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement;

    fireEvent.change(prioritySelect, { target: { value: "high" } });
    fireEvent.change(statusSelect, { target: { value: "done" } });

    expect(prioritySelect.value).toBe("high");
    expect(statusSelect.value).toBe("done");
  });

  it("shows correct button text for create vs edit mode", () => {
    const { rerender } = render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );

    expect(screen.getByRole("button", { name: /Create Task/i })).toBeInTheDocument();

    const existingTask: Task = {
      id: "task-1",
      title: "Test Task",
      description: "Test Description",
      priority: "medium",
      status: "todo",
      projectId: "project-1",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      position: 0
    };

    rerender(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} task={existingTask} />
      </Provider>
    );

    expect(screen.getByRole("button", { name: /Update Task/i })).toBeInTheDocument();
  });

  it("closes when cancel button is clicked", () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <Provider store={store}>
        <TaskModal isOpen={false} onClose={onCloseMock} />
      </Provider>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("clears validation errors when user starts typing", async () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );

    const titleInput = screen.getByLabelText(/Task Title/i);
    const submitButton = screen.getByRole("button", { name: /Create Task/i });
    
    // Trigger validation error
    fireEvent.click(submitButton);
    expect(await screen.findByText(/Task title is required/i)).toBeInTheDocument();

    // Start typing to clear error
    fireEvent.change(titleInput, { target: { value: "New task" } });
    
    await waitFor(() => {
      expect(screen.queryByText(/Task title is required/i)).not.toBeInTheDocument();
    });
  });

  it("shows user options in assignee dropdown", () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} />
      </Provider>
    );
    
    // Check that user options are present in the DOM
    expect(screen.getByText("John Smith (developer)")).toBeInTheDocument();
    expect(screen.getByText("Sarah Johnson (designer)")).toBeInTheDocument();
  });

  it("uses default status when provided", async () => {
    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} defaultStatus="in_progress" />
      </Provider>
    );

    // Wait for the useEffect to run and set the default status
    await waitFor(() => {
      const statusSelect = screen.getByLabelText(/Status/i) as HTMLSelectElement;
      expect(statusSelect.value).toBe("in_progress");
    });
  });
});