import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { HabitTracker } from './pages/HabitTracker';
import { AICoach } from './pages/AICoach';
import { CarbonSimulator } from './pages/CarbonSimulator';
import { Analytics } from './pages/Analytics';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';

const AppContent: React.FC = () => {
  const { onboarded, highContrast } = useApp();
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return queryParams?.get('page') || 'landing';
  });

  // Automatically route to dashboard if already onboarded and on landing/onboarding
  useEffect(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (queryParams && queryParams.get('page')) {
      // Bypassing auto-redirect because we explicitly asked for a test page
      return;
    }
    if (onboarded && (currentPage === 'landing' || currentPage === 'onboarding')) {
      setCurrentPage('dashboard');
    } else if (!onboarded && currentPage !== 'landing' && currentPage !== 'onboarding' && currentPage !== 'settings') {
      setCurrentPage('landing');
    }
  }, [onboarded, currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing setCurrentPage={setCurrentPage} />;
      case 'onboarding':
        return <Onboarding setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'tracker':
        return <HabitTracker />;
      case 'coach':
        return <AICoach />;
      case 'simulator':
        return <CarbonSimulator />;
      case 'analytics':
        return <Analytics />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      default:
        return <Landing setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-slate-100 antialiased overflow-x-hidden ${
      highContrast 
        ? 'bg-black text-white' 
        : 'bg-[#0b0f19]'
    }`}>
      {/* Decorative gradient glow underlay */}
      {!highContrast && (
        <div className="absolute top-0 inset-x-0 h-[500px] overflow-hidden pointer-events-none select-none z-0">
          <div className="absolute -top-[250px] left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] opacity-60" />
          <div className="absolute -top-[200px] right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] opacity-45" />
        </div>
      )}

      {/* Main navigation header */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main screen display */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>

      {/* Global footer */}
      <footer className={`py-6 border-t text-center text-[10px] select-none shrink-0 ${
        highContrast 
          ? 'bg-black border-white text-white' 
          : 'bg-[#0a0d16] border-white/5 text-slate-500'
      }`}>
        <p>&copy; {new Date().getFullYear()} EcoWise AI. Empowering sustainable living through intelligence.</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
