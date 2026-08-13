import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Zap, ShieldCheck } from 'lucide-react';

interface DataLightBannerProps {
  isDataLight: boolean;
  onToggleDataLight: (enabled: boolean) => void;
}

export default function DataLightBanner({ isDataLight, onToggleDataLight }: DataLightBannerProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  return (
    <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800">
      <div className="flex items-center gap-2">
        {isOnline ? (
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Wifi className="w-3.5 h-3.5" /> Online · PWA Cloud Sync Active
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-amber-400 font-bold animate-pulse">
            <WifiOff className="w-3.5 h-3.5" /> Offline Mode · Practice Cached Locally
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-400 hover:text-white transition-colors">
          <input
            type="checkbox"
            checked={isDataLight}
            onChange={(e) => onToggleDataLight(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-800 text-blue-500 focus:ring-0 cursor-pointer"
          />
          <span className="flex items-center gap-1">
            <Zap className={`w-3.5 h-3.5 ${isDataLight ? 'text-amber-400 fill-amber-400' : ''}`} />
            Data-Light Mode (Bandwidth Saver)
          </span>
        </label>
      </div>
    </div>
  );
}
