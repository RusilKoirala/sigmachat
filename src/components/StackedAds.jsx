import React from 'react';
import AdBanner from './AdBanner.jsx';

const StackedAds = ({ className = "" }) => {
  return (
    <div className={`stacked-ads ${className}`}>
      {/* First Ad - 300x250 */}
      <div className="mb-4">
        <AdBanner width={300} height={250} />
      </div>
      
      {/* Second Ad - 300x250 */}
      <div>
        <AdBanner width={300} height={250} />
      </div>
    </div>
  );
};

export default StackedAds;
