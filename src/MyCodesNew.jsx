import React from 'react';
import { Link } from 'react-router-dom';
import SigmaIcon from './components/SigmaIcon.jsx';
import { AdBanner1, AdBanner2 } from './components/AdManager.jsx';

import { useState } from 'react';
const MyCodes = () => {
  const [showCode, setShowCode] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);

  const handleDownload = (filename) => {
    const link = document.createElement('a');
    link.href = `/downloads/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Link to="/" className="text-white text-lg sm:text-xl font-bold tracking-tight flex items-center space-x-2 sm:space-x-3 hover:text-blue-400 transition-colors group">
                <SigmaIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
                <span>SIGMA</span>
              </Link>
            </div>
            <div className="flex space-x-4 sm:space-x-8">
              <Link to="/chat" className="text-slate-300 hover:text-white transition-colors duration-200 font-medium text-sm sm:text-base">
                Chat
              </Link>
              <Link to="/codes" className="text-blue-400 font-semibold border-b-2 border-blue-400 pb-1 text-sm sm:text-base">
                Codes
              </Link>
              <Link to="/bhailang" className="text-slate-300 hover:text-white transition-colors duration-200 font-medium text-sm sm:text-base hidden sm:inline">
                Bhai Lang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Responsive Main Content with Sidebar */}
      <div className="pt-16 sm:pt-20 flex flex-col lg:flex-row">
        {/* Responsive Ad Sidebar */}
        <aside className="w-full lg:w-48 xl:w-52 bg-slate-900/50 border-b lg:border-b-0 lg:border-r border-slate-800 lg:min-h-screen">
          <div className="sticky top-16 sm:top-20 p-2 sm:p-3 lg:space-y-3 max-h-screen overflow-hidden flex flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-0 justify-center lg:justify-start">
            {/* Main Ad - Responsive */}
            <div className="w-1/2 lg:w-full">
              <AdBanner1 className="mx-auto rounded-lg overflow-hidden" show={true} />
            </div>

            {/* Small Ad Below - Responsive */}
            <div className="w-1/2 lg:w-full">
              <AdBanner2 className="mx-auto rounded-lg overflow-hidden" show={true} />
            </div>
          </div>
        </aside>

        {/* Content Area - Responsive */}
        <div className="flex-1 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto lg:max-w-none">
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">
              Downloads
            </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            High-quality Python games and tools ready for download and use
          </p>
        </div>

        {/* Games Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Interactive Games</h2>
        
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Breakout Game */}
            <div className="group bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-slate-600 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🧱</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Breakout</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">Classic brick-breaking arcade game with modern graphics</p>
                  <div className="bg-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 mb-6 inline-block">Python + Pygame</div>
                  <button
                    onClick={() => handleDownload('breakout_game.py')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-blue-500/25"
                  >
                    Download Game
                  </button>
                </div>
              </div>
            </div>

            {/* Snake Game */}
            <div className="group bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-slate-600 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🐍</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Snake</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">Classic snake game with modern graphics and smooth gameplay</p>
                  <div className="bg-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 mb-6 inline-block">Python + Pygame</div>
                  <button
                    onClick={() => handleDownload('snake_game.py')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-blue-500/25"
                  >
                    Download Game
                  </button>
                </div>
              </div>
            </div>

            {/* Target Shooter Game */}
            <div className="group bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-slate-600 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Target Shooter</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">Aim and shoot moving targets with precision and skill</p>
                  <div className="bg-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 mb-6 inline-block">Python + Pygame</div>
                  <button
                    onClick={() => handleDownload('target_shooter.py')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-blue-500/25"
                  >
                    Download Game
                  </button>
                </div>
              </div>
            </div>

            {/* Car Racing Game */}
            <div className="group bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-slate-600 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🏎️</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Car Race</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">Fast-paced racing action with realistic physics</p>
                  <div className="bg-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 mb-6 inline-block">Python + Pygame</div>
                  <button
                    onClick={() => handleDownload('car_race.py')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-blue-500/25"
                  >
                    Download Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Installation Instructions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Installation Guide
          </h2>

          <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Installation Steps */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Setup Steps</h3>
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-300 text-sm mb-1">1. Install Python</p>
                    <code className="text-blue-400 text-xs">python.org/downloads</code>
                  </div>

                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-300 text-sm mb-2">2. Install Pygame</p>
                    <div className="bg-black rounded p-2 font-mono text-green-400 text-xs">
                      pip install pygame
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded p-3">
                    <p className="text-gray-300 text-sm">3. Download and run game</p>
                  </div>
                </div>
              </div>

              {/* Terminal Example */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Terminal Example</h3>
                <div className="bg-black rounded p-4 font-mono text-xs">
                  <div className="text-gray-500 mb-1">$ pip install pygame</div>
                  <div className="text-gray-400 mb-1">Successfully installed pygame-2.5.2</div>
                  <div className="text-gray-500 mb-1">$ python snake_game.py</div>
                  <div className="text-green-400">Game started successfully</div>
                </div>

                <div className="mt-3 p-3 bg-gray-800 rounded">
                  <p className="text-gray-300 text-xs">
                    All games include controls and instructions when you run them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* System Tools Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">System Tools</h2>
            <p className="text-gray-400">System optimization and utility tools</p>
          </div>

          {!showDownloads ? (
            /* Terms of Service Modal for Downloads */
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900 border border-red-600 rounded-lg shadow-2xl">
                {/* Header */}
                <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
                  <h3 className="text-xl font-bold flex items-center">
                    Download Terms & Disclaimer
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 text-sm leading-relaxed">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-400 mb-2"> WARNING</h4>
                    <p className="text-gray-300">
                      These are system modification tools that can make changes to your computer. Use with extreme caution!
                    </p>
                  </div>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold">•</span>
                      <p><strong>Educational Purpose Only:</strong> All tools are provided for learning and educational purposes only.</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold">•</span>
                      <p><strong>No Responsibility:</strong> I am NOT responsible for any damage, data loss, or system issues caused by these tools.</p>
                    </div>

                  

                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold">•</span>
                      <p><strong>Antivirus Warnings:</strong> These tools may trigger antivirus false positives due to system access requirements.</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold">•</span>
                      <p><strong>Administrator Rights:</strong> Most tools require administrator privileges to function properly.</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold">•</span>
                      <p><strong>Use at Your Own Risk:</strong> You are solely responsible for any consequences of using these tools.</p>
                    </div>

                  </div>

                </div>

                {/* Footer with Agree Button */}
                <div className="px-6 py-4 bg-gray-800 rounded-b-lg border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      By clicking "I Understand & Agree", you accept all risks and terms
                    </p>
                    <button
                      onClick={() => setShowDownloads(true)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                      I Agree And Understand
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Tools Access Panel */
            <div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-green-400 mb-2">Download Access Granted</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Remember: Use responsibly and always backup your system first
                </p>
                <button
                  onClick={() => setShowDownloads(false)}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to Terms
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bloatware Cleaner */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-1 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🧹</div>
                  <h3 className="text-lg font-bold text-white mb-2">Bloatware Cleaner</h3>
                  <p className="text-gray-400 text-sm mb-4">Remove unnecessary Windows apps and services</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('bloatware-cleaner.bat')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Download .bat
                    </button>
                    <div className="bg-green-800 rounded px-3 py-1 text-xs text-green-200">
                      Run as Administrator
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TCP Config Tool */}
            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-1 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌐</div>
                  <h3 className="text-lg font-bold text-white mb-2">TCP Config Tool</h3>
                  <p className="text-gray-400 text-sm mb-4">Network optimization and TCP tweaks</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('tcp-optimizer.reg')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Download Tool
                    </button>
                    <div className="bg-red-800 rounded px-3 py-1 text-xs text-red-200">
                      Windows Registry
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Optimizer */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors cursor-pointer">
              <div className="p-6 h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Game Optimizer</h3>
                  <p className="text-gray-400 text-sm mb-4">Boost FPS and reduce input lag</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('game-optimizer.bat')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Download Pack
                    </button>
                    <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300">
                      Registry + Scripts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Monitor */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors cursor-pointer">
              <div className="p-6 h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">System Monitor</h3>
                  <p className="text-gray-400 text-sm mb-4">Real-time PC performance stats</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('system-monitor.bat')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Download Tool
                    </button>
                    <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300">
                      Portable EXE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Cleaner */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors cursor-pointer">
              <div className="p-6 h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Privacy Cleaner</h3>
                  <p className="text-gray-400 text-sm mb-4">Clear traces and temp files</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('privacy-cleaner.ps1')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Download Script
                    </button>
                    <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300">
                      PowerShell Script
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WiFi Password Viewer */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors cursor-pointer">
              <div className="p-6 h-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">WiFi Password Tool</h3>
                  <p className="text-gray-400 text-sm mb-4">View saved WiFi passwords</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('wifi-password-viewer.bat')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      Download Tool
                    </button>
                    <div className="bg-gray-700 rounded px-3 py-1 text-xs text-gray-300">
                      Command Line
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

              {/* Warning Section */}
            
            </div>
          )}
        </section>

        {/* Terms & Code Access Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Educational Code Library</h2>
            <p className="text-gray-400">Programming resources for learning purposes</p>
          </div>

          {!showCode ? (
            /* Terms of Service Modal */
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-900 border border-red-600 rounded-lg shadow-2xl">
                {/* Header */}
                <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
                  <h3 className="text-xl font-bold flex items-center">
                     Terms of Use & Disclaimer
                  </h3>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 text-sm leading-relaxed">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-400 mb-2">IMPORTANT DISCLAIMER</h4>
                    <p className="text-gray-300">
                      By accessing this code library, you acknowledge and agree to the following terms:
                    </p>
                  </div>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold">•</span>
                      <p><strong>Educational Purpose Only:</strong> All code is provided for learning and educational purposes only.</p>
                    </div>

                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold">•</span>
                      <p><strong>No Cheating:</strong> I am NOT responsible for any use of this code for cheating in exams, assignments, or competitions.</p>
                    </div>


                    <div className="flex items-start space-x-3">
                      <span className="text-red-400 font-bold">•</span>
                      <p><strong>Your Responsibility:</strong> You are solely responsible for how you use this code and any consequences.</p>
                    </div>

                  
                  </div>

                </div>

                {/* Footer with Agree Button */}
                <div className="px-6 py-4 bg-gray-800 rounded-b-lg border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      By clicking "I Agree", you accept these terms
                    </p>
                    <button
                      onClick={() => setShowCode(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                      I Agree & Understand
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Code Access Panel */
            <div className="max-w-md mx-auto">
              <div className="bg-gray-900 border border-green-600 rounded-lg p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-green-400 mb-2">Access Granted</h3>
                  <p className="text-gray-400 text-sm">
                    Remember: Use responsibly for learning only
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    to="/codes/c-programming"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    C Programming
                  </Link>
                  <Link
                    to="/codes/html-programming"
                    className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-center"
                  >
                    🌐 HTML Programming
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowCode(false)}
                    className="w-full text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    ← Back to Terms
                  </button>
                </div>
              </div>
            </div>
          )}
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
