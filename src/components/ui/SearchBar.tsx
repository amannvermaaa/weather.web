'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchCities } from '@/lib/api';
import { City } from '@/types/weather';

interface SearchBarProps {
  onSelectCity: (city: City) => void;
  onAutoDetect: () => void;
}

export default function SearchBar({ onSelectCity, onAutoDetect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      const cities = await searchCities(query);
      setResults(cities);
      setIsLoading(false);
      setIsOpen(true);
    };

    const debounce = setTimeout(() => {
      fetchCities();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative z-50 w-full mb-6">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-cyan-400/70" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search city..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-2 pl-12 pr-12 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]"
        />
        {isLoading ? (
          <Loader2 className="absolute right-12 w-5 h-5 text-cyan-400 animate-spin" />
        ) : (
          <button 
            onClick={onAutoDetect}
            className="absolute right-2 p-2 hover:bg-white/10 rounded-xl transition-colors group"
            title="Auto-detect location"
          >
            <MapPin className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl"
          >
            {results.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city);
                  setIsOpen(false);
                  setQuery('');
                }}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
              >
                <MapPin className="w-4 h-4 text-cyan-400/50" />
                <div>
                  <div className="text-white font-medium">{city.name}</div>
                  <div className="text-slate-400 text-xs">{city.admin1 ? `${city.admin1}, ` : ''}{city.country}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
