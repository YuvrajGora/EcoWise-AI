import { describe, it, expect } from 'vitest';
import { getEcoTwinProjections, calculateSimulatedFootprint, type SimulatorInputs } from '../ecoTwinEngine';
import { calculateFootprint, defaultProfile } from '../sustainabilityIntelligence';
import { type UserProfile } from '../../types';

describe('EcoTwin Engine', () => {
  describe('getEcoTwinProjections', () => {
    it('generates projections and clamps sustainability score within [10, 100]', () => {
      const breakdown = {
        transport: 15000,
        energy: 10000,
        food: 5000,
        shopping: 2000,
        waste: 1000,
        total: 33000
      };

      const projections = getEcoTwinProjections(defaultProfile, breakdown);
      expect(projections.currentAnnualTonnes).toBe(33);
      expect(projections.recommendedAnnualTonnes).toBeLessThan(33);
      expect(projections.reductionPercentage).toBeGreaterThan(0);
      expect(projections.sustainabilityScore).toBe(10); // clamped at 10
    });

    it('generates high sustainability score for low emissions profile', () => {
      const breakdown = {
        transport: 400,
        energy: 400,
        food: 400,
        shopping: 200,
        waste: 100,
        total: 1500
      };

      const projections = getEcoTwinProjections(defaultProfile, breakdown);
      // 100 - (1500 / 150) = 90
      expect(projections.sustainabilityScore).toBe(90);
    });
  });

  describe('calculateSimulatedFootprint', () => {
    it('applies transport days to reduce simulated transportation emissions', () => {
      const profile: UserProfile = {
        ...defaultProfile,
        commuteType: 'petrol_car',
        commuteDistance: 100
      };

      const baseline = calculateFootprint(profile);

      const zeroDaysInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 0,
        electricityReduction: 0,
        greenEnergyUsage: 0,
        wasteReduction: 0
      };
      
      const sevenDaysInput: SimulatorInputs = {
        publicTransportDays: 7,
        vegMealsPerWeek: 0,
        electricityReduction: 0,
        greenEnergyUsage: 0,
        wasteReduction: 0
      };

      const simulatedZero = calculateSimulatedFootprint(profile, zeroDaysInput);
      const simulatedSeven = calculateSimulatedFootprint(profile, sevenDaysInput);

      expect(simulatedZero.transport).toBe(baseline.transport);
      expect(simulatedSeven.transport).toBeLessThan(simulatedZero.transport);
      // For 7 days, petrol car commute should be entirely replaced by public transit
      // 100 * 52 * 0.04 = 208 + flights emissions.
      expect(simulatedSeven.transport).toBe(208 + (profile.shortFlights * 300) + (profile.longFlights * 2500));
    });

    it('applies electricity reduction and green energy usage to lower simulated energy emissions', () => {
      const profile: UserProfile = {
        ...defaultProfile,
        electricityMonthly: 200,
        greenEnergy: false
      };

      const baseInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 0,
        electricityReduction: 0,
        greenEnergyUsage: 0,
        wasteReduction: 0
      };

      const energyReductionInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 0,
        electricityReduction: 30, // 30% reduction
        greenEnergyUsage: 0,
        wasteReduction: 0
      };

      const greenEnergyInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 0,
        electricityReduction: 0,
        greenEnergyUsage: 100, // 100% green energy usage
        wasteReduction: 0
      };

      const simulatedBase = calculateSimulatedFootprint(profile, baseInput);
      const simulatedReduction = calculateSimulatedFootprint(profile, energyReductionInput);
      const simulatedGreen = calculateSimulatedFootprint(profile, greenEnergyInput);

      expect(simulatedReduction.energy).toBeLessThan(simulatedBase.energy);
      expect(simulatedGreen.energy).toBeLessThan(simulatedBase.energy);
      expect(simulatedGreen.energy).toBeLessThan(simulatedReduction.energy);
    });

    it('applies vegetable meals per week to lower food emissions', () => {
      const profile: UserProfile = {
        ...defaultProfile,
        dietType: 'meat_heavy',
        foodWaste: 'low',
        localFood: 'rarely'
      };

      const baseInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 0,
        electricityReduction: 0,
        greenEnergyUsage: 0,
        wasteReduction: 0
      };

      const halfVegInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 10.5, // 50% vegan food influence
        electricityReduction: 0,
        greenEnergyUsage: 0,
        wasteReduction: 0
      };

      const fullVegInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 21, // 100% vegan food influence
        electricityReduction: 0,
        greenEnergyUsage: 0,
        wasteReduction: 0
      };

      const simulatedBase = calculateSimulatedFootprint(profile, baseInput);
      const simulatedHalf = calculateSimulatedFootprint(profile, halfVegInput);
      const simulatedFull = calculateSimulatedFootprint(profile, fullVegInput);

      expect(simulatedHalf.food).toBeLessThan(simulatedBase.food);
      expect(simulatedFull.food).toBeLessThan(simulatedHalf.food);
    });

    it('applies waste reduction to lower waste emissions', () => {
      const profile: UserProfile = {
        ...defaultProfile,
        trashBagsWeekly: 3
      };

      const baseInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 0,
        electricityReduction: 0,
        greenEnergyUsage: 0,
        wasteReduction: 0
      };

      const halfWasteInput: SimulatorInputs = {
        publicTransportDays: 0,
        vegMealsPerWeek: 0,
        electricityReduction: 0,
        greenEnergyUsage: 0,
        wasteReduction: 50 // 50% waste reduction
      };

      const simulatedBase = calculateSimulatedFootprint(profile, baseInput);
      const simulatedHalf = calculateSimulatedFootprint(profile, halfWasteInput);

      expect(simulatedHalf.waste).toBe(Math.round(simulatedBase.waste * 0.5));
    });
  });
});
