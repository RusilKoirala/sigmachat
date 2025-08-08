import React, { useState, useEffect } from 'react';

const AdBlockerOverlay = () => {
  const [isAdBlocked, setIsAdBlocked] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Adsera-specific ad blocker detection
    const detectAdBlocker = () => {
      // Method 1: Test actual Adsera script loading
      const testAdseraNetwork = () => {
        return new Promise((resolve) => {
          // Test with your actual ad script URL
          const script = document.createElement('script');
          script.src = '//www.highperformanceformat.com/e4085a4b3de2aee8e8bb593d11c4003a/invoke.js';
          script.onload = () => resolve(false); // Script loaded successfully
          script.onerror = () => resolve(true);  // Script blocked by ad blocker
          script.style.display = 'none';
          document.head.appendChild(script);

          setTimeout(() => {
            if (script.parentNode) {
              script.parentNode.removeChild(script);
            }
            resolve(true); // Timeout = likely blocked
          }, 3000);
        });
      };

      // Method 2: Check if Adsera ads actually loaded content
      const checkAdseraAdsLoaded = () => {
        const adBanner1 = document.querySelector('.ad-banner-1');
        const adBanner2 = document.querySelector('.ad-banner-2');

        if (adBanner1 && adBanner2) {
          // Check for actual ad content (iframes are the key indicator)
          const iframe1 = adBanner1.querySelector('iframe');
          const iframe2 = adBanner2.querySelector('iframe');

          // Check for any loaded scripts that would indicate successful ad loading
          const scripts1 = adBanner1.querySelectorAll('script[src*="highperformanceformat"]');
          const scripts2 = adBanner2.querySelectorAll('script[src*="highperformanceformat"]');

          // Check inner content (successful ads have more than just empty divs)
          const hasRealContent1 = iframe1 || (adBanner1.innerHTML.length > 200);
          const hasRealContent2 = iframe2 || (adBanner2.innerHTML.length > 200);

          console.log('Ad content check:', {
            ad1HasIframe: !!iframe1,
            ad2HasIframe: !!iframe2,
            ad1Scripts: scripts1.length,
            ad2Scripts: scripts2.length,
            ad1ContentLength: adBanner1.innerHTML.length,
            ad2ContentLength: adBanner2.innerHTML.length,
            ad1HasContent: hasRealContent1,
            ad2HasContent: hasRealContent2
          });

          // Return true if ads are NOT loaded (no iframes and no substantial content)
          return !hasRealContent1 && !hasRealContent2;
        }
        return true; // If containers don't exist, assume blocked
      };

      // Method 3: Multiple test elements (more likely to be blocked)
      const createAdseraTestElement = () => {
        // Test 1: Standard ad element
        const testAd1 = document.createElement('div');
        testAd1.className = 'adsbox advertisement ads ad-banner';
        testAd1.innerHTML = '&nbsp;';
        testAd1.style.position = 'absolute';
        testAd1.style.left = '-10000px';
        testAd1.style.height = '10px';
        testAd1.style.width = '10px';
        document.body.appendChild(testAd1);

        // Test 2: Adsera-specific element
        const testAd2 = document.createElement('div');
        testAd2.id = 'adsera-test';
        testAd2.className = 'ad-container';
        testAd2.innerHTML = '<ins class="adsbygoogle"></ins>';
        testAd2.style.position = 'absolute';
        testAd2.style.left = '-10000px';
        testAd2.style.height = '10px';
        testAd2.style.width = '10px';
        document.body.appendChild(testAd2);

        const blocked1 = testAd1.clientHeight === 0 || testAd1.offsetHeight === 0;
        const blocked2 = testAd2.clientHeight === 0 || testAd2.offsetHeight === 0;

        document.body.removeChild(testAd1);
        document.body.removeChild(testAd2);

        return blocked1 || blocked2;
      };

      // Method 4: Check if ad scripts are actually loading
      const checkAdScriptsBlocked = () => {
        // Check if our ad containers have loaded any scripts
        const adBanner1 = document.querySelector('.ad-banner-1');
        const adBanner2 = document.querySelector('.ad-banner-2');

        if (adBanner1 && adBanner2) {
          const scripts1 = adBanner1.querySelectorAll('script');
          const scripts2 = adBanner2.querySelectorAll('script');

          // If containers exist but no scripts loaded, likely blocked
          return scripts1.length === 0 && scripts2.length === 0;
        }

        return false;
      };

      // Run Adsera-specific detection
      setTimeout(async () => {
        const networkBlocked = await testAdseraNetwork();
        const adsNotLoaded = checkAdseraAdsLoaded();
        const testElementBlocked = createAdseraTestElement();
        const scriptsBlocked = checkAdScriptsBlocked();

        // If we see ERR_BLOCKED_BY_CLIENT, it's definitely an ad blocker
        // OR if ads didn't load AND other tests confirm
        const adBlockerDetected = networkBlocked || (adsNotLoaded && testElementBlocked);

        const debugData = {
          networkBlocked,
          adsNotLoaded,
          testElementBlocked,
          scriptsBlocked,
          finalResult: adBlockerDetected,
          userAgent: navigator.userAgent.includes('Chrome') ? 'Chrome-based' : 'Other',
          timestamp: new Date().toLocaleTimeString()
        };

        console.log('Adsera ad blocker detection:', debugData);
        setDebugInfo(debugData);

        setIsAdBlocked(adBlockerDetected);
        setShowOverlay(adBlockerDetected);

      }, 5000); // 5 seconds for Adsera ads to fully load
    };

    detectAdBlocker();

    // Re-check every 15 seconds
    const interval = setInterval(detectAdBlocker, 15000);

    return () => clearInterval(interval);
  }, []);

  // Don't show anything if ads are not blocked or manually overridden
  if (!isAdBlocked || !showOverlay || manualOverride) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 border border-red-600 rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
        <div className="text-red-400 space-y-6">
          {/* Icon */}
          <div className="text-6xl">🚫</div>
          
          {/* Title */}
          <div className="text-2xl font-bold text-white">
            Ad Blocker Detected!
          </div>
          
          {/* Message */}
          <div className="text-lg leading-relaxed">
           <p className="mb-4 text-white">
   Yo! Running this server ain’t free, kid — my wallet is crying in binary. Be a real one: turn off that ad blocker and help keep SigmaChat alive 🫡
</p>


          </div>
          
          {/* Instructions */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-left">
            <div className="font-bold mb-2 text-center text-white">How to disable:</div>
            <ul className="space-y-1 text-gray-300">
              <li>• Click the ad blocker icon in your browser</li>
              <li>• Select "Disable on this site"</li>
              <li>• Refresh the page</li>
            </ul>
          </div>
          
         

         
          
          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full"
            >
              I've disabled my ad blocker - Refresh
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBlockerOverlay;
