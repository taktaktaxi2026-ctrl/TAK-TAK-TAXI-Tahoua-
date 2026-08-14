import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NIAMEY_LANDMARKS } from '../../data/niameyData';
import { MapPin, Users, DollarSign, Car, Search, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const MenuTab: React.FC = () => {
  const { t, createCourse, user } = useApp();

  const [departNom, setDepartNom] = useState('Grand Marché de Niamey');
  const [departLat, setDepartLat] = useState(13.5178);
  const [departLng, setDepartLng] = useState(2.1156);

  const [arriveeNom, setArriveeNom] = useState('Aéroport International Diori Hamani');
  const [arriveeLat, setArriveeLat] = useState(13.4815);
  const [arriveeLng, setArriveeLng] = useState(2.1834);

  const [nbPassagers, setNbPassagers] = useState(1);
  const [prixPropose, setPrixPropose] = useState<number | ''>(1500);
  const [searchFilter, setSearchFilter] = useState('');
  const [activePicker, setActivePicker] = useState<'depart' | 'arrivee' | null>(null);

  const handleSelectLandmark = (landmark: typeof NIAMEY_LANDMARKS[0]) => {
    if (activePicker === 'depart') {
      setDepartNom(landmark.nom);
      setDepartLat(landmark.lat);
      setDepartLng(landmark.lng);
    } else if (activePicker === 'arrivee') {
      setArriveeNom(landmark.nom);
      setArriveeLat(landmark.lat);
      setArriveeLng(landmark.lng);
    }
    setActivePicker(null);
    setSearchFilter('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!departNom || !arriveeNom) {
      alert('Veuillez spécifier le départ et l\'arrivée');
      return;
    }

    createCourse(
      departNom,
      departLat,
      departLng,
      arriveeNom,
      arriveeLat,
      arriveeLng,
      nbPassagers,
      typeof prixPropose === 'number' ? prixPropose : 1500
    );
  };

  const filteredLandmarks = NIAMEY_LANDMARKS.filter((l) =>
    l.nom.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.quartier.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-14">
      {/* Title */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-[var(--accent-color)]" />
            <span>Réserver un Taxi à Niamey</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Sélectionnez votre trajet (Grand Marché, Pont Kennedy, Université...)
          </p>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-lg bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30">
          0% Commission
        </span>
      </div>

      {/* Main Reservation Form */}
      <form onSubmit={handleSubmit} className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-5 space-y-4 shadow-xl">
        {/* Departure */}
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t('depart_label')}</span>
            </span>
            <button
              type="button"
              onClick={() => setActivePicker(activePicker === 'depart' ? null : 'depart')}
              className="text-xs text-[var(--accent-color)] hover:underline font-semibold"
            >
              Changer
            </button>
          </label>
          <div className="relative">
            <input
              type="text"
              value={departNom}
              onChange={(e) => setDepartNom(e.target.value)}
              placeholder="Ex: Grand Marché de Niamey"
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-[var(--accent-color)] focus:outline-none transition"
              required
            />
          </div>
        </div>

        {/* Arrival */}
        <div>
          <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{t('arrivee_label')}</span>
            </span>
            <button
              type="button"
              onClick={() => setActivePicker(activePicker === 'arrivee' ? null : 'arrivee')}
              className="text-xs text-[var(--accent-color)] hover:underline font-semibold"
            >
              Changer
            </button>
          </label>
          <div className="relative">
            <input
              type="text"
              value={arriveeNom}
              onChange={(e) => setArriveeNom(e.target.value)}
              placeholder="Ex: Aéroport International Diori Hamani"
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-[var(--accent-color)] focus:outline-none transition"
              required
            />
          </div>
        </div>

        {/* Landmark Quick Selector Modal/Accordion */}
        {activePicker && (
          <div className="bg-[#121212] border border-[var(--accent-color)]/40 rounded-xl p-3 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--accent-color)]">
                Sélectionner {activePicker === 'depart' ? 'le départ' : 'l\'arrivée'} dans Niamey :
              </span>
              <button
                type="button"
                onClick={() => setActivePicker(null)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Fermer
              </button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Rechercher un quartier ou marché..."
                className="w-full bg-[#1C1C1C] border border-[#333] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white"
              />
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredLandmarks.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => handleSelectLandmark(l)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-[#1C1C1C] hover:bg-[#262626] border border-[#262626] text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-gray-200">{l.nom}</p>
                    <p className="text-[10px] text-gray-400">{l.quartier}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#333] text-[var(--accent-color)]">
                    Choisir
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Passengers & Price in a 2-col Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Passengers */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[var(--accent-color)]" />
              <span>{t('nb_passagers')}</span>
            </label>
            <select
              value={nbPassagers}
              onChange={(e) => setNbPassagers(Number(e.target.value))}
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-[var(--accent-color)] focus:outline-none"
            >
              <option value={1}>1 Passager</option>
              <option value={2}>2 Passagers</option>
              <option value={3}>3 Passagers</option>
              <option value={4}>4 Passagers (Privatisé)</option>
            </select>
          </div>

          {/* Optional Price for Bêta */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>{t('prix_label')}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Espèces</span>
            </label>
            <input
              type="number"
              step={500}
              min={500}
              max={15000}
              value={prixPropose}
              onChange={(e) => setPrixPropose(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Ex: 1500 FCFA"
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-[var(--accent-color)] focus:outline-none"
            />
          </div>
        </div>

        {/* Submit button "Créer le coupon" */}
        <button
          type="submit"
          className="w-full mt-4 bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-black font-extrabold py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all glow-gold text-base"
        >
          <span>{t('creer_coupon')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </form>

      {/* Info on Trust Beta */}
      <div className="bg-[#1C1C1C]/80 border border-[#262626] rounded-2xl p-4 space-y-2 text-xs text-gray-300">
        <div className="flex items-center gap-2 font-bold text-[var(--accent-color)]">
          <ShieldCheck className="w-4 h-4" />
          <span>Pourquoi ce prix est optionnel ?</span>
        </div>
        <p className="text-gray-400 leading-relaxed">
          En phase de <strong className="text-white">Bêta de confiance</strong>, le modèle économique (commission de 10%) est désactivé. Le passager paie directement en espèces le chauffeur à l&apos;arrivée. Vous pouvez négocier le prix via le chat intégré (limite : 5 messages).
        </p>
      </div>
    </div>
  );
};
