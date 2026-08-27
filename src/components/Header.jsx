import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="flex justify-between items-center px-4 h-16 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          {/* Hamburger icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <Link to="/" className="flex items-center gap-1">
          <span className="text-xl font-bold tracking-tighter">YouTube Clone</span>
        </Link>
      </div>

      <div className="flex flex-1 max-w-2xl px-12">
        <div className="flex w-full items-center border rounded-full overflow-hidden bg-white">
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full px-4 py-2 outline-none"
          />
          <button className="px-5 py-2 bg-gray-100 hover:bg-gray-200 border-l">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </div>
      </div>

      <div>
        <Link to="/login" className="flex items-center gap-2 border border-gray-300 text-blue-600 px-4 py-1.5 rounded-full hover:bg-blue-50 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Sign in
        </Link>
      </div>
    </header>
  );
};

export default Header;
