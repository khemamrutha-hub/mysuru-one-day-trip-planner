import React from 'react';
import { HISTORY_ARTICLES } from '../data/mysoreData';
import { ThemeConfig } from '../types';
import { CheckCircle2, Landmark } from 'lucide-react';

interface HistorySectionProps {
  currentTheme: ThemeConfig;
}

export const HistorySection: React.FC<HistorySectionProps> = () => {
  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-xl">
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
          Historical Chronicles of the Kingdom of Mysuru
        </h2>
        <p className="text-sm text-slate-200 mt-1 font-medium">
          Six centuries of the Wadiyar dynasty, architectural masterpieces, and mythological origins
        </p>
      </div>

      {/* Historical Articles */}
      <div className="space-y-8">
        {HISTORY_ARTICLES.map((article) => (
          <div
            key={article.id}
            className="p-5 sm:p-7 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-2xl space-y-5"
          >
            {/* Header info */}
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/40 bg-amber-500/20 text-amber-300 mb-2.5 inline-block">
                  {article.era}
                </span>
                <h3 className="font-serif font-bold text-lg sm:text-2xl leading-snug text-white">
                  {article.name}
                </h3>
              </div>
              <div className="text-xs text-right sm:flex-shrink-0">
                <div className="font-semibold text-slate-200">{article.ruler}</div>
                <div className="font-bold text-amber-300 text-sm mt-0.5">
                  {article.year}
                </div>
              </div>
            </div>

            {/* Photos */}
            {article.photos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {article.photos.map((photo, pIdx) => (
                  <div
                    key={pIdx}
                    className="relative h-48 sm:h-56 rounded-xl overflow-hidden border border-slate-700 group bg-black"
                  >
                    <img
                      src={photo}
                      alt={article.labels[pIdx] || 'Historical image'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 text-xs font-bold text-white drop-shadow">
                      {article.labels[pIdx]}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content text */}
            <div className="text-sm text-slate-100 leading-relaxed whitespace-pre-line font-normal">
              {article.content}
            </div>

            {/* Key Facts */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-300">
                <Landmark className="w-4 h-4 text-amber-400" />
                <span>Key Architectural & Historical Facts</span>
              </h4>
              <ul className="space-y-2 text-xs">
                {article.keyFacts.map((fact, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
