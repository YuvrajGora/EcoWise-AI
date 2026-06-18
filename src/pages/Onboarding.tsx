import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  type UserProfile, 
  type CommuteType, 
  type DietType, 
  type HeatingType, 
  type ShoppingVolume 
} from '../utils/sustainabilityIntelligence';
import { 
  Car, 
  Lightbulb, 
  Utensils, 
  Trash2, 
  User, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Check
} from 'lucide-react';

interface OnboardingProps {
  setCurrentPage: (page: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ setCurrentPage }) => {
  const { saveProfile, highContrast } = useApp();
  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    householdSize: 1,
    location: 'US',
    commuteType: 'petrol_car',
    commuteDistance: 50,
    shortFlights: 1,
    longFlights: 0,
    electricityMonthly: 250,
    heatingSource: 'electricity',
    greenEnergy: false,
    dietType: 'average',
    localFood: 'sometimes',
    foodWaste: 'medium',
    clothingMonthly: 'average',
    techYearly: 'medium',
    trashBagsWeekly: 2,
    composting: false,
    recycling: 'recycle_some'
  });

  const updateField = (key: keyof UserProfile, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      // Completed, calculate and save
      saveProfile(formData);
      setCurrentPage('dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const stepsDetails = [
    { title: 'Personal Info', icon: User, desc: 'Let\'s start with your profile basics.' },
    { title: 'Transportation', icon: Car, desc: 'Tell us how you move around daily.' },
    { title: 'Home Energy', icon: Lightbulb, desc: 'How much energy does your home consume?' },
    { title: 'Food & Goods', icon: Utensils, desc: 'What are your eating and shopping cycles?' },
    { title: 'Waste & Recycling', icon: Trash2, desc: 'Let\'s check your waste disposal habits.' }
  ];

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      {/* Onboarding progress header */}
      <div className="mb-8 space-y-4 select-none">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Step {step} of {totalSteps}
          </span>
          <span className="text-xs font-semibold text-emerald-400">
            {Math.round((step / totalSteps) * 100)}% Complete
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center justify-between pt-1">
          {stepsDetails.map((sDet, idx) => {
            const SIcon = sDet.icon;
            const isCompleted = step > idx + 1;
            const isActive = step === idx + 1;
            return (
              <div 
                key={idx} 
                className={`flex flex-col items-center space-y-1 ${
                  isActive ? 'text-emerald-400' : isCompleted ? 'text-blue-400' : 'text-slate-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                  isActive 
                    ? highContrast ? 'border-white bg-white text-black' : 'border-emerald-400 bg-emerald-500/10'
                    : isCompleted
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-800 bg-slate-900'
                }`}>
                  {isCompleted ? <Check className="h-4 w-4" /> : <SIcon className="h-4 w-4" />}
                </div>
                <span className="text-[9px] font-medium hidden sm:inline">{sDet.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className={`glass-card p-6 sm:p-8 ${highContrast ? 'border-2 border-white bg-black text-white' : ''}`}>
        <div className="mb-6 space-y-1 select-none">
          <h2 className="text-xl font-bold font-display text-white">
            {stepsDetails[step - 1].title}
          </h2>
          <p className="text-xs text-slate-400">
            {stepsDetails[step - 1].desc}
          </p>
        </div>

        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name-input" className="text-xs font-semibold text-slate-300 block">
                What should we call you?
              </label>
              <input
                id="name-input"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 ${
                  highContrast ? 'bg-black border-white text-white focus:border-white' : ''
                }`}
                aria-label="Name"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="household-select" className="text-xs font-semibold text-slate-300 block">
                Household Size (People)
              </label>
              <select
                id="household-select"
                value={formData.householdSize}
                onChange={(e) => updateField('householdSize', Number(e.target.value))}
                className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 ${
                  highContrast ? 'bg-black border-white text-white' : ''
                }`}
                aria-label="Household size select"
              >
                <option value={1}>1 (Single)</option>
                <option value={2}>2 (Couple)</option>
                <option value={3}>3 People</option>
                <option value={4}>4 People</option>
                <option value={5}>5+ People</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="location-select" className="text-xs font-semibold text-slate-300 block">
                General Location Region
              </label>
              <select
                id="location-select"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 ${
                  highContrast ? 'bg-black border-white text-white' : ''
                }`}
                aria-label="Location select"
              >
                <option value="US">North America / US (High Carbon Grid)</option>
                <option value="EU">Europe (Medium/Low Carbon Grid)</option>
                <option value="AS">Asia / India (Coal Dominated Grid)</option>
                <option value="OTHER">Other Global Average</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: TRANSPORTATION */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Primary Commute Vehicle / Transit
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { value: 'petrol_car', label: 'Gas/Diesel Car' },
                  { value: 'hybrid_car', label: 'Hybrid Vehicle' },
                  { value: 'electric_car', label: 'Electric Car (EV)' },
                  { value: 'public_transit', label: 'Public Transit' },
                  { value: 'active_commute', label: 'Active (Bicycle/Walk)' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateField('commuteType', item.value as CommuteType)}
                    className={`text-left p-3 rounded-lg border text-xs font-semibold transition-all ${
                      formData.commuteType === item.value
                        ? highContrast
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="commute-distance" className="font-semibold text-slate-300">
                  Weekly Travel Distance
                </label>
                <span className="font-mono text-emerald-400 font-bold">{formData.commuteDistance} km / week</span>
              </div>
              <input
                id="commute-distance"
                type="range"
                min="0"
                max="500"
                step="10"
                value={formData.commuteDistance}
                onChange={(e) => updateField('commuteDistance', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                aria-label="Weekly travel distance"
              />
            </div>

             <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="short-flights" className="text-[11px] font-semibold text-slate-300 block">
                  Short flights/yr (&lt;3 hrs)
                </label>
                <input
                  id="short-flights"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.shortFlights}
                  onChange={(e) => updateField('shortFlights', Math.max(0, Number(e.target.value)))}
                  className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-sm text-slate-100 ${
                    highContrast ? 'bg-black border-white text-white' : ''
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="long-flights" className="text-[11px] font-semibold text-slate-300 block">
                  Long flights/yr (&gt;3 hrs)
                </label>
                <input
                  id="long-flights"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.longFlights}
                  onChange={(e) => updateField('longFlights', Math.max(0, Number(e.target.value)))}
                  className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-1.5 text-sm text-slate-100 ${
                    highContrast ? 'bg-black border-white text-white' : ''
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: HOME ENERGY */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="electricity-input" className="font-semibold text-slate-300">
                  Monthly Home Electricity Consumption
                </label>
                <span className="font-mono text-emerald-400 font-bold">{formData.electricityMonthly} kWh / month</span>
              </div>
              <input
                id="electricity-input"
                type="range"
                min="50"
                max="1200"
                step="25"
                value={formData.electricityMonthly}
                onChange={(e) => updateField('electricityMonthly', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Primary Home Heating Source
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 {[
                  { value: 'natural_gas', label: 'Natural Gas' },
                  { value: 'electricity', label: 'Heat Pump / Electric' },
                  { value: 'heating_oil', label: 'Heating Oil' },
                  { value: 'biomass', label: 'Wood / Biomass Pellet' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateField('heatingSource', item.value as HeatingType)}
                    className={`text-left p-3 rounded-lg border text-xs font-semibold transition-all ${
                      formData.heatingSource === item.value
                        ? highContrast
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Switch option for renewable energy */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${
              highContrast ? 'border-white bg-black' : 'bg-white/5 border-white/5'
            }`}>
              <div>
                <div className="text-xs font-bold text-slate-200">Renewable Energy Subscription</div>
                <div className="text-[10px] text-slate-400">Are you on a certified green energy tariff?</div>
              </div>
              <button
                type="button"
                onClick={() => updateField('greenEnergy', !formData.greenEnergy)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formData.greenEnergy
                    ? highContrast ? 'bg-white border-black' : 'bg-emerald-500'
                    : 'bg-slate-700'
                }`}
                aria-checked={formData.greenEnergy}
                role="switch"
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-slate-900 transition-transform ${
                    formData.greenEnergy ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: FOOD & GOODS */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Primary Diet Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'meat_heavy', label: 'Meat Heavy' },
                  { value: 'average', label: 'Average Diet' },
                  { value: 'vegetarian', label: 'Vegetarian' },
                  { value: 'vegan', label: 'Strict Vegan' }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateField('dietType', item.value as DietType)}
                    className={`p-3 rounded-lg border text-xs font-semibold transition-all ${
                      formData.dietType === item.value
                        ? highContrast
                          ? 'bg-white text-black border-white font-bold'
                          : 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

             <div className="space-y-1">
              <label htmlFor="localfood-select" className="text-xs font-semibold text-slate-300 block">
                How often do you prioritize local / organic food?
              </label>
              <select
                id="localfood-select"
                value={formData.localFood}
                onChange={(e) => updateField('localFood', e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-100 ${
                  highContrast ? 'bg-black border-white text-white' : ''
                }`}
              >
                <option value="rarely">Rarely (Supermarket Imports)</option>
                <option value="sometimes">Occasionally</option>
                <option value="always">Regularly (Farmers Markets)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="clothing-select" className="text-xs font-semibold text-slate-300 block">
                Clothing & Goods Shopping Volume
              </label>
              <select
                id="clothing-select"
                value={formData.clothingMonthly}
                onChange={(e) => updateField('clothingMonthly', e.target.value as ShoppingVolume)}
                className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-100 ${
                  highContrast ? 'bg-black border-white text-white' : ''
                }`}
              >
                <option value="light">Light (Thrift, high-duration use)</option>
                <option value="average">Average (New pieces occasionally)</option>
                <option value="heavy">Heavy (Trend shopper, fast fashion)</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 5: WASTE & RECYCLING */}
        {step === 5 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="trash-bags" className="font-semibold text-slate-300">
                  Weekly Trash Production
                </label>
                <span className="font-mono text-emerald-400 font-bold">{formData.trashBagsWeekly} large bags / week</span>
              </div>
              <input
                id="trash-bags"
                type="range"
                min="0"
                max="8"
                step="1"
                value={formData.trashBagsWeekly}
                onChange={(e) => updateField('trashBagsWeekly', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="recycling-select" className="text-xs font-semibold text-slate-300 block">
                How diligent are you with recycling?
              </label>
              <select
                id="recycling-select"
                value={formData.recycling}
                onChange={(e) => updateField('recycling', e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-100 ${
                  highContrast ? 'bg-black border-white text-white' : ''
                }`}
              >
                <option value="recycle_none">Rarely (Toss all to landfill)</option>
                <option value="recycle_some">Occasionally sorting</option>
                <option value="recycle_all">Regularly / Diligent sorting</option>
              </select>
            </div>

            {/* Composting Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${
              highContrast ? 'border-white bg-black' : 'bg-white/5 border-white/5'
            }`}>
              <div>
                <div className="text-xs font-bold text-slate-200">Composting Household Waste</div>
                <div className="text-[10px] text-slate-400">Do you divert organic waste from landfills?</div>
              </div>
              <button
                type="button"
                onClick={() => updateField('composting', !formData.composting)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  formData.composting
                    ? highContrast ? 'bg-white border-black' : 'bg-emerald-500'
                    : 'bg-slate-700'
                }`}
                aria-checked={formData.composting}
                role="switch"
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-slate-900 transition-transform ${
                    formData.composting ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>
        )}

        {/* Buttons Nav */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5 select-none">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className={`px-4 py-2.5 rounded-lg border text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                highContrast
                  ? 'border-white text-white hover:bg-white/10'
                  : 'border-slate-800 text-slate-400 hover:text-white bg-white/5'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              highContrast
                ? 'bg-white text-black hover:bg-slate-200 border-2 border-white'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-900 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            }`}
          >
            <span>{step === totalSteps ? 'Finalize Profile' : 'Next Step'}</span>
            {step === totalSteps ? <Sparkles className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
