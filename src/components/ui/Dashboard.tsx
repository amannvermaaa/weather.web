'use client';
import { Cloud, MapPin, Thermometer, Wind, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 w-[90%] md:w-80 lg:w-96 rounded-3xl p-6 backdrop-blur-2xl bg-slate-900/40 border border-white/10 shadow-[0_0_40px_rgba(34,211,238,0.1)] z-10 mx-auto left-0 md:left-auto md:mx-0"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-3xl pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-cyan-400" />
              Neo Tokyo
            </h2>
            <p className="text-cyan-300/70 text-xs mt-1 uppercase tracking-widest font-semibold">
              AI Weather Intelligence
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <Cloud className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center md:items-start">
          <div className="flex items-start">
            <span className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
              24
            </span>
            <span className="text-3xl text-cyan-400 mt-2 font-light">°C</span>
          </div>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Thermometer className="w-4 h-4" /> Feels like 26°C
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
            <Wind className="w-5 h-5 text-cyan-400 mb-2" />
            <p className="text-slate-400 text-sm">Wind Speed</p>
            <p className="text-white font-semibold">14 km/h</p>
          </div>
          <div className="bg-black/40 rounded-2xl p-4 border border-white/5 backdrop-blur-md">
            <Droplets className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-slate-400 text-sm">Humidity</p>
            <p className="text-white font-semibold">65%</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
            Full Forecast
          </button>
          <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold transition-all border border-white/10">
            View Map
          </button>
        </div>
      </div>
    </motion.div>
  );
}
