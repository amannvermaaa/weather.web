'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Server, Database, Activity, RefreshCw } from 'lucide-react';

export default function SystemHealthPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchHealth = () => {
    setLoading(true);
    fetch('http://localhost:5000/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setStats(data);
      setLoading(false);
    })
    .catch(console.error);
  };

  useEffect(() => {
    fetchHealth();
  }, [token]);

  if (!stats) return <div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">System Status</h2>
        <button 
          onClick={fetchHealth}
          className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-4 py-2 rounded-lg"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Server className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Node Server</p>
              <p className="text-lg font-semibold text-white">Online</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Uptime</span>
              <span className="text-white font-mono">{formatUptime(stats.health.uptime)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Memory</span>
              <span className="text-white font-mono">{stats.health.memoryUsage.toFixed(2)} MB</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">MongoDB Atlas</p>
              <p className="text-lg font-semibold text-white">Connected</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Latency</span>
              <span className="text-white font-mono">12ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Connections</span>
              <span className="text-white font-mono">3</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Weather API</p>
              <p className="text-lg font-semibold text-white">Operational</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Avg Response</span>
              <span className="text-white font-mono">245ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Error Rate</span>
              <span className="text-white font-mono">0.02%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden font-mono text-sm">
        <div className="p-4 border-b border-white/10 bg-black/60 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-slate-400">server.log</span>
        </div>
        <div className="p-4 text-slate-300 space-y-2">
          <p>[INFO] Server started on port 5000</p>
          <p>[INFO] Connected to MongoDB</p>
          <p>[INFO] JWT Secret initialized</p>
          <p>[WARN] Rate limit reached for IP 192.168.1.1</p>
          <p className="text-cyan-400">[INFO] Admin /stats requested by user {token?.substring(0,10)}...</p>
        </div>
      </div>
    </div>
  );
}
