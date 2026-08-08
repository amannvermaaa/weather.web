'use client';
import { useState } from 'react';
import { Plane, MapPin, Star, Loader2, Info, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeather } from '@/context/WeatherContext';
import SearchBar from '@/components/ui/SearchBar';
import TravelScene from '@/components/3d/TravelScene';
import AttractionsList from '@/components/ui/AttractionsList';

export default function TravelPage() {
  const { city, setCity, weather, loading } = useWeather();

  const getTravelScore = () => {
    if (!weather) return { score: 0, label: '', color: '' };
    const { temperature, rain, windSpeed } = weather.current;
    
    if ((rain ?? 0) > 5 || windSpeed > 30 || temperature > 35 || temperature < 5) {
      return { score: 40, label: 'Not Ideal', color: 'text-red-400', bg: 'bg-red-400' };
    }
    if ((rain ?? 0) > 1 || windSpeed > 20 || temperature > 30 || temperature < 10) {
      return { score: 70, label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400' };
    }
    return { score: 95, label: 'Excellent', color: 'text-green-400', bg: 'bg-green-400' };
  };

  const getPackingSuggestions = () => {
    if (!weather) return [];
    const { temperature, rain } = weather.current;
    const suggestions = ['Comfortable walking shoes', 'Power bank', 'Travel documents'];
    
    if ((rain ?? 0) > 0) suggestions.push('Umbrella', 'Waterproof jacket');
    if (temperature > 25) suggestions.push('Sunscreen', 'Sunglasses', 'Light breathable clothing');
    if (temperature < 15) suggestions.push('Warm jacket', 'Scarf', 'Gloves');
    
    return suggestions;
  };

  const travelScore = getTravelScore();

  return (
    <TravelScene>
      <div className="w-full font-sans selection:bg-cyan-500/30">
        
        {/* Section 1: Hero */}
        <section className="min-h-[100vh] flex flex-col items-center justify-center px-4 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(34,211,238,0.3)]">
              <Plane className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight mb-6">
              AI Trip Planner
            </h1>
            <p className="text-slate-300 text-xl max-w-2xl mb-12">
              Embark on a journey. Scroll down to discover AI-powered insights, weather forecasting, and packing suggestions for your next destination.
            </p>
            
            <div className="w-full max-w-2xl mx-auto backdrop-blur-xl bg-white/5 p-4 rounded-3xl border border-white/10 shadow-2xl">
              <SearchBar onSelectCity={setCity} onAutoDetect={() => {}} />
            </div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-20 flex flex-col items-center text-cyan-500/70"
            >
              <span className="text-sm font-semibold tracking-widest uppercase mb-2">Scroll to explore</span>
              <ArrowDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </section>

        {loading && (
          <div className="min-h-screen flex justify-center items-center">
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
          </div>
        )}

        {weather && city && !loading && (
          <>
            {/* Section 2: Weather & Score Analysis */}
            <section className="min-h-[100vh] flex flex-col items-center justify-center px-4 md:px-8 max-w-7xl mx-auto py-20 relative z-10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-8">
                  <div>
                    <h2 className="text-5xl font-bold text-white mb-4 flex items-center gap-3">
                      <MapPin className="text-cyan-400 w-10 h-10" />
                      {city.name}
                    </h2>
                    <p className="text-slate-400 text-xl">{city.country}</p>
                  </div>
                  <div className="mt-8 md:mt-0 text-left md:text-right">
                    <p className="text-sm text-slate-400 uppercase tracking-widest mb-2 font-semibold">AI Travel Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-7xl font-bold ${travelScore.color}`}>{travelScore.score}</span>
                      <span className="text-3xl text-slate-500">/ 100</span>
                    </div>
                    <p className={`${travelScore.color} text-lg font-medium mt-2`}>{travelScore.label} Conditions</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-black/40 rounded-3xl p-6 border border-white/5 hover:bg-white/5 transition-colors">
                    <p className="text-cyan-500 text-sm uppercase font-bold tracking-wider mb-2">Temp</p>
                    <p className="text-4xl text-white font-light">{Math.round(weather.current.temperature)}°C</p>
                  </div>
                  <div className="bg-black/40 rounded-3xl p-6 border border-white/5 hover:bg-white/5 transition-colors">
                    <p className="text-cyan-500 text-sm uppercase font-bold tracking-wider mb-2">Rain Prob.</p>
                    <p className="text-4xl text-white font-light">{Math.max(...weather.hourly.precipitationProbability.slice(0, 24))}%</p>
                  </div>
                  <div className="bg-black/40 rounded-3xl p-6 border border-white/5 hover:bg-white/5 transition-colors">
                    <p className="text-cyan-500 text-sm uppercase font-bold tracking-wider mb-2">UV Index</p>
                    <p className="text-4xl text-white font-light">{weather.daily.uvIndex[0]}</p>
                  </div>
                  <div className="bg-black/40 rounded-3xl p-6 border border-white/5 hover:bg-white/5 transition-colors">
                    <p className="text-cyan-500 text-sm uppercase font-bold tracking-wider mb-2">Wind</p>
                    <p className="text-4xl text-white font-light">{weather.current.windSpeed} <span className="text-xl">km/h</span></p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 3: AI Packing List */}
            <section className="min-h-[100vh] flex flex-col items-center justify-center px-4 md:px-8 max-w-7xl mx-auto py-20 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-3xl border border-cyan-500/20 rounded-[3rem] p-8 md:p-16 relative overflow-hidden"
              >
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full" />
                
                <h3 className="text-4xl font-bold text-white mb-10 flex items-center gap-4 relative z-10">
                  <Info className="text-cyan-400 w-10 h-10" /> 
                  Smart Packing List
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {getPackingSuggestions().map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 text-slate-200 text-lg bg-black/40 p-6 rounded-2xl border border-white/10 hover:border-cyan-500/50 transition-all hover:-translate-y-1"
                    >
                      <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Section 4: Top Attractions */}
            <section className="min-h-[100vh] flex flex-col items-center justify-center px-4 md:px-8 max-w-7xl mx-auto py-20 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full"
              >
                <h3 className="text-4xl font-bold text-white mb-12 flex items-center gap-4 justify-center">
                  <Star className="text-yellow-400 w-10 h-10" /> 
                  Recommended Attractions in {city.name}
                </h3>
                
                <AttractionsList city={city} />
              </motion.div>
            </section>
          </>
        )}
      </div>
    </TravelScene>
  );
}
