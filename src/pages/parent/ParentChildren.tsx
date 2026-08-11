import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, Activity, ShieldCheck, Eye, Radio, Bell } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function ParentChildren() {
  const { linkedStudents } = useAppContext();
  const navigate = useNavigate();
  
  const children = linkedStudents;

  const toggleConsent = async (childId: string, capability: 'deviceSync' | 'cameraWellness' | 'whatsappNotifications', currentValue: boolean) => {
    try {
      await updateDoc(doc(db, 'users', childId), {
        [`consent.${capability}`]: !currentValue,
        'consent.updatedAt': new Date().toISOString()
      });
    } catch (e) {
      console.error('Error updating child consent:', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">My Children & Parent Device Controls</h2>
          <p className="text-neutral-500">Manage settings, feature permissions, and view learning reports for your children.</p>
        </div>
      </div>
      
      {children.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold">!</div>
            <div>
              <p className="font-bold text-amber-900">You haven't linked a child yet.</p>
              <p className="text-sm text-amber-700">Enter their link code to get started tracking their progress.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/onboarding')} 
            className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
          >
            Enter Link Code
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map(child => {
          const isChildMinor = (child.age !== undefined && child.age < 14) || child.isParentManaged;
          const consent = child.consent || { deviceSync: false, cameraWellness: false, whatsappNotifications: false, updatedAt: '' };

          return (
            <div key={child.id} className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-neutral-800">{child.name}</h3>
                      <p className="text-sm text-neutral-500">
                        {child.age ? `Age ${child.age} · ` : ''}Level {child.level || 1} • {child.points || 0} pts
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isChildMinor ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-700'
                  }`}>
                    {isChildMinor ? 'Parent Managed (<14)' : 'Active'}
                  </span>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Level</p>
                      <p className="text-2xl font-bold text-neutral-800">{child.level || 1}</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Current Streak</p>
                      <p className="text-lg font-bold text-neutral-800">{child.streak || 0} days</p>
                    </div>
                  </div>

                  {/* PARENTAL FEATURE PERMISSIONS & SENSOR TOGGLES */}
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                    <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-600" />
                      Parent Device & Privacy Controls
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-100 text-xs">
                        <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-purple-600" /> VR Labs & Device Sync
                        </span>
                        <button
                          onClick={() => toggleConsent(child.id, 'deviceSync', consent.deviceSync)}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                            consent.deviceSync ? 'bg-purple-600 text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {consent.deviceSync ? 'Enabled ✓' : 'Disabled'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-100 text-xs">
                        <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-purple-600" /> Camera Study Companion
                        </span>
                        <button
                          onClick={() => toggleConsent(child.id, 'cameraWellness', consent.cameraWellness)}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                            consent.cameraWellness ? 'bg-purple-600 text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {consent.cameraWellness ? 'Enabled ✓' : 'Disabled'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-purple-100 text-xs">
                        <span className="font-semibold text-neutral-800 flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-purple-600" /> WhatsApp Weekly Digest
                        </span>
                        <button
                          onClick={() => toggleConsent(child.id, 'whatsappNotifications', consent.whatsappNotifications)}
                          className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                            consent.whatsappNotifications ? 'bg-purple-600 text-white' : 'bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          {consent.whatsappNotifications ? 'Enabled ✓' : 'Disabled'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-2">
                <button 
                  onClick={() => navigate('/parent/messages')}
                  className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-bold rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message Teacher
                </button>
                <button 
                  onClick={() => navigate(`/parent/children/${child.id}/report`)}
                  className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  View Full Report
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
