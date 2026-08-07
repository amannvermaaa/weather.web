'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { City, WeatherData } from '@/types/weather';
import { getWeatherData } from '@/lib/api';

interface WeatherContextType {
  city: City | null;
  setCity: (city: City) => void;
  weather: WeatherData | null;
  loading: boolean;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city) {
      setLoading(true);
      getWeatherData(city.latitude, city.longitude).then(data => {
        setWeather(data);
        setLoading(false);
      });
    }
  }, [city]);

  return (
    <WeatherContext.Provider value={{ city, setCity, weather, loading }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
