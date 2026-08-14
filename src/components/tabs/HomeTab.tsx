import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeatherBanner } from '../WeatherBanner';
import { NiameyMap } from '../NiameyMap';
import { LandingPage } from '../LandingPage';
import { Car, ShieldCheck, Sparkles, MapPin, ArrowRight, UserCheck, Layout, Map } from 'lucide-react';

export const HomeTab: React.FC = () => {
  const { t, setActiveTab, user, setIsDriverModalOpen } = useApp();
  const [viewMode, setViewMode] = useState<'landing' | 'map'>('landing');

  return (
    <div className="space-y-4 pb-12">
      {/* Quick View Switcher Bar */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-2 flex items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-1.5 bg-[#121212] p-1 rounded-xl border border-[#262626]">
          <button
            onClick={() => setViewMode('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
              viewMode === 'landing'
                ? 'bg-[var(--accent-color)] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Présentation Landing Page</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition ${
              viewMode === 'map'
                ? 'bg-[var(--accent-color)] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Carte & Météo Directe</span>
          </button>
        </div>

        <button
          onClick={() => setActiveTab('menu')}
          className="bg-gradient-to-r from-[var(--accent-color)] to-amber-500 hover:brightness-110 text-black font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow transition shrink-0"
        >
          <Car className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Réserver</span>
        </button>
      </div>

      {/* Main Content based on View Mode */}
      {viewMode === 'landing' ? (
        <LandingPage />
      ) : (
        <div className="space-y-4">
          {/* 1. Open-Meteo Weather Banner */}
          <WeatherBanner />

          {/* 2. Interactive Leaflet Map of Niamey */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-gray-200 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Carte de Niamey • Grand Marché, Pont Kennedy, Harobanda</span>
              </h2>
              <span className="text-xs text-gray-400">Cliquez sur un repère pour partir</span>
            </div>
            <NiameyMap
              onSelectLandmark={(nom, lat, lng) => {
                setActiveTab('menu');
              }}
            />
          </div>

          {/* 3. Chauffeur onboarding banner if user is Chauffeur */}
          {user.role === 'chauffeur' && (
            <div className="bg-gradient-to-r from-amber-900/40 to-[#1C1C1C] border-2 border-[var(--accent-color)] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)] text-black flex items-center justify-center font-bold shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    Vérification de vos Papiers via IA Gemini
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    Téléchargez votre CNI, Permis de Conduire et Carte Grise pour validation immédiate avant de recevoir des courses.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDriverModalOpen(true)}
                className="w-full sm:w-auto bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition whitespace-nowrap"
              >
                Uploader mes 3 documents
              </button>
            </div>
          )}

          {/* 4. Large CTA "Réserver un taxi" */}
          <div className="pt-1">
            <button
              onClick={() => setActiveTab('menu')}
              className="w-full bg-gradient-to-r from-[var(--accent-color)] to-amber-500 hover:opacity-95 text-black font-extrabold py-4 px-6 rounded-2xl shadow-2xl flex items-center justify-between group transform active:scale-[0.99] transition-all glow-gold"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-black/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-black" />
                </div>
                <div className="text-left">
                  <span className="text-base sm:text-lg block leading-tight font-black">
                    {t('reserver_cta')}
                  </span>
                  <span className="text-xs opacity-80 font-semibold">
                    Paiement direct en espèces • 0% Commission
                  </span>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 5. Trust Bêta Philosophy badge */}
          <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-gray-300">
            <ShieldCheck className="w-5 h-5 text-[var(--accent-color)] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white mb-0.5">Bêta de Confiance : Pourquoi 0% de commission ?</h4>
              <p className="text-gray-400 leading-relaxed">
                {t('commission_info')} L&apos;objectif est de prouver la fiabilité du service à Niamey, de vérifier tous les chauffeurs via Gemini OCR, et de bâtir une base d&apos;utilisateurs solide avant toute monétisation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

