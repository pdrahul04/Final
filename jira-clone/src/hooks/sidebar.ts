import { useCallback, useState } from "react";

export function useSidebarState() {
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