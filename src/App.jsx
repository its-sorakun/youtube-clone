import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 md:ml-64 bg-gray-50 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
