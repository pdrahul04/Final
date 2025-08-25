import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { store } from "../../store";
import TaskModal from "../TaskBoard/TaskModal";
import type { Task } from "../../types";

vi.mock("../../../hooks/redux", async () => {
  const actual = await vi.importActual("../../../hooks/redux");
  return {
    ...actual,
    useAppSelector: vi.fn((selector: any) => {
      // Mocked selectors
      if (selector.name === "selectActiveUsers") {
        return [
          { id: "1", name: "Alice", role: "Developer" },
          { id: "2", name: "Bob", role: "Tester" },
        ];
      }

      return {
        currentProject: { id: "project-1", type: "task" },
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
    expect(screen.getByLabelText(/Reporter/i)).toBeInTheDocument();
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
  
  it("pre-fills form when editing a task", () => {
    const existingTask: Task = {
      id: "task-1",
      title: "Fix login bug",
      description: "Fix the bug in login page",
      priority: "medium",
      status: "in_review",
      projectId: "project-1",
      assignee: "user-1", // John Smith's ID
      reporter: "user-2", // Sarah Johnson's ID
      createdAt: "",
      updatedAt: "",
      position: 0,
    };

    render(
      <Provider store={store}>
        <TaskModal isOpen={true} onClose={onCloseMock} task={existingTask} />
      </Provider>
    );

    expect(screen.getByDisplayValue(/Fix login bug/i)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(/Fix the bug in login page/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /priority/i })
    ).toHaveDisplayValue(/medium/i);
    expect(
      screen.getByRole("combobox", { name: /status/i })
    ).toHaveDisplayValue(/in review/i);
    expect(
      screen.getByRole("combobox", { name: /assignee/i })
    ).toHaveDisplayValue("John Smith (developer)");
    expect(
      screen.getByRole("combobox", { name: /reporter/i })
    ).toHaveDisplayValue("Sarah Johnson (designer)");
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
});
