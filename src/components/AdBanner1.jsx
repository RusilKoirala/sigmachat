import React, { useEffect, useRef } from 'react';

const AdBanner1 = ({ className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (adRef.current && !adRef.current.hasChildNodes()) {
        try {
          // Clear any existing content
          adRef.current.innerHTML = '';

          // First ad script - 160x600
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.innerHTML = `
            window.atOptions = {
              'key' : 'e4085a4b3de2aee8e8bb593d11c4003a',
              'format' : 'iframe',
              'height' : 600,
              'width' : 160,
              'params' : {}
            };
          `;

          const invokeScript = document.createElement('script');
          invokeScript.type = 'text/javascript';
          invokeScript.src = '//www.highperformanceformat.com/e4085a4b3de2aee8e8bb593d11c4003a/invoke.js';
          invokeScript.async = true;

          // Add error handling
          invokeScript.onerror = () => {
            console.log('Ad script failed to load');
          };

          adRef.current.appendChild(script);
          adRef.current.appendChild(invokeScript);

          console.log('AdBanner1 script loaded');
        } catch (error) {
          console.error('Error loading AdBanner1:', error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`ad-banner-1 ${className}`} style={{ width: '160px', height: '600px', border: '1px solid #333' }}>
      <div ref={adRef} className="w-full h-full"></div>
    </div>
  );
};

export default AdBanner1;
