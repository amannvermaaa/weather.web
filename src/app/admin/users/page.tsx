'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Trash2 } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = () => {
    setLoading(true);
    fetch('http://localhost:5000/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setUsers(data);
      setLoading(false);
    })
    .catch(console.error);
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="w-8 h-8 animate-spin text-cyan-400" /></div>;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/20 border-b border-white/10">
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Cities</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
              <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm text-white">{u.email}</td>
                <td className="p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-400">{u.savedCities?.length || 0}</td>
                <td className="p-4 text-sm text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => deleteUser(u._id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
