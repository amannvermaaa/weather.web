'use client';
import { useState, useEffect } from 'react';
import { City } from '@/types/weather';
import AttractionCard, { Attraction } from './AttractionCard';
import { Map, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AttractionsList({ city }: { city: City }) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!city) return;

    const fetchAttractions = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/attractions?lat=${city.latitude}&lon=${city.longitude}`);
        if (!res.ok) throw new Error('Failed to fetch attractions');
        const data = await res.json();
        setAttractions(data.attractions || []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [city]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 h-[450px] flex flex-col relative overflow-hidden">
            {/* Shimmer animation overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
            <div className="w-full h-48 bg-slate-800/50 rounded-2xl mb-6 shrink-0" />
            <div className="h-6 bg-slate-800/50 rounded-md w-3/4 mb-4" />
            <div className="flex gap-2 mb-4">
              <div className="h-4 bg-slate-800/50 rounded-md w-16" />
              <div className="h-4 bg-slate-800/50 rounded-md w-24" />
            </div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-slate-800/50 rounded-md w-full" />
              <div className="h-4 bg-slate-800/50 rounded-md w-full" />
              <div className="h-4 bg-slate-800/50 rounded-md w-2/3" />
            </div>
            <div className="h-10 bg-slate-800/50 rounded-xl w-full mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (error || (!loading && attractions.length === 0)) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center max-w-2xl mx-auto"
      >
        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
          {error ? <AlertCircle className="w-10 h-10 text-cyan-400" /> : <Map className="w-10 h-10 text-cyan-400" />}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          {error ? 'Unable to load attractions' : 'No attractions found nearby'}
        </h3>
        <p className="text-slate-400 text-lg">
          {error 
            ? 'We encountered an error while searching for places. Please try searching again.' 
            : `We couldn't find any major landmarks near ${city.name} in our database. Try a different city!`}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {attractions.map((attraction, i) => (
        <motion.div 
          key={attraction.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="h-full"
        >
          <AttractionCard attraction={attraction} />
        </motion.div>
      ))}
    </div>
  );
}
