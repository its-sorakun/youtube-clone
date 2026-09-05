import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../api/axios.js';

const Sidebar = () => {
  const isExpanded = useSelector((state) => state.sidebar.isExpanded);
  const user = useSelector((state) => state.auth.user);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (user) {
        try {
          const res = await api.get('/channels/subscribed');
          setSubscriptions(res.data);
        } catch (err) {
          console.error("Failed to fetch subscriptions", err);
        }
      } else {
        setSubscriptions([]);
      }
    };
    
    // Fetch subscriptions whenever the user's global subscriptions array changes
    fetchSubscriptions();
  }, [user?.subscriptions]);

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 4.44l7 6.09V20h-4v-6H9v6H5v-9.47l7-6.09m0-1.32l-8 6.96V21h6v-6h4v6h6V10.08l-8-6.96z"></path></svg> 
    },
    { 
      name: 'Shorts', 
      path: '/shorts', 
      icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L19 9.06c1.3-.71 1.77-2.34 1.05-3.64-.71-1.3-2.34-1.77-3.64-1.05l-8.6 4.74c-1.12.62-1.57 2.02-1 3.14.46.9 1.42 1.39 2.42 1.25l.97-.14s-.93.53-1.17.65c-1.3.71-1.77 2.34-1.05 3.64.71 1.3 2.34 1.77 3.64 1.05l8.6-4.74c1.12-.62 1.57-2.02 1-3.14-.46-.9-1.42-1.39-2.42-1.25l-.97.14s.93-.53 1.17-.65zM10 14.65v-5.3L15 12l-5 2.65z"></path></svg> 
    },
    { 
      name: 'Subscriptions', 
      path: '/feed/subscriptions', 
      icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 10h18v10H3V10z"></path></svg> 
    },
    { 
      name: 'You', 
      path: user?.channels?.length > 0 ? `/channel/${user.channels[0]}` : "/channel/my-channel", 
      icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.5.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z"></path></svg> 
    }
  ];

  return (
    <aside className={`hidden md:flex flex-col bg-white border-r fixed h-[calc(100vh-64px)] overflow-y-auto transition-all duration-200 ${isExpanded ? 'w-64 px-3' : 'w-20 px-1 items-center'}`}>
      <div className="py-2">
        {navItems.map((item) => {
          // If the user is logged out, don't render the "You" tab
          if (item.name === 'You' && !user) return null;
          
          return (
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
          );
        })}
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

          {user && subscriptions.length > 0 && (
            <>
              <hr className="my-2 border-gray-200" />
              <div className="px-3 py-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Subscriptions</h3>
                {subscriptions.map(sub => (
                  <NavLink 
                    key={sub._id} 
                    to={`/channel/${sub._id}`} 
                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 mb-1"
                  >
                    <img 
                      src={sub.channelAvatar || sub.owner?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.channelName)}&background=random`} 
                      alt={sub.channelName} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-gray-900 ml-5 text-sm truncate">{sub.channelName}</span>
                  </NavLink>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </aside>
  );
};

export default Sidebar;
