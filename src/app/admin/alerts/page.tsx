'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Trash2, Send } from 'lucide-react';

export default function AlertsAdminPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchAlerts();
  }, [token]);

  const fetchAlerts = () => {
    setLoading(true);
    fetch('http://localhost:5000/admin/alerts', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setAlerts(data);
      setLoading(false);
    })
    .catch(console.error);
  };

  const createAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/admin/alerts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title, message, severity, active: true })
      });
      if (res.ok) {
        const newAlert = await res.json();
        setAlerts([newAlert, ...alerts]);
        setTitle('');
        setMessage('');
        setSeverity('info');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/alerts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setAlerts(alerts.filter(a => a._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Alert Form */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white mb-4">Broadcast New Alert</h2>
        <form onSubmit={createAlert} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Title</label>
              <input 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase text-slate-400 mb-1">Severity</label>
              <select 
                value={severity} 
                onChange={e => setSeverity(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="info">Info (Blue)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="danger">Danger (Red)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase text-slate-400 mb-1">Message</label>
            <textarea 
              required 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 min-h-[100px]" 
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Broadcast Alert
            </button>
          </div>
        </form>
      </div>

      {/* Alert List */}
      <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Active Broadcasts</h2>
        </div>
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /></div>
        ) : (
          <div className="divide-y divide-white/5">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No active broadcasted alerts.</div>
            ) : alerts.map(alert => (
              <div key={alert._id} className="p-4 flex items-start justify-between hover:bg-white/5 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                      alert.severity === 'danger' ? 'bg-red-500/20 text-red-400' :
                      alert.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {alert.severity}
                    </span>
                    <h3 className="text-white font-medium">{alert.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Broadcasted on {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => deleteAlert(alert._id)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
