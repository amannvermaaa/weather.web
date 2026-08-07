import { MapPin, Star, Clock } from 'lucide-react';

export interface Attraction {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  distance: string;
  lat: number;
  lon: number;
  category: string;
  openingHours: string;
}

export default function AttractionCard({ attraction }: { attraction: Attraction }) {
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${attraction.lat},${attraction.lon}`;

  return (
    <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group flex flex-col h-full relative overflow-hidden shadow-xl">
      <div className="w-full h-48 bg-slate-800 rounded-2xl mb-6 overflow-hidden relative shrink-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        
        {/* Distance Badge */}
        <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400" />
          {attraction.distance}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 z-20 bg-cyan-600/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10">
          {attraction.category}
        </div>

        {/* Real Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={attraction.imageUrl} 
          alt={attraction.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop';
          }}
        />
      </div>
      
      <div className="flex-grow flex flex-col">
        <h4 className="text-white font-bold text-xl mb-2 leading-tight group-hover:text-cyan-400 transition-colors">{attraction.name}</h4>
        <div className="flex items-center gap-3 text-sm mb-3 text-slate-300">
          <span className="flex items-center text-yellow-400 font-semibold bg-yellow-400/10 px-2 py-0.5 rounded-md">
            {attraction.rating.toFixed(1)} <Star className="w-3 h-3 ml-1 fill-yellow-400" />
          </span>
          <span className="flex items-center gap-1 text-slate-400 text-xs border border-white/5 bg-black/20 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" /> {attraction.openingHours}
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{attraction.description}</p>
      </div>

      <div className="pt-4 border-t border-white/10 mt-auto">
        <a 
          href={mapLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-cyan-500 hover:text-white border border-white/10 py-3 rounded-xl transition-colors font-semibold text-cyan-400 text-sm"
        >
          View on Google Maps
        </a>
      </div>
    </div>
  );
}
