import React from 'react';
import { Box } from 'lucide-react';
import DeviceSync from '../../components/DeviceSync';

export default function VRLabs() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-600 text-white p-8 rounded-2xl">
        <Box className="w-10 h-10 mb-4 opacity-90" />
        <h2 className="text-2xl font-bold mb-2">VR Labs</h2>
        <p className="text-indigo-100 max-w-xl">
          Full simulated science labs and 3D collaborative modeling are on our roadmap. If you already
          have a VR headset connected, you can launch a live session below right now — this uses the
          real WebXR standard, it's not a preview.
        </p>
      </div>
      <DeviceSync />
    </div>
  );
}
