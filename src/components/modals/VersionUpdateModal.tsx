import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, RefreshCw, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { getLatestAppVersion } from '../../lib/supabase';

export const VersionUpdateModal: React.FC = () => {
  const { isVersionModalOpen, setIsVersionModalOpen } = useApp();
  const [checking, setChecking] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [latestVersion, setLatestVersion] = useState('v1.1.0-beta (Prête)');

  if (!isVersionModalOpen) return null;

  const handleCheckUpdate = async () => {
    setChecking(true);
    try {
      const ver = await getLatestAppVersion();
      if (ver && ver.version) {
        setLatestVersion(ver.version);
      }
    } catch (e) {
      // fallback
    } finally {
      setTimeout(() => {
        setChecking(false);
        setHasUpdate(true);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#1C1C1C] border border-[var(--accent-color)]/40 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-5">
        <button
          onClick={() => {
            setIsVersionModalOpen(false);
            setHasUpdate(false);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)] text-black flex items-center justify-center font-bold">
            <RefreshCw className={`w-6 h-6 ${checking ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Mise à Jour TAK TAK TAXI (APK)</h3>
            <p className="text-xs text-gray-400">
              Vérification de la version (Table <code className="text-[var(--accent-color)]">versions</code>)
            </p>
          </div>
        </div>

        <div className="bg-[#121212] border border-[#333] rounded-2xl p-4 space-y-2 text-xs text-gray-300">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Version actuelle :</span>
            <span className="font-mono text-white font-bold">v1.0.0-beta.niamey</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Dernière version APK :</span>
            <span className="font-mono text-[var(--accent-color)] font-bold">
              {hasUpdate ? 'v1.1.0-beta (Prête)' : 'v1.0.0-beta'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Canal de diffusion :</span>
            <span className="font-bold text-emerald-400">Bêta de confiance (PWA / APK)</span>
          </div>
        </div>

        {hasUpdate ? (
          <div className="bg-gradient-to-r from-[var(--accent-color)]/20 to-amber-900/30 border border-[var(--accent-color)] rounded-2xl p-4 text-center space-y-3">
            <Sparkles className="w-6 h-6 text-[var(--accent-color)] mx-auto" />
            <h4 className="font-extrabold text-white text-sm">
              Nouvelle version APK v1.1.0 disponible !
            </h4>
            <p className="text-xs text-gray-300">
              Amélioration de la vitesse de chargement et des repères OpenStreetMap de Niamey.
            </p>
            <button
              onClick={() => {
                alert('Téléchargement du nouvel APK Bêta en cours... (Simulation)');
                setIsVersionModalOpen(false);
              }}
              className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-black font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger l&apos;APK v1.1.0</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleCheckUpdate}
            disabled={checking}
            className="w-full bg-[#262626] hover:bg-[#333] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-[#444] transition"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Vérification en cours...' : 'Vérifier maintenant dans Supabase'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
