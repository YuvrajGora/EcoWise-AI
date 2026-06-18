import { describe, it, expect } from 'vitest';
import { 
  sanitizeText, 
  validateNumber, 
  validateBoolean, 
  validateText, 
  validateUserProfile, 
  validateHabitLogs, 
  validateChallenges 
} from '../security';

describe('Security Utilities', () => {
  describe('sanitizeText', () => {
    it('escapes standard HTML injection payloads', () => {
      const payload = '<script>alert("XSS")</script>';
      const sanitized = sanitizeText(payload);
      expect(sanitized).not.toContain('<');
      expect(sanitized).not.toContain('>');
      expect(sanitized).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;');
    });

    it('escapes other malicious characters', () => {
      expect(sanitizeText('Hello & World')).toBe('Hello &amp; World');
      expect(sanitizeText("User's text / query")).toBe('User&#x27;s text &#x2F; query');
    });

    it('returns empty string if input is not a string', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
      expect(sanitizeText(123)).toBe('');
    });
  });

  describe('validateNumber', () => {
    it('clamps valid numbers to range', () => {
      expect(validateNumber(10, 0, 5, 2)).toBe(5);
      expect(validateNumber(-10, 0, 5, 2)).toBe(0);
      expect(validateNumber(3, 0, 5, 2)).toBe(3);
    });

    it('converts valid strings to numbers', () => {
      expect(validateNumber('3', 0, 5, 2)).toBe(3);
    });

    it('returns defaultVal for NaN, non-finite values, and null/undefined', () => {
      expect(validateNumber('invalid', 0, 5, 2)).toBe(2);
      expect(validateNumber(NaN, 0, 5, 2)).toBe(2);
      expect(validateNumber(Infinity, 0, 5, 2)).toBe(2);
      expect(validateNumber(null, 0, 5, 2)).toBe(2);
    });
  });

  describe('validateBoolean', () => {
    it('returns true or false for boolean type', () => {
      expect(validateBoolean(true, false)).toBe(true);
      expect(validateBoolean(false, true)).toBe(false);
    });

    it('coerces string representations of boolean', () => {
      expect(validateBoolean('true', false)).toBe(true);
      expect(validateBoolean('false', true)).toBe(false);
    });

    it('returns default value for non-boolean types', () => {
      expect(validateBoolean('invalid', false)).toBe(false);
      expect(validateBoolean(null, true)).toBe(true);
    });
  });

  describe('validateText', () => {
    it('trims and limits length', () => {
      expect(validateText('   Hello World   ', 10, 'default')).toBe('Hello Worl');
    });

    it('sanitizes inputs', () => {
      expect(validateText('<script>', 100, 'default')).toBe('&lt;script&gt;');
    });

    it('returns default value for invalid text types', () => {
      expect(validateText(null, 10, 'default')).toBe('default');
    });
  });

  describe('validateUserProfile', () => {
    it('returns default profile for null or non-object profile', () => {
      const p = validateUserProfile(null);
      expect(p.householdSize).toBe(1);
      expect(p.location).toBe('US');
      expect(p.commuteType).toBe('petrol_car');
    });

    it('restores defaults for invalid values', () => {
      const corrupt = {
        name: '<script>alert("hi")</script>',
        householdSize: 150, // exceeds max clamp or default limits
        commuteType: 'rocket_ship', // invalid
        dietType: 'chocolate_only', // invalid
        greenEnergy: 'yes' // invalid boolean type
      };
      const validated = validateUserProfile(corrupt);
      expect(validated.name).toBe('&lt;script&gt;alert(&quot;hi&quot;)&lt;&#x2F;script&gt;');
      expect(validated.householdSize).toBe(100); // clamped to max
      expect(validated.commuteType).toBe('petrol_car'); // restored to default
      expect(validated.dietType).toBe('average'); // restored to default
      expect(validated.greenEnergy).toBe(false); // restored to default
    });

    it('preserves valid options', () => {
      const valid = {
        name: 'Eco Warrior',
        householdSize: 4,
        location: 'CA',
        commuteType: 'ev_car',
        commuteDistance: 200,
        shortFlights: 1,
        longFlights: 2,
        heatingSource: 'electricity',
        electricityMonthly: 250,
        greenEnergy: true,
        dietType: 'vegan',
        localFood: 'always',
        foodWaste: 'low',
        clothingMonthly: 'light',
        techYearly: 'low',
        trashBagsWeekly: 1,
        composting: true,
        recycling: 'recycle_all'
      };
      const validated = validateUserProfile(valid);
      expect(validated).toEqual(valid);
    });
  });

  describe('validateHabitLogs', () => {
    it('returns empty array if input is not array', () => {
      expect(validateHabitLogs(null)).toEqual([]);
      expect(validateHabitLogs({})).toEqual([]);
    });

    it('filters out invalid objects and sanitizes content', () => {
      const raw = [
        null,
        {
          id: 'log1',
          date: '2026-06-18',
          category: 'transport',
          value: 10,
          co2SavedKg: 2.5,
          description: '<script>'
        },
        {
          id: 'log2',
          date: '2026-06-19',
          category: 'invalid_category',
          value: 'not_a_number',
          co2SavedKg: 10000000, // exceeds max/clamps
          description: 'Valid'
        }
      ];

      const validated = validateHabitLogs(raw);
      expect(validated.length).toBe(2);
      expect(validated[0].description).toBe('&lt;script&gt;');
      expect(validated[1].category).toBe('energy'); // fallback category
      expect(validated[1].value).toBe(0); // fallback value
      expect(validated[1].co2SavedKg).toBe(100000); // clamped to max
    });
  });

  describe('validateChallenges', () => {
    it('returns empty array for invalid inputs', () => {
      expect(validateChallenges(undefined)).toEqual([]);
    });

    it('sanitizes and clamps challenge lists', () => {
      const raw = [
        {
          id: 'c1',
          title: 'Title',
          description: 'Desc',
          category: 'food',
          timeframe: 'daily',
          co2SavedKg: 10,
          xpReward: 20,
          difficulty: 'Low',
          progressMax: 5,
          progressCurrent: 2,
          completed: false
        },
        {
          id: 'c2',
          title: 'Bad Title',
          description: 'Bad Desc',
          category: 'bad_cat',
          timeframe: 'bad_tf',
          co2SavedKg: -10,
          xpReward: -50,
          difficulty: 'SuperHard',
          progressMax: -2,
          progressCurrent: 10,
          completed: 'yes'
        }
      ];

      const validated = validateChallenges(raw);
      expect(validated.length).toBe(2);
      expect(validated[0].completed).toBe(false);
      
      expect(validated[1].category).toBe('energy');
      expect(validated[1].timeframe).toBe('weekly');
      expect(validated[1].co2SavedKg).toBe(0);
      expect(validated[1].xpReward).toBe(0);
      expect(validated[1].difficulty).toBe('Medium');
      expect(validated[1].progressMax).toBe(1);
      expect(validated[1].progressCurrent).toBe(10); // clamped but matches input since max limit is 100000
      expect(validated[1].completed).toBe(false); // bad boolean parsed as default (false)
    });
  });
});
