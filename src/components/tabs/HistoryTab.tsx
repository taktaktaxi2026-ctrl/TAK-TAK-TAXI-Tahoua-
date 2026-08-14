import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Download, Car, Calendar, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export const HistoryTab: React.FC = () => {
  const { historyCourses, openReceiptModal, t } = useApp();

  return (
    <div className="space-y-4 pb-16">
      {/* Header */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--accent-color)]" />
            <span>{t('tab_history')} des Courses</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Toutes vos courses à Niamey avec reçus certifiés Bêta
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#262626] text-gray-300">
          {historyCourses.length} courses
        </span>
      </div>

      {/* Philosophy alert */}
      <div className="bg-[#121212] border border-[var(--accent-color)]/30 rounded-xl p-3 flex items-center gap-2 text-xs text-gray-300">
        <ShieldCheck className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
        <span>
          Sur chaque reçu figure la mention officielle : <strong className="text-white">&quot;Bêta - Aucune commission n&apos;a été prélevée&quot;</strong>.
        </span>
      </div>

      {/* List of rides */}
      {historyCourses.length === 0 ? (
        <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-8 text-center text-gray-400 text-xs sm:text-sm">
          Aucun historique disponible pour l&apos;instant.
        </div>
      ) : (
        <div className="space-y-3">
          {historyCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[#1C1C1C] hover:bg-[#202020] border border-[#262626] rounded-2xl p-4 transition-all shadow-md space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[var(--accent-color)]">
                    #{course.id}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(course.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Terminé</span>
                </span>
              </div>

              {/* Trajet */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-gray-300 truncate">{course.departNom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                  <span className="text-gray-300 truncate">{course.arriveeNom}</span>
                </div>
              </div>

              {/* Driver and Amount */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[var(--accent-color)]" />
                  <span className="text-xs font-semibold text-gray-200">
                    {course.chauffeurName || 'Abdoulaye Moussa'} ({course.chauffeurPlaque || 'RN-4582-NY'})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-white">
                    {course.prixAccepte || course.prixPropose || 1500} FCFA
                  </span>
                  <span className="block text-[10px] text-[var(--accent-color)] font-semibold">
                    0 FCFA Commission
                  </span>
                </div>
              </div>

              {/* Action Button: Open Official Receipt/Facture Modal with Logo & NIF */}
              <div className="pt-2 border-t border-[#262626] flex justify-end">
                <button
                  onClick={() => openReceiptModal(course)}
                  className="bg-[var(--accent-color)]/10 hover:bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Voir Facture PDF / Reçu</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
