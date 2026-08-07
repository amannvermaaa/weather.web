'use client';
import { useState, useEffect } from 'react';
import { Cloud, MapPin, Thermometer, Wind, Droplets, Sun, Sunrise, Sunset, Loader2, Star, StarOff } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { getWeatherData, getWeatherIconDetails } from '@/lib/api';
import { City, WeatherData } from '@/types/weather';
import MapSection from './MapSection';
import SearchBar from './SearchBar';
import HourlyChart from './HourlyChart';
import DailyForecast from './DailyForecast';
import WeatherHistory from './WeatherHistory';
import MagneticButton from './MagneticButton';
import { useAuth } from '@/context/AuthContext';
import { useWeather } from '@/context/WeatherContext';
import * as LucideIcons from 'lucide-react';

interface Props {
  city: City;
  setCity: (city: City) => void;
}

export default function WeatherDashboard({ city, setCity }: Props) {
  const { user, token, updateSavedCities } = useAuth();
  const { weather, loading } = useWeather();
  
  const favorites = user?.savedCities || [];

  const toggleFavorite = async () => {
    if (!user || !token) {
      alert("Please sign in to save favorite cities!");
      return;
    }

    const isFavorite = favorites.some(f => f.id === city.id);
    
    try {
      if (isFavorite) {
        const res = await fetch(`http://localhost:5000/cities/${city.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const updated = await res.json();
          updateSavedCities(updated);
        }
      } else {
        const res = await fetch(`http://localhost:5000/cities`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify(city)
        });
        if (res.ok) {
          const updated = await res.json();
          updateSavedCities(updated);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    }
  };

  useEffect(() => {
    if (!loading && weather) {
      gsap.fromTo(".stat-card", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [weather, loading]);

  const handleAutoDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCity({
          id: Date.now(),
          name: 'Current Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          country: 'Auto-detected'
        });
      });
    }
  };

  if (!weather && loading) {
    return (
      <div className="w-full md:max-w-4xl rounded-3xl p-6 backdrop-blur-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-2xl flex justify-center items-center h-[600px] pointer-events-auto">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!weather) return null;

  const currentIconDetails = getWeatherIconDetails(weather.current.weatherCode, weather.current.isDay === 1);
  const MainIcon = (LucideIcons as any)[currentIconDetails.icon] || LucideIcons.Cloud;
  const isFavorite = favorites.some(f => f.id === city.id);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full md:max-w-4xl rounded-3xl p-6 backdrop-blur-2xl bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 shadow-2xl relative pointer-events-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-3xl pointer-events-none" />
      
      <div className="relative">
        <SearchBar onSelectCity={setCity} onAutoDetect={handleAutoDetect} />
        
        {favorites.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-2">
            {favorites.map(fav => (
              <button 
                key={fav.id}
                onClick={() => setCity(fav)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-1"
              >
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {fav.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              {city.name}
              <button onClick={toggleFavorite} className="ml-1 hover:scale-110 transition-transform">
                {isFavorite ? (
                  <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                ) : (
                  <StarOff className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                )}
              </button>
            </h2>
            <p className="text-cyan-600/70 dark:text-cyan-300/70 text-xs mt-1 uppercase tracking-widest font-semibold">
              {currentIconDetails.label}
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] shrink-0"
          >
            <MainIcon className="w-7 h-7 text-white" />
          </motion.div>
        </div>

        <div className="mb-8 flex flex-col items-center md:items-start">
          <div className="flex items-start">
            <span className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-white/50">
              {Math.round(weather.current.temperature)}
            </span>
            <span className="text-3xl text-cyan-600 dark:text-cyan-400 mt-2 font-light">°C</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-2 flex items-center gap-2">
            <Thermometer className="w-4 h-4" /> Feels like {Math.round(weather.current.feelsLike)}°C
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
          <div className="stat-card bg-white/50 dark:bg-black/40 rounded-2xl p-4 border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <Wind className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1">Wind</p>
            <p className="text-slate-900 dark:text-white font-semibold">{weather.current.windSpeed} km/h</p>
          </div>
          <div className="stat-card bg-white/50 dark:bg-black/40 rounded-2xl p-4 border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1">Humidity</p>
            <p className="text-slate-900 dark:text-white font-semibold">{weather.current.humidity}%</p>
          </div>
          <div className="stat-card bg-white/50 dark:bg-black/40 rounded-2xl p-4 border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <Cloud className="w-5 h-5 text-slate-400 dark:text-slate-300 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1">Cloud Cover</p>
            <p className="text-slate-900 dark:text-white font-semibold">{weather.current.cloudCover}%</p>
          </div>
          <div className="stat-card bg-white/50 dark:bg-black/40 rounded-2xl p-4 border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <Sun className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1">UV Index</p>
            <p className="text-slate-900 dark:text-white font-semibold">{weather.daily.uvIndex[0] || 'N/A'}</p>
          </div>
          <div className="stat-card bg-white/50 dark:bg-black/40 rounded-2xl p-4 border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <Sunrise className="w-5 h-5 text-orange-500 dark:text-orange-400 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1">Sunrise</p>
            <p className="text-slate-900 dark:text-white font-semibold">{new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="stat-card bg-white/50 dark:bg-black/40 rounded-2xl p-4 border border-slate-200 dark:border-white/5 backdrop-blur-md">
            <Sunset className="w-5 h-5 text-pink-500 dark:text-pink-400 mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1">Sunset</p>
            <p className="text-slate-900 dark:text-white font-semibold">{new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HourlyChart data={weather.hourly} />
            <WeatherHistory data={weather.history} />
          </div>
          <div>
            <DailyForecast daily={weather.daily} />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <MagneticButton className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            Full Forecast
          </MagneticButton>
          <MagneticButton className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-all border border-white/10">
            View Details
          </MagneticButton>
        </div>
      </div>
    </motion.div>
  );
}
