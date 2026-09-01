import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SidebarContext } from '../context/SidebarContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const Sidebar = () => {
  const { isExpanded } = useContext(SidebarContext);
  const { user } = useContext(AuthContext);

  const navItems = [
    { name: 'Home', path: '/', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg> },
    { name: 'Shorts', path: '/shorts', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg> },
    { name: 'Subscriptions', path: '/feed/subscriptions', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg> },
  ];

  return (
    <aside className={`hidden md:flex flex-col bg-white border-r fixed h-[calc(100vh-64px)] overflow-y-auto transition-all duration-200 ${isExpanded ? 'w-64 px-3' : 'w-20 px-1 items-center'}`}>
      <div className="py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex ${isExpanded ? 'flex-row items-center px-3 py-2.5' : 'flex-col items-center justify-center py-4 px-1 gap-1'} rounded-lg transition-colors ${
                isActive ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100 font-normal'
              }`
            }
          >
            <span className="text-gray-900">{item.icon}</span>
            <span className={`${isExpanded ? 'ml-5' : 'text-[10px]'} text-gray-900`}>{item.name}</span>
          </NavLink>
        ))}
      </div>
      
      {isExpanded && (
        <>
          <hr className="my-2 border-gray-200" />
          <div className="px-3 py-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Explore</h3>
            <NavLink to="/gaming" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100">
              <span className="text-gray-900 ml-5 text-sm">Gaming</span>
            </NavLink>
            <NavLink to="/sports" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100">
              <span className="text-gray-900 ml-5 text-sm">Sports</span>
            </NavLink>
          </div>
          
          {user && (
            <>
              <hr className="my-2 border-gray-200" />
              <div className="px-3 py-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">You</h3>
                <NavLink to="/channel/my-channel" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100">
                  <span className="text-gray-900 ml-5 text-sm">Your Channel</span>
                </NavLink>
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
};

export default Sidebar;
