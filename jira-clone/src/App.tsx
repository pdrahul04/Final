import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "./hooks/redux";
import { selectProject } from "./store/slices/projectsSlice";
import { Suspense, lazy, useMemo, useCallback } from "react";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import { Setting } from "./pages/Setting/Setting";
import { useSidebarState } from "./hooks/sidebar";
import { useProjectCreationState } from "./hooks/CreationState";

// Lazy load components
const Sidebar = lazy(() => import("./pages/Navigation/Sidebar"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const ProjectCreationForm = lazy(
  () => import("./components/ProjectCreation/ProjectCreationForm")
);
const TaskBoard = lazy(() => import("./pages/Task/TaskBoard"));
const Backlog = lazy(() => import("./components/Backlog/Backlog"));
const SprintManagement = lazy(() => import("./pages/Sprint/SprintManagement"));

// Route guard component
function ProtectedRoute({
  children,
  condition,
  fallback = "/dashboard",
}: {
  children: React.ReactNode;
  condition: boolean;
  fallback?: string;
}) {
  return condition ? <>{children}</> : <Navigate to={fallback} replace />;
}

function App() {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector((state) => state.projects);

  const { sidebarOpen, handleToggleSidebar } = useSidebarState();
  const {
    showProjectCreation,
    handleCreateProject,
    handleProjectCreationSuccess,
    handleProjectCreationCancel,
  } = useProjectCreationState();

  const handleSelectProject = useCallback(
    (projectId: string) => {
      dispatch(selectProject(projectId));
    },
    [dispatch]
  );

  // Memoized values
  const mainContentClasses = useMemo(
    () => `main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`,
    [sidebarOpen]
  );

  const dashboardProps = useMemo(
    () => ({
      onCreateProject: handleCreateProject,
      onSelectProject: handleSelectProject,
    }),
    [handleCreateProject, handleSelectProject]
  );

  const projectCreationProps = useMemo(
    () => ({
      onSuccess: handleProjectCreationSuccess,
      onCancel: handleProjectCreationCancel,
    }),
    [handleProjectCreationSuccess, handleProjectCreationCancel]
  );

  const isScrumProject = useMemo(
    () => currentProject?.type === "scrum",
    [currentProject?.type]
  );

  // Main content based on current state
  const mainContent = showProjectCreation ? (
    <ProjectCreationForm {...projectCreationProps} />
  ) : (
    <Routes>
      <Route path="/" element={<Dashboard {...dashboardProps} />} />
      <Route path="/dashboard" element={<Dashboard {...dashboardProps} />} />
      <Route
        path="/board"
        element={
          <ProtectedRoute condition={!!currentProject}>
            <TaskBoard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/backlog"
        element={
          <ProtectedRoute condition={isScrumProject}>
            <Backlog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sprints"
        element={
          <ProtectedRoute condition={isScrumProject}>
            <SprintManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/settings" element={<Setting />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );

  return (
    <div className="app-layout">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
          <main className={mainContentClasses}>{mainContent}</main>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
