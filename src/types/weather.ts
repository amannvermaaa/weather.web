export interface City {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    pressure: number;
    cloudCover: number;
    visibility?: number; // Open-Meteo current doesn't always have visibility directly, we might map it or omit it
    weatherCode: number;
    isDay: number;
    rain?: number;
  };
  hourly: {
    time: string[];
    temperature: number[];
    weatherCode: number[];
    precipitationProbability: number[];
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperatureMax: number[];
    temperatureMin: number[];
    sunrise: string[];
    sunset: string[];
    uvIndex: number[];
    moonPhase: number[];
  };
  history: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
  };
}
