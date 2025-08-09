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
              <Link to="/bhailang" className="text-gray-300 hover:text-white transition-colors duration-200 font-medium">
                Bhai Lang
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Responsive Main Content with Sidebar */}
      <div className="pt-20 flex flex-col lg:flex-row">
        {/* Responsive Ad Sidebar */}
        <aside className="w-full lg:w-44 xl:w-48 bg-gray-950 border-b lg:border-b-0 lg:border-r border-gray-800 lg:min-h-screen">
          <div className="sticky top-20 p-2 lg:space-y-2 max-h-screen overflow-hidden flex flex-row lg:flex-col gap-2 lg:gap-0 justify-center lg:justify-start">
            {/* Main Ad - Responsive */}
            <div className="w-1/2 lg:w-full">
              <AdBanner1 className="mx-auto" show={true} />
            </div>

            {/* Small Ad Below - Responsive */}
            <div className="w-1/2 lg:w-full">
              <AdBanner2 className="mx-auto" show={true} />
            </div>
          </div>
        </aside>

        {/* Content Area - Responsive */}
        <div className="flex-1 px-4 max-w-6xl mx-auto lg:max-w-none">
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

        {/* System Tools & Utilities Section */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4"> System Tools & Utilities</h2>
            <p className="text-gray-400">Powerful system optimization and utility tools</p>
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
                <div className="text-green-400 text-2xl mb-2">✅</div>
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
                      📥 Download .bat
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
                      ⚡ Download Tool
                    </button>
                    <div className="bg-red-800 rounded px-3 py-1 text-xs text-red-200">
                      Windows Registry
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Optimizer */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-1 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-lg font-bold text-white mb-2">Game Optimizer</h3>
                  <p className="text-gray-400 text-sm mb-4">Boost FPS and reduce input lag</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('game-optimizer.bat')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      🚀 Download Pack
                    </button>
                    <div className="bg-purple-800 rounded px-3 py-1 text-xs text-purple-200">
                      Registry + Scripts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Monitor */}
            <div className="bg-gradient-to-br from-yellow-600 to-amber-600 rounded-xl p-1 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-lg font-bold text-white mb-2">System Monitor</h3>
                  <p className="text-gray-400 text-sm mb-4">Real-time PC performance stats</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('system-monitor.bat')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      📈 Download Tool
                    </button>
                    <div className="bg-yellow-800 rounded px-3 py-1 text-xs text-yellow-200">
                      Portable EXE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Cleaner */}
            <div className="bg-gradient-to-br from-gray-600 to-slate-600 rounded-xl p-1 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-lg font-bold text-white mb-2">Privacy Cleaner</h3>
                  <p className="text-gray-400 text-sm mb-4">Clear traces and temp files</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('privacy-cleaner.ps1')}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      🧽 Download Script
                    </button>
                    <div className="bg-gray-800 rounded px-3 py-1 text-xs text-gray-200">
                      PowerShell Script
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WiFi Password Viewer */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-1 hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="bg-black rounded-lg p-6 h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">📶</div>
                  <h3 className="text-lg font-bold text-white mb-2">WiFi Password Tool</h3>
                  <p className="text-gray-400 text-sm mb-4">View saved WiFi passwords</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDownload('wifi-password-viewer.bat')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                      🔑 Download Tool
                    </button>
                    <div className="bg-blue-800 rounded px-3 py-1 text-xs text-blue-200">
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
                  <div className="text-green-400 text-2xl mb-2">✅</div>
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
                    📚 C Programming
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
