import React, { useEffect, useRef } from 'react';

const AdBanner2 = ({ className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (adRef.current && !adRef.current.hasChildNodes()) {
        // Second ad script - 160x300
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
          atOptions = {
            'key' : '50282159d2c3d9056b91db2c692ce702',
            'format' : 'iframe',
            'height' : 300,
            'width' : 160,
            'params' : {}
          };
        `;
        
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = '//www.highperformanceformat.com/50282159d2c3d9056b91db2c692ce702/invoke.js';
        
        adRef.current.appendChild(script);
        adRef.current.appendChild(invokeScript);
      }
    }, 500); // Longer delay for second ad

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`ad-banner-2 ${className}`} style={{ width: '160px', height: '300px' }}>
      <div ref={adRef} className="w-full h-full"></div>
    </div>
  );
};

export default AdBanner2;
