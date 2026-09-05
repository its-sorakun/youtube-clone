import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';

const AppLayout = () => {
  const isExpanded = useSelector((state) => state.sidebar.isExpanded);
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] dark:text-white flex flex-col font-sans transition-colors duration-200">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className={`flex-1 transition-all duration-200 ${isExpanded ? 'md:ml-64' : 'md:ml-20'} bg-gray-50 dark:bg-[#0f0f0f] p-4`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return <AppLayout />;
}

export default App;
