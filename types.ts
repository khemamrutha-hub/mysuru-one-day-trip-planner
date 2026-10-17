export type Category = 'heritage' | 'spiritual' | 'nature' | 'shopping' | 'art' | 'food';

export interface Place {
  id: string;
  name: string;
  kannadaName?: string;
  category: Category;
  categoryLabel: string;
  lat: number;
  lng: number;
  time: string;
  openTime: string;
  closeTime: string;
  duration: string;
  durationMinutes: number;
  ticket: {
    indian: number;
    foreign: number;
    camera: number;
    child?: number;
  };
  rating: number;
  tags: string[];
  desc: string;
  history: string;
  tips: string;
  photos: string[];
  photoLabels: string[];
  userPhotos?: string[];
  nearbyFood: string[];
  walkScore: number;
  closedDay?: string;
  googleMapsQuery?: string;
  custom?: boolean;
}

export interface Restaurant {
  name: string;
  cuisine: string;
  image: string;
  rating: number;
  price: string;
  priceNum: number;
  hours: string;
  specialty: string;
  nearby: string;
  lat: number;
  lng: number;
  address: string;
}

export interface HistoryArticle {
  id: string;
  name: string;
  era: string;
  ruler: string;
  year: string;
  content: string;
  keyFacts: string[];
  photos: string[];
  labels: string[];
}

export type ThemeId =
  | 'royal-gold'
  | 'palace-illumination'
  | 'chamundi-sunset'
  | 'brindavan-emerald'
  | 'sandalwood-ivory'
  | 'regal-amethyst';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  bgGradient: string;
  heroGradient: string;
  goldColor: string;
  accentColor: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  textMuted: string;
  badgeBg: string;
  wallpaperPattern: 'mandala' | 'palace-lights' | 'jaali' | 'floral' | 'subtle';
}

export interface TripPlanItem {
  placeId: string;
  startTime: string; // "08:30"
  durationMinutes: number;
  travelTimeMinutes: number;
  notes: string;
  isSelected: boolean;
  stepNumber: number;
}

export interface TripPreferences {
  date: string;
  startTime: string;
  groupType: 'solo' | 'couple' | 'family' | 'friends';
  groupCount: number;
  budgetPerPerson: number;
  transportMode: 'auto' | 'cab' | 'bus' | 'self-drive';
}
