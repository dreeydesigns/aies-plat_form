import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Copy, Link, Settings, ShieldAlert } from 'lucide-react';
import PreferencesPanel from '../../components/PreferencesPanel';
import DeviceSync from '../../components/DeviceSync';
import ProfilePictureCapture from '../../components/shared/ProfilePictureCapture';

export default function StudentSettings() {
  const { currentUser, userProfile, isMinor, canAccessSettings } = useAppContext();
  const [copied, setCopied] = useState(false);

  if (!currentUser || !userProfile) return null;

  const handleCopyCode = () => {
    if (userProfile.linkCode) {
      navigator.clipboard.writeText(userProfile.linkCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">Account Settings</h2>
          <p className="text-neutral-500">Manage your profile and connections.</p>
        </div>
      </div>

      {isMinor && !canAccessSettings && (
        <div className="bg-purple-50 border border-purple-200 p-6 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-lg">
            <ShieldAlert className="w-6 h-6 text-purple-600" />
            Parent-Managed Settings Notice (Under 14)
          </div>
          <p className="text-sm text-purple-800 leading-relaxed">
            In compliance with student privacy laws, advanced device settings and VR features for learners under 14 are managed by a linked parent or guardian. Please share your Link Code below with your parent so they can configure your device permissions.
          </p>
        </div>
      )}

      <ProfilePictureCapture />

      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm max-w-2xl">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-neutral-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Link className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Parent / Guardian Link Code</h3>
            <p className="text-neutral-500 text-sm">Share this code with your parents so they can manage settings and track your progress.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-bold text-neutral-700">Your Link Code</label>
          <div className="flex items-center gap-4">
            <div className="bg-neutral-100 px-6 py-3 rounded-xl border border-neutral-200 font-mono text-xl font-bold tracking-widest text-neutral-800 flex-1">
              {userProfile.linkCode || 'Not generated'}
            </div>
            <button 
              onClick={handleCopyCode}
              disabled={!userProfile.linkCode}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-bold"
            >
              <Copy className="w-5 h-5" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {userProfile.parentIds && userProfile.parentIds.length > 0 && (
          <div className="mt-8 pt-8 border-t border-neutral-100">
            <h4 className="font-bold text-neutral-900 mb-4">Linked Parent Accounts</h4>
            <div className="space-y-2">
              {userProfile.parentIds.map((pid, i) => (
                <div key={pid} className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-100 rounded-lg">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-neutral-600">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">Parent Account Verified</p>
                    <p className="text-xs text-neutral-500">ID: {pid.substring(0,8)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Render Preferences & Device Sync only if permitted */}
      {canAccessSettings ? (
        <>
          <PreferencesPanel />
          <DeviceSync />
        </>
      ) : (
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 text-center text-neutral-500 text-sm">
          Device Sync & Sensor settings are locked for student accounts under 14 until verified by a linked parent account.
        </div>
      )}
    </div>
  );
}
