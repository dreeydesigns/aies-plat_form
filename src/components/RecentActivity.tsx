import React from 'react';
import { CheckCircle2, Trophy, Zap, Clock } from 'lucide-react';

export interface ActivityItem {
  id: string;
  childName: string;
  action: string;
  target: string;
  time: string;
  type: 'diagnostic' | 'practice' | 'badge' | 'workout';
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          Recent Student Activity Feed
        </h3>
        <span className="text-xs font-semibold text-neutral-500">Real-time</span>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center bg-neutral-50 rounded-2xl border border-neutral-100 p-6 space-y-2">
          <p className="text-sm font-semibold text-neutral-700">No activity recorded yet</p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            When your linked child completes their SAT Diagnostic or daily practice drills, activity updates will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(act => (
            <div key={act.id} className="flex items-start gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-100 hover:border-neutral-200 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                act.type === 'diagnostic' ? 'bg-purple-100 text-purple-700' :
                act.type === 'badge' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {act.type === 'diagnostic' && <CheckCircle2 className="w-4 h-4" />}
                {act.type === 'badge' && <Trophy className="w-4 h-4" />}
                {act.type === 'practice' && <Zap className="w-4 h-4" />}
                {act.type === 'workout' && <Zap className="w-4 h-4" />}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs text-neutral-800 leading-snug">
                  <span className="font-bold text-neutral-900">{act.childName}</span> {act.action} <span className="font-semibold text-neutral-950">{act.target}</span>
                </p>
                <p className="text-[10px] text-neutral-500 mt-0.5">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
