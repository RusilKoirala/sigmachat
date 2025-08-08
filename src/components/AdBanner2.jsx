import React, { useEffect, useRef } from 'react';

const AdBanner2 = ({ className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    const loadAd = () => {
      if (adRef.current) {
        // Clear any existing content
        adRef.current.innerHTML = '';

        // Create ad scripts
        const script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.innerHTML = `
          atOptions = {
            'key' : '50282159d2c3d9056b91db2c692ce702',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        `;

        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        script2.src = '//www.highperformanceformat.com/50282159d2c3d9056b91db2c692ce702/invoke.js';
        script2.async = true;

        script2.onload = () => {
          console.log('AdBanner2 (300px) loaded successfully');
        };

        script2.onerror = () => {
          console.log('AdBanner2 (300px) failed to load');
        };

        // Add scripts to the ad container
        adRef.current.appendChild(script1);
        adRef.current.appendChild(script2);
      }
    };

    // Load with delay (after first ad)
    const timer = setTimeout(loadAd, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`ad-banner-2 ${className}`} style={{ width: '160px', height: '300px', backgroundColor: '#111', border: '1px solid #444' }}>
      <div ref={adRef} className="w-full h-full"></div>
    </div>
  );
};

export default AdBanner2;
