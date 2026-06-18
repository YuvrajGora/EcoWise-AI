import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActionCard } from '../components/ActionCard';
import { 
  CarbonBudgetGauge, 
  SustainabilityScoreGauge 
} from '../components/VisualCharts';
import { translateCarbon, formatCarbon } from '../utils/impactTranslator';
import { 
  Award, 
  Flame, 
  Check, 
  Plus, 
  HelpCircle,
  AlertTriangle,
  Leaf
} from 'lucide-react';

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const { 
    profile, 
    breakdown, 
    recommendations, 
    challenges, 
    updateChallengeProgress,
    streak, 
    level, 
    highContrast,
    units,
    logHabit
  } = useApp();

  const [logOpen, setLogOpen] = useState(false);

  // Identify highest hotspot category
  const categories = [
    { key: 'transport', val: breakdown.transport, label: 'Transportation' },
    { key: 'energy', val: breakdown.energy, label: 'Home Energy' },
    { key: 'food', val: breakdown.food, label: 'Diet & Food' },
    { key: 'shopping', val: breakdown.shopping, label: 'Shopping' },
    { key: 'waste', val: breakdown.waste, label: 'Waste' }
  ];
  categories.sort((a, b) => b.val - a.val);
  const topHotspot = categories[0];

  // Translated total annual footprint metrics
  const annualTranslator = translateCarbon(breakdown.total);

  // Quick log options
  const quickLogHabits = [
    { label: 'Walk/Transit instead of Car', category: 'transport', co2: 2.5, desc: 'Used public transport or active transit' },
    { label: 'Ate Vegan/Vegetarian meal', category: 'food', co2: 1.8, desc: 'Opted for zero-meat diet' },
    { label: 'Reduced electricity by 1hr', category: 'energy', co2: 1.2, desc: 'Turned off standby loads and heaters' },
    { label: 'Composted kitchen scraps', category: 'waste', co2: 0.8, desc: 'Composted organic trash scraps' },
    { label: 'Diverted recycling from trash', category: 'waste', co2: 0.5, desc: 'Sorted recyclables' },
  ];

  const handleQuickLog = (habit: typeof quickLogHabits[0]) => {
    logHabit(
      habit.category as 'transport' | 'food' | 'energy' | 'waste' | 'shopping',
      1,
      habit.co2,
      habit.desc
    );
    setLogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Welcome & Streak Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Welcome back, {profile.name || 'Eco Warrior'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Here is your real-time carbon intelligence overview.
          </p>
        </div>

        {/* Level & XP */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            highContrast ? 'border border-white bg-black' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            <Award className="h-4 w-4" />
            <span>Level {level}</span>
          </div>
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            highContrast ? 'border border-white bg-black' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            <Flame className="h-4 w-4 fill-current animate-bounce" />
            <span>{streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Budget & Eco Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Carbon Budget Ring */}
        <div className={`glass-card p-6 flex flex-col justify-between ${highContrast ? 'border-2 border-white bg-black text-white' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Weekly Carbon Budget</h2>
            <span title="Calculated as (Onboarding Emissions/52) minus weekly carbon saved by logs.">
              <HelpCircle className="h-4 w-4 text-slate-500 cursor-pointer" />
            </span>
          </div>
          <CarbonBudgetGauge />
        </div>

        {/* Eco Score ring */}
        <div className={`glass-card p-6 flex flex-col justify-between ${highContrast ? 'border-2 border-white bg-black text-white' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Eco twin Score</h2>
            <span title="Score reflecting your current habits relative to global climate budgets.">
              <HelpCircle className="h-4 w-4 text-slate-500 cursor-pointer" />
            </span>
          </div>
          <SustainabilityScoreGauge />
        </div>

        {/* Hotspot & Equivalents Insights */}
        <div className={`glass-card p-6 flex flex-col justify-between space-y-4 ${highContrast ? 'border-2 border-white bg-black text-white' : ''}`}>
          <div>
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Highest Carbon Hotspot</h2>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-500/5 border border-red-500/15">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-xs font-bold text-slate-200">{topHotspot.label}</div>
                <div className="text-[10px] text-slate-400">
                  Emits {formatCarbon(topHotspot.val, units)} / year
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Footprint Real-World Equivalent</h2>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Your annual emissions ({formatCarbon(breakdown.total, units)}) is equivalent to driving{' '}
              <strong className="text-emerald-400">{annualTranslator.drivingKm} km</strong>, burning electricity for{' '}
              <strong className="text-emerald-400">{annualTranslator.electricityDays} days</strong>, or needing{' '}
              <strong className="text-emerald-400">{annualTranslator.trees} trees</strong> to absorb.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Challenges & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personalized Challenges */}
        <div className={`glass-card p-6 space-y-4 ${highContrast ? 'border-2 border-white bg-black text-white' : ''}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold font-display text-white">Active Challenges</h2>
            <button
              onClick={() => setCurrentPage('achievements')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold focus:outline-none"
            >
              All Achievements &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {challenges.slice(0, 3).map((ch) => (
              <div 
                key={ch.id} 
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  highContrast ? 'border-white bg-black' : 'bg-slate-900/60 border-white/5 hover:border-white/10'
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
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-1 rounded-full transition-all duration-300"
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
                    <Plus className="h-3 w-3" />
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

        {/* Priority Actions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold font-display text-white">Most Effective Actions Right Now</h2>
            <button
              onClick={() => setCurrentPage('analytics')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold focus:outline-none"
            >
              Analyze Hotspots &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 2).map((rec, idx) => (
              <ActionCard key={rec.id} recommendation={rec} rank={idx + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Log Trigger */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setLogOpen(!logOpen)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform focus:outline-none hover:scale-110 ${
            highContrast
              ? 'bg-white text-black border-2 border-white'
              : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-emerald-500/25'
          }`}
          aria-expanded={logOpen}
          aria-label="Quick log carbon reduction habit"
        >
          <Leaf className="h-6 w-6" />
        </button>

        {/* Quick Log Menu */}
        {logOpen && (
          <div className={`absolute bottom-14 right-0 w-64 rounded-xl border p-4 shadow-xl space-y-3 transition-all ${
            highContrast ? 'bg-black border-white text-white' : 'bg-slate-950 border-white/10 text-slate-100'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Log Habits</h3>
            <div className="flex flex-col gap-1.5">
              {quickLogHabits.map((habit, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickLog(habit)}
                  className={`text-left p-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    highContrast ? 'hover:bg-white/20' : 'hover:bg-white/5'
                  }`}
                >
                  <span className="truncate mr-2">{habit.label}</span>
                  <span className="text-emerald-400 shrink-0">-{habit.co2} kg</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
