'use client';
import { WeatherData } from '@/types/weather';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeatherHistory({ data }: { data: WeatherData['history'] }) {
  if (!data || !data.time) return null;

  const chartData = data.time.map((t, i) => ({
    date: new Date(t).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
    high: Math.round(data.temperatureMax[i]),
    low: Math.round(data.temperatureMin[i])
  }));

  return (
    <div className="bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-3xl p-6 mb-6">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Past 7 Days History</h2>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="high" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorHigh)" name="High °C" />
            <Area type="monotone" dataKey="low" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorLow)" name="Low °C" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
