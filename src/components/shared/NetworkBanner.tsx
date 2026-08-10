import React, { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export default function NetworkBanner() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-red-600 text-white p-3 z-50 flex items-center justify-center gap-3 shadow-lg">
      <WifiOff className="w-5 h-5" />
      <span className="font-medium">You are currently offline. Changes you make might not be saved.</span>
    </div>
  );
}
