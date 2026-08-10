import React from 'react';
import PreferencesPanel from '../../components/PreferencesPanel';
import DeviceSync from '../../components/DeviceSync';
import ProfilePictureCapture from '../../components/shared/ProfilePictureCapture';

export default function TeacherSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neutral-800">Account Settings</h2>
        <p className="text-neutral-500">Manage your language, accessibility, and connected devices.</p>
      </div>
      <ProfilePictureCapture />
      <PreferencesPanel />
      <DeviceSync />
    </div>
  );
}
