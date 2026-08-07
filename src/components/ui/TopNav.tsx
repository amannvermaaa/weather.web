'use client';
import { useState } from 'react';
import { User, LogOut, Navigation, Bell, Map, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';

export default function TopNav() {
  const { user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Navigation },
    { href: '/travel', label: 'Travel', icon: Map },
    { href: '/alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[80] p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-8 pointer-events-auto">
          <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              <span className="text-white text-lg">W</span>
            </div>
            WeatherWeb
          </Link>
          
          <nav className="hidden md:flex items-center gap-1 bg-white/60 dark:bg-black/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-full p-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">{user.email.split('@')[0]}</span>
              </div>
              <div className="w-[1px] h-4 bg-slate-300 dark:bg-white/20" />
              <button 
                onClick={logout} 
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-full p-1"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 backdrop-blur-md border border-transparent dark:border-white/10 px-6 py-2.5 rounded-full text-white font-medium transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
