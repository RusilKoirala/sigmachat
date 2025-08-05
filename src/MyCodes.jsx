import React from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from './components/SigmaIcon.jsx';

const MyCodes = () => (
  <div className="min-h-screen bg-black text-white">
    {/* Navigation Bar */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl font-bold tracking-wider flex items-center space-x-2">
              <SigmaIcon className="w-6 h-6" />
              <span>SIGMA</span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              to="/chat"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Chat
            </Link>
            <Link
              to="/codes"
              className="text-white font-medium border-b-2 border-white"
            >
              Code
            </Link>
          </div>
        </div>
      </div>
    </nav>

    {/* Main Content */}
    <div className="pt-16 flex flex-col items-center justify-center min-h-screen">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-6xl font-bold mb-6 tracking-wider">CODE</h1>
        <p className="text-xl text-gray-400 mb-12 font-light">
          Downloadable codes and snippets will appear here soon.
        </p>
        <div className="border-2 border-gray-800 rounded-lg p-8">
          <div className="text-gray-500 text-lg">
            🚧 Under Construction 🚧
          </div>
        </div>
        <p className="text-xs text-gray-500 font-light mt-8">
          Made By OG Rusil
        </p>
      </div>
    </div>
  </div>
);

export default MyCodes;