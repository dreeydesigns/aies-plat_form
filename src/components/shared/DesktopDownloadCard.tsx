import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Monitor, 
  Apple, 
  Laptop, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles, 
  WifiOff, 
  ShieldCheck,
  Zap,
  ExternalLink
} from 'lucide-react';

export type OperatingSystem = 'windows' | 'mac' | 'linux';

export default function DesktopDownloadCard() {
  const [detectedOS, setDetectedOS] = useState<OperatingSystem>('windows');
  const [selectedOS, setSelectedOS] = useState<OperatingSystem>('windows');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const platform = window.navigator.platform?.toLowerCase() || '';

    if (userAgent.includes('mac') || platform.includes('mac')) {
      setDetectedOS('mac');
      setSelectedOS('mac');
    } else if (userAgent.includes('linux') || platform.includes('linux')) {
      setDetectedOS('linux');
      setSelectedOS('linux');
    } else {
      setDetectedOS('windows');
      setSelectedOS('windows');
    }
  }, []);

  const osData = {
    windows: {
      name: 'Windows 10 / 11 (64-bit)',
      filename: 'AIES-SAT-Setup-1.2.4.exe',
      size: '~82 MB',
      icon: Laptop,
      url: 'https://github.com/dreeydesigns/aies-plat_form/releases/latest/download/AIES-SAT-Setup-1.2.4.exe'
    },
    mac: {
      name: 'macOS (Universal - Apple Silicon & Intel)',
      filename: 'AIES-SAT-1.2.4.dmg',
      size: '~89 MB',
      icon: Apple,
      url: 'https://github.com/dreeydesigns/aies-plat_form/releases/latest/download/AIES-SAT-1.2.4.dmg'
    },
    linux: {
      name: 'Linux (.AppImage)',
      filename: 'AIES-SAT-1.2.4.AppImage',
      size: '~78 MB',
      icon: Monitor,
      url: 'https://github.com/dreeydesigns/aies-plat_form/releases/latest/download/AIES-SAT-1.2.4.AppImage'
    }
  };

  const activeInfo = osData[selectedOS];
  const IconComponent = activeInfo.icon;

  return (
    <div className="mt-8 p-6 bg-slate-800/80 border border-slate-700/70 rounded-3xl backdrop-blur-xl shadow-xl space-y-4 max-w-lg mx-auto text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
            <WifiOff className="w-3 h-3" />
            <span>Offline-Ready Native App</span>
          </div>
          <h3 className="text-base font-bold text-white">Download AIES SAT for Desktop</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Practice offline without continuous connection. Syncs your tests and mastery telemetry automatically on reconnect.
          </p>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {/* Main Download Button */}
      <div className="space-y-2 pt-1">
        <a
          href={activeInfo.url}
          download
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download for {selectedOS === 'windows' ? 'Windows' : selectedOS === 'mac' ? 'Mac' : 'Linux'}</span>
        </a>

        {/* Metadata & Version info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Version: <strong className="text-slate-300 font-mono">v1.2.4</strong> ({activeInfo.size})</span>
          
          {/* OS Switcher Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>Other platforms</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showPicker && (
              <div className="absolute right-0 bottom-6 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-20 space-y-1">
                {(['windows', 'mac', 'linux'] as const).map((osKey) => (
                  <button
                    key={osKey}
                    onClick={() => { setSelectedOS(osKey); setShowPicker(false); }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedOS === osKey ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="capitalize">{osKey === 'mac' ? 'macOS (.dmg)' : osKey === 'windows' ? 'Windows (.exe)' : 'Linux (.AppImage)'}</span>
                    {selectedOS === osKey && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
