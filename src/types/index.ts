export type CommuteType = 'petrol_car' | 'hybrid_car' | 'ev_car' | 'electric_car' | 'public_transit' | 'active' | 'active_commute';
export type HeatingType = 'natural_gas' | 'electricity' | 'solar_green' | 'oil' | 'heating_oil' | 'biomass';
export type DietType = 'meat_heavy' | 'average' | 'vegetarian' | 'vegan' | 'pescatarian';
export type ShoppingVolume = 'none' | 'few' | 'average' | 'heavy' | 'light';

export interface UserProfile {
  name: string;
  householdSize: number;
  location: string;
  commuteType: CommuteType;
  commuteDistance: number; // km per week
  shortFlights: number; // flights per year
  longFlights: number; // flights per year
  heatingSource: HeatingType;
  electricityMonthly: number; // kWh
  greenEnergy: boolean;
  dietType: DietType;
  localFood: 'always' | 'sometimes' | 'rarely';
  foodWaste: 'high' | 'medium' | 'low';
  clothingMonthly: ShoppingVolume;
  techYearly: 'low' | 'medium' | 'heavy';
  trashBagsWeekly: number;
  composting: boolean;
  recycling: 'recycle_all' | 'recycle_some' | 'recycle_none';
}

export interface FootprintBreakdown {
  transport: number; // kg CO2/year
  energy: number;    // kg CO2/year
  food: number;      // kg CO2/year
  shopping: number;  // kg CO2/year
  waste: number;     // kg CO2/year
  total: number;     // kg CO2/year
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'food' | 'shopping' | 'waste';
  timeframe: 'daily' | 'weekly' | 'monthly';
  co2SavedKg: number;
  xpReward: number;
  difficulty: 'Low' | 'Medium' | 'High';
  progressMax: number;
  progressCurrent: number;
  completed: boolean;
}

export interface ActionRecommendation {
  id: string;
  name: string;
  category: 'transport' | 'energy' | 'food' | 'shopping' | 'waste';
  rawSavingsKg: number; // monthly
  effortLevel: 'Low' | 'Medium' | 'High';
  effortScore: number;  // 1, 2, 3
  priorityScore: number;
  reason: string;
  equivalentString: string;
  applicable: boolean;
}

export interface EcoTwinModel {
  currentAnnualTonnes: number;
  recommendedAnnualTonnes: number;
  reductionPercentage: number;
  equivalentTreesPlanted: number;
  equivalentCarKmSaved: number;
  sustainabilityScore: number;
}

export interface HabitLog {
  id: string;
  date: string; // YYYY-MM-DD
  category: 'transport' | 'energy' | 'food' | 'shopping' | 'waste';
  value: number; // km, meals, bags, etc.
  co2SavedKg: number;
  description: string;
}

export interface AppState {
  onboarded: boolean;
  profile: UserProfile;
  breakdown: FootprintBreakdown;
  recommendations: ActionRecommendation[];
  ecoTwin: EcoTwinModel;
  weeklyBudgetLimit: number; // in kg CO2
  weeklyUsedCarbon: number;  // in kg CO2
  weeklySavedCarbon: number; // in kg CO2
  budgetHealth: 'Excellent' | 'Good' | 'Warning' | 'Exceeded';
  habitLogs: HabitLog[];
  streak: number;
  xp: number;
  level: number;
  challenges: Challenge[];
  unlockedBadges: string[];
  highContrast: boolean;
  units: 'metric' | 'imperial';
  saveProfile: (p: UserProfile) => void;
  logHabit: (category: 'transport' | 'energy' | 'food' | 'shopping' | 'waste', value: number, co2Saved: number, desc: string) => void;
  completeChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  resetAllData: () => void;
  clearAllHabitLogs: () => void;
  toggleHighContrast: () => void;
  setUnits: (u: 'metric' | 'imperial') => void;
  addXp: (amount: number) => void;
}
