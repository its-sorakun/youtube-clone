import React, { createContext, useState } from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isExpanded, setIsExpanded, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
