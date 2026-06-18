import { describe, it, expect } from 'vitest';
import { 
  calculateFootprint, 
  detectHotspots, 
  generateChallengesForUser, 
  defaultProfile 
} from '../sustainabilityIntelligence';
import { type UserProfile } from '../../types';

describe('Sustainability Intelligence Engine', () => {
  describe('calculateFootprint', () => {
    it('calculates carbon footprint with default profile correctly', () => {
      const breakdown = calculateFootprint(defaultProfile);
      expect(breakdown).toBeDefined();
      expect(breakdown.total).toBeGreaterThan(0);
      expect(breakdown.transport).toBeGreaterThan(0);
      expect(breakdown.energy).toBeGreaterThan(0);
      expect(breakdown.food).toBeGreaterThan(0);
      expect(breakdown.shopping).toBeGreaterThan(0);
      expect(breakdown.waste).toBeGreaterThan(0);
    });

    it('calculates transportation emissions accurately based on vehicle types', () => {
      const petrolProfile: UserProfile = {
        ...defaultProfile,
        commuteType: 'petrol_car',
        commuteDistance: 100,
        shortFlights: 0,
        longFlights: 0
      };
      const evProfile: UserProfile = {
        ...defaultProfile,
        commuteType: 'ev_car',
        commuteDistance: 100,
        shortFlights: 0,
        longFlights: 0
      };
      const transitProfile: UserProfile = {
        ...defaultProfile,
        commuteType: 'public_transit',
        commuteDistance: 100,
        shortFlights: 0,
        longFlights: 0
      };

      const petrolEmissions = calculateFootprint(petrolProfile).transport;
      const evEmissions = calculateFootprint(evProfile).transport;
      const transitEmissions = calculateFootprint(transitProfile).transport;

      // 100km * 52 weeks * commuteFactor
      // petrol: 100 * 52 * 0.18 = 936
      // ev: 100 * 52 * 0.05 = 260
      // public_transit: 100 * 52 * 0.04 = 208
      expect(petrolEmissions).toBe(936);
      expect(evEmissions).toBe(260);
      expect(transitEmissions).toBe(208);
    });

    it('calculates energy emissions correctly based on sources and green energy usage', () => {
      const gasProfile: UserProfile = {
        ...defaultProfile,
        heatingSource: 'natural_gas',
        electricityMonthly: 200,
        greenEnergy: false
      };
      const solarProfile: UserProfile = {
        ...defaultProfile,
        heatingSource: 'solar_green',
        electricityMonthly: 200,
        greenEnergy: true
      };

      const gasEnergy = calculateFootprint(gasProfile).energy;
      const solarEnergy = calculateFootprint(solarProfile).energy;

      // gas: 1200 + (200 * 12 * 0.35) = 1200 + 840 = 2040
      // solar: 150 + (200 * 12 * 0.07) = 150 + 168 = 318
      expect(gasEnergy).toBe(2040);
      expect(solarEnergy).toBe(318);
    });

    it('calculates food emissions correctly based on diet and waste/local adjustors', () => {
      const meatHeavyProfile: UserProfile = {
        ...defaultProfile,
        dietType: 'meat_heavy',
        foodWaste: 'high',
        localFood: 'rarely'
      };
      const veganProfile: UserProfile = {
        ...defaultProfile,
        dietType: 'vegan',
        foodWaste: 'low',
        localFood: 'always'
      };

      const meatFood = calculateFootprint(meatHeavyProfile).food;
      const veganFood = calculateFootprint(veganProfile).food;

      // meat_heavy: 2900 * 1.15 + 0 = 3335
      // vegan: 900 * 1.0 - 150 = 750
      expect(meatFood).toBe(3335);
      expect(veganFood).toBe(750);
    });

    it('applies shopping offsets correctly when recycling is enabled', () => {
      const shopNormal: UserProfile = {
        ...defaultProfile,
        clothingMonthly: 'average',
        techYearly: 'medium',
        recycling: 'recycle_some'
      };
      const shopRecycleAll: UserProfile = {
        ...defaultProfile,
        clothingMonthly: 'average',
        techYearly: 'medium',
        recycling: 'recycle_all'
      };

      const normalShopping = calculateFootprint(shopNormal).shopping;
      const recycleShopping = calculateFootprint(shopRecycleAll).shopping;

      // average clothing (450) + medium tech (200) = 650
      // recycle_all applies 10% offset -> 650 * 0.9 = 585
      expect(normalShopping).toBe(650);
      expect(recycleShopping).toBe(585);
    });

    it('calculates waste emissions based on trash bags, composting, and recycling level', () => {
      const wasteHigh: UserProfile = {
        ...defaultProfile,
        trashBagsWeekly: 4,
        composting: false,
        recycling: 'recycle_none'
      };
      const wasteLow: UserProfile = {
        ...defaultProfile,
        trashBagsWeekly: 2,
        composting: true,
        recycling: 'recycle_all'
      };

      const highWasteEmissions = calculateFootprint(wasteHigh).waste;
      const lowWasteEmissions = calculateFootprint(wasteLow).waste;

      // wasteHigh: 4 bags * 52 weeks * 2kg/bag * 1.5 carbon equiv = 624
      // wasteLow: 2 bags * 52 weeks * 2kg/bag * 1.5 carbon equiv = 312
      // wasteLow composting: 312 * 0.6 = 187.2
      // wasteLow recycle_all: 187.2 * 0.5 = 93.6 -> round to 94
      expect(highWasteEmissions).toBe(624);
      expect(lowWasteEmissions).toBe(94);
    });
  });

  describe('detectHotspots', () => {
    it('detects and orders hotspots descending', () => {
      const breakdown = {
        transport: 5000,
        energy: 2000,
        food: 1500,
        shopping: 800,
        waste: 200,
        total: 9500
      };

      const hotspots = detectHotspots(breakdown);
      expect(hotspots).toHaveLength(5);
      expect(hotspots[0].name).toBe('Transportation');
      expect(hotspots[0].value).toBe(5000);
      expect(hotspots[1].name).toBe('Home Energy');
      expect(hotspots[4].name).toBe('Waste Management');
      expect(hotspots[4].value).toBe(200);
    });
  });

  describe('generateChallengesForUser', () => {
    it('generates challenges corresponding to the primary hotspot', () => {
      // Transport hotspot
      const transportBreakdown = {
        transport: 5000,
        energy: 100,
        food: 100,
        shopping: 100,
        waste: 100,
        total: 5400
      };
      const transportChallenges = generateChallengesForUser(defaultProfile, transportBreakdown);
      
      // Checking that transport challenges are generated
      const dailyTransport = transportChallenges.find(c => c.timeframe === 'daily' && c.category === 'transport');
      const weeklyTransport = transportChallenges.find(c => c.timeframe === 'weekly' && c.category === 'transport');
      const monthlyTransport = transportChallenges.find(c => c.timeframe === 'monthly' && c.category === 'transport');
      
      expect(dailyTransport).toBeDefined();
      expect(weeklyTransport).toBeDefined();
      expect(monthlyTransport).toBeDefined();

      // Energy hotspot
      const energyBreakdown = {
        transport: 100,
        energy: 5000,
        food: 100,
        shopping: 100,
        waste: 100,
        total: 5400
      };
      const energyChallenges = generateChallengesForUser(defaultProfile, energyBreakdown);
      const dailyEnergy = energyChallenges.find(c => c.timeframe === 'daily' && c.category === 'energy');
      expect(dailyEnergy).toBeDefined();
    });
  });
});
