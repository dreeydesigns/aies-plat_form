import React from 'react';
import { X, BookOpen, Calculator } from 'lucide-react';

interface MathReferenceSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MathReferenceSheetModal({ isOpen, onClose }: MathReferenceSheetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-200 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-neutral-900">SAT Math Reference Sheet</h2>
              <p className="text-xs text-neutral-500">Official standard formulas for Digital SAT Math sections</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Circles */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Circles</h3>
            <p className="font-mono text-neutral-800">Area: <span className="font-bold">$A = \pi r^2$</span></p>
            <p className="font-mono text-neutral-800">Degrees in circle: <span className="font-bold">360°</span></p>
            <p className="font-mono text-neutral-800">Radians in circle: <span className="font-bold">2π radians</span></p>
          </div>

          {/* Triangles & Rectangles */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">2D Area & Pythagoras</h3>
            <p className="font-mono text-neutral-800">Rectangle Area: <span className="font-bold">$A = \ell w$</span></p>
            <p className="font-mono text-neutral-800">Triangle Area: <span className="font-bold">$A = \frac{1}{2} b h$</span></p>
            <p className="font-mono text-neutral-800">Pythagorean Theorem: <span className="font-bold">$a^2 + b^2 = c^2$</span></p>
            <p className="font-mono text-neutral-800">Triangle Angles Sum: <span className="font-bold">$180^\circ$</span></p>
          </div>

          {/* Special Right Triangles */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">Special Right Triangles</h3>
            <p className="text-neutral-700 leading-relaxed">
              <strong>$45^\circ-45^\circ-90^\circ$:</strong> Side ratio is <span className="font-mono font-bold">$x : x : x\sqrt{2}$</span>
            </p>
            <p className="text-neutral-700 leading-relaxed">
              <strong>$30^\circ-60^\circ-90^\circ$:</strong> Side ratio is <span className="font-mono font-bold">$x : x\sqrt{3} : 2x$</span>
            </p>
          </div>

          {/* 3D Volumes */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
            <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">3D Volume Formulas</h3>
            <p className="font-mono text-neutral-800">Rectangular Solid: <span className="font-bold">$V = \ell w h$</span></p>
            <p className="font-mono text-neutral-800">Right Cylinder: <span className="font-bold">$V = \pi r^2 h$</span></p>
            <p className="font-mono text-neutral-800">Sphere: <span className="font-bold">$V = \frac{4}{3} \pi r^3$</span></p>
            <p className="font-mono text-neutral-800">Right Cone: <span className="font-bold">$V = \frac{1}{3} \pi r^2 h$</span></p>
            <p className="font-mono text-neutral-800">Pyramid: <span className="font-bold">$V = \frac{1}{3} B h$</span></p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-colors"
        >
          Close Reference Sheet
        </button>
      </div>
    </div>
  );
}
