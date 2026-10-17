import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ExternalLink, Navigation, Compass, Car } from 'lucide-react';
import { Place, ThemeConfig, TripPlanItem, Restaurant } from '../types';

interface MapSectionProps {
  places: Place[];
  planItems: TripPlanItem[];
  restaurants: Restaurant[];
  currentTheme: ThemeConfig;
  onOpenGoogleMap: (place: Place) => void;
  onSelectPlace: (place: Place) => void;
}

export const MapSection: React.FC<MapSectionProps> = ({
  places,
  planItems,
  restaurants,
  onOpenGoogleMap,
  onSelectPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [showRestaurants] = useState<boolean>(true);

  // Selected places in route order
  const selectedPlanItems = planItems.filter((p) => p.isSelected);
  const routePlaces = selectedPlanItems
    .map((item) => places.find((p) => p.id === item.placeId))
    .filter((p): p is Place => !!p);

  // Multi-stop Google Maps URL
  const googleMapsRouteUrl =
    routePlaces.length > 0
      ? `https://www.google.com/maps/dir/${routePlaces
          .map((p) => encodeURIComponent(p.name + ' Mysore'))
          .join('/')}`
      : `https://www.google.com/maps/search/?api=1&query=Mysore+Palace`;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [12.3051, 76.6551],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const markers: L.Marker[] = [];
    const routeCoords: [number, number][] = [];

    // Add place markers with clean step numbers
    routePlaces.forEach((place, index) => {
      const customIcon = L.divIcon({
        html: `
          <div style="
            background: #F59E0B;
            color: #0F172A;
            border-radius: 50%;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Playfair Display', serif;
            font-weight: 900;
            font-size: 16px;
            border: 3px solid #FFFFFF;
            box-shadow: 0 4px 14px rgba(0,0,0,0.6);
            cursor: pointer;
          ">
            ${index + 1}
          </div>
        `,
        className: 'clean-step-marker',
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'DM Sans', sans-serif; padding: 4px; max-width: 240px; color: #0F172A;">
          <div style="font-size: 11px; font-weight: 800; color: #D97706; text-transform: uppercase;">
            Step ${index + 1} • ${place.categoryLabel}
          </div>
          <div style="font-family: 'Playfair Display', serif; font-size: 16px; font-weight: bold; margin: 2px 0 6px 0; color: #0F172A;">
            ${place.name}
          </div>
          <div style="font-size: 12px; color: #334155; line-height: 1.4; margin-bottom: 8px;">
            ${place.desc.slice(0, 95)}...
          </div>
          <div style="display: flex; gap: 8px; font-size: 11px;">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Mysore')}" target="_blank" rel="noopener noreferrer" style="
              background: #F59E0B;
              color: #0F172A;
              padding: 4px 10px;
              border-radius: 6px;
              font-weight: bold;
              text-decoration: none;
              display: inline-block;
            ">Google Maps</a>
          </div>
        </div>
      `);

      markers.push(marker);
      routeCoords.push([place.lat, place.lng]);
    });

    // Draw connecting route line
    if (routeCoords.length > 1) {
      L.polyline(routeCoords, {
        color: '#F59E0B',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);
    }

    // Add dining markers
    if (showRestaurants) {
      restaurants.forEach((r) => {
        const foodIcon = L.divIcon({
          html: `
            <div style="
              background: #0284C7;
              color: #FFFFFF;
              border-radius: 8px;
              padding: 3px 7px;
              display: flex;
              align-items: center;
              gap: 3px;
              font-size: 11px;
              font-weight: 800;
              border: 2px solid #FFFFFF;
              box-shadow: 0 3px 10px rgba(0,0,0,0.5);
              cursor: pointer;
            ">
              🍽️ ${r.name.split(' ')[0]}
            </div>
          `,
          className: 'food-marker',
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });

        const foodMarker = L.marker([r.lat, r.lng], { icon: foodIcon }).addTo(map);
        foodMarker.bindPopup(`
          <div style="font-family: 'DM Sans', sans-serif; padding: 4px; max-width: 220px; color: #0F172A;">
            <div style="font-size: 11px; font-weight: bold; color: #0284C7; text-transform: uppercase;">
              ${r.cuisine}
            </div>
            <div style="font-size: 14px; font-weight: bold; margin: 2px 0 4px 0; color: #0F172A;">
              ${r.name}
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
              ${r.specialty}
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + ' Mysore')}" target="_blank" style="color: #0284C7; font-weight: bold; font-size: 11px;">Google Maps →</a>
          </div>
        `);
      });
    }

    // Auto-fit bounds
    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.15));
    }
  }, [routePlaces, showRestaurants, restaurants]);

  return (
    <div className="space-y-6">
      {/* Route Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-xl">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <span>Interactive Route Map & Navigation</span>
          </h2>
          <p className="text-sm text-slate-200 mt-1 font-medium">
            Follow the numbered sequential steps from morning to evening. Click any pin for Google Maps navigation.
          </p>
        </div>

        <a
          href={googleMapsRouteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow-lg"
        >
          <Navigation className="w-4 h-4" />
          <span>Open Full Route in Google Maps</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>

      {/* Map */}
      <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-20 p-3.5 rounded-xl border border-amber-500/30 bg-slate-900/95 text-xs space-y-1.5 shadow-xl hidden sm:block">
          <div className="font-bold uppercase tracking-wider text-[11px] text-amber-300 mb-1">
            Tour Legend
          </div>
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-black flex items-center justify-center">
              1
            </span>
            <span>Sequential Itinerary Stops</span>
          </div>
          <div className="flex items-center gap-2 text-white font-medium">
            <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white text-[10px] font-bold">
              Food
            </span>
            <span>Recommended Dining Stops</span>
          </div>
        </div>
      </div>

      {/* Step by step transit legs */}
      <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-slate-900 space-y-4 shadow-xl">
        <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
          <Car className="w-4 h-4 text-amber-400" />
          <span>Transit Segments & Distances</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {routePlaces.map((place, idx) => {
            const nextPlace = routePlaces[idx + 1];
            return (
              <div
                key={place.id}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-5 h-5 rounded-full text-xs font-black flex items-center justify-center bg-amber-400 text-slate-950">
                      {idx + 1}
                    </span>
                    <span className="text-sm">{place.name.split('(')[0]}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      place.name + ' Mysore'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1"
                  >
                    <span>Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {nextPlace ? (
                  <div className="mt-3 pt-2 border-t border-slate-800 text-xs text-slate-200 flex items-center justify-between font-medium">
                    <span>Next: {nextPlace.name.split('(')[0]}</span>
                    <span className="text-amber-300 font-bold">~20 mins transit</span>
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-slate-800 text-xs text-emerald-400 font-bold">
                    ✓ Final stop of the day
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
