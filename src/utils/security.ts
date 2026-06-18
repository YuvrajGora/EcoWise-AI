import { 
  type UserProfile, 
  type HabitLog, 
  type Challenge,
  type CommuteType,
  type HeatingType,
  type DietType,
  type ShoppingVolume
} from '../types';

/**
 * Escapes HTML characters to prevent XSS.
 */
export function sanitizeText(text: unknown): string {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and clamps a number input to protect against NaN, Infinity, or overflow.
 */
export function validateNumber(val: unknown, min: number, max: number, defaultVal: number): number {
  if (val === null || val === undefined) {
    return defaultVal;
  }
  const num = typeof val === 'number' ? val : Number(val);
  if (isNaN(num) || !isFinite(num)) {
    return defaultVal;
  }
  return Math.min(Math.max(num, min), max);
}

/**
 * Validates a boolean value.
 */
export function validateBoolean(val: unknown, defaultVal: boolean): boolean {
  if (typeof val === 'boolean') {
    return val;
  }
  if (val === 'true') return true;
  if (val === 'false') return false;
  return defaultVal;
}

/**
 * Validates and sanitizes text inputs with length constraints.
 */
export function validateText(val: unknown, maxLength: number, defaultVal: string): string {
  if (val === null || val === undefined) {
    return defaultVal;
  }
  const str = String(val).trim();
  const sanitized = sanitizeText(str);
  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength);
  }
  return sanitized;
}

const VALID_COMMUTE_TYPES: CommuteType[] = [
  'petrol_car',
  'hybrid_car',
  'ev_car',
  'electric_car',
  'public_transit',
  'active',
  'active_commute'
];

const VALID_HEATING_TYPES: HeatingType[] = [
  'natural_gas',
  'electricity',
  'solar_green',
  'oil',
  'heating_oil',
  'biomass'
];

const VALID_DIET_TYPES: DietType[] = [
  'meat_heavy',
  'average',
  'vegetarian',
  'vegan',
  'pescatarian'
];

const VALID_SHOPPING_VOLUMES: ShoppingVolume[] = [
  'none',
  'few',
  'average',
  'heavy',
  'light'
];

/**
 * Defensively validates a UserProfile object, restoring defaults for missing or invalid fields.
 */
export function validateUserProfile(p: unknown): UserProfile {
  const defaultProfile: UserProfile = {
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

  if (!p || typeof p !== 'object') {
    return defaultProfile;
  }

  const obj = p as Record<string, unknown>;

  const name = validateText(obj.name, 100, defaultProfile.name);
  const householdSize = validateNumber(obj.householdSize, 1, 100, defaultProfile.householdSize);
  const location = validateText(obj.location, 100, defaultProfile.location);
  
  const commuteType = VALID_COMMUTE_TYPES.includes(obj.commuteType as CommuteType) 
    ? (obj.commuteType as CommuteType) 
    : defaultProfile.commuteType;

  const commuteDistance = validateNumber(obj.commuteDistance, 0, 10000, defaultProfile.commuteDistance);
  const shortFlights = validateNumber(obj.shortFlights, 0, 1000, defaultProfile.shortFlights);
  const longFlights = validateNumber(obj.longFlights, 0, 1000, defaultProfile.longFlights);

  const heatingSource = VALID_HEATING_TYPES.includes(obj.heatingSource as HeatingType)
    ? (obj.heatingSource as HeatingType)
    : defaultProfile.heatingSource;

  const electricityMonthly = validateNumber(obj.electricityMonthly, 0, 100000, defaultProfile.electricityMonthly);
  const greenEnergy = validateBoolean(obj.greenEnergy, defaultProfile.greenEnergy);

  const dietType = VALID_DIET_TYPES.includes(obj.dietType as DietType)
    ? (obj.dietType as DietType)
    : defaultProfile.dietType;

  const localFood = ['always', 'sometimes', 'rarely'].includes(obj.localFood as string)
    ? (obj.localFood as 'always' | 'sometimes' | 'rarely')
    : defaultProfile.localFood;

  const foodWaste = ['high', 'medium', 'low'].includes(obj.foodWaste as string)
    ? (obj.foodWaste as 'high' | 'medium' | 'low')
    : defaultProfile.foodWaste;

  const clothingMonthly = VALID_SHOPPING_VOLUMES.includes(obj.clothingMonthly as ShoppingVolume)
    ? (obj.clothingMonthly as ShoppingVolume)
    : defaultProfile.clothingMonthly;

  const techYearly = ['low', 'medium', 'heavy'].includes(obj.techYearly as string)
    ? (obj.techYearly as 'low' | 'medium' | 'heavy')
    : defaultProfile.techYearly;

  const trashBagsWeekly = validateNumber(obj.trashBagsWeekly, 0, 1000, defaultProfile.trashBagsWeekly);
  const composting = validateBoolean(obj.composting, defaultProfile.composting);

  const recycling = ['recycle_all', 'recycle_some', 'recycle_none'].includes(obj.recycling as string)
    ? (obj.recycling as 'recycle_all' | 'recycle_some' | 'recycle_none')
    : defaultProfile.recycling;

  return {
    name,
    householdSize,
    location,
    commuteType,
    commuteDistance,
    shortFlights,
    longFlights,
    heatingSource,
    electricityMonthly,
    greenEnergy,
    dietType,
    localFood,
    foodWaste,
    clothingMonthly,
    techYearly,
    trashBagsWeekly,
    composting,
    recycling
  };
}

/**
 * Defensively validates and sanitizes a list of HabitLogs.
 */
export function validateHabitLogs(logs: unknown): HabitLog[] {
  if (!Array.isArray(logs)) {
    return [];
  }

  const validCategories = ['transport', 'energy', 'food', 'shopping', 'waste'];
  const list = logs as unknown[];

  return list
    .filter((log): log is Record<string, unknown> => !!log && typeof log === 'object')
    .map(log => {
      const id = validateText(log.id, 100, '');
      const date = validateText(log.date, 30, '');
      const category = validCategories.includes(log.category as string) ? log.category as string : 'energy';
      const value = validateNumber(log.value, 0, 100000, 0);
      const co2SavedKg = validateNumber(log.co2SavedKg, -100000, 100000, 0);
      const description = validateText(log.description, 200, '');

      return {
        id,
        date,
        category: category as 'transport' | 'energy' | 'food' | 'shopping' | 'waste',
        value,
        co2SavedKg,
        description
      };
    });
}

/**
 * Defensively validates and sanitizes a list of Challenges.
 */
export function validateChallenges(challs: unknown): Challenge[] {
  if (!Array.isArray(challs)) {
    return [];
  }

  const validCategories = ['transport', 'energy', 'food', 'shopping', 'waste'];
  const validTimeframes = ['daily', 'weekly', 'monthly'];
  const validDifficulties = ['Low', 'Medium', 'High'];
  const list = challs as unknown[];

  return list
    .filter((c): c is Record<string, unknown> => !!c && typeof c === 'object')
    .map(c => {
      const id = validateText(c.id, 100, '');
      const title = validateText(c.title, 100, '');
      const description = validateText(c.description, 200, '');
      const category = validCategories.includes(c.category as string) ? c.category as string : 'energy';
      const timeframe = validTimeframes.includes(c.timeframe as string) ? c.timeframe as string : 'weekly';
      const co2SavedKg = validateNumber(c.co2SavedKg, 0, 100000, 0);
      const xpReward = validateNumber(c.xpReward, 0, 100000, 0);
      const difficulty = validDifficulties.includes(c.difficulty as string) ? c.difficulty as string : 'Medium';
      const progressMax = validateNumber(c.progressMax, 1, 100000, 1);
      const progressCurrent = validateNumber(c.progressCurrent, 0, 100000, 0);
      const completed = validateBoolean(c.completed, false);

      return {
        id,
        title,
        description,
        category: category as 'transport' | 'energy' | 'food' | 'shopping' | 'waste',
        timeframe: timeframe as 'daily' | 'weekly' | 'monthly',
        co2SavedKg,
        xpReward,
        difficulty: difficulty as 'Low' | 'Medium' | 'High',
        progressMax,
        progressCurrent,
        completed
      };
    });
}
