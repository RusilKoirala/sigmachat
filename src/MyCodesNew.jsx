import React from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from './components/SigmaIcon.jsx';
import AdBanner1 from './components/AdBanner1.jsx';
import AdBanner2 from './components/AdBanner2.jsx';

const MyCodes = () => {

  return (
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
              <Link to="/chat" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Chat
              </Link>
              <Link to="/codes" className="text-white font-medium border-b-2 border-white">
                Code
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="pt-20 flex">
        {/* Left Sidebar - Ad */}
        <aside className="hidden lg:block w-44 bg-gray-950 border-r border-gray-800 min-h-screen">
          <div className="sticky top-20 p-2 space-y-2 max-h-screen overflow-hidden">
            {/* Main Ad - 160x600 */}
            <AdBanner1 className="mx-auto" />

            {/* Small Ad Below - 160x300 */}
            <AdBanner2 className="mx-auto" />
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 tracking-wider">CODE VAULT</h1>
          <p className="text-xl text-gray-400 font-light">Download cool stuff and access secret codes</p>
        </div>

        {/* Category 1: Cool Things to Download */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center"> Cool Things to Download</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Pygame Ball Game */}
            <Link to="/codes/bouncing-ball" className="group block">
              <div className="bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 rounded-xl p-1 hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="bg-black rounded-lg p-6 h-full">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎮</div>
                    <h3 className="text-lg font-bold text-white mb-2">Bouncing Ball</h3>
                    <p className="text-gray-400 text-sm mb-4">Simple pygame game with bouncing physics</p>
                    <div className="bg-gray-800 rounded px-3 py-1 text-xs text-green-400">Python + Pygame</div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Coming Soon Cards */}
            <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl p-1">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🚧</div>
                  <h3 className="text-lg font-bold text-white mb-2">Snake Game</h3>
                  <p className="text-gray-400 text-sm mb-4">Classic snake game coming soon</p>
                  <div className="bg-gray-800 rounded px-3 py-1 text-xs text-gray-500">Coming Soon</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl p-1">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-bold text-white mb-2">Target Game</h3>
                  <p className="text-gray-400 text-sm mb-4">Aim and shoot targets</p>
                  <div className="bg-gray-800 rounded px-3 py-1 text-xs text-gray-500">Coming Soon</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl p-1">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏎️</div>
                  <h3 className="text-lg font-bold text-white mb-2">Car Race</h3>
                  <p className="text-gray-400 text-sm mb-4">Simple racing game</p>
                  <div className="bg-gray-800 rounded px-3 py-1 text-xs text-gray-500">Coming Soon</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIP Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">🔐 Secret Codes</h2>
            <p className="text-gray-400">VIP access required</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="text-center mb-6">
                <span className="text-4xl">🕵️</span>
                <h3 className="text-xl font-bold mt-2">Grade 11 Practical Codes</h3>
                <p className="text-gray-400 text-sm mt-2">
                  C Programming and HTML codes for computer practicals
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/codes/c-programming"
                  className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  C Programming
                </Link>
                <Link
                  to="/codes/html-programming"
                  className="block w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  HTML Programming
                </Link>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Requires VIP credentials to access
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs text-gray-500 font-light">Made By OG Rusil</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MyCodes;
