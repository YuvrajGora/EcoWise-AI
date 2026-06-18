import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Leaf, 
  Cpu, 
  Flame, 
  Sparkles, 
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  Compass
} from 'lucide-react';

interface LandingProps {
  setCurrentPage: (page: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ setCurrentPage }) => {
  const { onboarded, highContrast } = useApp();

  const features = [
    {
      icon: Cpu,
      title: 'Sustainability Intelligence Engine',
      desc: 'Advanced algorithms break down emissions into localized footprint categories: transport, energy, food, shopping, and waste.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Flame,
      title: 'EcoTwin Predictions',
      desc: 'Simulate your current lifestyle compared to your recommended future model. Predict emission trajectories dynamically.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Sparkles,
      title: 'AI Priority Score Engine',
      desc: 'Get highly personalized, actionable suggestions. Sort recommendations instantly by emission savings divided by effort.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Leaf,
      title: 'Daily Habit Challenges',
      desc: 'Gamify your carbon reductions. Log eco-activities daily to maintain streaks, earn XP rewards, and level up.',
      color: 'from-amber-500 to-orange-500'
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background glowing blobs */}
      {!highContrast && (
        <>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </>
      )}

      {/* Hero Section */}
      <div className="max-w-4xl text-center space-y-6 select-none">
        <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          highContrast
            ? 'border border-white bg-black text-white'
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        }`}>
          <Sparkles className="h-3.5 w-3.5" />
          <span>Next-Generation Sustainability Coach</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-none">
          Track, Predict, and Decarbonize Your Life with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
            EcoWise AI
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
          Your personal Sustainability Intelligence assistant. Model your annual carbon output, run predictive EcoTwin simulations, prioritize high-impact habits, and challenge yourself to protect the planet.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button
            onClick={() => setCurrentPage(onboarded ? 'dashboard' : 'onboarding')}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer ${
              highContrast
                ? 'bg-white text-black hover:bg-slate-200 border-2 border-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-[0_0_24px_rgba(16,185,129,0.35)]'
            }`}
            aria-label="Get started with carbon assessment"
          >
            <span>{onboarded ? 'Go to Dashboard' : 'Calculate Your Footprint'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          {onboarded && (
            <button
              onClick={() => setCurrentPage('tracker')}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                highContrast
                  ? 'border-white text-white bg-black hover:bg-white/10'
                  : 'border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white bg-white/5'
              }`}
              aria-label="Go to habits tracker"
            >
              <span>Log Habits</span>
            </button>
          )}
        </div>
      </div>

      {/* Facts Banner */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
        {[
          {
            icon: ShieldAlert,
            title: '4.8 Tons CO₂',
            desc: 'Average annual carbon footprint of an individual globally.',
            color: 'text-amber-400'
          },
          {
            icon: TrendingDown,
            title: '2.0 Tons CO₂',
            desc: 'Target annual carbon budget recommended to halt global warming.',
            color: 'text-emerald-400'
          },
          {
            icon: Compass,
            title: '-40% Reduction',
            desc: 'Average emission reduction achieved using predictive eco-coaches.',
            color: 'text-blue-400'
          }
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`glass-card p-5 flex items-center space-x-4 ${
              highContrast ? 'border-2 border-white bg-black text-white' : ''
            }`}
          >
            <div className={`p-2.5 rounded-lg bg-white/5 ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{item.title}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="max-w-5xl w-full mt-20 space-y-8 select-none">
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-center text-white">
          Why EcoWise AI is Different
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx} 
                className={`glass-card glass-card-hover p-6 space-y-3 ${
                  highContrast ? 'border border-white bg-black text-white' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-r ${
                  highContrast ? 'bg-white text-black border border-white' : feature.color
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
