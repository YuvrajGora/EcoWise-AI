import { type UserProfile, type FootprintBreakdown } from './sustainabilityIntelligence';
import { translateCarbon } from './impactTranslator';

import { type ActionRecommendation } from '../types';

export type { ActionRecommendation };

export const getPriorityRankings = (
  profile: UserProfile,
  breakdown: FootprintBreakdown
): ActionRecommendation[] => {
  const recommendations: ActionRecommendation[] = [];

  // Weights configuration
  const IMPACT_WEIGHT = 1.8;
  const EFFORT_WEIGHT = 1.2;

  // 1. PUBLIC TRANSIT TWICE WEEKLY
  // Omit or set savings to 0 if they already commute via active/public transit
  const isCarCommuter = profile.commuteType === 'petrol_car';
  let transitSavings = 0;
  if (isCarCommuter && profile.commuteDistance > 30) {
    // If they drive a petrol car, calculate savings of switching 2 commute days (40% of weekly commute)
    const originalWeeklyEmissions = profile.commuteDistance * 0.18;
    const transitWeeklyEmissions = profile.commuteDistance * 0.04;
    // Monthly savings for 2 days/week (approx 40% of commuting distance replaced)
    transitSavings = Math.round((originalWeeklyEmissions - transitWeeklyEmissions) * 0.4 * 4.33); // monthly
  }
  recommendations.push({
    id: 'rec_transit',
    name: 'Use Public Transport Twice Weekly',
    category: 'transport',
    rawSavingsKg: transitSavings,
    effortLevel: 'Medium',
    effortScore: 2,
    priorityScore: 0, // calculated later
    reason: `Your car commute is contributing heavily to your transportation emissions (${Math.round(breakdown.transport * 0.4)} kg CO₂ monthly). Replacing two car trips per week reduces tailpipe output.`,
    equivalentString: '', // filled later
    applicable: transitSavings > 5
  });

  // 2. SWITCH TO GREEN ENERGY PLAN
  let greenEnergySavings = 0;
  if (!profile.greenEnergy) {
    // Saves 80% of electricity emissions
    const currentMonthlyElectric = profile.electricityMonthly * 0.35;
    greenEnergySavings = Math.round(currentMonthlyElectric * 0.80);
  }
  recommendations.push({
    id: 'rec_green_energy',
    name: 'Switch to a Green Energy Plan',
    category: 'energy',
    rawSavingsKg: greenEnergySavings,
    effortLevel: 'Low',
    effortScore: 1,
    priorityScore: 0,
    reason: `Home energy is a core hotspot. Transitioning your electric provider to certified renewable solar/wind offsets grid emissions instantly with zero daily changes.`,
    equivalentString: '',
    applicable: greenEnergySavings > 5
  });

  // 3. EAT VEGETARIAN MEALS TWICE WEEKLY
  let vegetarianSavings = 0;
  if (profile.dietType === 'meat_heavy' || profile.dietType === 'average') {
    // Average diet to vegetarian savings (diff is approx 500kg-1400kg annually)
    // 2 days/week vegetarian represents ~28% reduction in meat footprint
    const yearlyDiff = profile.dietType === 'meat_heavy' ? 1400 : 600;
    vegetarianSavings = Math.round((yearlyDiff * 0.28) / 12);
  }
  recommendations.push({
    id: 'rec_veggie_meals',
    name: 'Eat Vegetarian Meals Twice Weekly',
    category: 'food',
    rawSavingsKg: vegetarianSavings,
    effortLevel: 'Medium',
    effortScore: 2,
    priorityScore: 0,
    reason: `Food habits are responsible for a significant footprint (${Math.round(breakdown.food / 12)} kg CO₂/month). Meat has high carbon cycles; replacing two daily diets with plant alternatives reduces this stress.`,
    equivalentString: '',
    applicable: vegetarianSavings > 5
  });

  // 4. UNPLUG STANDBY ELECTRONICS (PHANTOM LOADS)
  // Applicable to everyone, but savings scale with monthly electricity consumption
  const phantomSavings = Math.round(profile.electricityMonthly * 0.05 * 0.35); // 5% of electric bill
  recommendations.push({
    id: 'rec_phantom_load',
    name: 'Unplug Standby Idle Electronics',
    category: 'energy',
    rawSavingsKg: phantomSavings,
    effortLevel: 'Low',
    effortScore: 1,
    priorityScore: 0,
    reason: `Idle gadgets (TVs, game consoles, laptops) draw continuous standby power. Unplugging them or utilizing smart strips avoids this unnecessary phantom energy consumption.`,
    equivalentString: '',
    applicable: phantomSavings > 2
  });

  // 5. REDUCE APPAREL PURCHASES BY 50%
  let clothingSavings = 0;
  if (profile.clothingMonthly === 'heavy') {
    clothingSavings = Math.round((900 * 0.5) / 12); // save 50% of heavy footprint (450kg/yr)
  } else if (profile.clothingMonthly === 'average') {
    clothingSavings = Math.round((450 * 0.5) / 12);
  }
  recommendations.push({
    id: 'rec_clothing',
    name: 'Halve Clothing Shopping Cycles',
    category: 'shopping',
    rawSavingsKg: clothingSavings,
    effortLevel: 'Medium',
    effortScore: 2,
    priorityScore: 0,
    reason: `Your apparel shopping habit contributes significantly to consumption carbon. Postponing clothing cycles or buying secondhand offsets manufacturing and logistic emissions.`,
    equivalentString: '',
    applicable: clothingSavings > 5
  });

  // 6. COMPOST ALL KITCHEN SCRAPS
  let compostingSavings = 0;
  if (!profile.composting) {
    // Composting reduces landfill methane.
    // If they have 2 bags trash weekly (approx 4kg waste * 52 = 208kg waste). Organic scraps is ~30% of waste.
    const weeklyWasteWeight = profile.trashBagsWeekly * 2;
    const monthlyOrganicWeight = weeklyWasteWeight * 0.3 * 4.33;
    // Composting saves methane, approx 1.5kg CO2 saved per kg diverted
    compostingSavings = Math.round(monthlyOrganicWeight * 1.5);
  }
  recommendations.push({
    id: 'rec_compost',
    name: 'Compost Organic Kitchen Scraps',
    category: 'waste',
    rawSavingsKg: compostingSavings,
    effortLevel: 'Low',
    effortScore: 1,
    priorityScore: 0,
    reason: `Landfilled food decomposes anaerobically to emit methane. Diverting organic leftovers to compost creates natural fertilizer and avoids landfill emissions.`,
    equivalentString: '',
    applicable: compostingSavings > 2
  });

  // 7. CARPOOL OR SWITCH TO ELECTRIC COMMUTING
  let electricCommuteSavings = 0;
  if (profile.commuteType === 'petrol_car') {
    // Switch to EV cuts commuting emissions by ~72%
    electricCommuteSavings = Math.round((profile.commuteDistance * 52 * (0.18 - 0.05)) / 12);
  }
  recommendations.push({
    id: 'rec_electric_vehicle',
    name: 'Shift Commute to Electric Commuting',
    category: 'transport',
    rawSavingsKg: electricCommuteSavings,
    effortLevel: 'High',
    effortScore: 3,
    priorityScore: 0,
    reason: `Converting petrol combustion commutes to EV or carpooling cuts tailpipe footprint by 70%+, shifting primary transport reliance to cleaner energy grids.`,
    equivalentString: '',
    applicable: electricCommuteSavings > 15
  });

  // Filter applicable recommendations, calculate score and equivalents
  const ranked = recommendations
    .filter(r => r.applicable)
    .map(r => {
      // Priority Score = (Carbon Savings * IMPACT_WEIGHT) / (Effort Score * EFFORT_WEIGHT)
      const score = (r.rawSavingsKg * IMPACT_WEIGHT) / (r.effortScore * EFFORT_WEIGHT);
      
      // Get impact equivalence (e.g. Trees Planted)
      const equivalents = translateCarbon(r.rawSavingsKg);
      const eqString = `${equivalents.trees} Trees Planted equivalent`;

      return {
        ...r,
        priorityScore: Math.round(score * 10) / 10,
        equivalentString: eqString
      };
    });

  // Sort descending by priority score
  ranked.sort((a, b) => b.priorityScore - a.priorityScore);

  return ranked;
};
