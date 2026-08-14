import React from 'react';
import { useApp } from '../context/AppContext';
import { CloudSun, Wind, Droplets, Thermometer, RefreshCw } from 'lucide-react';

export const WeatherBanner: React.FC = () => {
  const { weather } = useApp();

  if (!weather) {
    return (
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-xl p-3 flex items-center justify-between text-xs text-gray-400 animate-pulse">
        <span>Chargement météo Niamey en direct (Open-Meteo)...</span>
        <RefreshCw className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#1C1C1C] to-[#242424] border border-[var(--accent-color)]/30 rounded-xl p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
      {/* City and status */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)]">
          <CloudSun className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span>{weather.city}</span>
            <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-[#333] text-gray-300">
              {weather.description}
            </span>
          </div>
          <p className="text-[11px] text-gray-400">
            Open-Meteo • Rive Gauche & Droite
          </p>
        </div>
      </div>

      {/* Weather metrics */}
      <div className="flex items-center gap-4 text-gray-200">
        <div className="flex items-center gap-1 font-extrabold text-base sm:text-lg text-[var(--accent-color)]">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <span>{weather.temperature}°C</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400" title="Ressenti">
          <span>Ressenti {weather.feelsLike}°C</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
          <Droplets className="w-3.5 h-3.5 text-blue-400" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
          <Wind className="w-3.5 h-3.5 text-teal-400" />
          <span>{weather.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
};
