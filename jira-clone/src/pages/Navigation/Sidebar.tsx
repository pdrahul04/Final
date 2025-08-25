import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { 
  Home, 
  Kanban, 
  List, 
  Zap, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProject } = useAppSelector(state => state.projects);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Navigation items based on project type
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' }
    ];

    if (!currentProject) {
      return baseItems;
    }

    const projectItems = [
      { id: 'board', label: 'Board', icon: Kanban, path: '/board' }
    ];

    // Add scrum-specific items
    if (currentProject.type === 'scrum') {
      projectItems.push(
        { id: 'backlog', label: 'Backlog', icon: List, path: '/backlog' },
        { id: 'sprints', label: 'Sprints', icon: Zap, path: '/sprints' }
      );
    }

    return [...baseItems, ...projectItems];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          {isOpen && (
            <>
              <h2>Jira Clone</h2>
              {currentProject && (
                <span className="current-project">{currentProject.name}</span>
              )}
            </>
          )}
        </div>
        <button className="sidebar-toggle" onClick={onToggle}>
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
              title={!isOpen ? item.label : undefined}
            >
              <Icon size={20} />
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {isOpen && (
        <div className="sidebar-footer">
          <button 
            className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('/settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;