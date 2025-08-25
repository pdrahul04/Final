import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { selectProject } from './store/slices/projectsSlice';
import { Suspense, lazy, useMemo, useCallback, useState } from 'react';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';
import { Setting } from './pages/Setting/Setting';

// Lazy load components for code splitting
const Sidebar = lazy(() => import('./pages/Navigation/Sidebar'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ProjectCreationForm = lazy(() => import('./components/ProjectCreation/ProjectCreationForm'));
const TaskBoard = lazy(() => import('./pages/Task/TaskBoard'));
const Backlog = lazy(() => import('./components/Backlog/Backlog'));
const SprintManagement = lazy(() => import('./pages/Sprint/SprintManagement'));

// Custom hook for sidebar state management
function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Persist sidebar state in localStorage
    const saved = localStorage.getItem('sidebar-open');
    return saved ? JSON.parse(saved) : true;
  });

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev: boolean) => {
      const newState = !prev;
      localStorage.setItem('sidebar-open', JSON.stringify(newState));
      return newState;
    });
  }, []);

  return { sidebarOpen, handleToggleSidebar };
}

// Custom hook for project creation state
function useProjectCreationState() {
  const [showProjectCreation, setShowProjectCreation] = useState(false);

  const handleCreateProject = useCallback(() => {
    setShowProjectCreation(true);
  }, []);

  const handleProjectCreationSuccess = useCallback(() => {
    setShowProjectCreation(false);
  }, []);

  const handleProjectCreationCancel = useCallback(() => {
    setShowProjectCreation(false);
  }, []);

  return {
    showProjectCreation,
    handleCreateProject,
    handleProjectCreationSuccess,
    handleProjectCreationCancel
  };
}

// Route guard component
function ProtectedRoute({ 
  children, 
  condition, 
  fallback = "/dashboard" 
}: { 
  children: React.ReactNode;
  condition: boolean;
  fallback?: string;
}) {
  return condition ? <>{children}</> : <Navigate to={fallback} replace />;
}

function App() {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector(state => state.projects);
  
  const { sidebarOpen, handleToggleSidebar } = useSidebarState();
  const {
    showProjectCreation,
    handleCreateProject,
    handleProjectCreationSuccess,
    handleProjectCreationCancel
  } = useProjectCreationState();

  const handleSelectProject = useCallback((projectId: string) => {
    dispatch(selectProject(projectId));
  }, [dispatch]);

  // Memoize main content classes
  const mainContentClasses = useMemo(
    () => `main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`,
    [sidebarOpen]
  );

  // Memoize dashboard props to prevent unnecessary re-renders
  const dashboardProps = useMemo(() => ({
    onCreateProject: handleCreateProject,
    onSelectProject: handleSelectProject
  }), [handleCreateProject, handleSelectProject]);

  // Memoize project creation form props
  const projectCreationProps = useMemo(() => ({
    onSuccess: handleProjectCreationSuccess,
    onCancel: handleProjectCreationCancel
  }), [handleProjectCreationSuccess, handleProjectCreationCancel]);

  // Check if current project is scrum type
  const isScrumProject = useMemo(() => 
    currentProject?.type === 'scrum', 
    [currentProject?.type]
  );

  if (showProjectCreation) {
    return (
      <div className="app-layout">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
            <main className={mainContentClasses}>
              <ProjectCreationForm {...projectCreationProps} />
            </main>
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
          <main className={mainContentClasses}>
            <Routes>
              <Route 
                path="/" 
                element={<Dashboard {...dashboardProps} />} 
              />
              <Route 
                path="/dashboard" 
                element={<Dashboard {...dashboardProps} />} 
              />
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
          </main>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;