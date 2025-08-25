import { useCallback, useState } from "react";

// Custom hook for project creation state
export function useProjectCreationState() {
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