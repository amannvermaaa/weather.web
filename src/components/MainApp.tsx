'use client';
import { useState, useEffect } from 'react';
import Scene from '@/components/3d/Scene';
import WeatherDashboard from '@/components/ui/WeatherDashboard';
import dynamic from 'next/dynamic';
import { City } from '@/types/weather';
import Loader from '@/components/ui/Loader';
import CustomCursor from '@/components/ui/CustomCursor';
import SmoothScroll from '@/components/ui/SmoothScroll';
import { useWeather } from '@/context/WeatherContext';

const MapSection = dynamic(() => import('@/components/ui/MapSection'), { ssr: false });

function MainContent() {
  const { city, setCity } = useWeather();

  useEffect(() => {
    if (!city) {
      setCity({
        id: 1,
        name: 'Neo Tokyo',
        latitude: 35.6895,
        longitude: 139.6917,
        country: 'Japan'
      });
    }
  }, [city, setCity]);

  if (!city) return null;


  return (
    <SmoothScroll>
      <CustomCursor />
      <Loader />
      <main className="relative w-full min-h-[200vh] bg-[#020617] selection:bg-cyan-500/30">
        <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
          <Scene />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] z-0" />
        </div>
        
        <div className="relative z-10 w-full flex flex-col justify-end pt-52 md:pt-[240px] pb-24">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8 flex justify-end">
            <WeatherDashboard city={city} setCity={setCity} />
          </div>
        </div>

        <div className="relative z-10 w-full bg-slate-950/80 backdrop-blur-3xl border-t border-white/10 pb-24">
          <MapSection city={city} setCity={setCity} />
        </div>
      </main>
    </SmoothScroll>
  );
}

export default function MainApp() {
  return <MainContent />;
}
