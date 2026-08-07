'use client';
import { AuthProvider } from '@/context/AuthContext';
import { WeatherProvider, useWeather } from '@/context/WeatherContext';
import TopNav from '@/components/ui/TopNav';
import AIAssistant from '@/components/ui/AIAssistant';
import EmergencyBanner from '@/components/ui/EmergencyBanner';

import { usePathname } from 'next/navigation';

function AppContent({ children }: { children: React.ReactNode }) {
  const { weather } = useWeather();
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <TopNav />
      <EmergencyBanner weatherData={weather} />
      {children}
      <AIAssistant weatherContext={weather} />
    </>
  );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WeatherProvider>
        <AppContent children={children} />
      </WeatherProvider>
    </AuthProvider>
  );
}
