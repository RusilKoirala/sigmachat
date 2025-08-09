import React, { useState } from 'react';

const DownloadManager = ({ tool, onClose }) => {
  const [agreed, setAgreed] = useState(false);

  const downloadFiles = {
    'bloatware-cleaner': {
      file: '/downloads/bloatware-cleaner.bat',
      name: 'bloatware-cleaner.bat',
      size: '2.1 KB',
      description: 'Windows Bloatware Removal Script'
    },
    'tcp-optimizer': {
      file: '/downloads/tcp-optimizer.reg',
      name: 'tcp-optimizer.reg',
      size: '1.8 KB',
      description: 'TCP Network Optimization Registry File'
    },
    'game-optimizer': {
      file: '/downloads/game-optimizer.bat',
      name: 'game-optimizer.bat',
      size: '3.2 KB',
      description: 'Gaming Performance Optimization Script'
    },
    'privacy-cleaner': {
      file: '/downloads/privacy-cleaner.ps1',
      name: 'privacy-cleaner.ps1',
      size: '4.1 KB',
      description: 'Privacy and Temp Files Cleaner PowerShell Script'
    },
    'wifi-password': {
      file: '/downloads/wifi-password-viewer.bat',
      name: 'wifi-password-viewer.bat',
      size: '1.9 KB',
      description: 'WiFi Password Viewer Batch Script'
    },
    'system-monitor': {
      file: '/downloads/system-monitor.bat',
      name: 'system-monitor.bat',
      size: '2.8 KB',
      description: 'Real-time System Performance Monitor'
    }
  };

  const currentTool = downloadFiles[tool];

  const handleDownload = () => {
    if (!agreed) return;
    
    // Create download link
    const link = document.createElement('a');
    link.href = currentTool.file;
    link.download = currentTool.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Close modal after download
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!currentTool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-red-600 rounded-lg shadow-2xl max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {!agreed ? (
          /* Terms and Warning Modal */
          <>
            {/* Header */}
            <div className="bg-red-600 text-white px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center">
                  ⚠️ Download Agreement Required
                </h3>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              {/* File Info */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h4 className="font-bold text-blue-400 mb-2">📁 File Information</h4>
                <div className="text-gray-300 space-y-1">
                  <p><strong>File:</strong> {currentTool.name}</p>
                  <p><strong>Size:</strong> {currentTool.size}</p>
                  <p><strong>Description:</strong> {currentTool.description}</p>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-900 border border-red-600 rounded-lg p-4">
                <h4 className="font-bold text-red-300 mb-2">🚨 CRITICAL WARNING</h4>
                <p className="text-red-200 text-sm">
                  You are about to download a system modification tool. This file can make changes to your computer.
                </p>
              </div>

              {/* Terms */}
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Educational Use Only:</strong> This tool is provided for learning and educational purposes.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Use at Your Own Risk:</strong> I am NOT responsible for any damage to your system.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Backup Required:</strong> Create a system restore point before running this tool.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Antivirus Warning:</strong> Your antivirus may flag this as suspicious due to system access.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>Admin Rights:</strong> Some tools require administrator privileges to function.</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-red-400 font-bold">•</span>
                  <p><strong>No Warranty:</strong> This software is provided "as-is" without any guarantees.</p>
                </div>
              </div>

              {/* Final Warning */}
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                <p className="text-yellow-200 text-center font-medium">
                  ⚠️ By downloading, you acknowledge that you understand the risks and agree to use this tool responsibly.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-800 rounded-b-lg border-t border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  By clicking "I Understand & Agree", you accept all terms and risks
                </p>
                <button
                  onClick={() => setAgreed(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  I Understand & Agree
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Download Ready Modal */
          <>
            {/* Header */}
            <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center">
                  ✅ Ready to Download
                </h3>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 text-center">
              <div className="text-green-400 text-4xl mb-4">📥</div>
              <h4 className="text-xl font-bold text-green-400 mb-2">Download Authorized</h4>
              <p className="text-gray-400 mb-6">
                You have agreed to the terms. Click below to download the file.
              </p>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
                <div className="text-gray-300">
                  <p><strong>File:</strong> {currentTool.name}</p>
                  <p><strong>Size:</strong> {currentTool.size}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  📥 Download Now
                </button>
                
                <button
                  onClick={() => setAgreed(false)}
                  className="w-full text-gray-400 hover:text-white text-sm transition-colors"
                >
                  ← Back to Terms
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DownloadManager;
