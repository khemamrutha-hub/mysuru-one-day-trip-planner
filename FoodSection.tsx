import React from 'react';
import { ExternalLink, Star, MapPin, Clock, Utensils, Award } from 'lucide-react';
import { FAMOUS_RESTAURANTS } from '../data/mysoreData';
import { ThemeConfig } from '../types';

interface FoodSectionProps {
  currentTheme: ThemeConfig;
}

export const FoodSection: React.FC<FoodSectionProps> = ({ currentTheme }) => {
  const ICONIC_DELICACIES = [
    {
      name: 'Mysore Masala Dosa (Mylari Style)',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgCpd6LlKRuvs-XhXl5Qs7EIO-HZzqHlSqJpr2l1yRV-FMTnAihvXcjTk&s=10',
      desc: 'Cloud-soft golden crepe smeared with secret spiced red onion-garlic chutney and dollops of fresh handcrafted white butter.',
      where: 'Original Mylari Hotel (Agrahara) & Vinayaka Mylari',
      origin: 'Originated over 80 years ago in the royal agraharas of Mysuru.',
    },
    {
      name: 'Authentic Royal Mysore Pak',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSH2p7fWh4B_00rMO35TEVNKd5V5iV332oL4WfqogL8LnY3jGhb1yCAosk&s=10',
      desc: 'Melt-in-mouth royal confection crafted from roasted gram flour (besan), pure desi ghee, and sugar syrup.',
      where: 'Guru Sweet Mart (Sayyaji Rao Rd) & Mahalakshmi Sweets',
      origin: 'Invented in 1935 by palace royal chef Kakasura Madappa for Maharaja Krishnaraja Wadiyar IV.',
    },
    {
      name: 'Unlimited Royal Karnataka Thali',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5OmSj773Yw4IfmjDKBRX59RUZAVuugSzlTw5R3jLds8nQqiaYe6D5Ig8&s=10',
      desc: 'Steaming sona masoori rice served on a fresh plantain leaf with ghee gunpowder dal, royal rasam, vegetable palya, and curd chili.',
      where: 'Hotel RRR & Dasprakash Heritage',
      origin: 'Traditional banquet meals served in the royal capital.',
    },
    {
      name: 'Traditional South Indian Filter Kaapi',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKY839HI2OZEGGjdZfyV646sTeNZp5sWR7kV5-APWGSA&s=10',
      desc: 'Strong chicory-blended coffee poured back and forth from height into a traditional brass davarah-tumbler.',
      where: 'Mylari Hotel & Brahmin Coffee Bars',
      origin: 'Freshly roasted plantation coffee from nearby Coorg and Chikmagalur.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="p-5 sm:p-6 rounded-2xl border border-amber-500/30 bg-slate-900 shadow-xl">
        <h2 className="font-serif font-bold text-xl sm:text-2xl text-white">
          Mysuru Culinary Heritage & Dining Guide
        </h2>
        <p className="text-sm text-slate-200 mt-1 font-medium">
          Historical dishes born in the royal kitchen alongside multi-generational agrahara restaurants
        </p>
      </div>

      {/* Must-Try Foods Grid */}
      <div>
        <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Signature Mysuru Delicacies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ICONIC_DELICACIES.map((food, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-amber-500/30 bg-slate-900 flex flex-col sm:flex-row gap-4 transition hover:border-amber-400/60 shadow-xl"
            >
              <div className="w-full sm:w-36 h-28 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700 bg-slate-950">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5 flex-1">
                <h4 className="font-serif font-bold text-base text-white">{food.name}</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">{food.desc}</p>
                <div className="pt-1 text-xs space-y-1">
                  <div>
                    <strong className="text-amber-300 font-bold">Where to taste:</strong>{' '}
                    <span className="text-slate-100 font-medium">{food.where}</span>
                  </div>
                  <div className="text-slate-300 italic text-[11px]">{food.origin}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Famous Restaurants List with Real Photos & Google Maps Directions */}
      <div>
        <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-2 text-white">
          <Utensils className="w-5 h-5 text-amber-400" />
          <span>Recommended Heritage Restaurants</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAMOUS_RESTAURANTS.map((resto, idx) => {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${resto.name} Mysore`
            )}`;
            return (
              <div
                key={idx}
                className="rounded-xl border border-amber-500/30 bg-slate-900 overflow-hidden flex flex-col justify-between shadow-xl"
              >
                <div className="h-44 w-full overflow-hidden relative bg-black">
                  <img
                    src={resto.image}
                    alt={resto.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <span className="font-serif font-bold text-lg drop-shadow">
                      {resto.name}
                    </span>
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1 bg-black/80 px-2.5 py-1 rounded border border-amber-400/40">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      {resto.rating}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      {resto.cuisine}
                    </span>
                    <p className="text-xs text-slate-100 mt-1 leading-relaxed font-normal">
                      {resto.specialty}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs space-y-1.5 text-slate-200">
                      <div className="flex items-center gap-2 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{resto.hours}</span>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        <span>{resto.nearby}</span>
                      </div>
                      <div className="font-bold text-amber-300 text-xs pt-0.5">
                        {resto.price}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-end">
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-400/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition shadow-sm"
                    >
                      <span>Directions in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
