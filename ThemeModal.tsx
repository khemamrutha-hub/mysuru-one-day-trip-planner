import React from 'react';
import { X, Check, Sparkles } from 'lucide-react';
import { MYSORE_THEMES } from '../data/mysoreData';
import { ThemeConfig } from '../types';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeConfig) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 sm:p-8"
        style={{
          backgroundColor:
            currentTheme.id === 'sandalwood-ivory' ? '#FFFDF9' : '#170E04',
          borderColor: currentTheme.goldColor,
          color: currentTheme.id === 'sandalwood-ivory' ? '#2E1F0B' : '#FFF7E6',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between pb-4 border-b"
          style={{ borderColor: `${currentTheme.goldColor}33` }}
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              Mysore Heritage Styling & Themes
            </h2>
            <p className="text-xs sm:text-sm opacity-75 mt-0.5">
              Select an authentic royal Mysore visual atmosphere
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {MYSORE_THEMES.map((theme) => {
            const isSelected = currentTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme)}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-offset-2 scale-[1.02] shadow-xl'
                    : 'hover:scale-[1.01] hover:border-amber-400/60'
                }`}
                style={{
                  borderColor: isSelected
                    ? theme.goldColor
                    : 'rgba(255,255,255,0.15)',
                  backgroundColor:
                    theme.id === 'sandalwood-ivory' ? '#F7F0DF' : '#221405',
                }}
              >
                {/* Visual Preview Header Bar */}
                <div
                  className={`h-14 rounded-lg mb-3 bg-gradient-to-r ${theme.heroGradient} flex items-center justify-between px-3 border border-white/10`}
                >
                  <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    {theme.name.split(' ')[0]} Palette
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: theme.goldColor }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base">
                      {theme.name}
                    </h3>
                    <p className="text-xs opacity-75 mt-1 line-clamp-2">
                      {theme.subtitle}
                    </p>
                  </div>
                  {isSelected && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: theme.goldColor,
                        color:
                          theme.id === 'sandalwood-ivory' ? '#FFF' : '#1A1002',
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="pt-4 border-t flex items-center justify-between text-xs"
          style={{ borderColor: `${currentTheme.goldColor}33` }}
        >
          <span className="opacity-75">
            Applies instantaneously across backgrounds, borders, and route cards.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg font-bold uppercase tracking-wider shadow-md transition"
            style={{
              backgroundColor: currentTheme.goldColor,
              color:
                currentTheme.id === 'sandalwood-ivory' ? '#FFF' : '#1A1002',
            }}
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};
