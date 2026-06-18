import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type UserProfile, calculateFootprint } from '../utils/sustainabilityIntelligence';
import { EcoTwinComparisonBar } from '../components/VisualCharts';
import { translateCarbon, formatCarbon } from '../utils/impactTranslator';
import { 
  Flame, 
  RefreshCw, 
  Check, 
  Sparkles,
  Leaf
} from 'lucide-react';

export const CarbonSimulator: React.FC = () => {
  const { profile, breakdown, saveProfile, highContrast, units } = useApp();

  // Create temporary simulator profile state seeded from the user's actual profile
  const [simProfile, setSimProfile] = useState<UserProfile>({ ...profile });
  const [isSaved, setIsSaved] = useState(false);

  const handleSimChange = (key: keyof UserProfile, value: any) => {
    setSimProfile(prev => ({
      ...prev,
      [key]: value
    }));
    setIsSaved(false);
  };

  const resetSimulator = () => {
    setSimProfile({ ...profile });
    setIsSaved(false);
  };

  const applySimProfile = () => {
    saveProfile(simProfile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Calculate footprint for the simulated profile
  const simBreakdown = calculateFootprint(simProfile);

  // Carbon savings calculation
  const totalSavingsAnnual = Math.max(0, breakdown.total - simBreakdown.total);
  const totalSavingsMonthly = Math.round((totalSavingsAnnual / 12) * 10) / 10;
  
  // Translate simulated savings
  const equivalents = translateCarbon(totalSavingsMonthly);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            EcoTwin Carbon Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Model lifestyle changes, predict futuristic emissions, and simulate planetary offsets in real-time.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={resetSimulator}
            className={`px-4 py-2 rounded-lg border text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              highContrast
                ? 'border-white text-white hover:bg-white/10'
                : 'border-slate-800 text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Settings</span>
          </button>

          <button
            onClick={applySimProfile}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              highContrast
                ? 'bg-white text-black hover:bg-slate-200 border-2 border-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            }`}
          >
            {isSaved ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            <span>{isSaved ? 'Applied Target!' : 'Apply as Baseline'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Simulator controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`glass-card p-6 space-y-5 ${highContrast ? 'border-2 border-white bg-black' : ''}`}>
            <h2 className="text-base font-bold font-display text-white border-b border-white/5 pb-2">
              Emissions Modulators
            </h2>

            {/* Commute Vehicle Type */}
            <div className="space-y-1.5">
              <label htmlFor="sim-commute" className="text-xs font-semibold text-slate-300 block">
                Commuting Vehicle / Transit
              </label>
              <select
                id="sim-commute"
                value={simProfile.commuteType}
                onChange={(e) => handleSimChange('commuteType', e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 ${
                  highContrast ? 'bg-black border-white text-white' : ''
                }`}
              >
                <option value="petrol_car">Gas/Diesel Combustion Car</option>
                <option value="hybrid_car">Hybrid Vehicle</option>
                <option value="electric_car">Electric Vehicle (EV)</option>
                <option value="public_transit">Public Transit</option>
                <option value="active_commute">Active Transit (Walk/Cycle)</option>
              </select>
            </div>

            {/* Commute distance */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="sim-distance" className="font-semibold text-slate-300">
                  Weekly Commute Distance
                </label>
                <span className="font-mono text-emerald-400 font-bold">{simProfile.commuteDistance} km</span>
              </div>
              <input
                id="sim-distance"
                type="range"
                min="0"
                max="500"
                step="10"
                value={simProfile.commuteDistance}
                onChange={(e) => handleSimChange('commuteDistance', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Monthly electricity */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="sim-electricity" className="font-semibold text-slate-300">
                  Monthly Electricity
                </label>
                <span className="font-mono text-emerald-400 font-bold">{simProfile.electricityMonthly} kWh</span>
              </div>
              <input
                id="sim-electricity"
                type="range"
                min="50"
                max="1200"
                step="25"
                value={simProfile.electricityMonthly}
                onChange={(e) => handleSimChange('electricityMonthly', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Diet selection */}
            <div className="space-y-1.5">
              <label htmlFor="sim-diet" className="text-xs font-semibold text-slate-300 block">
                Dietary Pattern
              </label>
              <select
                id="sim-diet"
                value={simProfile.dietType}
                onChange={(e) => handleSimChange('dietType', e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs text-slate-100 ${
                  highContrast ? 'bg-black border-white text-white' : ''
                }`}
              >
                <option value="meat_heavy">Meat Heavy</option>
                <option value="average">Average Diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            {/* Waste trash bags */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="sim-trash" className="font-semibold text-slate-300">
                  Weekly Trash Bags
                </label>
                <span className="font-mono text-emerald-400 font-bold">{simProfile.trashBagsWeekly} bags</span>
              </div>
              <input
                id="sim-trash"
                type="range"
                min="0"
                max="8"
                step="1"
                value={simProfile.trashBagsWeekly}
                onChange={(e) => handleSimChange('trashBagsWeekly', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            {/* Green Energy Tariff */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${
              highContrast ? 'border-white bg-black' : 'bg-white/5 border-white/5'
            }`}>
              <div>
                <div className="text-xs font-bold text-slate-200">Green tariff</div>
                <div className="text-[9px] text-slate-400">Green Electricity plan</div>
              </div>
              <button
                type="button"
                onClick={() => handleSimChange('greenEnergy', !simProfile.greenEnergy)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  simProfile.greenEnergy
                    ? highContrast ? 'bg-white border-black' : 'bg-emerald-500'
                    : 'bg-slate-700'
                }`}
                aria-checked={simProfile.greenEnergy}
                role="switch"
              >
                <span 
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-slate-900 transition-transform ${
                    simProfile.greenEnergy ? 'translate-x-5' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>

            {/* Composting */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${
              highContrast ? 'border-white bg-black' : 'bg-white/5 border-white/5'
            }`}>
              <div>
                <div className="text-xs font-bold text-slate-200">Organic compost</div>
                <div className="text-[9px] text-slate-400">Compost food waste</div>
              </div>
              <button
                type="button"
                onClick={() => handleSimChange('composting', !simProfile.composting)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
                  simProfile.composting
                    ? highContrast ? 'bg-white border-black' : 'bg-emerald-500'
                    : 'bg-slate-700'
                }`}
                aria-checked={simProfile.composting}
                role="switch"
              >
                <span 
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-slate-900 transition-transform ${
                    simProfile.composting ? 'translate-x-5' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>
        </div>

        {/* Prediction Outputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main projection card */}
          <div className={`glass-card p-6 space-y-6 ${highContrast ? 'border-2 border-white bg-black' : ''}`}>
            <h2 className="text-base font-bold font-display text-white flex items-center">
              <Flame className="h-5 w-5 mr-1.5 text-orange-400" />
              EcoTwin Future Comparison
            </h2>

            {/* Comparison Bar SVG Chart */}
            <EcoTwinComparisonBar current={breakdown} future={simBreakdown} />

            {/* Carbon Totals Breakdown */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                <span className="text-[9px] text-slate-400 uppercase block font-semibold">Baseline Footprint</span>
                <span className="text-lg font-black text-white">{formatCarbon(breakdown.total, units)}</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                <span className="text-[9px] text-emerald-400 uppercase block font-semibold">Simulated Footprint</span>
                <span className="text-lg font-black text-emerald-400">{formatCarbon(simBreakdown.total, units)}</span>
              </div>
            </div>
          </div>

          {/* Environmental Equivalents Box */}
          {totalSavingsAnnual > 0 && (
            <div className={`glass-card p-5 space-y-3 ${
              highContrast ? 'border border-white bg-black' : 'border-emerald-500/10 bg-emerald-500/5'
            }`}>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center">
                <Leaf className="h-4.5 w-4.5 text-emerald-400 mr-1.5" />
                Simulated Savings Impact: -{formatCarbon(totalSavingsAnnual, units)}/year
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By maintaining these simulated adjustments, your monthly emission offset ({formatCarbon(totalSavingsMonthly, units)}) equates to:
              </p>
              <div className="grid grid-cols-3 gap-3 text-center pt-1">
                <div className="p-2.5 bg-slate-950/40 rounded-lg border border-white/5">
                  <span className="text-base font-black text-emerald-400 font-display block">{equivalents.trees}</span>
                  <span className="text-[9px] text-slate-400">Trees Planted</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 rounded-lg border border-white/5">
                  <span className="text-base font-black text-emerald-400 font-display block">{equivalents.drivingKm} km</span>
                  <span className="text-[9px] text-slate-400">Less Driving</span>
                </div>
                <div className="p-2.5 bg-slate-950/40 rounded-lg border border-white/5">
                  <span className="text-base font-black text-emerald-400 font-display block">{equivalents.electricityDays} d</span>
                  <span className="text-[9px] text-slate-400">Home Electric</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
