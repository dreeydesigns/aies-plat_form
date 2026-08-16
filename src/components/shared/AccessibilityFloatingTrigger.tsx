import React from 'react';
import { Accessibility } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import AccessibilityControlModal from './AccessibilityControlModal';

export default function AccessibilityFloatingTrigger() {
  const { setIsModalOpen } = useAccessibility();

  return (
    <>
      {/* Floating Assistive Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="Open Accessibility and Assistive Controls"
        title="Accessibility & Assistive Tools"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-xl shadow-blue-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-white/20 focus:outline-none focus:ring-4 focus:ring-blue-400"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {/* Interactive Modal */}
      <AccessibilityControlModal />
    </>
  );
}
