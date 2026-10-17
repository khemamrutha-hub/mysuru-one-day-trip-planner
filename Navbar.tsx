import React from 'react';
import { RotateCcw, Calendar, MapPin, Compass, Utensils } from 'lucide-react';
import { ThemeConfig } from '../types';

interface NavbarProps {
  currentTheme: ThemeConfig;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onResetPlan: () => void;
  totalStops: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  activeStep,
  setActiveStep,
  onResetPlan,
  totalStops,
}) => {
  const steps = [
    { num: 1, label: 'Timing & Budget', icon: Calendar },
    { num: 2, label: 'Step-by-Step Itinerary', icon: Compass, count: totalStops },
    { num: 3, label: 'Route on Map', icon: MapPin },
    { num: 4, label: 'Food & Heritage', icon: Utensils },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b bg-slate-900/95 border-amber-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-black text-xl border shadow-md bg-amber-500/20 border-amber-400 text-amber-300">
              M
            </div>
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white">
                MyTrip Planner
              </div>
              <p className="text-xs uppercase tracking-wider font-bold text-amber-400">
                Mysuru One-Day Tour
              </p>
            </div>
          </div>

          {/* Quick Actions (Theme & ZIP download removed per user request) */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetPlan}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-amber-500/40 text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 hover:text-white transition flex items-center gap-1.5 shadow-sm"
              title="Reset default one-day schedule"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Schedule</span>
            </button>
          </div>
        </div>

        {/* Step-by-Step Progress Tabs with 100% visible high-contrast text */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 border-t border-slate-800 scrollbar-none">
          {steps.map((st) => {
            const Icon = st.icon;
            const isActive = activeStep === st.num;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition whitespace-nowrap border ${
                  isActive
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold shadow-md'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-700 text-white border border-slate-600'
                  }`}
                >
                  {st.num}
                </span>
                <span className="font-medium text-slate-100">{st.label}</span>
                {st.count !== undefined && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full font-bold ml-0.5 bg-amber-400/20 border border-amber-400/40 text-amber-300">
                    {st.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
