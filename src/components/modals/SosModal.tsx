import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, PhoneCall, CheckCircle2, MapPin, Send } from 'lucide-react';

export const SosModal: React.FC = () => {
  const { isSosModalOpen, setIsSosModalOpen, triggerSos, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isSosModalOpen) return null;

  const handleTrigger = async () => {
    setLoading(true);
    const res = await triggerSos();
    setLoading(false);
    setSuccessMsg(res.message || 'Alerte SOS émise par SMS !');
    setTimeout(() => {
      setIsSosModalOpen(false);
      setSuccessMsg('');
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#1C1C1C] border-2 border-red-600 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-5 glow-red">
        {/* Close */}
        <button
          onClick={() => setIsSosModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-600 mx-auto flex items-center justify-center text-red-500 animate-pulse">
            <ShieldAlert className="w-9 h-9" />
          </div>
          <h3 className="text-xl font-black text-red-500 uppercase tracking-wide">
            ALERTE SOS URGENCE NIAMEY
          </h3>
          <p className="text-xs text-gray-300">
            Cette action envoie immédiatement un SMS pré-formaté avec votre position GPS sur OpenStreetMap à vos 2 contacts d&apos;urgence.
          </p>
        </div>

        {/* Contacts preview */}
        <div className="bg-[#121212] border border-[#333] rounded-2xl p-4 space-y-2 text-xs">
          <span className="font-bold text-gray-400 block uppercase text-[10px]">
            Contacts d&apos;urgence configurés :
          </span>
          {user.emergencyContacts && user.emergencyContacts.length > 0 ? (
            user.emergencyContacts.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-white font-mono bg-[#1C1C1C] p-2 rounded-lg">
                <span>Contact {i + 1}</span>
                <span className="text-[var(--accent-color)] font-bold">{c}</span>
              </div>
            ))
          ) : (
            <div className="text-amber-400 font-semibold">
              Aucun contact configuré. Par défaut : +227 96 00 00 00
            </div>
          )}
        </div>

        {/* Location info */}
        <div className="bg-red-950/30 border border-red-500/40 rounded-2xl p-3 flex items-center gap-2 text-xs text-red-300">
          <MapPin className="w-4 h-4 text-red-400 shrink-0" />
          <span>
            Coordonnées GPS jointes : <strong className="text-white">13.5137° N, 2.1098° E (Niamey)</strong>
          </span>
        </div>

        {successMsg ? (
          <div className="bg-emerald-600/20 border border-emerald-500 text-emerald-300 p-4 rounded-2xl text-center font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMsg}</span>
          </div>
        ) : (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsSosModalOpen(false)}
              className="w-1/3 bg-[#262626] hover:bg-[#333] text-gray-300 font-bold py-3.5 rounded-2xl text-xs"
            >
              Annuler
            </button>
            <button
              onClick={handleTrigger}
              disabled={loading}
              className="w-2/3 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 px-4 rounded-2xl text-sm shadow-xl glow-red flex items-center justify-center gap-2 transform active:scale-[0.98] transition"
            >
              <Send className="w-5 h-5" />
              <span>{loading ? 'ENVOI DU SMS...' : 'DÉCLENCHER LE SOS MAINTENANT'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
