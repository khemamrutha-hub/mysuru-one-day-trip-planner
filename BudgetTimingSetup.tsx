import React from 'react';
import {
  Clock,
  DollarSign,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Place, ThemeConfig, TripPlanItem, TripPreferences } from '../types';

interface BudgetTimingSetupProps {
  places: Place[];
  planItems: TripPlanItem[];
  preferences: TripPreferences;
  onUpdatePreferences: (updated: Partial<TripPreferences>) => void;
  onApplyPreset: (presetName: string) => void;
  onGoToNextStep: () => void;
  currentTheme: ThemeConfig;
}

export const BudgetTimingSetup: React.FC<BudgetTimingSetupProps> = ({
  places,
  planItems,
  preferences,
  onUpdatePreferences,
  onApplyPreset,
  onGoToNextStep,
}) => {
  const selectedItems = planItems.filter((i) => i.isSelected);

  const totalTicketsCostPerPerson = selectedItems.reduce((acc, item) => {
    const pl = places.find((p) => p.id === item.placeId);
    return acc + (pl ? pl.ticket.indian : 0);
  }, 0);

  const transportCostEstimates: Record<string, number> = {
    auto: 450,
    cab: 1400,
    bus: 120,
    'self-drive': 600,
  };
  const transportTotal = transportCostEstimates[preferences.transportMode] || 450;
  const transportPerPerson = Math.round(
    transportTotal / Math.max(preferences.groupCount, 1)
  );

  const diningCostPerPerson = 450; // Dosa breakfast + Thali lunch + coffee
  const shoppingBufferPerPerson = 250;

  const totalCostPerPerson =
    totalTicketsCostPerPerson +
    transportPerPerson +
    diningCostPerPerson +
    shoppingBufferPerPerson;
  const grandTotalGroupCost = totalCostPerPerson * preferences.groupCount;

  const budgetDifference = preferences.budgetPerPerson - totalCostPerPerson;
  const isOverBudget = budgetDifference < 0;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
              Step 1 of 4
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Tour Timings & Expense Estimator
            </h2>
            <p className="text-sm text-slate-200 mt-1 max-w-xl font-medium">
              Configure your morning departure time, travel party, and local transport mode. Real-time cost estimates update automatically.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Curated Itineraries:</span>
            <button
              onClick={() => onApplyPreset('heritage')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-amber-400 bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 transition shadow-sm"
            >
              Classic Heritage
            </button>
            <button
              onClick={() => onApplyPreset('budget')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-slate-600 bg-slate-800 text-slate-200 hover:text-white hover:border-amber-400 transition shadow-sm"
            >
              Budget (&lt; ₹500)
            </button>
            <button
              onClick={() => onApplyPreset('family')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold border border-slate-600 bg-slate-800 text-slate-200 hover:text-white hover:border-amber-400 transition shadow-sm"
            >
              Family & Wildlife
            </button>
          </div>
        </div>
      </div>

      {/* Inputs & Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Settings (5 Cols) */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-slate-900 space-y-4 shadow-xl">
          <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Schedule & Party Setup</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* Start time */}
            <div>
              <label className="block font-bold uppercase tracking-wider mb-1.5 text-slate-200">
                Morning Start Time
              </label>
              <input
                type="time"
                value={preferences.startTime}
                onChange={(e) => onUpdatePreferences({ startTime: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white font-medium text-sm focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs text-slate-300 mt-1 block font-medium">
                Recommended 08:30 AM to beat afternoon palace crowds
              </span>
            </div>

            {/* Group details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-slate-200">
                  Group Type
                </label>
                <select
                  value={preferences.groupType}
                  onChange={(e) =>
                    onUpdatePreferences({
                      groupType: e.target.value as TripPreferences['groupType'],
                      groupCount:
                        e.target.value === 'solo'
                          ? 1
                          : e.target.value === 'couple'
                          ? 2
                          : e.target.value === 'family'
                          ? 4
                          : 3,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white font-medium text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="solo">Solo Traveler</option>
                  <option value="couple">Couple</option>
                  <option value="family">Family</option>
                  <option value="friends">Friends Group</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider mb-1.5 text-slate-200">
                  Total Travelers
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={preferences.groupCount}
                  onChange={(e) =>
                    onUpdatePreferences({
                      groupCount: Math.max(1, parseInt(e.target.value) || 1),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white font-medium text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Transport mode */}
            <div>
              <label className="block font-bold uppercase tracking-wider mb-1.5 text-slate-200">
                City Transportation
              </label>
              <select
                value={preferences.transportMode}
                onChange={(e) =>
                  onUpdatePreferences({
                    transportMode: e.target.value as TripPreferences['transportMode'],
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white font-medium text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="auto">Auto-rickshaw (~₹450 total/day)</option>
                <option value="cab">Chauffeur AC Taxi (~₹1,400 total/day)</option>
                <option value="bus">KSRTC City Bus (~₹120/person)</option>
                <option value="self-drive">Self-drive Car / Bike (~₹600 fuel)</option>
              </select>
            </div>

            {/* Budget slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-bold uppercase tracking-wider text-slate-200">
                  Target Budget / Person
                </label>
                <span className="font-bold text-amber-300 text-sm">
                  ₹{preferences.budgetPerPerson}
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="3500"
                step="50"
                value={preferences.budgetPerPerson}
                onChange={(e) =>
                  onUpdatePreferences({
                    budgetPerPerson: parseInt(e.target.value) || 1000,
                  })
                }
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Economy ₹300</span>
                <span>Standard ₹1,500</span>
                <span>Comfort ₹3,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Cost Breakdown & Health (7 Cols) */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Estimated Expense Breakdown</span>
              </h3>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                  isOverBudget
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isOverBudget ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                    Exceeds Target by ₹{Math.abs(budgetDifference)}
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    Under Budget by ₹{budgetDifference}
                  </>
                )}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3.5">
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      (totalCostPerPerson / Math.max(preferences.budgetPerPerson, 1)) * 100
                    )}%`,
                    backgroundColor: isOverBudget ? '#EF4444' : '#F59E0B',
                  }}
                  className="h-full transition-all duration-300"
                />
              </div>
              <div className="flex justify-between text-xs mt-2 text-slate-200 font-medium">
                <span>
                  Estimated per person: <strong className="text-amber-300">₹{totalCostPerPerson}</strong>
                </span>
                <span>
                  Group total ({preferences.groupCount} travelers):{' '}
                  <strong className="text-amber-300">₹{grandTotalGroupCost}</strong>
                </span>
              </div>
            </div>

            {/* Expense cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Monument Tickets
                </div>
                <div className="font-black text-lg mt-1 text-amber-300">
                  ₹{totalTicketsCostPerPerson}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {selectedItems.length} destinations
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Transport Share
                </div>
                <div className="font-black text-lg mt-1 text-amber-300">
                  ₹{transportPerPerson}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 capitalize">
                  {preferences.transportMode}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Food & Sweets
                </div>
                <div className="font-black text-lg mt-1 text-amber-300">
                  ₹{diningCostPerPerson}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Meals & Mysore Pak
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Shopping & Misc
                </div>
                <div className="font-black text-lg mt-1 text-amber-300">
                  ₹{shoppingBufferPerPerson}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Sandalwood / Souvenirs
                </div>
              </div>
            </div>
          </div>

          {/* Footer Next Button */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Includes entry for all currently selected stops</span>
            </span>

            <button
              onClick={onGoToNextStep}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Next: Step-by-Step Itinerary</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
