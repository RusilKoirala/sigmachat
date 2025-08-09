import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

// Ad Manager Context
const AdContext = createContext();

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within AdProvider');
  }
  return context;
};

// Ad Provider Component
export const AdProvider = ({ children }) => {
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [adScriptsReady, setAdScriptsReady] = useState(false);

  useEffect(() => {
    // Preload ad scripts globally
    const preloadAdScripts = () => {
      // Preload first ad script
      const script1 = document.createElement('script');
      script1.src = '//www.highperformanceformat.com/e4085a4b3de2aee8e8bb593d11c4003a/invoke.js';
      script1.async = true;
      script1.onload = () => {
        console.log('Ad script 1 preloaded');
        checkAllScriptsLoaded();
      };
      script1.onerror = () => {
        console.log('Ad script 1 failed to preload');
      };

      // Preload second ad script
      const script2 = document.createElement('script');
      script2.src = '//www.highperformanceformat.com/50282159d2c3d9056b91db2c692ce702/invoke.js';
      script2.async = true;
      script2.onload = () => {
        console.log('Ad script 2 preloaded');
        checkAllScriptsLoaded();
      };
      script2.onerror = () => {
        console.log('Ad script 2 failed to preload');
      };

      // Add to head but keep them hidden
      document.head.appendChild(script1);
      document.head.appendChild(script2);
    };

    const checkAllScriptsLoaded = () => {
      setAdScriptsReady(true);
      setAdsLoaded(true);
    };

    // Start preloading after a short delay
    const timer = setTimeout(preloadAdScripts, 1000);

    return () => clearTimeout(timer);
  }, []);

  const value = {
    adsLoaded,
    adScriptsReady,
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
};

// Enhanced Ad Banner 1 (600px)
export const AdBanner1 = ({ className = "", show = true }) => {
  const { adScriptsReady } = useAds();
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!show || !adScriptsReady || !adRef.current) return;

    const loadAd = () => {
      // Clear any existing content
      adRef.current.innerHTML = '';

      // Create ad configuration
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        window.atOptions = {
          'key': 'e4085a4b3de2aee8e8bb593d11c4003a',
          'format': 'iframe',
          'height': 600,
          'width': 160,
          'params': {}
        };
      `;

      // Create invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highperformanceformat.com/e4085a4b3de2aee8e8bb593d11c4003a/invoke.js';
      invokeScript.async = true;

      invokeScript.onload = () => {
        console.log('AdBanner1 (600px) loaded successfully');
        setAdLoaded(true);
      };

      invokeScript.onerror = () => {
        console.log('AdBanner1 (600px) failed to load');
      };

      // Add scripts to container
      adRef.current.appendChild(configScript);
      adRef.current.appendChild(invokeScript);
    };

    // Load ad with delay
    const timer = setTimeout(loadAd, 500);

    return () => clearTimeout(timer);
  }, [show, adScriptsReady]);

  if (!show) return null;

  return (
    <div
      className={`ad-banner-1 ${className} w-full max-w-[160px] mx-auto`}
      style={{
        height: 'clamp(300px, 50vh, 600px)', // Responsive height
        backgroundColor: adLoaded ? 'transparent' : '#111',
        border: adLoaded ? 'none' : '1px solid #444',
        transition: 'all 0.3s ease'
      }}
    >
      <div ref={adRef} className="w-full h-full"></div>
      {!adLoaded && adScriptsReady && (
        <div className="flex items-center justify-center h-full text-gray-500 text-xs">
          Loading ad...
        </div>
      )}
    </div>
  );
};

// Enhanced Ad Banner 2 (300px)
export const AdBanner2 = ({ className = "", show = true }) => {
  const { adScriptsReady } = useAds();
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (!show || !adScriptsReady || !adRef.current) return;

    const loadAd = () => {
      // Clear any existing content
      adRef.current.innerHTML = '';

      // Create ad configuration
      const configScript = document.createElement('script');
      configScript.type = 'text/javascript';
      configScript.innerHTML = `
        window.atOptions = {
          'key': '50282159d2c3d9056b91db2c692ce702',
          'format': 'iframe',
          'height': 300,
          'width': 160,
          'params': {}
        };
      `;

      // Create invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highperformanceformat.com/50282159d2c3d9056b91db2c692ce702/invoke.js';
      invokeScript.async = true;

      invokeScript.onload = () => {
        console.log('AdBanner2 (300px) loaded successfully');
        setAdLoaded(true);
      };

      invokeScript.onerror = () => {
        console.log('AdBanner2 (300px) failed to load');
      };

      // Add scripts to container
      adRef.current.appendChild(configScript);
      adRef.current.appendChild(invokeScript);
    };

    // Load ad with delay (after first ad)
    const timer = setTimeout(loadAd, 1000);

    return () => clearTimeout(timer);
  }, [show, adScriptsReady]);

  if (!show) return null;

  return (
    <div
      className={`ad-banner-2 ${className} w-full max-w-[160px] mx-auto`}
      style={{
        height: 'clamp(200px, 25vh, 300px)', // Responsive height
        backgroundColor: adLoaded ? 'transparent' : '#111',
        border: adLoaded ? 'none' : '1px solid #444',
        transition: 'all 0.3s ease'
      }}
    >
      <div ref={adRef} className="w-full h-full"></div>
      {!adLoaded && adScriptsReady && (
        <div className="flex items-center justify-center h-full text-gray-500 text-xs">
          Loading ad...
        </div>
      )}
    </div>
  );
};
