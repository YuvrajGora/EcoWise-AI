import { type UserProfile, type FootprintBreakdown, calculateFootprint } from './sustainabilityIntelligence';
import { getPriorityRankings } from './aiPriorityEngine';

import { type EcoTwinModel } from '../types';

export type { EcoTwinModel };

export const getEcoTwinProjections = (
  profile: UserProfile,
  breakdown: FootprintBreakdown
): EcoTwinModel => {
  const currentTotal = breakdown.total;
  
  // Calculate recommended total by subtracting the raw monthly savings of the top recommendations (multiplied by 12)
  const recommendations = getPriorityRankings(profile, breakdown);
  
  // Let's assume they implement the top 3 recommendations
  const topRecommendations = recommendations.slice(0, 3);
  const annualSavings = topRecommendations.reduce((sum, rec) => sum + (rec.rawSavingsKg * 12), 0);
  
  const recommendedTotal = Math.max(800, currentTotal - annualSavings); // clamp at 800kg as hard minimum
  
  const currentAnnualTonnes = Math.round((currentTotal / 1000) * 10) / 10;
  const recommendedAnnualTonnes = Math.round((recommendedTotal / 1000) * 10) / 10;
  
  const diff = Math.max(0, currentTotal - recommendedTotal);
  const reductionPercentage = currentTotal > 0 ? Math.round((diff / currentTotal) * 100) : 0;
  
  // Equivalents of annual savings
  const equivalentTreesPlanted = Math.round(diff / 20); // 20kg per tree
  const equivalentCarKmSaved = Math.round(diff / 0.22); // 0.22kg per km

  // Calculate a score from 10 to 100, where 15+ tonnes/year is 10, and < 1.5 tonnes/year is 100
  const sustainabilityScore = Math.max(10, Math.min(100, Math.round(100 - (currentTotal / 150))));

  return {
    currentAnnualTonnes,
    recommendedAnnualTonnes,
    reductionPercentage,
    equivalentTreesPlanted,
    equivalentCarKmSaved,
    sustainabilityScore
  };
};

/**
 * Simulator Inputs interface
 */
export interface SimulatorInputs {
  publicTransportDays: number; // 0 to 7 days/week
  vegMealsPerWeek: number;     // 0 to 21 meals/week
  electricityReduction: number; // 0 to 50%
  greenEnergyUsage: number;    // 0 to 100%
  wasteReduction: number;      // 0 to 100%
}

/**
 * Calculate simulated carbon footprint based on interactive sliders
 */
export const calculateSimulatedFootprint = (
  profile: UserProfile,
  inputs: SimulatorInputs
): FootprintBreakdown => {
  // Start with a copied profile to modify based on sliders
  let transport: number;

  // 1. COMMUTE ALTERATIONS
  // If commuting by petrol/EV car, public transport days reduce car mileage.
  // 5 days commute is standard, but user can slide 0-7. Replaces car commutes.
  if (
    profile.commuteType === 'petrol_car' ||
    profile.commuteType === 'hybrid_car' ||
    profile.commuteType === 'ev_car' ||
    profile.commuteType === 'electric_car'
  ) {
    const transitReplacedRatio = Math.min(1, inputs.publicTransportDays / 7);
    const carCommuteWeight = 1 - transitReplacedRatio;
    
    // We adjust weekly commute distance by transit days
    const carDistance = profile.commuteDistance * carCommuteWeight;
    const transitDistance = profile.commuteDistance * transitReplacedRatio;
    
    // Calculate new transport emissions
    let commuteFactorCar = 0.05;
    if (profile.commuteType === 'petrol_car') {
      commuteFactorCar = 0.18;
    } else if (profile.commuteType === 'hybrid_car') {
      commuteFactorCar = 0.09;
    }
    const commuteFactorTransit = 0.04;
    
    const commuteEmissions = (carDistance * commuteFactorCar + transitDistance * commuteFactorTransit) * 52;
    const shortFlightEmissions = profile.shortFlights * 2 * 150;
    const longFlightEmissions = profile.longFlights * 10 * 250;
    
    // We override calculations in the breakdown
    transport = Math.round(commuteEmissions + shortFlightEmissions + longFlightEmissions);
  } else {
    // Already public transit or active
    transport = calculateFootprint(profile).transport;
  }

  // 2. ENERGY ALTERATIONS
  // Reduce electricity kWh
  const electricReductionWeight = 1 - inputs.electricityReduction / 100;
  
  // Green energy usage slider replaces regular energy percentage
  const greenEnergyRatio = inputs.greenEnergyUsage / 100;
  const regularEnergyRatio = 1 - greenEnergyRatio;
  
  const totalKwhAnnual = profile.electricityMonthly * 12 * electricReductionWeight;
  const electricityEmissions = (totalKwhAnnual * regularEnergyRatio * 0.35) + (totalKwhAnnual * greenEnergyRatio * 0.07);
  
  let heatingAnnual = 0;
  if (profile.heatingSource === 'natural_gas') heatingAnnual = 1200;
  else if (profile.heatingSource === 'oil') heatingAnnual = 2200;
  else if (profile.heatingSource === 'electricity') heatingAnnual = 900;
  else if (profile.heatingSource === 'solar_green') heatingAnnual = 150;

  const energy = Math.round(heatingAnnual + electricityEmissions);

  // 3. DIET ALTERATIONS
  // Veg meals per week: 0 to 21
  // Scale diet type between current diet and Vegan based on veg meals proportion.
  // 21 meals = 100% vegan (900kg). 7 meals = 100% vegetarian (1400kg). 0 meals = current diet.
  let dietBase = 2000;
  if (profile.dietType === 'meat_heavy') dietBase = 2900;
  else if (profile.dietType === 'vegetarian') dietBase = 1400;
  else if (profile.dietType === 'vegan') dietBase = 900;
  else if (profile.dietType === 'pescatarian') dietBase = 1600;

  const vegRatio = Math.min(1, inputs.vegMealsPerWeek / 21); // 1 means completely plant-based
  
  // Blend current diet base with Vegan base (900kg)
  const simulatedDietBase = dietBase * (1 - vegRatio) + 900 * vegRatio;

  let wasteModifier = 1.0;
  if (profile.foodWaste === 'high') wasteModifier = 1.15;
  else if (profile.foodWaste === 'medium') wasteModifier = 1.05;

  let localModifier = 0;
  if (profile.localFood === 'always') localModifier = -150;
  else if (profile.localFood === 'sometimes') localModifier = -50;

  const food = Math.round(simulatedDietBase * wasteModifier + localModifier);

  // 4. SHOPPING ALTERATIONS (General 10% reduction if recycling is used, no simulator slider here)
  const shopping = calculateFootprint(profile).shopping;

  // 5. WASTE ALTERATIONS
  const wasteReductionWeight = 1 - inputs.wasteReduction / 100;
  const baselineWaste = calculateFootprint(profile).waste;
  const waste = Math.round(baselineWaste * wasteReductionWeight);

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
