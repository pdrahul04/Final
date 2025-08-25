import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useSidebarState } from "../hooks/sidebar";
import { useProjectCreationState } from "../hooks/creationState";
import { Suspense, useCallback, useMemo } from "react";
import { selectProject } from "../store/slices/projectsSlice";
import ProjectCreationForm from "../components/ProjectCreation/ProjectCreationForm";
import Dashboard from "../pages/Dashboard/Dashboard";
import TaskBoard from "../pages/Task/TaskBoard";
import Backlog from "../components/Backlog/Backlog";
import SprintManagement from "../pages/Sprint/SprintManagement";
import { Setting } from "../pages/Setting/Setting";
import ErrorBoundary from "../components/Common/ErrorBoundary";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import Sidebar from "../pages/Navigation/Sidebar";

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


function AppRoute(){

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

export default AppRoute;