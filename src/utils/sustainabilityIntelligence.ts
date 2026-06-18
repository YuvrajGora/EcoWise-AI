/**
 * Sustainability Intelligence Engine
 * Handles carbon footprint calculations, hotspot detection, and personalized challenge generation.
 */

import { 
  type CommuteType,
  type HeatingType,
  type DietType,
  type ShoppingVolume,
  type UserProfile,
  type FootprintBreakdown,
  type Challenge
} from '../types';

export type { CommuteType, HeatingType, DietType, ShoppingVolume, UserProfile, FootprintBreakdown, Challenge };

// Default values for a new profile
export const defaultProfile: UserProfile = {
  name: '',
  householdSize: 1,
  location: 'US',
  commuteType: 'petrol_car',
  commuteDistance: 150,
  shortFlights: 2,
  longFlights: 0,
  heatingSource: 'natural_gas',
  electricityMonthly: 300,
  greenEnergy: false,
  dietType: 'average',
  localFood: 'sometimes',
  foodWaste: 'medium',
  clothingMonthly: 'few',
  techYearly: 'medium',
  trashBagsWeekly: 2,
  composting: false,
  recycling: 'recycle_some'
};

// Calculate annual carbon footprint from profile
export const calculateFootprint = (profile: UserProfile): FootprintBreakdown => {
  // 1. TRANSPORTATION
  let commuteFactor = 0;
  if (profile.commuteType === 'petrol_car') commuteFactor = 0.18; // kg/km
  else if (profile.commuteType === 'hybrid_car') commuteFactor = 0.09;
  else if (profile.commuteType === 'ev_car' || profile.commuteType === 'electric_car') commuteFactor = 0.05;
  else if (profile.commuteType === 'public_transit') commuteFactor = 0.04;
  
  const annualCommute = profile.commuteDistance * 52 * commuteFactor;
  const shortFlightEmissions = profile.shortFlights * 2 * 150; // avg 2 hours per short flight * 150kg/hr
  const longFlightEmissions = profile.longFlights * 10 * 250; // avg 10 hours * 250kg/hr
  const transport = Math.round(annualCommute + shortFlightEmissions + longFlightEmissions);

  // 2. ENERGY
  let heatingAnnual = 0;
  if (profile.heatingSource === 'natural_gas') heatingAnnual = 1200; // kg CO2/yr avg
  else if (profile.heatingSource === 'oil' || profile.heatingSource === 'heating_oil') heatingAnnual = 2200;
  else if (profile.heatingSource === 'electricity') heatingAnnual = 900;
  else if (profile.heatingSource === 'solar_green' || profile.heatingSource === 'biomass') heatingAnnual = 150;

  let electricMultiplier = 0.35; // kg CO2 per kWh
  if (profile.greenEnergy) {
    electricMultiplier = 0.07; // 80% reduction
  }
  const electricityAnnual = profile.electricityMonthly * 12 * electricMultiplier;
  const energy = Math.round(heatingAnnual + electricityAnnual);

  // 3. FOOD
  let dietBase = 2000; // average
  if (profile.dietType === 'meat_heavy') dietBase = 2900;
  else if (profile.dietType === 'vegetarian') dietBase = 1400;
  else if (profile.dietType === 'vegan') dietBase = 900;
  else if (profile.dietType === 'pescatarian') dietBase = 1600;

  // Food waste adjustment
  let wasteModifier = 1.0;
  if (profile.foodWaste === 'high') wasteModifier = 1.15;
  else if (profile.foodWaste === 'medium') wasteModifier = 1.05;
  
  // Local food purchase adjustment
  let localModifier = 0;
  if (profile.localFood === 'always') localModifier = -150;
  else if (profile.localFood === 'sometimes') localModifier = -50;

  const food = Math.round(dietBase * wasteModifier + localModifier);

  // 4. SHOPPING
  let clothingAnnual = 0;
  if (profile.clothingMonthly === 'none') clothingAnnual = 50;
  else if (profile.clothingMonthly === 'few' || profile.clothingMonthly === 'light') clothingAnnual = 150;
  else if (profile.clothingMonthly === 'average') clothingAnnual = 450;
  else if (profile.clothingMonthly === 'heavy') clothingAnnual = 900;

  let techAnnual: number;
  if (profile.techYearly === 'medium') techAnnual = 200;
  else if (profile.techYearly === 'heavy') techAnnual = 500;
  else techAnnual = 50;

  let shopping = clothingAnnual + techAnnual;
  if (profile.recycling === 'recycle_all') {
    shopping = Math.round(shopping * 0.9); // 10% offset
  }
  shopping = Math.round(shopping);

  // 5. WASTE
  let wasteAnnual = profile.trashBagsWeekly * 52 * 2; // avg 2kg waste per bag
  // Carbon equivalence of municipal waste landfilling (approx 1.5kg CO2 per kg waste)
  wasteAnnual = wasteAnnual * 1.5;

  if (profile.composting) {
    wasteAnnual = wasteAnnual * 0.6; // 40% reduction
  }
  if (profile.recycling === 'recycle_all') {
    wasteAnnual = wasteAnnual * 0.5; // 50% recycling reduction
  } else if (profile.recycling === 'recycle_some') {
    wasteAnnual = wasteAnnual * 0.8; // 20% recycling reduction
  }
  const waste = Math.round(wasteAnnual);

  const total = transport + energy + food + shopping + waste;

  return {
    transport,
    energy,
    food,
    shopping,
    waste,
    total
  };
};

// Detect top emissions hotspots and return natural language explanations
export const detectHotspots = (breakdown: FootprintBreakdown) => {
  const categories = [
    { name: 'Transportation', value: breakdown.transport, pct: breakdown.transport / breakdown.total },
    { name: 'Home Energy', value: breakdown.energy, pct: breakdown.energy / breakdown.total },
    { name: 'Food Preferences', value: breakdown.food, pct: breakdown.food / breakdown.total },
    { name: 'Shopping & Consumption', value: breakdown.shopping, pct: breakdown.shopping / breakdown.total },
    { name: 'Waste Management', value: breakdown.waste, pct: breakdown.waste / breakdown.total }
  ];

  // Sort descending
  categories.sort((a, b) => b.value - a.value);
  return categories;
};

// Automatically generate dynamic challenges based on highest emission categories
export const generateChallengesForUser = (_profile: UserProfile, breakdown: FootprintBreakdown): Challenge[] => {
  const hotspots = detectHotspots(breakdown);
  const primaryHotspot = hotspots[0].name; // Highest category
  
  const challenges: Challenge[] = [];

  // Generate Daily Challenge
  if (primaryHotspot === 'Transportation') {
    challenges.push({
      id: 'd_trans_1',
      title: 'Short Commute Walk',
      description: 'Replace a car drive under 3 km by walking or riding a bicycle.',
      category: 'transport',
      timeframe: 'daily',
      co2SavedKg: 1.2,
      xpReward: 25,
      difficulty: 'Low',
      progressMax: 1,
      progressCurrent: 0,
      completed: false
    });
  } else if (primaryHotspot === 'Home Energy') {
    challenges.push({
      id: 'd_energy_1',
      title: 'Phantom Load Purge',
      description: 'Unplug 5 standby electronics (chargers, gaming rigs, microwave) before going to sleep.',
      category: 'energy',
      timeframe: 'daily',
      co2SavedKg: 0.6,
      xpReward: 15,
      difficulty: 'Low',
      progressMax: 1,
      progressCurrent: 0,
      completed: false
    });
  } else if (primaryHotspot === 'Food Preferences') {
    challenges.push({
      id: 'd_food_1',
      title: 'Compost Hero',
      description: 'Ensure 100% of your organic kitchen scraps today are composted, leaving zero organic waste in the trash bin.',
      category: 'food',
      timeframe: 'daily',
      co2SavedKg: 0.8,
      xpReward: 20,
      difficulty: 'Low',
      progressMax: 1,
      progressCurrent: 0,
      completed: false
    });
  } else {
    challenges.push({
      id: 'd_waste_1',
      title: 'Zero-Single Use Plastic',
      description: 'Avoid buying or using single-use plastic cups, water bottles, and shopping bags today.',
      category: 'shopping',
      timeframe: 'daily',
      co2SavedKg: 0.5,
      xpReward: 15,
      difficulty: 'Low',
      progressMax: 1,
      progressCurrent: 0,
      completed: false
    });
  }

  // Adding generic second daily challenge
  challenges.push({
    id: 'd_gen_1',
    title: 'Veggie Breakfast',
    description: 'Prepare a 100% plant-based breakfast (oatmeal, fruit, toast with avocado) today.',
    category: 'food',
    timeframe: 'daily',
    co2SavedKg: 0.9,
    xpReward: 20,
    difficulty: 'Low',
    progressMax: 1,
    progressCurrent: 0,
    completed: false
  });

  // Generate Weekly Challenges
  if (primaryHotspot === 'Transportation') {
    challenges.push({
      id: 'w_trans_1',
      title: 'Transit Switch',
      description: 'Commute using bus, train, or carpool at least twice this week instead of driving alone.',
      category: 'transport',
      timeframe: 'weekly',
      co2SavedKg: 10.5,
      xpReward: 120,
      difficulty: 'Medium',
      progressMax: 2,
      progressCurrent: 0,
      completed: false
    });
  } else if (primaryHotspot === 'Home Energy') {
    challenges.push({
      id: 'w_energy_1',
      title: 'Cold Water Cycle',
      description: 'Wash all laundry loads in cold water (30°C or below) this week to save heating energy.',
      category: 'energy',
      timeframe: 'weekly',
      co2SavedKg: 4.8,
      xpReward: 80,
      difficulty: 'Low',
      progressMax: 3, // 3 loads
      progressCurrent: 0,
      completed: false
    });
  } else if (primaryHotspot === 'Food Preferences') {
    challenges.push({
      id: 'w_food_1',
      title: 'Vegetarian Streak',
      description: 'Consume only vegetarian or plant-based meals for three full days this week.',
      category: 'food',
      timeframe: 'weekly',
      co2SavedKg: 15.0,
      xpReward: 150,
      difficulty: 'Medium',
      progressMax: 3,
      progressCurrent: 0,
      completed: false
    });
  } else {
    challenges.push({
      id: 'w_shopping_1',
      title: 'Secondhand Saturday',
      description: 'If you need to make purchases, look to buy pre-owned/secondhand, or postpone all clothing/accessory purchases.',
      category: 'shopping',
      timeframe: 'weekly',
      co2SavedKg: 8.0,
      xpReward: 100,
      difficulty: 'Medium',
      progressMax: 1,
      progressCurrent: 0,
      completed: false
    });
  }

  // Generate Monthly Challenges
  if (primaryHotspot === 'Transportation') {
    challenges.push({
      id: 'm_trans_1',
      title: 'Car-Free Commuter',
      description: 'Log at least 15 commutes using zero-emission methods (walking, biking, or public transit) this month.',
      category: 'transport',
      timeframe: 'monthly',
      co2SavedKg: 65.0,
      xpReward: 400,
      difficulty: 'High',
      progressMax: 15,
      progressCurrent: 0,
      completed: false
    });
  } else if (primaryHotspot === 'Home Energy') {
    challenges.push({
      id: 'm_energy_1',
      title: 'Thermostat Challenge',
      description: 'Set your air conditioning 2°C higher (or heating 2°C lower) for 20 days this month.',
      category: 'energy',
      timeframe: 'monthly',
      co2SavedKg: 35.0,
      xpReward: 350,
      difficulty: 'High',
      progressMax: 20,
      progressCurrent: 0,
      completed: false
    });
  } else if (primaryHotspot === 'Food Preferences') {
    challenges.push({
      id: 'm_food_1',
      title: 'No Food Left Behind',
      description: 'Achieve 30 days of tracking with near-zero food waste by planning meals and freezing leftovers.',
      category: 'food',
      timeframe: 'monthly',
      co2SavedKg: 40.0,
      xpReward: 380,
      difficulty: 'Medium',
      progressMax: 30,
      progressCurrent: 0,
      completed: false
    });
  } else {
    challenges.push({
      id: 'm_shopping_1',
      title: 'Fast Fashion Fast',
      description: 'Commit to buying zero clothing items for the entire month.',
      category: 'shopping',
      timeframe: 'monthly',
      co2SavedKg: 50.0,
      xpReward: 400,
      difficulty: 'High',
      progressMax: 1,
      progressCurrent: 0,
      completed: false
    });
  }

  return challenges;
};
