'use client';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface HourlyChartProps {
  data: {
    time: string[];
    temperature: number[];
    precipitationProbability: number[];
  };
}

export default function HourlyChart({ data }: HourlyChartProps) {
  const chartData = data.time.map((t, i) => ({
    time: new Date(t).toLocaleTimeString([], { hour: 'numeric' }),
    temp: Math.round(data.temperature[i]),
    rain: data.precipitationProbability[i]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg p-3 shadow-xl">
          <p className="text-slate-900 dark:text-white font-medium mb-1">{label}</p>
          <p className="text-cyan-600 dark:text-cyan-400 font-bold">{payload[0].value}°C</p>
          <p className="text-blue-500 dark:text-blue-400 text-xs mt-1">Rain: {payload[0].payload.rain}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hourly Forecast</h3>
      </div>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              minTickGap={20}
            />
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#22d3ee" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorTemp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
