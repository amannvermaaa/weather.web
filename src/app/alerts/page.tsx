'use client';
import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, MapPin, Loader2, Info, Wind, ThermometerSun, CloudRain, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { City, WeatherData } from '@/types/weather';
import { useWeather } from '@/context/WeatherContext';
import SearchBar from '@/components/ui/SearchBar';

export default function AlertsPage() {
  const { city, setCity, weather, loading } = useWeather();

  const getAlerts = () => {
    if (!weather) return [];
    const alerts = [];
    const current = weather.current;

    if (current.windSpeed > 40) {
      alerts.push({ type: 'danger', icon: Wind, title: "High Wind Warning", message: `Hurricane-force winds of ${current.windSpeed} km/h detected. Secure loose objects and stay indoors.`, time: 'LIVE' });
    } else if (current.windSpeed > 25) {
      alerts.push({ type: 'warning', icon: Wind, title: "Breezy Conditions", message: `Moderate winds of ${current.windSpeed} km/h. Exercise caution if driving high-profile vehicles.`, time: 'LIVE' });
    }

    if (current.temperature > 40) {
      alerts.push({ type: 'danger', icon: ThermometerSun, title: "Extreme Heatwave", message: `Critical temperature of ${Math.round(current.temperature)}°C. Avoid outdoor activities and stay hydrated.`, time: 'LIVE' });
    } else if (current.temperature > 35) {
      alerts.push({ type: 'warning', icon: ThermometerSun, title: "Heat Advisory", message: `High temperature of ${Math.round(current.temperature)}°C. Drink plenty of water.`, time: 'LIVE' });
    }

    if (current.rain > 10) {
      alerts.push({ type: 'danger', icon: CloudRain, title: "Flash Flood Warning", message: `Heavy rainfall detected (${current.rain}mm). Immediate risk of localized flooding in low-lying areas.`, time: 'LIVE' });
    } else if (current.rain > 0) {
      alerts.push({ type: 'info', icon: CloudRain, title: "Precipitation Advisory", message: `Light rain detected. Roads may be slippery.`, time: 'LIVE' });
    }

    return alerts;
  };

  const alerts = getAlerts();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 max-w-6xl mx-auto relative">
      
      {/* Futuristic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center mb-16">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          className="relative"
        >
          {/* Radar Pulse Effect */}
          <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            <Activity className="w-10 h-10 text-red-500" />
          </div>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 tracking-tight mb-6">
          Global <span className="text-red-500">Alerts</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-light">
          Real-time meteorological warnings and critical weather advisories broadcasted directly to your dashboard.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-20 relative z-20">
        <SearchBar onSelectCity={setCity} onAutoDetect={() => {}} />
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center my-32">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-2 border-red-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-r-2 border-cyan-500 animate-[spin_1.5s_linear_infinite_reverse]" />
            <div className="absolute inset-4 rounded-full border-b-2 border-yellow-500 animate-[spin_2s_linear_infinite]" />
            <Activity className="absolute inset-0 m-auto w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="mt-6 text-slate-400 animate-pulse tracking-widest text-sm uppercase">Scanning Region...</p>
        </div>
      )}

      {weather && city && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <MapPin className="text-cyan-400 w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide">{city.name}</h2>
                <p className="text-sm text-slate-400">Current Surveillance Zone</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
              <div className={`w-2 h-2 rounded-full ${alerts.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                {alerts.length > 0 ? 'Active Threats' : 'All Clear'}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {alerts.length === 0 ? (
              <motion.div 
                key="no-alerts"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full bg-gradient-to-br from-green-500/5 to-emerald-900/10 backdrop-blur-3xl border border-green-500/20 rounded-[2rem] p-16 text-center shadow-[0_0_50px_rgba(34,197,94,0.05)]"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                  <ShieldCheck className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-white font-extrabold text-3xl mb-4 tracking-tight">Optimal Conditions</h3>
                <p className="text-slate-400 text-lg max-w-lg mx-auto">
                  Meteorological sensors detect no severe weather threats in {city.name}. The environment is stable and safe for all activities.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="alerts-list"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {alerts.map((alert, i) => {
                  const Icon = alert.icon;
                  const isDanger = alert.type === 'danger';
                  const isWarning = alert.type === 'warning';
                  
                  return (
                    <motion.div 
                      key={i}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, translateY: -5 }}
                      className={`relative overflow-hidden backdrop-blur-2xl border rounded-[2rem] p-8 flex flex-col gap-6 shadow-2xl transition-all duration-300 group cursor-default ${
                        isDanger ? 'bg-gradient-to-br from-red-950/40 to-red-900/10 border-red-500/30 hover:border-red-500/60' :
                        isWarning ? 'bg-gradient-to-br from-orange-950/40 to-yellow-900/10 border-orange-500/30 hover:border-orange-500/60' :
                        'bg-gradient-to-br from-blue-950/40 to-cyan-900/10 border-blue-500/30 hover:border-blue-500/60'
                      }`}
                    >
                      {/* Animated Glow Behind Card */}
                      <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] blur-md ${
                        isDanger ? 'bg-red-500/20' : isWarning ? 'bg-orange-500/20' : 'bg-blue-500/20'
                      }`} />

                      <div className="relative flex justify-between items-start">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                          isDanger ? 'bg-red-500/20 text-red-400 shadow-red-500/20' :
                          isWarning ? 'bg-orange-500/20 text-orange-400 shadow-orange-500/20' :
                          'bg-blue-500/20 text-blue-400 shadow-blue-500/20'
                        }`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        
                        <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border backdrop-blur-md ${
                          isDanger ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                          isWarning ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                          'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        }`}>
                          {isDanger && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                          <span className="text-xs font-bold tracking-widest uppercase">
                            {alert.time}
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <h3 className={`font-extrabold text-2xl mb-3 tracking-tight ${
                          isDanger ? 'text-red-100' :
                          isWarning ? 'text-orange-100' :
                          'text-blue-100'
                        }`}>{alert.title}</h3>
                        <p className={`text-lg leading-relaxed ${
                          isDanger ? 'text-red-200/80' :
                          isWarning ? 'text-orange-200/80' :
                          'text-blue-200/80'
                        }`}>{alert.message}</p>
                      </div>
                      
                      {/* Decorative Tech Lines */}
                      <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
