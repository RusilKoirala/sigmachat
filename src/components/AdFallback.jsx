import React from 'react';

const AdFallback = ({ width = 160, height = 600, className = "" }) => {
  return (
    <div 
      className={`ad-fallback ${className} bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div className="text-center text-gray-500 text-xs p-2">
        <div className="mb-2">📢</div>
        <div>Ad Space</div>
        <div className="text-xs mt-1 opacity-60">
          {width}x{height}
        </div>
      </div>
    </div>
  );
};

export default AdFallback;
