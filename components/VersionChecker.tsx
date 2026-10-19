import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetadataType {
  version: string;
  buildTimestamp: number;
}

const VersionChecker: React.FC = () => {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    // Load initial version
    const loadInitialVersion = async () => {
      try {
        const response = await fetch('/metadata.json', { cache: 'no-store' });
        const data: MetadataType = await response.json();
        // Store the timestamp in localStorage
        localStorage.setItem('appBuildTimestamp', data.buildTimestamp.toString());
      } catch (error) {
        console.error('Failed to load initial version:', error);
      }
    };

    loadInitialVersion();
  }, []);

  useEffect(() => {
    // Check for updates every 5 minutes
    const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

    const checkForUpdates = async () => {
      try {
        const response = await fetch('/metadata.json', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data: MetadataType = await response.json();
        const storedTimestamp = localStorage.getItem('appBuildTimestamp');

        if (storedTimestamp && data.buildTimestamp.toString() !== storedTimestamp) {
          // New version detected
          setShowUpdateBanner(true);
        }
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    };

    const intervalId = setInterval(checkForUpdates, CHECK_INTERVAL);

    // Also check when page becomes visible after being hidden
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleRefresh = () => {
    // Clear cache and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdateBanner(false);
  };

  return (
    <AnimatePresence>
      {showUpdateBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-9999 bg-primary text-white shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">update</span>
                <div>
                  <h3 className="font-bold text-lg">New Update Available</h3>
                  <p className="text-white/90 text-sm">
                    A new version of the GPAA website is available. Please refresh to see the latest updates.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all font-bold text-sm"
                >
                  Later
                </button>
                <button
                  onClick={handleRefresh}
                  className="px-6 py-2 rounded-lg bg-white text-primary hover:bg-white/90 transition-all font-bold text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Refresh Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VersionChecker;
