/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  type UserProfile, 
  type Challenge,
  type HabitLog,
  type AppState
} from '../types';
import { 
  defaultProfile, 
  calculateFootprint,
  generateChallengesForUser
} from '../utils/sustainabilityIntelligence';
import { getPriorityRankings } from '../utils/aiPriorityEngine';
import { getEcoTwinProjections } from '../utils/ecoTwinEngine';
import {
  validateUserProfile,
  validateHabitLogs,
  validateChallenges,
  validateNumber,
  validateBoolean
} from '../utils/security';


const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or use defaults
  const [onboarded, setOnboarded] = useState<boolean>(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (queryParams && queryParams.get('mock') === 'true') return true;
    try {
      const saved = localStorage.getItem('ecowise_onboarded');
      return saved ? JSON.parse(saved) === true : false;
    } catch (e) {
      console.error('Failed to parse ecowise_onboarded', e);
      return false;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (queryParams && queryParams.get('mock') === 'true') {
      return {
        name: 'Eco Warrior',
        householdSize: 2,
        location: 'US',
        commuteType: 'petrol_car',
        commuteDistance: 150,
        shortFlights: 2,
        longFlights: 1,
        heatingSource: 'natural_gas',
        electricityMonthly: 300,
        greenEnergy: false,
        dietType: 'meat_heavy',
        localFood: 'sometimes',
        foodWaste: 'medium',
        clothingMonthly: 'average',
        techYearly: 'medium',
        trashBagsWeekly: 2,
        composting: false,
        recycling: 'recycle_some'
      };
    }
    try {
      const saved = localStorage.getItem('ecowise_profile');
      return saved ? validateUserProfile(JSON.parse(saved)) : defaultProfile;
    } catch (e) {
      console.error('Failed to parse ecowise_profile', e);
      return defaultProfile;
    }
  });

  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (queryParams && queryParams.get('mock') === 'true') {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const twoDaysAgoStr = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      return [
        { id: '1', date: todayStr, category: 'transport', value: 15, co2SavedKg: 4.8, description: 'Took public transit to work' },
        { id: '2', date: todayStr, category: 'food', value: 2, co2SavedKg: 1.2, description: 'Had vegetarian meals' },
        { id: '3', date: yesterdayStr, category: 'energy', value: 1, co2SavedKg: 0.8, description: 'Used LED lights only' },
        { id: '4', date: twoDaysAgoStr, category: 'energy', value: 1, co2SavedKg: 0.5, description: 'Did a cold laundry wash' }
      ];
    }
    try {
      const saved = localStorage.getItem('ecowise_habit_logs');
      return saved ? validateHabitLogs(JSON.parse(saved)) : [];
    } catch (e) {
      console.error('Failed to parse ecowise_habit_logs', e);
      return [];
    }
  });

  const [xp, setXp] = useState<number>(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (queryParams && queryParams.get('mock') === 'true') return 450;
    try {
      const saved = localStorage.getItem('ecowise_xp');
      return saved ? validateNumber(Number(saved), 0, 1000000, 0) : 0;
    } catch (e) {
      console.error('Failed to parse ecowise_xp', e);
      return 0;
    }
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (queryParams && queryParams.get('mock') === 'true') {
      return [
        { id: 'c1', title: 'Car-Free Day', description: 'Walk or take public transport instead of driving.', co2SavedKg: 8.5, difficulty: 'Medium', timeframe: 'daily', completed: false, category: 'transport', xpReward: 50, progressMax: 1, progressCurrent: 0 },
        { id: 'c2', title: 'Veg Out', description: 'Eat 3 fully plant-based meals this week.', co2SavedKg: 3.6, difficulty: 'Low', timeframe: 'weekly', completed: true, category: 'food', xpReward: 30, progressMax: 3, progressCurrent: 3 },
        { id: 'c3', title: 'Unplugged Evening', description: 'Reduce home electricity usage by 1 hour daily.', co2SavedKg: 1.5, difficulty: 'Low', timeframe: 'daily', completed: false, category: 'energy', xpReward: 20, progressMax: 1, progressCurrent: 0 }
      ];
    }
    try {
      const saved = localStorage.getItem('ecowise_challenges');
      return saved ? validateChallenges(JSON.parse(saved)) : [];
    } catch (e) {
      console.error('Failed to parse ecowise_challenges', e);
      return [];
    }
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (queryParams && queryParams.get('mock_high_contrast') === 'true') return true;
    try {
      const saved = localStorage.getItem('ecowise_high_contrast');
      return saved ? validateBoolean(JSON.parse(saved), false) : false;
    } catch (e) {
      console.error('Failed to parse ecowise_high_contrast', e);
      return false;
    }
  });

  const [units, setUnitsState] = useState<'metric' | 'imperial'>(() => {
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    if (queryParams && queryParams.get('mock_imperial') === 'true') return 'imperial';
    try {
      const saved = localStorage.getItem('ecowise_units');
      if (saved) {
        const val = JSON.parse(saved);
        return val === 'imperial' ? 'imperial' : 'metric';
      }
      return 'metric';
    } catch (e) {
      console.error('Failed to parse ecowise_units', e);
      return 'metric';
    }
  });


  // Calculated properties
  const breakdown = calculateFootprint(profile);
  const recommendations = getPriorityRankings(profile, breakdown);
  const ecoTwin = getEcoTwinProjections(profile, breakdown);

  // Weekly Carbon Budget (default base budget limit is 80 kg CO2)
  const weeklyBudgetLimit = 80;

  // Calculate base weekly emissions from onboarding footprint (annual / 52)
  const baseWeeklyEmissions = breakdown.total / 52;

  // Calculate carbon saved by habits logged this current week (last 7 days)
  const { weeklySavedCarbon, weeklyUsedCarbon, budgetHealth } = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter logs in the last 7 days
    const recentLogs = habitLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= oneWeekAgo && logDate <= today;
    });

    const savedThisWeek = recentLogs.reduce((sum, log) => sum + log.co2SavedKg, 0);
    const saved = Math.round(savedThisWeek * 10) / 10;

    const usedThisWeek = Math.max(0, baseWeeklyEmissions - savedThisWeek);
    const used = Math.round(usedThisWeek * 10) / 10;

    // Calculate budget health status
    let health: 'Excellent' | 'Good' | 'Warning' | 'Exceeded';
    if (usedThisWeek <= weeklyBudgetLimit * 0.7) {
      health = 'Excellent';
    } else if (usedThisWeek <= weeklyBudgetLimit) {
      health = 'Good';
    } else if (usedThisWeek <= weeklyBudgetLimit * 1.2) {
      health = 'Warning';
    } else {
      health = 'Exceeded';
    }

    return {
      weeklySavedCarbon: saved,
      weeklyUsedCarbon: used,
      budgetHealth: health
    };
  }, [habitLogs, baseWeeklyEmissions, weeklyBudgetLimit]);

  // Compute XP Level (200 XP per level)
  const level = Math.floor(xp / 200) + 1;

  // Streak calculation (consecutive days with at least one log)
  const streak = useMemo(() => {
    if (habitLogs.length === 0) {
      return 0;
    }

    // Get sorted unique log dates (YYYY-MM-DD)
    const logDates = Array.from(new Set(habitLogs.map(log => log.date))).sort();
    
    let currentStreak = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Verify if there's any log today or yesterday to maintain the streak
    const hasLogRecent = logDates.includes(todayStr) || logDates.includes(yesterdayStr);
    
    if (hasLogRecent) {
      currentStreak = 1;
      const checkDate = new Date(logDates.includes(todayStr) ? todayStr : yesterdayStr);
      
      // Trace backwards
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkStr = checkDate.toISOString().split('T')[0];
        if (logDates.includes(checkStr)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    return currentStreak;
  }, [habitLogs]);

  // Unlock badges based on achievements
  const unlockedBadges = useMemo(() => {
    const badges: string[] = [];
    if (onboarded) badges.push('Green Onboarded');
    if (streak >= 3) badges.push('Streak Starter');
    if (streak >= 7) badges.push('Consistency King');
    if (xp >= 200) badges.push('Eco Explorer');
    if (xp >= 600) badges.push('Carbon Crusher');
    if (xp >= 1200) badges.push('Planet Protector');
    
    // Check if they completed any High difficulty challenge
    const completedChallengesCount = challenges.filter(c => c.completed).length;
    if (completedChallengesCount >= 1) badges.push('Challenge Conqueror');
    if (completedChallengesCount >= 5) badges.push('Climate Champion');

    return badges;
  }, [onboarded, streak, xp, challenges]);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecowise_onboarded', JSON.stringify(onboarded));
      localStorage.setItem('ecowise_profile', JSON.stringify(profile));
      localStorage.setItem('ecowise_habit_logs', JSON.stringify(habitLogs));
      localStorage.setItem('ecowise_xp', xp.toString());
      localStorage.setItem('ecowise_challenges', JSON.stringify(challenges));
      localStorage.setItem('ecowise_high_contrast', JSON.stringify(highContrast));
      localStorage.setItem('ecowise_units', JSON.stringify(units));
    } catch (e) {
      console.error('Failed to sync state to localStorage', e);
    }
  }, [onboarded, profile, habitLogs, xp, challenges, highContrast, units]);


  // Triggered when user finishes Onboarding questionnaire
  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setOnboarded(true);
    
    // Auto-generate challenges based on new profile hotspots
    const breakdown = calculateFootprint(newProfile);
    const newChallenges = generateChallengesForUser(newProfile, breakdown);
    setChallenges(newChallenges);
    setXp(0);
  };

  const addXp = (amount: number) => {
    setXp(prev => prev + amount);
  };

  // Logging habits
  const logHabit = (
    category: 'transport' | 'energy' | 'food' | 'shopping' | 'waste',
    value: number,
    co2SavedKg: number,
    description: string
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newLog: HabitLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      date: todayStr,
      category,
      value,
      co2SavedKg: Math.round(co2SavedKg * 10) / 10,
      description
    };
    
    setHabitLogs(prev => [newLog, ...prev]);
    addXp(15); // +15 XP for logging a daily habit

    // Dynamically check and update challenge progress for matching categories
    setChallenges(prevChallenges => 
      prevChallenges.map(c => {
        if (c.category === category && !c.completed) {
          const newProgress = Math.min(c.progressMax, c.progressCurrent + 1);
          const isCompletedNow = newProgress === c.progressMax;
          if (isCompletedNow) {
            // We'll award XP in state directly or deferred.
            // Let's add XP immediately.
            setTimeout(() => addXp(c.xpReward), 0);
          }
          return {
            ...c,
            progressCurrent: newProgress,
            completed: isCompletedNow
          };
        }
        return c;
      })
    );
  };

  // Complete challenge manually
  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(c => {
        if (c.id === challengeId && !c.completed) {
          addXp(c.xpReward);
          return {
            ...c,
            progressCurrent: c.progressMax,
            completed: true
          };
        }
        return c;
      })
    );
  };

  // Update challenge progress
  const updateChallengeProgress = (challengeId: string, progress: number) => {
    setChallenges(prev => 
      prev.map(c => {
        if (c.id === challengeId && !c.completed) {
          const nextProgress = Math.min(c.progressMax, Math.max(0, progress));
          const isCompleted = nextProgress === c.progressMax;
          if (isCompleted) {
            addXp(c.xpReward);
          }
          return {
            ...c,
            progressCurrent: nextProgress,
            completed: isCompleted
          };
        }
        return c;
      })
    );
  };

  const resetAllData = () => {
    setOnboarded(false);
    setProfile(defaultProfile);
    setHabitLogs([]);
    setXp(0);
    setChallenges([]);
    setUnitsState('metric');
    setHighContrast(false);
    localStorage.clear();
  };

  const clearAllHabitLogs = () => {
    setHabitLogs([]);
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const setUnits = (u: 'metric' | 'imperial') => {
    setUnitsState(u);
  };

  return (
    <AppContext.Provider
      value={{
        onboarded,
        profile,
        breakdown,
        recommendations,
        ecoTwin,
        weeklyBudgetLimit,
        weeklyUsedCarbon,
        weeklySavedCarbon,
        budgetHealth,
        habitLogs,
        streak,
        xp,
        level,
        challenges,
        unlockedBadges,
        highContrast,
        units,
        saveProfile,
        logHabit,
        completeChallenge,
        updateChallengeProgress,
        resetAllData,
        clearAllHabitLogs,
        toggleHighContrast,
        setUnits,
        addXp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
