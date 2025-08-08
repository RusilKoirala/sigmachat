import React, { useEffect, useRef } from 'react';

const AdBanner1 = ({ className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    const loadAd = () => {
      if (adRef.current) {
        // Clear any existing content
        adRef.current.innerHTML = '';

        // Simple direct approach - just add the scripts
        const script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.innerHTML = `
          atOptions = {
            'key' : 'e4085a4b3de2aee8e8bb593d11c4003a',
            'format' : 'iframe',
            'height' : 600,
            'width' : 160,
            'params' : {}
          };
        `;

        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.src = '//www.highperformanceformat.com/e4085a4b3de2aee8e8bb593d11c4003a/invoke.js';
        script2.async = true;

        script2.onload = () => {
          console.log('AdBanner1 (600px) loaded successfully');
        };

        script2.onerror = () => {
          console.log('AdBanner1 (600px) failed to load');
        };

        // Add scripts to the ad container
        adRef.current.appendChild(script1);
        adRef.current.appendChild(script2);
      }
    };

    // Load with delay
    const timer = setTimeout(loadAd, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`ad-banner-1 ${className}`} style={{ width: '160px', height: '600px', backgroundColor: '#111', border: '1px solid #444' }}>
      <div ref={adRef} className="w-full h-full"></div>
    </div>
  );
};

export default AdBanner1;
