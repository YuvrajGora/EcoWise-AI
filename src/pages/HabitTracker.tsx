import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCarbon } from '../utils/impactTranslator';
import { 
  Flame, 
  Trash2, 
  Plus, 
  Calendar, 
  ShieldAlert
} from 'lucide-react';

export const HabitTracker: React.FC = () => {
  const { 
    habitLogs, 
    streak, 
    xp, 
    logHabit, 
    clearAllHabitLogs, 
    highContrast, 
    units 
  } = useApp();

  // Habit logging form state
  const [category, setCategory] = useState<string>('transport');
  const [description, setDescription] = useState<string>('');
  const [carbonSaved, setCarbonSaved] = useState<number>(5.5);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!description.trim()) {
      setErrorMsg('Please specify a description.');
      return;
    }
    if (description.length > 80) {
      setErrorMsg('Description must be 80 characters or less.');
      return;
    }
    if (carbonSaved <= 0 || carbonSaved > 500) {
      setErrorMsg('Savings must be between 0.1 and 500 kg CO₂.');
      return;
    }

    logHabit(
      category as any,
      1,
      Number(carbonSaved),
      description
    );

    setDescription('');
    setCarbonSaved(5.5);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'transport': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'energy': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'food': return 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20';
      case 'shopping': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'waste': return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Daily Habit Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Log sustainable actions, grow your active streak, and offset carbon.
          </p>
        </div>
        
        {habitLogs.length > 0 && (
          <button
            onClick={clearAllHabitLogs}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors border ${
              highContrast 
                ? 'border-white bg-black text-white hover:bg-white/10'
                : 'border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10'
            }`}
          >
            <Trash2 className="h-4 w-4" />
            <span>Reset Logs</span>
          </button>
        )}
      </div>

      {/* Streak panel */}
      <div className={`glass-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ${
        highContrast ? 'border-2 border-white bg-black' : ''
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
            highContrast ? 'bg-white text-black border-white' : 'bg-amber-500/10 border-amber-400/20 text-amber-500'
          }`}>
            <Flame className="h-7 w-7" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Logging Streak</div>
            <div className="text-xl font-bold text-white mt-0.5">{streak} Days Consistent</div>
            <div className="text-[10px] text-slate-500">Keep logging daily to multiply carbon offset scores.</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <div className="bg-slate-900/60 border border-white/5 rounded-xl px-4 py-2 text-center">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide">XP Unlocked</span>
            <span className="text-sm font-bold text-emerald-400">{xp} XP</span>
          </div>
          <div className="bg-slate-900/60 border border-white/5 rounded-xl px-4 py-2 text-center">
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wide">Total Offsets Logged</span>
            <span className="text-sm font-bold text-blue-400">{habitLogs.length} Actions</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Habit logging Form */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold font-display text-white">
            Log Action Entry
          </h2>
          <form 
            onSubmit={handleLog}
            className={`glass-card p-6 space-y-4 ${
              highContrast ? 'border-2 border-white bg-black' : ''
            }`}
          >
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Category Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full rounded-xl bg-slate-900 border px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 ${
                  highContrast ? 'border-white focus:ring-white' : 'border-white/10 focus:ring-emerald-500'
                }`}
              >
                <option value="transport">Transportation (Cycling/Carpool)</option>
                <option value="energy">Home Energy (Thermostat/Appliances)</option>
                <option value="food">Diet & Food (Vegan/Locally sourced)</option>
                <option value="shopping">Shopping (Second-hand/Reusable bag)</option>
                <option value="waste">Waste (Recycling/Composting)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Action Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Cycled to office instead of taking car"
                className={`w-full rounded-xl bg-slate-900 border px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 ${
                  highContrast ? 'border-white focus:ring-white' : 'border-white/10 focus:ring-emerald-500'
                }`}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase">CO₂ Offset (kg)</label>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{carbonSaved} kg</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={carbonSaved}
                onChange={(e) => setCarbonSaved(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <span className="block text-[9px] text-slate-500 italic">
                Adjust the emissions slide bar depending on direct trip size or appliance time.
              </span>
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all ${
                highContrast 
                  ? 'bg-white text-black hover:bg-slate-200' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Log Action +20 XP</span>
            </button>
          </form>
        </div>

        {/* History log lists */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold font-display text-white">
            Offset Activity Archive
          </h2>

          {habitLogs.length === 0 ? (
            <div className={`p-8 rounded-2xl border border-dashed border-slate-800 text-center flex flex-col items-center justify-center space-y-2.5 bg-slate-900/10 ${
              highContrast ? 'border-white bg-black' : ''
            }`}>
              <Calendar className="h-8 w-8 text-slate-700" />
              <div className="text-xs text-slate-400">No habit logs found.</div>
              <p className="text-[10px] text-slate-500 max-w-[280px]">
                Submit your first sustainable activity card inside the logging panel.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {habitLogs.slice().reverse().map((log) => (
                <div 
                  key={log.id} 
                  className={`p-4 rounded-xl border flex justify-between items-center ${
                    highContrast ? 'border-white bg-black' : 'bg-slate-900/60 border-white/5'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        getCategoryColor(log.category)
                      }`}>
                        {log.category}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {log.date}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white truncate">{log.description}</p>
                  </div>
                  
                  <div className="text-right shrink-0 flex items-center space-x-3">
                    <div>
                      <div className="text-xs font-bold text-emerald-400">
                        -{formatCarbon(log.co2SavedKg, units)}
                      </div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase">+15 XP</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
