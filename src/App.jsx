import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { SidebarProvider, SidebarContext } from './context/SidebarContext.jsx';

const AppLayout = () => {
  const { isExpanded } = useContext(SidebarContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className={`flex-1 transition-all duration-200 ${isExpanded ? 'md:ml-64' : 'md:ml-20'} bg-gray-50 p-4`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppLayout />
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
