import { City, WeatherData } from '../types/weather';

export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

export async function getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,relative_humidity_2m,weather_code,precipitation_probability',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max',
      past_days: '7',
      forecast_days: '16',
      timezone: 'auto'
    });
    
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
    const data = await res.json();
    
    // Determine the index for "today" to slice hourly and daily data properly
    const todayIndex = data.daily.time.findIndex((t: string) => t === new Date().toISOString().split('T')[0]) || 7;
    const currentHourIndex = todayIndex * 24 + new Date().getHours();
    
    return {
      current: {
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        pressure: data.current.pressure_msl,
        cloudCover: data.current.cloud_cover,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day,
      },
      hourly: {
        time: data.hourly.time.slice(currentHourIndex, currentHourIndex + 24),
        temperature: data.hourly.temperature_2m.slice(currentHourIndex, currentHourIndex + 24),
        weatherCode: data.hourly.weather_code.slice(currentHourIndex, currentHourIndex + 24),
        precipitationProbability: data.hourly.precipitation_probability.slice(currentHourIndex, currentHourIndex + 24),
      },
      daily: {
        time: data.daily.time.slice(todayIndex, todayIndex + 16),
        weatherCode: data.daily.weather_code.slice(todayIndex, todayIndex + 16),
        temperatureMax: data.daily.temperature_2m_max.slice(todayIndex, todayIndex + 16),
        temperatureMin: data.daily.temperature_2m_min.slice(todayIndex, todayIndex + 16),
        sunrise: data.daily.sunrise.slice(todayIndex, todayIndex + 16),
        sunset: data.daily.sunset.slice(todayIndex, todayIndex + 16),
        uvIndex: data.daily.uv_index_max.slice(todayIndex, todayIndex + 16),
        moonPhase: Array.from({length: 16}, () => Math.random() * 100), // mocked moon phase
      },
      history: {
        time: data.daily.time.slice(0, todayIndex),
        temperatureMax: data.daily.temperature_2m_max.slice(0, todayIndex),
        temperatureMin: data.daily.temperature_2m_min.slice(0, todayIndex),
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

export function getWeatherIconDetails(code: number, isDay: boolean = true) {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  const codes: Record<number, { label: string, icon: string }> = {
    0: { label: 'Clear sky', icon: isDay ? 'Sun' : 'Moon' },
    1: { label: 'Mainly clear', icon: isDay ? 'Sun' : 'Moon' },
    2: { label: 'Partly cloudy', icon: isDay ? 'CloudSun' : 'CloudMoon' },
    3: { label: 'Overcast', icon: 'Cloud' },
    45: { label: 'Fog', icon: 'CloudFog' },
    48: { label: 'Depositing rime fog', icon: 'CloudFog' },
    51: { label: 'Light Drizzle', icon: 'CloudDrizzle' },
    53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle' },
    55: { label: 'Dense Drizzle', icon: 'CloudDrizzle' },
    56: { label: 'Light Freezing Drizzle', icon: 'CloudDrizzle' },
    57: { label: 'Dense Freezing Drizzle', icon: 'CloudDrizzle' },
    61: { label: 'Slight Rain', icon: 'CloudRain' },
    63: { label: 'Moderate Rain', icon: 'CloudRain' },
    65: { label: 'Heavy Rain', icon: 'CloudRain' },
    66: { label: 'Light Freezing Rain', icon: 'CloudRain' },
    67: { label: 'Heavy Freezing Rain', icon: 'CloudRain' },
    71: { label: 'Slight Snow fall', icon: 'CloudSnow' },
    73: { label: 'Moderate Snow fall', icon: 'CloudSnow' },
    75: { label: 'Heavy Snow fall', icon: 'CloudSnow' },
    77: { label: 'Snow grains', icon: 'CloudSnow' },
    80: { label: 'Slight Rain showers', icon: 'CloudRain' },
    81: { label: 'Moderate Rain showers', icon: 'CloudRain' },
    82: { label: 'Violent Rain showers', icon: 'CloudRain' },
    85: { label: 'Slight Snow showers', icon: 'CloudSnow' },
    86: { label: 'Heavy Snow showers', icon: 'CloudSnow' },
    95: { label: 'Thunderstorm', icon: 'CloudLightning' },
    96: { label: 'Thunderstorm with slight hail', icon: 'CloudLightning' },
    99: { label: 'Thunderstorm with heavy hail', icon: 'CloudLightning' },
  };

  return codes[code] || { label: 'Unknown', icon: 'Cloud' };
}
