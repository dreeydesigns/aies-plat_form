import React from 'react';
import { Award, Zap, Trophy, Star, CheckCircle } from 'lucide-react';
import { BADGES_DATA } from '../../utils/badge-manager';

export default function Badges({ earnedBadges }: { earnedBadges: string[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-neutral-800">Recent Achievements</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {earnedBadges.length === 0 ? (
          <div className="col-span-2 text-sm text-neutral-500 text-center py-4 bg-neutral-50 rounded-xl">
            No achievements yet. Complete lessons to earn badges!
          </div>
        ) : (
          earnedBadges.map(badgeId => {
            const badge = BADGES_DATA[badgeId];
            if (!badge) return null;
            return (
              <div key={badgeId} className="flex flex-col items-center p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
                  {badge.icon === 'Zap' && <Zap className="w-6 h-6 text-amber-500" />}
                  {badge.icon === 'Trophy' && <Trophy className="w-6 h-6 text-amber-500" />}
                  {badge.icon === 'Star' && <Star className="w-6 h-6 text-amber-500" />}
                  {badge.icon === 'CheckCircle' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                </div>
                <p className="text-xs font-bold text-neutral-800">{badge.name}</p>
                <p className="text-[10px] text-neutral-500 mt-1 leading-tight">{badge.description}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
