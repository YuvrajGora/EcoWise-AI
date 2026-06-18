import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CarbonBreakdownDonut, 
  EmissionTrendArea 
} from '../components/VisualCharts';
import { formatCarbon, getRealWorldEquivalent } from '../utils/impactTranslator';
import { 
  Compass, 
  Cpu, 
  Flame, 
  Zap,
  Calendar
} from 'lucide-react';

export const Analytics: React.FC = () => {
  const { breakdown, habitLogs, highContrast, units } = useApp();
  const [activeStep, setActiveStep] = useState<number>(1);

  // Table breakdown items
  const tableData = [
    { key: 'transport', label: 'Transportation', value: breakdown.transport, desc: 'Commutes, road trips, short/long flights' },
    { key: 'energy', label: 'Home Energy', value: breakdown.energy, desc: 'Home electricity and space heating emissions' },
    { key: 'food', label: 'Diet & Food', value: breakdown.food, desc: 'Emissions associated with eating styles & local sourcing' },
    { key: 'shopping', label: 'Shopping', value: breakdown.shopping, desc: 'Production and shipping footprint of apparel & goods' },
    { key: 'waste', label: 'Waste', value: breakdown.waste, desc: 'Landfill methane emission equivalents from organic trash' }
  ];

  // Decision Intelligence Framework Steps
  const decisionSteps = [
    {
      step: 1,
      title: 'Assessment',
      icon: Compass,
      desc: 'Formulate an estimated carbon baseline from onboarding habits across 5 distinct lifestyle vectors.',
      action: 'Completed via onboarding questionnaire.'
    },
    {
      step: 2,
      title: 'Hotspot Isolation',
      icon: Cpu,
      desc: 'Calculate category scores and isolate the highest carbon contributor representing the biggest reduction potential.',
      action: 'Isolated on your Dashboard & Charts.'
    },
    {
      step: 3,
      title: 'AI Priority Rankings',
      icon: Zap,
      desc: 'Filter actions using the mathematical priority formula (Carbon Savings / Effort) to rank high-impact, easy steps first.',
      action: 'Generated on the Recommendations dashboard.'
    },
    {
      step: 4,
      title: 'EcoTwin Future Simulation',
      icon: Flame,
      desc: 'Model hypothetical scenarios with sliding parameters and project carbon reduction trajectories.',
      action: 'Deploy simulations on the Simulator page.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Sustainability Intelligence Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Audit your carbon emissions profile and trace historical offset logs.
          </p>
        </div>
      </div>

      {/* Decision Intelligence workflow block */}
      <div className={`glass-card p-6 space-y-4 ${highContrast ? 'border-2 border-white bg-black' : ''}`}>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold font-display text-white">
              Decision Intelligence Framework
            </h2>
            <p className="text-xs text-slate-400">
              The continuous analysis feedback loop EcoWise AI deploys to help you decarbonize.
            </p>
          </div>
          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
            highContrast ? 'border border-white text-white' : 'bg-blue-500/10 text-blue-400'
          }`}>
            Feedback Loop
          </span>
        </div>

        {/* Horizontal step layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {decisionSteps.map((s) => {
            const SIcon = s.icon;
            const isSelected = activeStep === s.step;
            return (
              <div 
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? highContrast
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <SIcon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Step {s.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{s.title}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
                <div className="text-[9px] text-slate-500 italic border-t border-white/5 pt-1.5">
                  Status: {s.action}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SVG Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carbon breakdown Donut */}
        <div className={`glass-card p-6 space-y-4 ${highContrast ? 'border-2 border-white bg-black' : ''}`}>
          <h2 className="text-base font-bold font-display text-white">
            Categorical Footprint Breakdown
          </h2>
          <CarbonBreakdownDonut data={breakdown} />
        </div>

        {/* Area Trend chart */}
        <div className={`glass-card p-6 space-y-4 ${highContrast ? 'border-2 border-white bg-black' : ''}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold font-display text-white">
              7-Day Offsets Trend
            </h2>
            <div className="flex items-center space-x-1 text-[10px] text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Rolling 7 Days</span>
            </div>
          </div>
          <EmissionTrendArea logs={habitLogs} />
        </div>
      </div>

      {/* Table section */}
      <div className={`glass-card p-6 space-y-4 ${highContrast ? 'border-2 border-white bg-black' : ''}`}>
        <h2 className="text-base font-bold font-display text-white">
          Detailed Environmental Emissions Audit
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-slate-400 uppercase tracking-wider ${
              highContrast ? 'border-white' : 'border-white/5'
            }`}>
              <tr>
                <th className="pb-3 pr-4">Category</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Emissions Context</th>
                <th className="pb-3 pr-4 text-right">Annual Impact</th>
                <th className="pb-3 pr-4 text-right">% of Total</th>
                <th className="pb-3 text-right">Trees Equivalent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {tableData.map((row) => {
                const percentage = Math.round((row.value / (breakdown.total || 1)) * 100);
                const trees = getRealWorldEquivalent(row.value).trees;
                return (
                  <tr key={row.key} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 pr-4 text-white font-bold">{row.label}</td>
                    <td className="py-3.5 pr-4 text-slate-400 hidden md:table-cell">{row.desc}</td>
                    <td className="py-3.5 pr-4 text-right font-mono text-slate-200">
                      {formatCarbon(row.value, units)}
                    </td>
                    <td className="py-3.5 pr-4 text-right font-mono text-slate-200">
                      {percentage}%
                    </td>
                    <td className="py-3.5 text-right font-mono text-emerald-400">
                      {trees} trees / yr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
