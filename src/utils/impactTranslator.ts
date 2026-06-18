/**
 * Environmental Impact Translator
 * Helps users conceptualize carbon quantities by translating CO2 saved (kg) into real-world equivalents.
 */

export interface ImpactEquivalents {
  co2Saved: number;
  trees: number;
  drivingKm: number;
  electricityDays: number;
}

export const translateCarbon = (co2SavedKg: number): ImpactEquivalents => {
  const roundedCo2 = Math.max(0, Math.round(co2SavedKg * 10) / 10);
  
  // Trees Planted equivalent (Approx 20kg CO2 per tree per year)
  // Let's use 20kg as the divisor.
  const trees = Math.round((roundedCo2 / 20) * 10) / 10;
  
  // Driving Km saved (Approx 0.22 kg CO2 per km of driving an average petrol passenger vehicle)
  const drivingKm = Math.round(roundedCo2 / 0.22);
  
  // Days of average household electricity saved (Avg household uses ~25 kWh/day, which is ~8.75 kg CO2/day at 0.35 kg/kWh)
  // Let's use 8 kg CO2 per day as a rounded standard baseline.
  const electricityDays = Math.round((roundedCo2 / 8) * 10) / 10;

  return {
    co2Saved: roundedCo2,
    trees,
    drivingKm,
    electricityDays
  };
};

/**
 * Helper to generate a text translation sentence.
 * Example: "Equivalent to planting 2.4 trees, driving 109 km less, or saving 6 days of home electricity."
 */
export const getImpactString = (co2SavedKg: number): string => {
  const { trees, drivingKm, electricityDays } = translateCarbon(co2SavedKg);
  return `Equivalent to planting ${trees} trees, driving ${drivingKm} km less, or saving ${electricityDays} days of home electricity.`;
};

/**
 * Formats carbon values into strings with standard units based on user preferences.
 */
export const formatCarbon = (kgValue: number, units: 'metric' | 'imperial', precision: number = 1): string => {
  if (units === 'imperial') {
    const lbsValue = kgValue * 2.20462;
    return `${lbsValue.toFixed(precision)} lbs CO₂`;
  }
  return `${kgValue.toFixed(precision)} kg CO₂`;
};

/**
 * Alias for translateCarbon to resolve dependency references across screens.
 */
export const getRealWorldEquivalent = (co2SavedKg: number): ImpactEquivalents => {
  return translateCarbon(co2SavedKg);
};
