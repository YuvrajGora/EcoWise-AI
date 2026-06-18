import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Leaf, 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Flame, 
  Award, 
  Settings as SettingsIcon,
  Activity,
  Menu,
  X,
  Eye
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { onboarded, xp, level, streak, highContrast, toggleHighContrast } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  // Next level XP threshold (200 XP per level)
  const xpInCurrentLevel = xp % 200;
  const xpPercentage = Math.min(100, (xpInCurrentLevel / 200) * 100);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresOnboarding: true },
    { id: 'tracker', label: 'Habit Tracker', icon: Calendar, requiresOnboarding: true },
    { id: 'coach', label: 'AI Coach', icon: MessageSquare, requiresOnboarding: true },
    { id: 'simulator', label: 'Simulator', icon: Flame, requiresOnboarding: true },
    { id: 'analytics', label: 'Analytics', icon: Activity, requiresOnboarding: true },
    { id: 'achievements', label: 'Achievements', icon: Award, requiresOnboarding: true },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, requiresOnboarding: false },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  return (
    <nav 
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-200 ${
        highContrast 
          ? 'bg-black border-white text-white' 
          : 'bg-[#0f172a]/80 border-white/5 text-slate-100'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentPage(onboarded ? 'dashboard' : 'landing')}
              className="flex items-center space-x-2 focus:outline-none"
              aria-label="EcoWise AI Home"
            >
              <Leaf className={`h-8 w-8 text-emerald-400 ${highContrast ? 'text-white' : ''}`} />
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                EcoWise AI
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              if (item.requiresOnboarding && !onboarded) return null;
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none ${
                    isActive
                      ? highContrast
                        ? 'bg-white text-black font-bold border'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : highContrast
                        ? 'text-white hover:bg-white/10'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Progress Panel (XP & Streaks) */}
          <div className="hidden sm:flex items-center space-x-4">
            {onboarded && (
              <>
                {/* Streak */}
                <div 
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    highContrast
                      ? 'border border-white bg-black'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  }`}
                  title="Daily Logging Streak"
                >
                  <Flame className="h-3.5 w-3.5 fill-current" />
                  <span>{streak} Day Streak</span>
                </div>

                {/* Level Progress */}
                <div className="flex flex-col items-end w-36">
                  <div className="flex justify-between w-full text-[10px] text-slate-400 font-medium mb-1">
                    <span>LVL {level}</span>
                    <span>{xpInCurrentLevel}/200 XP</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-blue-500 h-1.5 rounded-full transition-all duration-500" 
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Accessibility Shortcut */}
            <button
              onClick={toggleHighContrast}
              className={`p-2 rounded-lg transition-colors focus:outline-none ${
                highContrast
                  ? 'bg-white text-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
              aria-label="Toggle High Contrast Mode"
              title="Toggle High Contrast Mode"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleHighContrast}
              className={`p-2 rounded-lg focus:outline-none ${
                highContrast
                  ? 'bg-white text-black'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
              aria-label="Toggle High Contrast"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={`lg:hidden border-t px-2 pt-2 pb-4 space-y-1 ${
          highContrast ? 'bg-black border-white' : 'bg-[#0f172a] border-white/5'
        }`}>
          {navItems.map((item) => {
            if (item.requiresOnboarding && !onboarded) return null;
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-medium focus:outline-none transition-colors ${
                  isActive
                    ? highContrast
                      ? 'bg-white text-black font-bold'
                      : 'bg-emerald-500/10 text-emerald-400 border-l-4 border-emerald-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {onboarded && (
            <div className="px-4 py-3 border-t border-white/5 mt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Streak:</span>
                <span className="text-sm font-semibold text-amber-400 flex items-center">
                  <Flame className="h-4 w-4 fill-current mr-1" /> {streak} Days
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Level {level}</span>
                  <span>{xpInCurrentLevel}/200 XP</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
