import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Eye, 
  Trash2, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { 
    units, 
    setUnits, 
    highContrast, 
    toggleHighContrast, 
    resetAllData 
  } = useApp();

  const handleReset = () => {
    if (window.confirm('Are you absolutely sure you want to delete all onboarding profiles, habit logs, streaks, and achievements? This action is permanent.')) {
      resetAllData();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 select-none">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Personalize your display options, measurement systems, and profile logs.
        </p>
      </div>

      <div className="space-y-6">
        {/* Unit preference selector */}
        <div className={`glass-card p-6 space-y-4 ${highContrast ? 'border-2 border-white bg-black' : ''}`}>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Measurement System</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose between metric (kilograms, kilometers) or imperial (pounds, miles) calculations.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUnits('metric')}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all font-bold ${
                units === 'metric'
                  ? highContrast
                    ? 'border-white bg-white text-black'
                    : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span>Metric (SI Units)</span>
              {units === 'metric' && <Check className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setUnits('imperial')}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all font-bold ${
                units === 'imperial'
                  ? highContrast
                    ? 'border-white bg-white text-black'
                    : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span>Imperial (US Customary)</span>
              {units === 'imperial' && <Check className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Accessibility & Visual Mode */}
        <div className={`glass-card p-6 space-y-4 ${highContrast ? 'border-2 border-white bg-black' : ''}`}>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Accessibility & Contrast</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Toggle high contrast modes for better visual compliance and screen readability.
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-slate-400" />
              <div>
                <span className="block text-xs font-bold text-white">High Contrast Colors</span>
                <span className="text-[10px] text-slate-500">Overrides neon glass styles with maximum contrast white-on-black layout.</span>
              </div>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                highContrast
                  ? 'bg-white text-black'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {highContrast ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* Factory Reset Section */}
        <div className={`glass-card p-6 space-y-4 border-rose-500/20 bg-rose-500/5 ${
          highContrast ? 'border-2 border-white bg-black' : ''
        }`}>
          <div>
            <h2 className="text-sm font-bold text-rose-400 uppercase tracking-wider">System Factory Reset</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              This action deletes all onboarding settings, streaks, carbon offsets, and achievements stored in local storage.
            </p>
          </div>

          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-[10px] flex items-start space-x-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              <strong>Warning:</strong> Deleting cache is immediate. Your dashboard results and historical graphs will be cleared.
            </span>
          </div>

          <button
            onClick={handleReset}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors border ${
              highContrast
                ? 'border-white bg-black text-white hover:bg-white/10'
                : 'border-rose-500/30 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10'
            }`}
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Local Stored Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
