import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Award, 
  Lock, 
  Check, 
  Plus, 
  Sparkles
} from 'lucide-react';

interface BadgeItem {
  name: string;
  desc: string;
  criteria: string;
}

export const Achievements: React.FC = () => {
  const { 
    xp, 
    level, 
    streak, 
    challenges, 
    unlockedBadges, 
    updateChallengeProgress, 
    highContrast 
  } = useApp();

  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const xpInCurrentLevel = xp % 200;
  const xpNeeded = 200 - xpInCurrentLevel;
  const xpPercentage = Math.min(100, (xpInCurrentLevel / 200) * 100);

  const badgeCatalog: BadgeItem[] = [
    { name: 'Green Onboarded', desc: 'Welcome to the platform!', criteria: 'Complete the EcoWise initial onboarding questionnaire.' },
    { name: 'Streak Starter', desc: 'Building consistent habits.', criteria: 'Log sustainable habits for 3 consecutive days.' },
    { name: 'Consistency King', desc: 'An inspiration to others.', criteria: 'Maintain a logging streak of 7 consecutive days.' },
    { name: 'Eco Explorer', desc: 'Venturing into reduction steps.', criteria: 'Accumulate a total of 200 XP.' },
    { name: 'Carbon Crusher', desc: 'Diverting massive grid strain.', criteria: 'Accumulate a total of 600 XP.' },
    { name: 'Planet Protector', desc: 'A true hero of the environment.', criteria: 'Accumulate a total of 1200 XP.' },
    { name: 'Challenge Conqueror', desc: 'Tackled difficulty with courage.', criteria: 'Complete at least 1 high-difficulty challenge.' },
    { name: 'Climate Champion', desc: 'Ultimate planet protector badge.', criteria: 'Complete 5 or more sustainability challenges.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Gamified Achievements Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Earn XP, increase your Level rank, and unlock collectible badges.
          </p>
        </div>
      </div>

      {/* Gamification progress level */}
      <div className={`glass-card p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center ${
        highContrast ? 'border-2 border-white bg-black' : ''
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl border ${
            highContrast ? 'bg-white text-black border-white' : 'bg-emerald-500/10 border-emerald-400/20 text-emerald-400'
          }`}>
            Lvl {level}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Level Rank</div>
            <div className="text-lg font-bold text-white mt-0.5">Eco Guard</div>
            <div className="text-[10px] text-slate-500">{streak} days active streak</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 md:col-span-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>{xpPercentage}% Level Progress</span>
            <span>{xp} XP / {level * 200} Total XP ({xpNeeded} XP to next level)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-blue-500 h-3.5 rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Badges Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold font-display text-white">
            Unlockable Collectible Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badgeCatalog.map((b) => {
              const isUnlocked = unlockedBadges.includes(b.name);
              return (
                <div
                  key={b.name}
                  onClick={() => setSelectedBadge(b)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-all ${
                    isUnlocked
                      ? highContrast
                        ? 'border-white bg-white text-black font-bold'
                        : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:scale-105'
                      : 'border-slate-800 bg-slate-900/40 text-slate-600 hover:border-slate-700'
                  }`}
                  style={{
                    filter: isUnlocked && !highContrast ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.15))' : 'none'
                  }}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                    isUnlocked 
                      ? highContrast ? 'bg-black text-white border-black' : 'bg-emerald-500/10 border-emerald-400/20' 
                      : 'bg-slate-950/40 border-slate-800/80'
                  }`}>
                    {isUnlocked ? (
                      <Award className="h-6 w-6" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-700" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold truncate max-w-[110px] text-slate-200">{b.name}</div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Badge details tooltip box */}
          {selectedBadge && (
            <div className={`p-4 rounded-xl border flex items-start space-x-3 transition-opacity duration-300 ${
              highContrast ? 'border-white bg-black' : 'bg-white/5 border-white/5'
            }`}>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white">{selectedBadge.name}</h3>
                <p className="text-[10px] text-slate-300">{selectedBadge.desc}</p>
                <div className="text-[10px] text-slate-400 pt-1">
                  <strong>Unlock Criteria:</strong> {selectedBadge.criteria}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Challenges Board */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold font-display text-white">
            Sustainability Challenges
          </h2>

          <div className="space-y-3">
            {challenges.map((ch) => (
              <div 
                key={ch.id} 
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  highContrast ? 'border-white bg-black' : 'bg-slate-900/60 border-white/5'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        ch.difficulty === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                        ch.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {ch.difficulty}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {ch.timeframe}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white mt-1">{ch.title}</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{ch.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-bold">+{ch.xpReward} XP</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>Progress: {ch.progressCurrent} / {ch.progressMax}</span>
                    <span>{Math.round((ch.progressCurrent / ch.progressMax) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(ch.progressCurrent / ch.progressMax) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Log button */}
                {!ch.completed ? (
                  <button
                    onClick={() => updateChallengeProgress(ch.id, ch.progressCurrent + 1)}
                    className={`w-full py-1.5 rounded-lg font-bold text-[10px] flex items-center justify-center space-x-1 ${
                      highContrast ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Increment Progress</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-center space-x-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/5 py-1.5 rounded-lg">
                    <Check className="h-3.5 w-3.5" />
                    <span>Completed! Reward Claimed</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
