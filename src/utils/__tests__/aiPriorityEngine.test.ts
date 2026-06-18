import { describe, it, expect } from 'vitest';
import { getPriorityRankings } from '../aiPriorityEngine';
import { calculateFootprint, defaultProfile } from '../sustainabilityIntelligence';
import { type UserProfile } from '../../types';

describe('AI Priority Engine', () => {
  it('calculates priority rankings and sorts them descending by score', () => {
    const profile: UserProfile = {
      ...defaultProfile,
      commuteType: 'petrol_car',
      commuteDistance: 150, // high commute
      electricityMonthly: 300,
      greenEnergy: false,
      dietType: 'meat_heavy',
      composting: false
    };

    const breakdown = calculateFootprint(profile);
    const rankings = getPriorityRankings(profile, breakdown);

    expect(rankings).toBeDefined();
    expect(rankings.length).toBeGreaterThan(0);

    // Verify ordering
    for (let i = 0; i < rankings.length - 1; i++) {
      expect(rankings[i].priorityScore).toBeGreaterThanOrEqual(rankings[i + 1].priorityScore);
    }
  });

  it('filters out non-applicable recommendations', () => {
    const ecoProfile: UserProfile = {
      ...defaultProfile,
      commuteType: 'active', // no car transit savings
      commuteDistance: 0,
      electricityMonthly: 0,
      greenEnergy: true, // no green energy savings
      dietType: 'vegan', // no veggie savings
      composting: true,
      recycling: 'recycle_all'
    };

    const breakdown = calculateFootprint(ecoProfile);
    const rankings = getPriorityRankings(ecoProfile, breakdown);

    // Some generic recommendations like standby electronics might still be applicable,
    // but car commute transit and green energy plan should not be present.
    const hasTransit = rankings.some(r => r.id === 'rec_transit');
    const hasGreenEnergy = rankings.some(r => r.id === 'rec_green_energy');
    const hasElectricVehicle = rankings.some(r => r.id === 'rec_electric_vehicle');

    expect(hasTransit).toBe(false);
    expect(hasGreenEnergy).toBe(false);
    expect(hasElectricVehicle).toBe(false);
  });

  it('calculates the priority score using the specific weighted formula', () => {
    const profile: UserProfile = {
      ...defaultProfile,
      electricityMonthly: 200,
      greenEnergy: false
    };
    const breakdown = calculateFootprint(profile);
    const rankings = getPriorityRankings(profile, breakdown);

    const greenEnergyRec = rankings.find(r => r.id === 'rec_green_energy');
    expect(greenEnergyRec).toBeDefined();
    if (greenEnergyRec) {
      // rawSavings = Math.round((200 * 0.35) * 0.8) = Math.round(70 * 0.8) = 56
      // score = (56 * 1.8) / (1 * 1.2) = 100.8 / 1.2 = 84
      expect(greenEnergyRec.rawSavingsKg).toBe(56);
      expect(greenEnergyRec.priorityScore).toBe(84);
      expect(greenEnergyRec.equivalentString).toContain('Trees Planted equivalent');
    }
  });
});
