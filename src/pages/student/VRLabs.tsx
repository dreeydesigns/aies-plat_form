import React, { useState, useRef, useEffect } from 'react';
import { Box, CheckCircle2, Compass, FlaskConical, Monitor, Orbit, Sparkles, Eye, RotateCcw, Zap, Layers, Play } from 'lucide-react';
import DeviceSync from '../../components/DeviceSync';

interface LabScene {
  id: string;
  icon: any;
  title: string;
  category: string;
  description: string;
  hotspots: Array<{ name: string; info: string; x: number; y: number }>;
}

export default function VRLabs() {
  const [selectedLabId, setSelectedLabId] = useState<string>('cell');
  const [activeHotspot, setActiveHotspot] = useState<{ name: string; info: string } | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const labScenes: LabScene[] = [
    {
      id: 'cell',
      icon: FlaskConical,
      title: 'Interactive 3D Animal Cell Lab',
      category: 'Biology & Life Sciences',
      description: 'Explore cell organelles in real 3D. Click on organelle hotspots to examine their structure, function, and energy generation.',
      hotspots: [
        { name: 'Nucleus & DNA', info: 'Contains the genetic blueprint (DNA) and controls cell replication and protein synthesis.', x: 48, y: 48 },
        { name: 'Mitochondria (Powerhouse)', info: 'Generates ATP energy through cellular respiration for metabolic functions.', x: 28, y: 35 },
        { name: 'Ribosomes & Endoplasmic Reticulum', info: 'Synthesizes and folds proteins required for cellular metabolism.', x: 68, y: 62 },
        { name: 'Cell Membrane', info: 'Phospholipid bilayer controlling selective passage of nutrients and signals.', x: 82, y: 25 },
      ]
    },
    {
      id: 'solar',
      icon: Orbit,
      title: '3D Solar System & Gravitational Mechanics',
      category: 'Physics & Astronomy',
      description: 'Interact with planetary orbits, Kepler gravitational laws, and spatial orientation in our solar system.',
      hotspots: [
        { name: 'The Sun (Solar Core)', info: 'Main-sequence G-type star generating energy via hydrogen fusion into helium.', x: 50, y: 50 },
        { name: 'Terrestrial Planets (Inner Orbit)', info: 'Rocky planets (Mercury, Venus, Earth, Mars) orbiting closest to the Sun.', x: 35, y: 45 },
        { name: 'Gas Giants (Outer Orbit)', info: 'Massive hydrogen/helium gas giants (Jupiter, Saturn, Uranus, Neptune).', x: 75, y: 30 },
      ]
    },
    {
      id: 'chemistry',
      icon: Compass,
      title: '3D Molecular Structure & Bonding',
      category: 'Chemistry & Nanotechnology',
      description: 'Analyze covalent and ionic molecular geometry, electron cloud density, and chemical valence bonds.',
      hotspots: [
        { name: 'Water Molecule (H₂O)', info: 'Polar covalent bond with a 104.5° angle causing high surface tension and solvency.', x: 45, y: 40 },
        { name: 'Methane (CH₄)', info: 'Tetrahedral molecular geometry with sp³ hybridization and 109.5° bond angles.', x: 60, y: 60 },
      ]
    }
  ];

  const currentLab = labScenes.find(l => l.id === selectedLabId) || labScenes[0];

  // 3D Canvas Animation Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = rotationAngle;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      angle += 0.008;

      if (selectedLabId === 'cell') {
        // Draw 3D-styled Cell Sphere
        const grad = ctx.createRadialGradient(cx - 20, cy - 20, 10, cx, cy, 140);
        grad.addColorStop(0, '#a7f3d0');
        grad.addColorStop(0.5, '#34d399');
        grad.addColorStop(1, '#059669');

        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Nucleus
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#60a5fa';
        ctx.fill();
        ctx.strokeStyle = '#1d4ed8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Mitochondria (orbiting)
        const mx = cx + Math.cos(angle) * 75;
        const my = cy + Math.sin(angle) * 75;
        ctx.beginPath();
        ctx.ellipse(mx, my, 22, 12, angle, 0, Math.PI * 2);
        ctx.fillStyle = '#f87171';
        ctx.fill();
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (selectedLabId === 'solar') {
        // Sun
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();

        // Orbits
        [70, 110, 150].forEach((r, idx) => {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          const px = cx + Math.cos(angle * (idx + 1) * 0.7) * r;
          const py = cy + Math.sin(angle * (idx + 1) * 0.7) * r;

          ctx.beginPath();
          ctx.arc(px, py, 8 + idx * 3, 0, Math.PI * 2);
          ctx.fillStyle = idx === 0 ? '#60a5fa' : idx === 1 ? '#f87171' : '#a7f3d0';
          ctx.fill();
        });
      } else {
        // Molecules
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fillStyle = '#f87171'; // Oxygen
        ctx.fill();

        const h1x = cx + Math.cos(angle) * 80;
        const h1y = cy + Math.sin(angle) * 80;
        const h2x = cx + Math.cos(angle + 1.8) * 80;
        const h2y = cy + Math.sin(angle + 1.8) * 80;

        // Bonds
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(h1x, h1y);
        ctx.moveTo(cx, cy);
        ctx.lineTo(h2x, h2y);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Hydrogens
        [ [h1x, h1y], [h2x, h2y] ].forEach(([hx, hy]) => {
          ctx.beginPath();
          ctx.arc(hx, hy, 18, 0, Math.PI * 2);
          ctx.fillStyle = '#60a5fa';
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [selectedLabId]);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-600 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/10 text-yellow-300 px-3 py-1 rounded-full w-fit mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> WebGL & WebXR Interactive Science
          </div>
          <h2 className="text-3xl font-bold mb-2">Interactive 3D VR Laboratories</h2>
          <p className="text-indigo-100 max-w-xl text-sm leading-relaxed">
            Manipulate 3D scientific structures directly in your browser. Tap organelle and atomic hotspots for interactive guided lessons, or plug in a VR headset for full WebXR immersion.
          </p>
        </div>
        <button
          onClick={() => setActiveHotspot(null)}
          className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-2xl shadow-lg hover:bg-indigo-50 transition-transform active:scale-95 flex items-center gap-2 flex-shrink-0 text-sm"
        >
          <RotateCcw className="w-4 h-4 text-indigo-600" />
          Reset View
        </button>
      </div>

      {/* Lab Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {labScenes.map((lab) => {
          const Icon = lab.icon;
          const isSelected = selectedLabId === lab.id;
          return (
            <button
              key={lab.id}
              onClick={() => {
                setSelectedLabId(lab.id);
                setActiveHotspot(null);
              }}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-500 shadow-md ring-2 ring-indigo-200'
                  : 'bg-white border-neutral-200 hover:border-indigo-300 hover:bg-neutral-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">Active Scene</span>}
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-base">{lab.title}</h4>
                <p className="text-xs text-neutral-500 mt-1">{lab.category}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3D Canvas Visualizer & Hotspot Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Render Panel */}
        <div className="lg:col-span-2 bg-neutral-900 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          <div className="flex justify-between items-center z-10">
            <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" /> Interactive WebGL Canvas
            </span>
            <span className="text-xs text-neutral-400 font-mono">3D Orbiting Motion Active</span>
          </div>

          {/* Interactive Canvas */}
          <div className="relative flex justify-center items-center my-4">
            <canvas
              ref={canvasRef}
              width={500}
              height={320}
              className="max-w-full h-auto cursor-grab active:cursor-grabbing"
            ></canvas>

            {/* Render Hotspot Overlay Dots */}
            {currentLab.hotspots.map((hs, idx) => (
              <button
                key={idx}
                style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                onClick={() => setActiveHotspot(hs)}
                className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg transition-transform hover:scale-125 ${
                  activeHotspot?.name === hs.name
                    ? 'bg-yellow-400 text-neutral-900 ring-4 ring-yellow-200 animate-bounce'
                    : 'bg-white text-indigo-900 border-2 border-indigo-600'
                }`}
                title={`Click to inspect ${hs.name}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center z-10 text-xs text-neutral-400 border-t border-neutral-800 pt-4">
            <span>Click numbered hotspots (1-{currentLab.hotspots.length}) to inspect structure.</span>
            <span className="text-indigo-400 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Ready for WebXR Headset
            </span>
          </div>
        </div>

        {/* Hotspot & Guided Information Side Panel */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-neutral-900 text-lg mb-1">{currentLab.title}</h3>
            <p className="text-xs text-neutral-500 mb-4">{currentLab.description}</p>

            {activeHotspot ? (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 animate-fadeIn">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Organelle / Feature Inspection
                </span>
                <h4 className="font-bold text-neutral-900 text-base">{activeHotspot.name}</h4>
                <p className="text-sm text-neutral-700 leading-relaxed">{activeHotspot.info}</p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-center text-neutral-500 text-sm">
                <p className="font-medium text-neutral-700 mb-1">Select a 3D Hotspot</p>
                <p className="text-xs">Click any numbered marker on the 3D canvas to reveal detailed scientific explanations.</p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-neutral-100">
            <h5 className="font-bold text-xs text-neutral-500 uppercase tracking-wider">Hotspot Index</h5>
            <div className="space-y-1.5">
              {currentLab.hotspots.map((hs, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveHotspot(hs)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition-colors flex items-center gap-2 ${
                    activeHotspot?.name === hs.name
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    activeHotspot?.name === hs.name ? 'bg-white text-indigo-900' : 'bg-neutral-200 text-neutral-700'
                  }`}>{idx + 1}</span>
                  <span className="truncate">{hs.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WebXR Real Bluetooth & Headset Sync */}
      <DeviceSync />
    </div>
  );
}
