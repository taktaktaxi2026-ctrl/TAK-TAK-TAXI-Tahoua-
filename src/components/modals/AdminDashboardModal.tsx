import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Key,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Car,
  Users,
  Activity,
  Award,
  Sparkles,
  Search
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const { isAdminModalOpen, setIsAdminModalOpen, chauffeurs, t } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'fleet' | 'ocr' | 'metrics'>('fleet');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdminModalOpen) return null;

  const verifiedCount = chauffeurs.filter((c) => c.globalVerdict === 'valide').length;
  const onlineCount = chauffeurs.filter((c) => c.statut === 'en_ligne').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#1C1C1C] border border-red-500/40 rounded-3xl w-full max-w-3xl p-6 relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={() => setIsAdminModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-500 flex items-center justify-center font-bold">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>Superviseur TAK TAK TAXI (Admin)</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                  Accès Caché
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Gestion des approbations OCR & supervision de la flotte à Niamey
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="grid grid-cols-3 gap-2 bg-[#121212] p-1.5 rounded-2xl border border-[#333]">
          <button
            onClick={() => setActiveSubTab('fleet')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'fleet'
                ? 'bg-[var(--accent-color)] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Flotte ({onlineCount} en ligne)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('ocr')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'ocr'
                ? 'bg-[var(--accent-color)] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Vérification OCR ({verifiedCount}/{chauffeurs.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('metrics')}
            className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeSubTab === 'metrics'
                ? 'bg-[var(--accent-color)] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Bêta & Modèle</span>
          </button>
        </div>

        {/* Content based on sub-tab */}
        {activeSubTab === 'fleet' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300">
                Chauffeurs inscrits à Niamey ({chauffeurs.length}) :
              </span>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrer plaque..."
                  className="w-full bg-[#121212] border border-[#333] rounded-lg pl-8 pr-2 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {chauffeurs
                .filter((c) => c.plaque.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((c) => (
                  <div
                    key={c.userId}
                    className="bg-[#121212] border border-[#262626] rounded-2xl p-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/20 text-[var(--accent-color)] flex items-center justify-center font-bold text-sm">
                        🚕
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm">
                          {c.userId === 'ch-01'
                            ? 'Abdoulaye Moussa'
                            : c.userId === 'ch-02'
                            ? 'Souleymane Ibrahim'
                            : `Chauffeur ${c.plaque}`}
                        </h4>
                        <p className="text-xs text-gray-400 font-mono">
                          Plaque : <span className="text-[var(--accent-color)]">{c.plaque}</span> • {c.vehiculeModele}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.statut === 'en_ligne'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {c.statut.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-[11px] text-gray-400 mt-1">{c.coursesEffectuees} courses</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeSubTab === 'ocr' && (
          <div className="space-y-3">
            <div className="bg-[#121212] p-3 rounded-xl border border-[#333] text-xs text-gray-300">
              <span className="font-bold text-white">Supervision IA Gemini OCR :</span> Si un document est marqué
              &quot;En attente&quot; ou si Gemini échoue sur un tampon usé, l&apos;Admin peut valider ou refuser ici.
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {chauffeurs.map((c) => (
                <div
                  key={c.userId}
                  className="bg-[#121212] border border-[#262626] rounded-2xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {c.userId === 'ch-01'
                          ? 'Abdoulaye Moussa'
                          : c.userId === 'ch-02'
                          ? 'Souleymane Ibrahim'
                          : `Chauffeur ${c.plaque}`}
                      </h4>
                      <p className="text-xs text-gray-400">Plaque : {c.plaque}</p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        c.globalVerdict === 'valide'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {c.globalVerdict === 'valide' ? '100% VÉRIFIÉ' : 'EN ATTENTE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="bg-[#1C1C1C] p-2 rounded-lg border border-[#333]">
                      <span className="block text-[10px] text-gray-400">CNI</span>
                      <span className="font-bold text-emerald-400">VALIDE</span>
                    </div>
                    <div className="bg-[#1C1C1C] p-2 rounded-lg border border-[#333]">
                      <span className="block text-[10px] text-gray-400">PERMIS</span>
                      <span className="font-bold text-emerald-400">VALIDE</span>
                    </div>
                    <div className="bg-[#1C1C1C] p-2 rounded-lg border border-[#333]">
                      <span className="block text-[10px] text-gray-400">CARTE GRISE</span>
                      <span className="font-bold text-emerald-400">VALIDE</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSubTab === 'metrics' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#121212] p-4 rounded-2xl border border-[#333] text-center">
                <span className="text-gray-400 text-xs block">COURSES BÊTA</span>
                <span className="text-xl font-black text-white mt-1 block">505</span>
              </div>
              <div className="bg-[#121212] p-4 rounded-2xl border border-[#333] text-center">
                <span className="text-gray-400 text-xs block">CHAUFFEURS</span>
                <span className="text-xl font-black text-[var(--accent-color)] mt-1 block">
                  {chauffeurs.length}
                </span>
              </div>
              <div className="bg-[#121212] p-4 rounded-2xl border border-[#333] text-center">
                <span className="text-gray-400 text-xs block">TAUX COMMISSION</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">0%</span>
              </div>
              <div className="bg-[#121212] p-4 rounded-2xl border border-[#333] text-center">
                <span className="text-gray-400 text-xs block">REVENU PERÇU</span>
                <span className="text-xl font-black text-gray-300 mt-1 block">0 FCFA</span>
              </div>
            </div>

            <div className="bg-amber-950/20 border border-[var(--accent-color)]/30 rounded-2xl p-4 text-xs text-gray-300 space-y-1">
              <span className="font-bold text-[var(--accent-color)] block text-sm">
                Rappel du modèle économique suspendu :
              </span>
              <p>
                Le champ <code className="text-white bg-black/40 px-1 py-0.5 rounded">commission_rate</code> est paramétré à <code className="text-emerald-400 font-bold">0.0</code> et le paiement s&apos;effectue en espèces directes au chauffeur.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-black font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm"
          >
            Fermer le Superviseur
          </button>
        </div>
      </div>
    </div>
  );
};
