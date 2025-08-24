import { useState } from 'react';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { selectProject } from './store/slices/projectsSlice';
import { toggleSidebar } from './store/slices/uiSlice';
import Sidebar from './components/Navigation/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectCreationForm from './components/ProjectCreation/ProjectCreationForm';
import TaskBoard from './components/TaskBoard/TaskBoard';

function App() {
  const dispatch = useAppDispatch();
  const { sidebarOpen, currentView } = useAppSelector(state => state.ui);
  const { currentProject } = useAppSelector(state => state.projects);
  const [showProjectCreation, setShowProjectCreation] = useState(false);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleCreateProject = () => {
    setShowProjectCreation(true);
  };

  const handleProjectCreationSuccess = () => {
    setShowProjectCreation(false);
  };

  const handleProjectCreationCancel = () => {
    setShowProjectCreation(false);
  };

  const handleSelectProject = (projectId: string) => {
    dispatch(selectProject(projectId));
  };

  // Render current view content
  const renderMainContent = () => {
    if (showProjectCreation) {
      return (
        <ProjectCreationForm
          onSuccess={handleProjectCreationSuccess}
          onCancel={handleProjectCreationCancel}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            onCreateProject={handleCreateProject}
            onSelectProject={handleSelectProject}
          />
        );
      case 'board':
        return (
          <TaskBoard />
        );
      case 'backlog':
        return (
          <div className="view-placeholder">
            <h2>Backlog</h2>
            <p>Backlog view will be implemented in Step 5</p>
          </div>
        );
      case 'sprints':
        return (
          <div className="view-placeholder">
            <h2>Sprints</h2>
            <p>Sprint management will be implemented in Step 5</p>
          </div>
        );
      default:
        return (
          <Dashboard
            onCreateProject={handleCreateProject}
            onSelectProject={handleSelectProject}
          />
        );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {renderMainContent()}
      </main>
    </div>
  );
}

export default App;