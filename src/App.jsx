import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';

const AppLayout = () => {
  const isExpanded = useSelector((state) => state.sidebar.isExpanded);

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
  return <AppLayout />;
}

export default App;
