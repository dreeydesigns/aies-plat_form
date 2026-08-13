import React, { useEffect, useRef, useState } from 'react';
import { Calculator, X, Maximize2, Minimize2 } from 'lucide-react';

declare global {
  interface Window {
    Desmos?: any;
  }
}

interface DesmosCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DesmosCalculator({ isOpen, onClose }: DesmosCalculatorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<any>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script already exists
    if (window.Desmos) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      console.warn('Desmos API script failed to load online. Showing fallback mode.');
    };
    document.head.appendChild(script);

    return () => {
      // Keep script in head for performance
    };
  }, []);

  useEffect(() => {
    if (isOpen && isScriptLoaded && containerRef.current && window.Desmos && !calculatorRef.current) {
      calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
        keypad: true,
        graphpaper: true,
        expressions: true,
        settingsMenu: false,
        zoomButtons: true,
        border: false
      });
    }

    return () => {
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
        calculatorRef.current = null;
      }
    };
  }, [isOpen, isScriptLoaded]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-200 shadow-2xl rounded-2xl bg-white border border-neutral-300 flex flex-col overflow-hidden ${
        isMaximized
          ? 'inset-4 md:inset-10'
          : 'bottom-4 right-4 w-[95vw] sm:w-[500px] md:w-[600px] h-[480px]'
      }`}
    >
      {/* Header */}
      <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm tracking-wide">Desmos® Graphing Calculator</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
            Official SAT Tool
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-600 rounded-lg text-neutral-400 hover:text-white transition-colors"
            title="Close Calculator"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calculator Body */}
      <div className="flex-1 bg-white relative">
        <div ref={containerRef} className="w-full h-full" />
        {!isScriptLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-neutral-50 text-neutral-600 text-center">
            <Calculator className="w-10 h-10 text-neutral-400 animate-bounce mb-3" />
            <p className="font-bold text-sm">Loading Desmos Calculator API...</p>
            <p className="text-xs text-neutral-500 mt-1">Connecting to official graphing engine</p>
          </div>
        )}
      </div>
    </div>
  );
}
