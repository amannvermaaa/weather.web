'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getWeatherIconDetails } from '@/lib/api';
import * as LucideIcons from 'lucide-react';
import { WeatherData } from '@/types/weather';

export default function DailyForecast({ daily }: { daily: WeatherData['daily'] }) {
  const [showExtended, setShowExtended] = useState(false);

  const getMoonIcon = (phase: number) => {
    // phase is mocked 0-100
    if (phase < 12.5 || phase >= 87.5) return LucideIcons.Moon; // simplified
    return LucideIcons.Moon;
  };

  const daysToShow = showExtended ? 15 : 7;

  return (
    <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white px-2">Forecast</h3>
        <button 
          onClick={() => setShowExtended(!showExtended)}
          className="text-xs bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full hover:bg-cyan-500/20 transition-colors font-medium"
        >
          {showExtended ? 'Show 7 Days' : '15-Day Extended'}
        </button>
      </div>
      
      <div className="flex flex-col gap-3">
        {daily.time.slice(0, daysToShow).map((dateStr, i) => {
          const date = new Date(dateStr);
          const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
          const { icon, label } = getWeatherIconDetails(daily.weatherCode[i], true);
          const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Cloud;
          const MoonIcon = getMoonIcon(daily.moonPhase[i]);

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-black/20 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors border border-slate-200 dark:border-white/5"
            >
              <div className="w-16 text-slate-900 dark:text-white font-medium">{dayName}</div>
              
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 flex-1 justify-center">
                <IconComponent className="w-5 h-5" />
                <span className="text-xs text-slate-600 dark:text-slate-400 hidden lg:inline-block w-20 truncate">{label}</span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <MoonIcon className="w-4 h-4 opacity-50" />
              </div>

              <div className="flex items-center gap-3 w-24 justify-end">
                <span className="text-slate-900 dark:text-white font-semibold">{Math.round(daily.temperatureMax[i])}°</span>
                <span className="text-slate-500 font-medium">{Math.round(daily.temperatureMin[i])}°</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
