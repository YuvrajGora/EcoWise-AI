import React from 'react';
import { useApp } from '../context/AppContext';
import { type ActionRecommendation } from '../utils/aiPriorityEngine';
import { translateCarbon } from '../utils/impactTranslator';
import { 
  Car, 
  Lightbulb, 
  Utensils, 
  ShoppingBag, 
  Trash2, 
  CheckCircle,
  Zap,
  Clock,
  Compass
} from 'lucide-react';

interface ActionCardProps {
  recommendation: ActionRecommendation;
  rank: number;
}

const CATEGORY_ICONS = {
  transport: Car,
  energy: Lightbulb,
  food: Utensils,
  shopping: ShoppingBag,
  waste: Trash2,
};

const EFFORT_COLORS = {
  Low: {
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    hc: 'border border-white bg-black text-white'
  },
  Medium: {
    bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    hc: 'border border-white bg-black text-white'
  },
  High: {
    bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    hc: 'border border-white bg-black text-white'
  }
};

export const ActionCard: React.FC<ActionCardProps> = ({ recommendation, rank }) => {
  const { logHabit, highContrast } = useApp();
  
  const Icon = CATEGORY_ICONS[recommendation.category] || Compass;
  const effortStyle = EFFORT_COLORS[recommendation.effortLevel];

  // Calculate equivalence detailed metrics
  const equivalents = translateCarbon(recommendation.rawSavingsKg);

  const handleLogAction = () => {
    // Log habit with monthly savings / 4 (to make it a weekly habit value)
    const weeklySavings = Math.round((recommendation.rawSavingsKg / 4.33) * 10) / 10;
    
    // Determine a log value
    const logVal = 1;
    const desc = `Implemented: ${recommendation.name}`;

    logHabit(
      recommendation.category,
      logVal,
      weeklySavings,
      desc
    );
  };

  return (
    <div 
      className={`glass-card glass-card-hover p-5 relative overflow-hidden transition-all duration-300 ${
        highContrast ? 'border-2 border-white bg-black text-white' : ''
      }`}
      style={{
        borderLeft: highContrast ? '8px solid #ffffff' : undefined,
        borderLeftColor: !highContrast ? (
          recommendation.category === 'transport' ? '#60a5fa' :
          recommendation.category === 'energy' ? '#f59e0b' :
          recommendation.category === 'food' ? '#10b981' :
          recommendation.category === 'shopping' ? '#a855f7' : '#ec4899'
        ) : undefined
      }}
    >
      {/* Priority Rank Indicator */}
      <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold tracking-wider rounded-bl-lg ${
        highContrast 
          ? 'bg-white text-black' 
          : 'bg-[#1e293b] text-slate-400 border-l border-b border-white/5'
      }`}>
        RANK #{rank}
      </div>

      <div className="flex items-start space-x-4">
        {/* Category Icon */}
        <div className={`p-2.5 rounded-lg ${
          highContrast 
            ? 'border border-white bg-black text-white' 
            : 'bg-white/5 text-slate-300'
        }`}>
          <Icon className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2.5">
          <div className="space-y-1">
            <h3 className="text-base font-bold font-display text-white pr-12">
              {recommendation.name}
            </h3>
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                highContrast ? effortStyle.hc : effortStyle.bg
              }`}>
                {recommendation.effortLevel} Effort
              </span>
              <span className={`flex items-center text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5`}>
                <Zap className="h-3 w-3 text-amber-400 mr-1" />
                Score: {recommendation.priorityScore}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {recommendation.reason}
          </p>

          {/* Environmental Equivalents */}
          <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
            highContrast 
              ? 'border-white bg-black text-white' 
              : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300'
          }`}>
            <div className="font-semibold flex items-center">
              <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              Monthly Impact Equivalent:
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
              <li>Diverts emissions equivalent to planting <strong className="text-emerald-300">{equivalents.trees} trees</strong></li>
              <li>Avoids <strong className="text-emerald-300">{equivalents.drivingKm} km</strong> of car combustion travel</li>
              <li>Saves <strong className="text-emerald-300">{equivalents.electricityDays} days</strong> of standard home energy use</li>
            </ul>
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleLogAction}
            className={`w-full py-2 px-3 rounded-lg font-medium text-xs flex items-center justify-center space-x-1.5 transition-all focus:outline-none ${
              highContrast
                ? 'bg-white text-black font-bold hover:bg-slate-200'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            }`}
            aria-label={`Log habit execution for ${recommendation.name}`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Mark as Actioned (+15 XP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
