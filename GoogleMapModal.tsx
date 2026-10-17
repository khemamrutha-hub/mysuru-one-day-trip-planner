import React from 'react';
import { X, ExternalLink, Navigation, MapPin } from 'lucide-react';
import { Place, ThemeConfig } from '../types';

interface GoogleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: Place | null;
  currentTheme: ThemeConfig;
}

export const GoogleMapModal: React.FC<GoogleMapModalProps> = ({
  isOpen,
  onClose,
  place,
}) => {
  if (!isOpen || !place) return null;

  const searchQuery = place.googleMapsQuery || encodeURIComponent(`${place.name} Mysuru Karnataka`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${searchQuery}&travelmode=driving`;
  const embedUrl = `https://maps.google.com/maps?q=${place.lat},${place.lng}&hl=en&z=15&output=embed`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-2xl border border-amber-400 bg-slate-900 text-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-amber-400/50 bg-amber-500/20 text-amber-300 font-serif font-bold text-sm shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">{place.name}</h3>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400 text-amber-300">
                  Live Access
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Coordinates: {place.lat.toFixed(4)}° N, {place.lng.toFixed(4)}° E
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition shadow"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Map Frame */}
        <div className="flex-1 w-full relative bg-black">
          <iframe
            title={`Google Map for ${place.name}`}
            src={embedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* Footer info & Direct links */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-slate-200 font-medium">
            <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="line-clamp-1">{place.desc}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-amber-300 font-bold"
            >
              <span>Open in Google Maps App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200 font-semibold">Walk Score: {place.walkScore}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
