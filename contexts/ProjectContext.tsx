import React, {createContext, useContext} from 'react';
import type {Project} from '../db';

type ProjectContextType = {
  project: Project;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{
  project: Project;
  children: React.ReactNode;
}> = ({project, children}) => {
  return (
    <ProjectContext.Provider value={{project}}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
