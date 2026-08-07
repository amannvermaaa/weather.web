'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, AlertTriangle, Activity, Settings, ArrowLeft, BookOpen } from 'lucide-react';

const sidebarLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/admin/blog', label: 'Blog', icon: BookOpen },
  { href: '/admin/health', label: 'System Health', icon: Activity },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not logged in, or not admin, redirect.
    // Since we don't have SSR auth check here, it's a simple client side redirect.
    // In a real app, middleware.ts would handle this securely.
    if (!token) {
      router.push('/');
    } else if (user?.role !== 'admin') {
      alert("Access Denied: Admin role required.");
      router.push('/');
    }
  }, [user, token, router]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Sidebar - hidden on mobile by default, real app would have a toggle */}
      <aside className="w-full md:w-64 border-b md:border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#09090b] flex flex-col shrink-0">
        <div className="h-16 flex items-center justify-between md:justify-start px-6 border-b border-slate-200 dark:border-white/10">
          <Link href="/" className="flex items-center gap-2 text-slate-900 dark:text-white font-bold hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Exit Admin
          </Link>
        </div>
        
        <div className="p-4 flex-1 hidden md:block">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</p>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                    isActive 
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium' 
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-white/10 hidden md:block">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <span className="text-cyan-600 dark:text-cyan-400 text-xs font-bold">{user.email.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.email}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
            <Settings className="w-4 h-4 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] md:h-screen overflow-hidden bg-slate-50 dark:bg-[#09090b]">
        <header className="h-16 border-b border-slate-200 dark:border-white/10 flex items-center px-4 md:px-8 shrink-0 bg-white/50 dark:bg-transparent backdrop-blur-md md:backdrop-blur-none z-10 sticky top-0">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {sidebarLinks.find(l => l.href === pathname)?.label || 'Admin Panel'}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
