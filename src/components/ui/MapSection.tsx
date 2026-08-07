'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { City } from '@/types/weather';
import { Layers } from 'lucide-react';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  city: City;
  setCity: (city: City) => void;
}

function MapEvents({ setCity }: { setCity: (city: City) => void }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      // Reverse geocoding to get city name
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        
        let name = 'Selected Location';
        if (data.address) {
          name = data.address.city || data.address.town || data.address.village || data.address.county || name;
        }
        
        setCity({
          id: Date.now(),
          name: name,
          latitude: lat,
          longitude: lng,
          country: data.address?.country || 'Unknown'
        });
      } catch (error) {
        // Fallback if reverse geocoding fails
        setCity({
          id: Date.now(),
          name: `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`,
          latitude: lat,
          longitude: lng,
          country: 'Selected Location'
        });
      }
    },
  });
  return null;
}

export default function MapSection({ city, setCity }: Props) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 relative z-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
          <Layers className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Interactive Map</h2>
          <p className="text-slate-400">Click anywhere to explore weather conditions.</p>
        </div>
      </div>
      
      <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
        <MapContainer 
          center={[city.latitude, city.longitude]} 
          zoom={5} 
          scrollWheelZoom={false} 
          className="w-full h-full"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap Dark">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
            </LayersControl.BaseLayer>
            
            <LayersControl.BaseLayer name="OpenStreetMap Standard">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay name="Precipitation (Rain)">
              <TileLayer url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=DEMO_KEY" />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Temperature">
              <TileLayer url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=DEMO_KEY" />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Clouds">
              <TileLayer url="https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=DEMO_KEY" />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Wind Speed">
              <TileLayer url="https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=DEMO_KEY" />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Snow">
              <TileLayer url="https://tile.openweathermap.org/map/snow_new/{z}/{x}/{y}.png?appid=DEMO_KEY" />
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Storms & Lightning">
              <TileLayer url="https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=DEMO_KEY" />
            </LayersControl.Overlay>
          </LayersControl>
          
          <MapEvents setCity={setCity} />
          
          <Marker position={[city.latitude, city.longitude]} />
        </MapContainer>
        
        <div className="absolute bottom-6 left-6 z-[1000] bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 pointer-events-none">
          <p className="text-sm font-semibold text-white mb-1">Weather Layers</p>
          <p className="text-xs text-slate-400 max-w-[200px]">
            API key required for real-time precipitation, temperature, and cloud overlays.
          </p>
        </div>
      </div>
    </div>
  );
}
