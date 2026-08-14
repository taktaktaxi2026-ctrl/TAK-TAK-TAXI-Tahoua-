import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NiameyMap } from '../NiameyMap';
import {
  Car,
  Phone,
  MessageSquare,
  XCircle,
  Star,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  AlertTriangle,
  FileText,
  Download,
  MapPin
} from 'lucide-react';
import { CourseStatus } from '../../types';

const STEPS: { id: CourseStatus; label: string }[] = [
  { id: 'recherche', label: 'Recherche' },
  { id: 'trouve', label: 'Chauffeur trouvé' },
  { id: 'en_route', label: 'En route' },
  { id: 'en_cours', label: 'En cours' },
  { id: 'termine', label: 'Terminé' },
  { id: 'recu', label: 'Reçu' }
];

export const CourseTab: React.FC = () => {
  const {
    activeCourse,
    courseMessages,
    sendCourseMessage,
    advanceCourseStatus,
    cancelCourse,
    t,
    user,
    setIsSosModalOpen,
    downloadReceipt,
    openReceiptModal
  } = useApp();

  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(true);

  if (!activeCourse || activeCourse.statut === 'annule') {
    return (
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto my-6">
        <div className="w-16 h-16 rounded-full bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/40 mx-auto flex items-center justify-center text-[var(--accent-color)]">
          <Car className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-white text-base sm:text-lg">Aucune course active</h3>
        <p className="text-xs sm:text-sm text-gray-400">
          Vous n&apos;avez aucune course en cours. Allez dans l&apos;onglet Réserver pour commander un taxi à Niamey.
        </p>
      </div>
    );
  }

  const currentIdx = STEPS.findIndex((s) => s.id === activeCourse.statut);
  const canCancel = currentIdx < 2; // Can cancel if < 'en_route'
  const restEchanges = Math.max(0, 5 - (activeCourse.nbEchanges || 0));

  const handleSendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const sent = sendCourseMessage(chatInput.trim());
    if (sent) setChatInput('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Status Tracker 6 Steps */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[var(--accent-color)] uppercase tracking-wider">
            Statut de la Course
          </span>
          <span className="text-xs font-mono text-gray-400">#{activeCourse.id}</span>
        </div>

        {/* 6 Steps Progress Bar */}
        <div className="grid grid-cols-6 gap-1 relative my-3">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-black'
                      : isCurrent
                      ? 'bg-[var(--accent-color)] text-black ring-4 ring-[var(--accent-color)]/30 scale-110'
                      : 'bg-[#262626] text-gray-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] mt-1 font-semibold leading-tight ${
                    isCurrent ? 'text-[var(--accent-color)] font-extrabold' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step description */}
        <div className="mt-4 p-3 rounded-xl bg-[#121212] border border-[#262626] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--accent-color)] animate-pulse" />
            <span className="text-xs font-bold text-white">
              {activeCourse.statut === 'recherche' && t('statut_recherche')}
              {activeCourse.statut === 'trouve' && t('statut_trouve')}
              {activeCourse.statut === 'en_route' && t('statut_en_route')}
              {activeCourse.statut === 'en_cours' && t('statut_en_cours')}
              {activeCourse.statut === 'termine' && t('statut_termine')}
              {activeCourse.statut === 'recu' && t('statut_recu')}
            </span>
          </div>

          {/* Test helper button to advance steps smoothly */}
          {activeCourse.statut !== 'recu' && (
            <button
              onClick={advanceCourseStatus}
              className="px-3 py-1 rounded-lg bg-[var(--accent-color)]/20 hover:bg-[var(--accent-color)]/30 text-[var(--accent-color)] text-xs font-bold border border-[var(--accent-color)]/40 transition"
              title="Avancer le statut (Simulation Bêta)"
            >
              Étape suivante →
            </button>
          )}
        </div>
      </div>

      {/* 2. Driver Info & Actions */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <img
              src={
                activeCourse.chauffeurPhoto ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt="Chauffeur"
              className="w-12 h-12 rounded-full object-cover border-2 border-[var(--accent-color)]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-white text-base">
                  {activeCourse.chauffeurName || 'Chauffeur TAK TAK'}
                </h3>
                <span className="flex items-center text-xs font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-amber-400 inline mr-0.5" /> 4.9
                </span>
              </div>
              <p className="text-xs text-gray-300 font-mono mt-0.5">
                Plaque : <strong className="text-[var(--accent-color)]">{activeCourse.chauffeurPlaque || 'RN-4582-NY'}</strong>
              </p>
            </div>
          </div>

          {/* SOS Trigger */}
          <button
            onClick={() => setIsSosModalOpen(true)}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 p-2.5 rounded-xl font-bold text-xs flex items-center gap-1"
            title="Alerte SOS"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">SOS</span>
          </button>
        </div>

        {/* Route info */}
        <div className="py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
          <div className="bg-[#121212] p-2.5 rounded-xl border border-[#262626]">
            <span className="text-gray-400 block text-[10px]">DÉPART</span>
            <span className="font-bold text-white">{activeCourse.departNom}</span>
          </div>
          <div className="bg-[#121212] p-2.5 rounded-xl border border-[#262626]">
            <span className="text-gray-400 block text-[10px]">ARRIVÉE</span>
            <span className="font-bold text-white">{activeCourse.arriveeNom}</span>
          </div>
        </div>

        {/* Buttons: Call, Chat, Cancel */}
        <div className="pt-2 grid grid-cols-3 gap-2">
          {/* Phone call native link */}
          <a
            href={`tel:${activeCourse.chauffeurPhone || '+22796881234'}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs transition"
          >
            <Phone className="w-4 h-4" />
            <span>Appeler</span>
          </a>

          {/* Toggle Chat */}
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--accent-color)]/20 hover:bg-[var(--accent-color)]/30 text-[var(--accent-color)] border border-[var(--accent-color)]/40 font-bold text-xs transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat ({courseMessages.length})</span>
          </button>

          {/* Cancel */}
          <button
            onClick={cancelCourse}
            disabled={!canCancel}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-xs transition ${
              canCancel
                ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 cursor-pointer'
                : 'bg-[#262626] text-gray-500 cursor-not-allowed opacity-50'
            }`}
            title={canCancel ? 'Annuler la course' : 'Trop tard pour annuler'}
          >
            <XCircle className="w-4 h-4" />
            <span>Annuler</span>
          </button>
        </div>

        {/* Cancellation warning rule */}
        {canCancel && (
          <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>{t('cancel_warning')} (Actuel : {user.cancellationsCount}/5)</span>
          </p>
        )}
      </div>

      {/* Interactive Live Map of active course */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[var(--accent-color)]" />
            <span>Carte Hybride & Localisation du Chauffeur</span>
          </h3>
          <span className="text-[11px] text-emerald-400 font-semibold">GPS Actif</span>
        </div>
        <NiameyMap />
      </div>

      {/* 3. Negotiation Chat with 5-exchange Limit */}
      {showChat && (
        <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#262626] pb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--accent-color)]" />
              <span className="font-bold text-white text-xs sm:text-sm">
                Chat en direct & Négociation du Prix
              </span>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                restEchanges > 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              Reste {restEchanges}/5 échanges prix
            </span>
          </div>

          {/* Messages stream */}
          <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
            {courseMessages.map((msg, idx) => {
              const isMe = msg.senderId === user.id;
              return (
                <div
                  key={`${msg.id}-${idx}`}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm ${
                      isMe
                        ? 'bg-[var(--accent-color)] text-black font-semibold rounded-br-none'
                        : 'bg-[#262626] text-gray-100 rounded-bl-none border border-[#333]'
                    }`}
                  >
                    {!isMe && (
                      <span className="block text-[10px] font-bold text-[var(--accent-color)] mb-0.5">
                        {msg.senderName}
                      </span>
                    )}
                    <p>{msg.content}</p>
                    {msg.containsNumber && (
                      <span className="inline-block mt-1 text-[10px] font-bold px-1 rounded bg-black/20 text-amber-900">
                        Négociation Chiffrée
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-0.5 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMsg} className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Écrire un message ou prix (ex: 1500 FCFA)..."
              className="flex-1 bg-[#121212] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-[var(--accent-color)] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-black p-2.5 rounded-xl font-bold transition"
              title="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-gray-400">
            {t('negociation_limite')}
          </p>
        </div>
      )}

      {/* 4. Receipt Download card if course is finished */}
      {(activeCourse.statut === 'recu' || activeCourse.statut === 'termine') && (
        <div className="bg-gradient-to-r from-emerald-950/40 to-[#1C1C1C] border-2 border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-white text-sm">Reçu Bêta de Course Généré</h4>
              <p className="text-xs text-gray-300">
                Mention : &quot;Bêta - Aucune commission n&apos;a été prélevée&quot;
              </p>
            </div>
          </div>
          <button
            onClick={() => activeCourse && openReceiptModal(activeCourse)}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Voir Facture PDF / Reçu</span>
          </button>
        </div>
      )}
    </div>
  );
};
