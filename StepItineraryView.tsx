import React, { useState } from 'react';
import {
  Clock,
  ExternalLink,
  Navigation,
  Info,
  Car,
  ChevronDown,
  ChevronUp,
  Utensils,
  AlertTriangle,
} from 'lucide-react';
import { Place, ThemeConfig, TripPlanItem } from '../types';

interface StepItineraryViewProps {
  places: Place[];
  planItems: TripPlanItem[];
  startTime: string;
  currentTheme: ThemeConfig;
  onUpdateDuration: (placeId: string, durationMinutes: number) => void;
  onToggleStop: (placeId: string) => void;
  onReorderPlan: (newPlan: TripPlanItem[]) => void;
  onOpenGoogleMap: (place: Place) => void;
}

export const StepItineraryView: React.FC<StepItineraryViewProps> = ({
  places,
  planItems,
  startTime,
  currentTheme,
  onUpdateDuration,
  onToggleStop,
  onReorderPlan,
  onOpenGoogleMap,
}) => {
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({
    'mysore-palace': true,
  });

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedItems = planItems.filter((i) => i.isSelected);

  // Calculate arrival times
  let currentHour = parseInt(startTime.split(':')[0], 10) || 8;
  let currentMinute = parseInt(startTime.split(':')[1], 10) || 30;

  const stepsWithTiming = selectedItems.map((item, idx) => {
    const place = places.find((p) => p.id === item.placeId);

    const h = currentHour % 24;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const arrivalTimeStr = `${String(displayHour).padStart(2, '0')}:${String(
      currentMinute
    ).padStart(2, '0')} ${ampm}`;

    // Add stay duration + 20 min transit for next
    const totalMinutes = item.durationMinutes + (idx < selectedItems.length - 1 ? 20 : 0);
    const newTotalMinutes = currentMinute + totalMinutes;
    currentHour = (currentHour + Math.floor(newTotalMinutes / 60)) % 24;
    currentMinute = newTotalMinutes % 60;

    return {
      ...item,
      place,
      arrivalTimeStr,
      stepNumber: idx + 1,
    };
  });

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
              Step-by-Step One-Day Itinerary
            </h2>
            <p className="text-sm text-slate-200 mt-1 font-medium">
              Optimized in geographic sequence for minimal travel time and maximum heritage experience.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-400 bg-amber-500/20 text-amber-300 shadow-sm">
              {selectedItems.length} Scheduled Stops
            </span>
          </div>
        </div>
      </div>

      {/* Step Sequence List */}
      <div className="space-y-6">
        {stepsWithTiming.map((step, idx) => {
          const place = step.place;
          if (!place) return null;

          const isExpanded = !!expandedDetails[place.id];
          const nextStep = stepsWithTiming[idx + 1];

          return (
            <div key={place.id} className="relative">
              {/* Connector line to next step */}
              {nextStep && (
                <div className="hidden md:block absolute left-8 top-full h-6 w-0.5 z-0 bg-amber-500/40" />
              )}

              {/* Stop Card */}
              <div className="rounded-2xl border border-amber-500/30 bg-slate-900 overflow-hidden shadow-2xl transition-all duration-300">
                {/* Step Header Banner */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 bg-slate-950">
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Step Number Badge */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-serif font-black text-lg flex-shrink-0 shadow-md bg-amber-400 text-slate-950 border border-amber-300">
                      {step.stepNumber}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border border-amber-400/40 bg-amber-500/20 text-amber-300">
                          {step.arrivalTimeStr}
                        </span>
                        <span className="text-xs font-bold text-amber-300">
                          {place.categoryLabel}
                        </span>
                        {place.closedDay && (
                          <span className="text-xs font-bold text-red-400 flex items-center gap-1 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
                            <AlertTriangle className="w-3.5 h-3.5" /> Closed on {place.closedDay}s
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-lg sm:text-xl text-white mt-1">
                        {place.name}
                      </h3>
                    </div>
                  </div>

                  {/* Header Actions (Duration, Google Maps, Expand) */}
                  <div className="flex items-center gap-2 flex-wrap self-end md:self-center">
                    {/* Stay Duration Selector */}
                    <div className="flex items-center gap-1.5 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-300 font-semibold">Stay:</span>
                      <select
                        value={step.durationMinutes}
                        onChange={(e) =>
                          onUpdateDuration(place.id, parseInt(e.target.value) || 60)
                        }
                        className="bg-transparent font-bold text-amber-300 focus:outline-none cursor-pointer"
                      >
                        <option value="45" className="bg-slate-900 text-white">45 mins</option>
                        <option value="60" className="bg-slate-900 text-white">1 hour</option>
                        <option value="90" className="bg-slate-900 text-white">1.5 hours</option>
                        <option value="120" className="bg-slate-900 text-white">2 hours</option>
                        <option value="150" className="bg-slate-900 text-white">2.5 hours</option>
                        <option value="180" className="bg-slate-900 text-white">3 hours</option>
                      </select>
                    </div>

                    {/* Google Maps Access */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${
                        place.googleMapsQuery || encodeURIComponent(place.name + ' Mysore')
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-400/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition shadow-sm"
                      title="Open in Google Maps app"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>

                    {/* Details Expand Toggle */}
                    <button
                      onClick={() => toggleDetails(place.id)}
                      className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white transition"
                      title="Toggle complete details & photography"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Content with Real Photography & Practical Information */}
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Photo Showcase (5 Cols) */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="relative h-56 sm:h-64 rounded-xl overflow-hidden border border-amber-500/30 shadow-lg bg-black">
                      <img
                        src={place.photos[0]}
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-3 text-xs text-white font-bold drop-shadow">
                        {place.photoLabels[0] || place.name}
                      </div>
                    </div>

                    {/* Additional Photos Thumbnails */}
                    {place.photos.length > 1 && (
                      <div className="grid grid-cols-3 gap-2">
                        {place.photos.slice(1, 4).map((ph, pIdx) => (
                          <div
                            key={pIdx}
                            className="h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-950"
                          >
                            <img
                              src={ph}
                              alt=""
                              className="w-full h-full object-cover hover:opacity-90 transition"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Information & Practical Data (7 Cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-sm text-slate-100 leading-relaxed font-normal">
                      {place.desc}
                    </p>

                    {/* Quick Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-950 text-xs">
                      <div>
                        <div className="font-bold text-slate-300 uppercase text-[11px] tracking-wider">
                          Visiting Hours
                        </div>
                        <div className="font-semibold text-white mt-1">{place.time}</div>
                      </div>

                      <div>
                        <div className="font-bold text-slate-300 uppercase text-[11px] tracking-wider">
                          Entry Fee
                        </div>
                        <div className="font-bold mt-1 text-amber-300">
                          {place.ticket.indian === 0 ? 'Free Entry' : `₹${place.ticket.indian} (Indian)`}
                        </div>
                        {place.ticket.foreign > 0 && (
                          <div className="text-slate-300 text-[11px] mt-0.5">
                            ₹{place.ticket.foreign} (Foreigner)
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-bold text-slate-300 uppercase text-[11px] tracking-wider">
                          Walk Score
                        </div>
                        <div className="font-bold text-white mt-1">
                          {place.walkScore} / 100
                        </div>
                      </div>
                    </div>

                    {/* Visitor Tips */}
                    <div className="text-xs p-3.5 rounded-xl border border-amber-500/40 bg-amber-950/20 space-y-1.5">
                      <div className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-300">
                        <Info className="w-4 h-4 text-amber-400" />
                        <span>Traveler Guidance & Practical Advice</span>
                      </div>
                      <p className="text-slate-100 leading-relaxed font-normal">{place.tips}</p>
                    </div>

                    {/* Expanded History & Heritage */}
                    {isExpanded && (
                      <div className="p-4 rounded-xl border border-amber-500/30 bg-slate-950 text-xs space-y-2">
                        <div className="font-serif font-bold text-sm text-amber-300">
                          Royal Chronicle & Historical Context
                        </div>
                        <p className="text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                          {place.history}
                        </p>
                      </div>
                    )}

                    {/* Recommended Nearby Dining */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5 text-amber-400" />
                        <span>Nearby Dining:</span>
                      </span>
                      {place.nearbyFood.map((food, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2.5 py-1 rounded-md border border-slate-700 bg-slate-800 text-slate-100 text-xs font-semibold"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Transit Segment to Next Step */}
                {nextStep && nextStep.place && (
                  <div className="p-3.5 px-5 border-t border-slate-800 bg-slate-950 text-xs flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-slate-100">
                      <Car className="w-4 h-4 text-amber-400" />
                      <span>
                        Transit to Step {nextStep.stepNumber}:{' '}
                        <strong className="text-amber-300">{nextStep.place.name.split('(')[0]}</strong>
                      </span>
                    </div>
                    <div className="text-slate-300 font-medium">
                      Estimated travel: ~15 to 25 mins by auto-rickshaw or taxi
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
