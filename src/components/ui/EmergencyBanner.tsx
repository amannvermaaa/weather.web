'use client';
import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  weatherData: any;
}

export default function EmergencyBanner({ weatherData }: Props) {
  const [alert, setAlert] = useState<{ title: string, message: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!weatherData) return;

    // Simulate alerts based on thresholds
    const current = weatherData.current;
    let newAlert = null;

    if (current.windSpeed > 40) {
      newAlert = { title: "High Wind Alert", message: `Winds of ${current.windSpeed} km/h detected. Secure loose objects.` };
    } else if (current.temperature > 40) {
      newAlert = { title: "Heatwave Warning", message: `Extreme temperature of ${Math.round(current.temperature)}°C. Stay hydrated and indoors.` };
    } else if (current.temperature < 0) {
      newAlert = { title: "Cold Wave Alert", message: `Sub-zero temperatures of ${Math.round(current.temperature)}°C. Risk of frostbite.` };
    } else if (current.rain > 10) {
      newAlert = { title: "Heavy Rain Warning", message: `Heavy rainfall detected. Risk of localized flooding.` };
    }

    if (newAlert) {
      setAlert(newAlert);
      setIsVisible(true);

      // Trigger browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(newAlert.title, { body: newAlert.message });
      } else if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification(newAlert!.title, { body: newAlert!.message });
          }
        });
      }
    } else {
      setIsVisible(false);
    }
  }, [weatherData]);

  return (
    <AnimatePresence>
      {isVisible && alert && (
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-3xl pointer-events-auto"
        >
          <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 flex items-start gap-4 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-400 font-bold uppercase tracking-wider text-sm mb-1">{alert.title}</h3>
              <p className="text-white text-sm">{alert.message}</p>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="text-red-400/70 hover:text-red-400 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
