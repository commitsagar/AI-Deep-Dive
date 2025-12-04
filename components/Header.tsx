
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h1a1 1 0 011 1v1.5a1.5 1.5 0 01-3 0V7a1 1 0 00-1-1H9a1 1 0 00-1 1v1.5a1.5 1.5 0 01-3 0V6a1 1 0 011-1h1a1 1 0 001-1v-.5z" />
          <path d="M4 11a1 1 0 011-1h1.5a1.5 1.5 0 013 0H14a1 1 0 011 1v1.5a1.5 1.5 0 01-3 0V12a1 1 0 00-1-1H9a1 1 0 00-1 1v.5a1.5 1.5 0 01-3 0V11z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          AI Fashion Stylist
        </h1>
      </div>
    </header>
  );
};

export default Header;
