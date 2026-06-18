import { describe, it, expect } from 'vitest';
import { 
  translateCarbon, 
  getImpactString, 
  formatCarbon, 
  getRealWorldEquivalent 
} from '../impactTranslator';

describe('Environmental Impact Translator', () => {
  describe('translateCarbon / getRealWorldEquivalent', () => {
    it('translates 48 kg CO2 saved correctly into equivalents', () => {
      const equivalents = translateCarbon(48);
      expect(equivalents.co2Saved).toBe(48);
      // Trees: 48 / 20 = 2.4
      expect(equivalents.trees).toBe(2.4);
      // Driving: Math.round(48 / 0.22) = 218
      expect(equivalents.drivingKm).toBe(218);
      // Electricity: Math.round((48 / 8) * 10) / 10 = 6.0
      expect(equivalents.electricityDays).toBe(6.0);
    });

    it('translates 120 kg CO2 saved correctly into equivalents', () => {
      const equivalents = getRealWorldEquivalent(120);
      expect(equivalents.co2Saved).toBe(120);
      // Trees: 120 / 20 = 6.0
      expect(equivalents.trees).toBe(6.0);
      // Driving: Math.round(120 / 0.22) = 545
      expect(equivalents.drivingKm).toBe(545);
      // Electricity: Math.round((120 / 8) * 10) / 10 = 15.0
      expect(equivalents.electricityDays).toBe(15.0);
    });

    it('clamps negative values to 0', () => {
      const equivalents = translateCarbon(-20);
      expect(equivalents.co2Saved).toBe(0);
      expect(equivalents.trees).toBe(0);
      expect(equivalents.drivingKm).toBe(0);
      expect(equivalents.electricityDays).toBe(0);
    });
  });

  describe('getImpactString', () => {
    it('generates the correct descriptive sentence', () => {
      const sentence = getImpactString(48);
      expect(sentence).toBe('Equivalent to planting 2.4 trees, driving 218 km less, or saving 6 days of home electricity.');
    });
  });

  describe('formatCarbon', () => {
    it('formats metric units correctly', () => {
      const formatted = formatCarbon(12.345, 'metric', 2);
      expect(formatted).toBe('12.35 kg CO₂');
    });

    it('formats imperial units correctly (converting kg to lbs)', () => {
      // 10kg * 2.20462 = 22.0462 lbs
      const formatted = formatCarbon(10, 'imperial', 1);
      expect(formatted).toBe('22.0 lbs CO₂');
    });
  });
});
