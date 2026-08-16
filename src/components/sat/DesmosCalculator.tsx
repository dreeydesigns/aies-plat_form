import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Calculator, X, Maximize2, Minimize2, GripHorizontal, RotateCcw } from 'lucide-react';

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
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [isMaximized, setIsMaximized] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Custom position coordinates
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  // Calculate default position on open
  useEffect(() => {
    if (isOpen && !position) {
      const defaultWidth = Math.min(600, window.innerWidth - 32);
      const defaultHeight = 480;
      const initialX = Math.max(16, window.innerWidth - defaultWidth - 24);
      const initialY = Math.max(16, window.innerHeight - defaultHeight - 24);
      setPosition({ x: initialX, y: initialY });
    }
  }, [isOpen, position]);

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

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized || !modalRef.current) return;
    
    // Ignore if clicking on button
    if ((e.target as HTMLElement).closest('button')) return;

    const currentX = position?.x ?? 20;
    const currentY = position?.y ?? 20;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY,
    };

    setIsDragging(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;
      
      const modalWidth = modalRef.current?.offsetWidth || 500;
      const modalHeight = modalRef.current?.offsetHeight || 480;

      // Clamping within viewport
      const nextX = Math.max(0, Math.min(window.innerWidth - modalWidth, dragStartRef.current.initialX + deltaX));
      const nextY = Math.max(0, Math.min(window.innerHeight - modalHeight, dragStartRef.current.initialY + deltaY));

      setPosition({ x: nextX, y: nextY });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [isMaximized, position]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isMaximized || !modalRef.current || e.touches.length === 0) return;
    
    if ((e.target as HTMLElement).closest('button')) return;

    const touch = e.touches[0];
    const currentX = position?.x ?? 20;
    const currentY = position?.y ?? 20;

    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: currentX,
      initialY: currentY,
    };

    setIsDragging(true);

    const onTouchMove = (moveEvent: TouchEvent) => {
      if (moveEvent.touches.length === 0) return;
      const moveTouch = moveEvent.touches[0];
      const deltaX = moveTouch.clientX - dragStartRef.current.startX;
      const deltaY = moveTouch.clientY - dragStartRef.current.startY;
      
      const modalWidth = modalRef.current?.offsetWidth || 500;
      const modalHeight = modalRef.current?.offsetHeight || 480;

      const nextX = Math.max(0, Math.min(window.innerWidth - modalWidth, dragStartRef.current.initialX + deltaX));
      const nextY = Math.max(0, Math.min(window.innerHeight - modalHeight, dragStartRef.current.initialY + deltaY));

      setPosition({ x: nextX, y: nextY });
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  }, [isMaximized, position]);

  const resetPosition = () => {
    const defaultWidth = Math.min(600, window.innerWidth - 32);
    const defaultHeight = 480;
    setPosition({
      x: Math.max(16, window.innerWidth - defaultWidth - 24),
      y: Math.max(16, window.innerHeight - defaultHeight - 24),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      style={
        isMaximized
          ? undefined
          : position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
              position: 'fixed',
            }
          : undefined
      }
      className={`fixed z-50 shadow-2xl rounded-2xl bg-white border border-neutral-300 flex flex-col overflow-hidden select-none ${
        isDragging ? 'opacity-95 ring-4 ring-blue-500/30' : ''
      } ${
        isMaximized
          ? 'inset-4 md:inset-10'
          : !position
          ? 'bottom-4 right-4 w-[95vw] sm:w-[500px] md:w-[600px] h-[480px]'
          : 'w-[95vw] sm:w-[500px] md:w-[600px] h-[480px]'
      }`}
    >
      {/* Draggable Header */}
      <div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={`bg-neutral-900 text-white px-4 py-3 flex items-center justify-between transition-colors ${
          isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:bg-neutral-800'
        }`}
        title={isMaximized ? 'Desmos Graphing Calculator' : 'Click and drag anywhere on this bar to move the calculator'}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <GripHorizontal className="w-4 h-4 text-neutral-400" />
          <Calculator className="w-5 h-5 text-blue-400" />
          <span className="font-bold text-sm tracking-wide">Desmos® Graphing Calculator</span>
          <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
            Movable
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          {!isMaximized && (
            <button
              onClick={resetPosition}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
              title="Reset to default position"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
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
      <div className="flex-1 bg-white relative select-auto">
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
