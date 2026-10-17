import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GoogleMapModal } from './components/GoogleMapModal';
import { MapSection } from './components/MapSection';
import { StepItineraryView } from './components/StepItineraryView';
import { BudgetTimingSetup } from './components/BudgetTimingSetup';
import { FoodSection } from './components/FoodSection';
import { HistorySection } from './components/HistorySection';
import { INITIAL_PLACES, FAMOUS_RESTAURANTS, MYSORE_THEMES } from './data/mysoreData';
import { Place, ThemeConfig, TripPlanItem, TripPreferences } from './types';
import { Utensils, BookOpen } from 'lucide-react';

const STORAGE_KEYS = {
  PLAN: 'mytrip_mysore_plan_clean_v4',
  PREFS: 'mytrip_mysore_prefs_clean_v4',
};

export default function App() {
  // Single, unified Mysore Royal Gold & Slate theme with maximum text visibility
  const currentTheme: ThemeConfig = MYSORE_THEMES[0];

  // Places state
  const [places] = useState<Place[]>(INITIAL_PLACES);

  // Plan items state (ordered step-by-step)
  const [planItems, setPlanItems] = useState<TripPlanItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    const defaultOrderedIds = [
      'mysore-palace',
      'st-philomena',
      'devaraja-market',
      'mysore-zoo',
      'chamundi-hills',
      'brindavan-gardens',
    ];
    return defaultOrderedIds.map((id, index) => {
      const p = INITIAL_PLACES.find((pl) => pl.id === id);
      return {
        placeId: id,
        startTime: '08:30',
        durationMinutes: p?.durationMinutes || 90,
        travelTimeMinutes: 20,
        notes: '',
        isSelected: true,
        stepNumber: index + 1,
      };
    });
  });

  // Trip Preferences state
  const [preferences, setPreferences] = useState<TripPreferences>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PREFS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      date: new Date().toISOString().slice(0, 10),
      startTime: '08:30',
      groupType: 'couple',
      groupCount: 2,
      budgetPerPerson: 1200,
      transportMode: 'auto',
    };
  });

  // Step wizard state: 1, 2, 3, 4
  const [activeStep, setActiveStep] = useState<number>(2); // Default to Step 2: Step-by-Step Itinerary
  const [selectedPlaceForGoogleMap, setSelectedPlaceForGoogleMap] = useState<Place | null>(null);
  const [foodHeritageTab, setFoodHeritageTab] = useState<'food' | 'history'>('food');

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(planItems));
  }, [planItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences));
  }, [preferences]);

  // Duration updater
  const handleUpdateDuration = (placeId: string, durationMinutes: number) => {
    setPlanItems((prev) =>
      prev.map((item) =>
        item.placeId === placeId ? { ...item, durationMinutes } : item
      )
    );
  };

  // Toggle stop inclusion
  const handleToggleStop = (placeId: string) => {
    setPlanItems((prev) =>
      prev.map((item) =>
        item.placeId === placeId ? { ...item, isSelected: !item.isSelected } : item
      )
    );
  };

  // Presets
  const handleApplyPreset = (presetName: string) => {
    if (presetName === 'heritage') {
      const heritageIds = [
        'mysore-palace',
        'st-philomena',
        'devaraja-market',
        'mysore-zoo',
        'chamundi-hills',
        'brindavan-gardens',
      ];
      setPlanItems((prev) =>
        prev.map((p, idx) => ({
          ...p,
          isSelected: heritageIds.includes(p.placeId),
          stepNumber: idx + 1,
        }))
      );
      setPreferences((prev) => ({ ...prev, budgetPerPerson: 1200 }));
    } else if (presetName === 'budget') {
      const budgetIds = [
        'chamundi-hills',
        'st-philomena',
        'devaraja-market',
        'mysore-palace',
        'jaganmohan-palace',
      ];
      setPlanItems((prev) =>
        prev.map((p, idx) => ({
          ...p,
          isSelected: budgetIds.includes(p.placeId),
          stepNumber: idx + 1,
        }))
      );
      setPreferences((prev) => ({ ...prev, budgetPerPerson: 450 }));
    } else if (presetName === 'family') {
      const familyIds = [
        'mysore-zoo',
        'mysore-palace',
        'chamundi-hills',
        'brindavan-gardens',
      ];
      setPlanItems((prev) =>
        prev.map((p, idx) => ({
          ...p,
          isSelected: familyIds.includes(p.placeId),
          stepNumber: idx + 1,
        }))
      );
      setPreferences((prev) => ({
        ...prev,
        budgetPerPerson: 1400,
        groupType: 'family',
        groupCount: 4,
      }));
    }
  };

  const handleResetPlan = () => {
    const defaultOrderedIds = [
      'mysore-palace',
      'st-philomena',
      'devaraja-market',
      'mysore-zoo',
      'chamundi-hills',
      'brindavan-gardens',
    ];
    setPlanItems(
      defaultOrderedIds.map((id, index) => {
        const p = INITIAL_PLACES.find((pl) => pl.id === id);
        return {
          placeId: id,
          startTime: '08:30',
          durationMinutes: p?.durationMinutes || 90,
          travelTimeMinutes: 20,
          notes: '',
          isSelected: true,
          stepNumber: index + 1,
        };
      })
    );
    setPreferences({
      date: new Date().toISOString().slice(0, 10),
      startTime: '08:30',
      groupType: 'couple',
      groupCount: 2,
      budgetPerPerson: 1200,
      transportMode: 'auto',
    });
  };

  const selectedCount = planItems.filter((p) => p.isSelected).length;

  return (
    <div className="min-h-screen font-sans text-white bg-slate-950">
      {/* Navigation (ZIP and Theme options removed) */}
      <Navbar
        currentTheme={currentTheme}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        onResetPlan={handleResetPlan}
        totalStops={selectedCount}
      />

      {/* Mysore Heritage Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/20 border border-amber-400 text-amber-300">
                <span>Mysuru Cultural Heritage Tour</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Explore Mysuru in One Day
              </h1>
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
                A sequential royal heritage route with authentic photography, visiting hours, and direct Google Maps access.
              </p>
            </div>

            {/* Practical Tour Summary */}
            <div className="p-4 rounded-xl border border-amber-500/40 bg-slate-900/95 flex items-center gap-4 shadow-xl">
              <div className="text-center px-1">
                <div className="text-xl sm:text-2xl font-serif font-black text-amber-300">
                  {selectedCount}
                </div>
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Stops
                </div>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="text-center px-1">
                <div className="text-xl sm:text-2xl font-serif font-black text-amber-300">
                  08:30 AM
                </div>
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Start
                </div>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="text-center px-1">
                <div className="text-xl sm:text-2xl font-serif font-black text-amber-300">
                  ₹{preferences.budgetPerPerson}
                </div>
                <div className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Budget/Pax
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Step Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step 1: Timing & Budget */}
        {activeStep === 1 && (
          <BudgetTimingSetup
            places={places}
            planItems={planItems}
            preferences={preferences}
            onUpdatePreferences={(up) => setPreferences((prev) => ({ ...prev, ...up }))}
            onApplyPreset={handleApplyPreset}
            onGoToNextStep={() => setActiveStep(2)}
            currentTheme={currentTheme}
          />
        )}

        {/* Step 2: Step-by-Step Itinerary */}
        {activeStep === 2 && (
          <StepItineraryView
            places={places}
            planItems={planItems}
            startTime={preferences.startTime}
            currentTheme={currentTheme}
            onUpdateDuration={handleUpdateDuration}
            onToggleStop={handleToggleStop}
            onReorderPlan={setPlanItems}
            onOpenGoogleMap={(p) => setSelectedPlaceForGoogleMap(p)}
          />
        )}

        {/* Step 3: Route on Map */}
        {activeStep === 3 && (
          <MapSection
            places={places}
            planItems={planItems}
            restaurants={FAMOUS_RESTAURANTS}
            currentTheme={currentTheme}
            onOpenGoogleMap={(p) => setSelectedPlaceForGoogleMap(p)}
            onSelectPlace={(p) => setSelectedPlaceForGoogleMap(p)}
          />
        )}

        {/* Step 4: Food & Heritage Guide */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="flex gap-2 p-1.5 rounded-xl border border-amber-500/30 bg-slate-900/90 max-w-md shadow-md">
              <button
                onClick={() => setFoodHeritageTab('food')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  foodHeritageTab === 'food'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Mysuru Food & Dining</span>
              </button>

              <button
                onClick={() => setFoodHeritageTab('history')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  foodHeritageTab === 'history'
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Wadiyar Royal History</span>
              </button>
            </div>

            {foodHeritageTab === 'food' ? (
              <FoodSection currentTheme={currentTheme} />
            ) : (
              <HistorySection currentTheme={currentTheme} />
            )}
          </div>
        )}
      </main>

      {/* Clean Mysore Footer (ZIP and Theme switcher removed) */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="font-serif font-bold text-xl text-white tracking-tight">
            MyTrip Planner • Mysuru Heritage Tour
          </div>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            A comprehensive travel companion for exploring the heritage, architecture, cuisine, and gardens of Mysuru.
          </p>
          <div className="pt-2 text-xs text-amber-400 font-semibold">
            Mysuru, Karnataka, India
          </div>
        </div>
      </footer>

      {/* Google Maps Modal */}
      <GoogleMapModal
        isOpen={!!selectedPlaceForGoogleMap}
        onClose={() => setSelectedPlaceForGoogleMap(null)}
        place={selectedPlaceForGoogleMap}
        currentTheme={currentTheme}
      />
    </div>
  );
}
