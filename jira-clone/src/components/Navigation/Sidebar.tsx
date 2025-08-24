import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setCurrentView } from '../../store/slices/uiSlice';
import { 
  Home, 
  Kanban, 
  List, 
  Zap, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { ViewType } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const dispatch = useAppDispatch();
  const { currentView } = useAppSelector(state => state.ui);
  const { currentProject } = useAppSelector(state => state.projects);

  const handleViewChange = (view: ViewType) => {
    dispatch(setCurrentView(view));
  };

  // Navigation items based on project type
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home, view: 'dashboard' as ViewType}
    ];

    if (!currentProject) {
      return baseItems;
    }

    const projectItems = [
      { id: 'board', label: 'Board', icon: Kanban, view: 'board' as ViewType}
    ];

    // Add scrum-specific items
    if (currentProject.type === 'scrum') {
      projectItems.push(
        { id: 'backlog', label: 'Backlog', icon: List, view: 'backlog' as ViewType },
        { id: 'sprints', label: 'Sprints', icon: Zap, view: 'sprints' as ViewType }
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
          const isActive = currentView === item.view;

          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleViewChange(item.view)}
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
          <button className="nav-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;