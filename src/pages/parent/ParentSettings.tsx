import React from 'react';
import PreferencesPanel from '../../components/PreferencesPanel';
import ProfilePictureCapture from '../../components/shared/ProfilePictureCapture';

export default function ParentSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-800">Account Settings</h2>
        <p className="text-neutral-500">Manage your language and accessibility preferences.</p>
      </div>
      <ProfilePictureCapture />
      <PreferencesPanel />
    </div>
  );
}
