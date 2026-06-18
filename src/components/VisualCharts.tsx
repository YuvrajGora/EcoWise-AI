import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCarbon, getRealWorldEquivalent } from '../utils/impactTranslator';
import type { FootprintBreakdown } from '../utils/sustainabilityIntelligence';

// Colors for standard light/dark modes
const CATEGORY_COLORS = {
  transport: { stroke: 'url(#gradient-transport)', text: '#60a5fa', fill: 'rgba(96, 165, 250, 0.15)', name: 'Transportation' },
  energy: { stroke: 'url(#gradient-energy)', text: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', name: 'Home Energy' },
  food: { stroke: 'url(#gradient-food)', text: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', name: 'Diet & Food' },
  shopping: { stroke: 'url(#gradient-shopping)', text: '#a855f7', fill: 'rgba(168, 85, 247, 0.15)', name: 'Shopping & Goods' },
  waste: { stroke: 'url(#gradient-waste)', text: '#ec4899', fill: 'rgba(236, 72, 153, 0.15)', name: 'Waste & Recycling' },
};

// High contrast overrides
const HC_CATEGORY_COLORS = {
  transport: { stroke: '#ffffff', text: '#ffffff', fill: 'none', name: 'Transportation' },
  energy: { stroke: '#ffffff', text: '#ffffff', fill: 'none', name: 'Home Energy' },
  food: { stroke: '#ffffff', text: '#ffffff', fill: 'none', name: 'Diet & Food' },
  shopping: { stroke: '#ffffff', text: '#ffffff', fill: 'none', name: 'Shopping & Goods' },
  waste: { stroke: '#ffffff', text: '#ffffff', fill: 'none', name: 'Waste & Recycling' },
};

// --- 1. CARBON BREAKDOWN DONUT CHART ---
interface DonutProps {
  data: {
    transport: number;
    energy: number;
    food: number;
    shopping: number;
    waste: number;
    total: number;
  };
}

export const CarbonBreakdownDonut: React.FC<DonutProps> = ({ data }) => {
  const { highContrast, units } = useApp();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categories = [
    { key: 'transport', value: data.transport },
    { key: 'energy', value: data.energy },
    { key: 'food', value: data.food },
    { key: 'shopping', value: data.shopping },
    { key: 'waste', value: data.waste },
  ].filter(c => c.value > 0);

  const colors = highContrast ? HC_CATEGORY_COLORS : CATEGORY_COLORS;

  // Donut geometry
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const center = 100;

  let accumulatedAngle = -90; // start at top

  const slices = categories.map((cat, idx) => {
    const percentage = cat.value / (data.total || 1);
    const strokeDashoffset = circumference - (circumference * percentage);
    const rotation = accumulatedAngle;
    accumulatedAngle += percentage * 360;

    return {
      ...cat,
      percentage,
      strokeDashoffset,
      rotation,
      color: colors[cat.key as keyof typeof colors],
      index: idx
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-4">
      {/* SVG Container */}
      <div className="relative w-48 h-48 select-none">
        <svg 
          viewBox="0 0 200 200" 
          className="w-full h-full transform transition-transform duration-300"
          role="img"
          aria-label={`Carbon breakdown donut chart. Total emissions is ${formatCarbon(data.total, units)}.`}
        >
          <defs>
            <linearGradient id="gradient-transport" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="gradient-energy" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="gradient-food" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="gradient-shopping" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="gradient-waste" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>

          {/* Underlay ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={highContrast ? '#333333' : '#1e293b'}
            strokeWidth={strokeWidth}
          />

          {slices.map((slice) => {
            const isHovered = hoveredIndex === slice.index;
            return (
              <circle
                key={slice.key}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={slice.color.stroke}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={slice.strokeDashoffset}
                transform={`rotate(${slice.rotation} ${center} ${center})`}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(slice.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  filter: isHovered && !highContrast ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))' : 'none'
                }}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            {hoveredIndex !== null ? slices[hoveredIndex].color.name : 'Total Impact'}
          </span>
          <span className="text-xl font-bold font-display text-white mt-0.5">
            {hoveredIndex !== null 
              ? formatCarbon(slices[hoveredIndex].value, units)
              : formatCarbon(data.total, units)
            }
          </span>
          <span className="text-[9px] text-slate-400">
            {hoveredIndex !== null
              ? `${Math.round(slices[hoveredIndex].percentage * 100)}% of total`
              : 'Per Year'
            }
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-2 w-full md:w-52">
        {slices.map((slice) => (
          <div
            key={slice.key}
            className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
              hoveredIndex === slice.index 
                ? highContrast ? 'bg-white text-black' : 'bg-white/5' 
                : 'hover:bg-white/5'
            }`}
            onMouseEnter={() => setHoveredIndex(slice.index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center space-x-2">
              <span 
                className="w-3.5 h-3.5 rounded-full border border-white/20"
                style={{ backgroundColor: highContrast ? '#ffffff' : slice.color.text }}
              />
              <span className="text-xs font-semibold text-slate-200">
                {slice.color.name}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-100">
                {formatCarbon(slice.value, units)}
              </div>
              <div className="text-[10px] text-slate-400">
                {Math.round(slice.percentage * 100)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- 2. EMISSION TREND AREA CHART ---
interface TrendProps {
  logs: { date: string; co2SavedKg: number }[];
}

export const EmissionTrendArea: React.FC<TrendProps> = ({ logs }) => {
  const { highContrast } = useApp();

  // Aggregate emissions savings over past 7 days
  const getPastNDays = (n: number) => {
    const arr = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().split('T')[0]);
    }
    return arr;
  };

  const labels = getPastNDays(7);
  const dataPoints = labels.map(day => {
    const dailyLogs = logs.filter(l => l.date === day);
    const sumSaved = dailyLogs.reduce((acc, l) => acc + l.co2SavedKg, 0);
    return Math.round(sumSaved * 10) / 10;
  });

  const width = 500;
  const height = 180;
  const padding = 35;

  const maxVal = Math.max(10, ...dataPoints) * 1.2;

  // Chart coordinates mapping
  const points = dataPoints.map((val, idx) => {
    const x = padding + (idx * (width - 2 * padding) / (labels.length - 1));
    const y = height - padding - (val * (height - 2 * padding) / maxVal);
    return { x, y, val, label: labels[idx] };
  });

  // Generate SVG path strings
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  }

  // Formatting date labels (e.g. "Jun 18")
  const formatDateLabel = (str: string) => {
    const [,, day] = str.split('-');
    return day;
  };

  return (
    <div className="w-full">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="Emission savings trend line chart over past week"
      >
        <defs>
          <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padding + p * (height - 2 * padding);
          const gridVal = Math.round((maxVal - (p * maxVal)) * 10) / 10;
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke={highContrast ? '#444' : 'rgba(255,255,255,0.05)'}
                strokeDasharray="4,4"
              />
              <text
                x={padding - 8}
                y={y + 4}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="end"
                className="font-mono"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {points.length > 0 && !highContrast && (
          <path d={areaD} fill="url(#area-gradient)" />
        )}

        {/* Line stroke */}
        {points.length > 0 && (
          <path
            d={pathD}
            fill="none"
            stroke={highContrast ? '#ffffff' : '#10b981'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Dynamic Nodes / Dots */}
        {points.map((p, idx) => (
          <g key={idx} className="group">
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill={highContrast ? '#ffffff' : '#10b981'}
              stroke={highContrast ? '#000000' : '#0f172a'}
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:scale-150"
            />
            {/* Hover Tooltip inside SVG */}
            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <rect
                x={Math.max(p.x - 45, 10)}
                y={p.y - 35}
                width="90"
                height="24"
                rx="4"
                fill={highContrast ? '#ffffff' : '#1e293b'}
                stroke={highContrast ? '#000000' : '#334155'}
                strokeWidth="1"
              />
              <text
                x={Math.max(p.x, 55)}
                y={p.y - 19}
                fill={highContrast ? '#000000' : '#fff'}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {p.val} kg Saved
              </text>
            </g>
          </g>
        ))}

        {/* Date Labels */}
        {points.map((p, idx) => (
          <text
            key={idx}
            x={p.x}
            y={height - padding + 18}
            fill="#94a3b8"
            fontSize="10"
            textAnchor="middle"
            className="font-mono"
          >
            {formatDateLabel(p.label)}
          </text>
        ))}
      </svg>
    </div>
  );
};


// --- 3. ECOTWIN COMPARISON BAR ---
interface ComparisonProps {
  current: FootprintBreakdown;
  future: FootprintBreakdown;
}

export const EcoTwinComparisonBar: React.FC<ComparisonProps> = ({ current, future }) => {
  const { highContrast, units } = useApp();

  const categories = [
    { key: 'transport', label: 'Transport', currVal: current.transport, futVal: future.transport, color: '#60a5fa' },
    { key: 'energy', label: 'Energy', currVal: current.energy, futVal: future.energy, color: '#f59e0b' },
    { key: 'food', label: 'Diet/Food', currVal: current.food, futVal: future.food, color: '#10b981' },
    { key: 'shopping', label: 'Shopping', currVal: current.shopping, futVal: future.shopping, color: '#a855f7' },
    { key: 'waste', label: 'Waste', currVal: current.waste, futVal: future.waste, color: '#ec4899' },
  ];

  const maxVal = Math.max(1, ...categories.map(c => Math.max(c.currVal, c.futVal)));

  return (
    <div className="space-y-4">
      {categories.map((cat) => {
        const currWidth = Math.max(2, (cat.currVal / maxVal) * 100);
        const futWidth = Math.max(2, (cat.futVal / maxVal) * 100);
        const reduction = cat.currVal > 0 
          ? Math.round(((cat.currVal - cat.futVal) / cat.currVal) * 100)
          : 0;

        return (
          <div key={cat.key} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200">{cat.label}</span>
              {reduction > 0 && (
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                  -{reduction}% twin projection
                </span>
              )}
            </div>

            {/* Custom Bar Layout */}
            <div className="space-y-1.5">
              {/* Current */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] w-12 text-slate-400">Current:</span>
                <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700/30">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${currWidth}%`, 
                      backgroundColor: highContrast ? '#ffffff' : cat.color,
                      opacity: 0.65
                    }}
                  />
                </div>
                <span className="text-[10px] w-16 text-right font-mono text-slate-300">
                  {formatCarbon(cat.currVal, units, 0)}
                </span>
              </div>

              {/* Recommended Future */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] w-12 text-emerald-400">EcoTwin:</span>
                <div className="flex-1 bg-slate-800/80 rounded-full h-3 overflow-hidden border border-emerald-500/10">
                  <div 
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${futWidth}%`, 
                      backgroundColor: highContrast ? '#ffffff' : '#10b981',
                      boxShadow: !highContrast ? `0 0 8px ${cat.color}` : 'none'
                    }}
                  />
                </div>
                <span className="text-[10px] w-16 text-right font-mono text-emerald-400 font-bold">
                  {formatCarbon(cat.futVal, units, 0)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};


// --- 4. CARBON BUDGET GAUGE (WEEKLY) ---
export const CarbonBudgetGauge: React.FC = () => {
  const { weeklyBudgetLimit, weeklyUsedCarbon, weeklySavedCarbon, budgetHealth, highContrast, units } = useApp();

  const radius = 55;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate percentage used
  const usedPercentage = Math.min(1.2, weeklyUsedCarbon / (weeklyBudgetLimit || 1));
  const strokeDashoffset = circumference - (circumference * Math.min(1.0, usedPercentage));

  // Determine colors based on health
  const getHealthColor = () => {
    if (highContrast) return '#ffffff';
    switch (budgetHealth) {
      case 'Excellent': return '#10b981'; // Green
      case 'Good': return '#34d399';      // Emerald
      case 'Warning': return '#f59e0b';   // Amber
      case 'Exceeded': return '#ef4444';  // Red
    }
  };

  const healthText = () => {
    switch (budgetHealth) {
      case 'Excellent': return 'On track - Excellent';
      case 'Good': return 'On track - Good';
      case 'Warning': return 'Approaching limit';
      case 'Exceeded': return 'Budget Exceeded';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="relative w-36 h-36">
        <svg 
          viewBox="0 0 130 130" 
          className="w-full h-full transform -rotate-90"
          role="img"
          aria-label={`Carbon Budget Gauge: Used ${weeklyUsedCarbon} kg CO2 out of limit ${weeklyBudgetLimit} kg CO2.`}
        >
          {/* Base track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={highContrast ? '#333333' : '#1e293b'}
            strokeWidth={strokeWidth}
          />
          {/* Active progress */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={getHealthColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Weekly Used</span>
          <span className="text-xl font-bold font-display text-white mt-0.5">
            {formatCarbon(weeklyUsedCarbon, units, 1)}
          </span>
          <span className="text-[10px] text-slate-400">
            limit {formatCarbon(weeklyBudgetLimit, units, 0)}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <span 
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            highContrast
              ? 'border border-white bg-black text-white'
              : budgetHealth === 'Exceeded' 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : budgetHealth === 'Warning'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}
        >
          {healthText()}
        </span>
        <div className="text-[11px] text-slate-400 mt-2 font-medium">
          Saved this week: <span className="text-emerald-400 font-bold">{formatCarbon(weeklySavedCarbon, units, 1)}</span>
        </div>
        <div className="text-[10px] text-slate-400 mt-1 italic">
          (= {getRealWorldEquivalent(weeklySavedCarbon).trees} trees planted equivalent)
        </div>
      </div>
    </div>
  );
};


// --- 5. SUSTAINABILITY SCORE GAUGE ---
export const SustainabilityScoreGauge: React.FC = () => {
  const { ecoTwin, highContrast } = useApp();
  const score = ecoTwin.sustainabilityScore;

  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * score) / 100;

  const getScoreRating = (val: number) => {
    if (val >= 85) return { text: 'Eco Champion', color: 'text-emerald-400' };
    if (val >= 60) return { text: 'Sustainability Explorer', color: 'text-emerald-300' };
    if (val >= 40) return { text: 'Average Impact', color: 'text-amber-400' };
    return { text: 'High Emission Footprint', color: 'text-red-400' };
  };

  const rating = getScoreRating(score);

  return (
    <div className="flex flex-col items-center justify-center p-3 text-center">
      <div className="relative w-36 h-36">
        <svg 
          viewBox="0 0 130 130" 
          className="w-full h-full transform -rotate-90"
          role="img"
          aria-label={`Sustainability Score: ${score} out of 100.`}
        >
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={highContrast ? '#333333' : 'rgba(255,255,255,0.03)'}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="65"
            cy="65"
            r={radius}
            fill="none"
            stroke={highContrast ? '#ffffff' : '#10b981'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: !highContrast ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' : 'none'
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Eco Score</span>
          <span className="text-3xl font-black font-display text-white">
            {score}
          </span>
          <span className="text-[10px] text-slate-400">/ 100</span>
        </div>
      </div>

      <div className="mt-3">
        <span className={`text-xs font-bold ${highContrast ? 'text-white' : rating.color}`}>
          {rating.text}
        </span>
        <p className="text-[10px] text-slate-400 mt-1 max-w-[150px] mx-auto leading-relaxed">
          Based on carbon footprint, diet habits, recycling diligence, and active lifestyle.
        </p>
      </div>
    </div>
  );
};
