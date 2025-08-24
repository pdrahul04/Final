import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { selectProject } from './store/slices/projectsSlice';
import Sidebar from './components/Navigation/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectCreationForm from './components/ProjectCreation/ProjectCreationForm';
import TaskBoard from './components/TaskBoard/TaskBoard';
import Backlog from './components/Backlog/Backlog';
import SprintManagement from './components/Sprints/SprintManagement';
import { useState } from 'react';
import { Settings } from './components/Settings/Setting';

function App() {
  const dispatch = useAppDispatch();
  const { currentProject } = useAppSelector(state => state.projects);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProjectCreation, setShowProjectCreation] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

  if (showProjectCreation) {
    return (
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <ProjectCreationForm
            onSuccess={handleProjectCreationSuccess}
            onCancel={handleProjectCreationCancel}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard
                onCreateProject={handleCreateProject}
                onSelectProject={handleSelectProject}
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <Dashboard
                onCreateProject={handleCreateProject}
                onSelectProject={handleSelectProject}
              />
            } 
          />
          <Route 
            path="/board" 
            element={
              currentProject ? <TaskBoard /> : <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/backlog" 
            element={
              currentProject?.type === 'scrum' ? <Backlog /> : <Navigate to="/dashboard" replace />
            } 
          />
          <Route 
            path="/sprints" 
            element={
              currentProject?.type === 'scrum' ? <SprintManagement /> : <Navigate to="/dashboard" replace />
            } 
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;