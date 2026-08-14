import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { THEME_COLORS, SUPPORTED_LANGUAGES, INITIAL_CHAUFFEURS } from '../../data/niameyData';
import {
  User,
  Palette,
  Globe,
  ShieldAlert,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Key,
  FileCheck,
  UserCheck
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const {
    user,
    setUser,
    changeTheme,
    changeLanguage,
    subscribedChauffeurIds,
    toggleSubscription,
    setIsAdminModalOpen,
    setIsDriverModalOpen,
    t
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone);
  const [contact1, setContact1] = useState(user.emergencyContacts[0] || '+227 96 11 22 33');
  const [contact2, setContact2] = useState(user.emergencyContacts[1] || '+227 97 44 55 66');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name,
      email,
      phone,
      emergencyContacts: [contact1, contact2].filter(Boolean)
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Identity section */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-color)] text-black flex items-center justify-center font-black text-xl border-2 border-white/20">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">{user.name}</h2>
              <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-[#262626] text-[var(--accent-color)] capitalize mt-0.5">
                Rôle : {user.role}
              </span>
            </div>
          </div>

          {/* If user is admin, show supervisor button */}
          {user.role === 'admin' && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Key className="w-4 h-4" />
              <span>Dashboard Superviseur</span>
            </button>
          )}

          {/* If user is chauffeur, show documents OCR button */}
          {user.role === 'chauffeur' && (
            <button
              onClick={() => setIsDriverModalOpen(true)}
              className="bg-[var(--accent-color)] text-black font-extrabold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow"
            >
              <FileCheck className="w-4 h-4" />
              <span>Gérer 3 Documents (OCR)</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Nom et Prénom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:border-[var(--accent-color)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Numéro de Téléphone (Niger)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:border-[var(--accent-color)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.email@taktak.ne"
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:border-[var(--accent-color)] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-black font-extrabold px-5 py-2 rounded-xl text-xs sm:text-sm transition"
            >
              Enregistrer mes infos
            </button>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Enregistré
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 2. Section Préférences : Sélecteur de Thème (10 pastilles) & Langue (8 langues) */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-5 shadow-xl space-y-5">
        {/* Theme Selector (10 colors) */}
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-2.5">
            <Palette className="w-4 h-4 text-[var(--accent-color)]" />
            <span>Sélecteur de Thème (10 pastilles • Style 1xBet / Niamey)</span>
          </h3>
          <p className="text-xs text-gray-400 mb-3">
            Cliquez sur une pastille pour changer la couleur d&apos;accentuation en temps réel :
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5">
            {THEME_COLORS.map((theme) => {
              const isSelected = user.themeColor === theme.color;
              return (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.color)}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-white bg-[#262626] scale-105 shadow-lg'
                      : 'border-[#333] hover:border-gray-500 bg-[#121212]'
                  }`}
                  title={theme.name}
                >
                  <span
                    className="w-7 h-7 rounded-full block border border-black/40 shadow-inner"
                    style={{ backgroundColor: theme.color }}
                  ></span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-black"></span>
                  )}
                  <span className="text-[9px] text-gray-300 mt-1 truncate max-w-full font-semibold">
                    {theme.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Selector (8 options) */}
        <div className="border-t border-[#262626] pt-4">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 mb-2.5">
            <Globe className="w-4 h-4 text-[var(--accent-color)]" />
            <span>Sélecteur de Langue (8 langues du Niger & région)</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = user.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-2.5 rounded-xl border text-left transition ${
                    isActive
                      ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-white font-bold'
                      : 'border-[#333] hover:border-gray-500 bg-[#121212] text-gray-300'
                  }`}
                >
                  <span className="block text-xs">{lang.label}</span>
                  <span className="block text-[10px] text-gray-400 font-normal">{lang.native}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Section Sécurité : 2 Contacts d'urgence pour le bouton SOS */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>Contacts d&apos;Urgence (Bouton SOS)</span>
        </h3>
        <p className="text-xs text-gray-400">
          En cas de danger, un SMS pré-formaté avec votre position GPS sur OpenStreetMap sera envoyé automatiquement.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Contact Urgence 1</label>
            <input
              type="text"
              value={contact1}
              onChange={(e) => setContact1(e.target.value)}
              placeholder="+227 96 00 00 00"
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Contact Urgence 2</label>
            <input
              type="text"
              value={contact2}
              onChange={(e) => setContact2(e.target.value)}
              placeholder="+227 97 00 00 00"
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* 4. Section Abonnement : Chauffeurs que le passager suit */}
      <div className="bg-[#1C1C1C] border border-[#262626] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <span>Mes Chauffeurs Favoris (Abonnement)</span>
          </h3>
          <span className="text-xs text-gray-400">
            {subscribedChauffeurIds.length} suivi(s)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INITIAL_CHAUFFEURS.map((ch) => {
            const isSubscribed = subscribedChauffeurIds.includes(ch.userId);
            return (
              <div
                key={ch.userId}
                className="bg-[#121212] border border-[#262626] rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">
                    {ch.userId === 'ch-01' ? 'Abdoulaye Moussa' : ch.userId === 'ch-02' ? 'Souleymane Ibrahim' : `Chauffeur ${ch.plaque}`}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-mono">Plaque : {ch.plaque}</p>
                  <p className="text-[10px] text-[var(--accent-color)]">{ch.vehiculeModele}</p>
                </div>
                <button
                  onClick={() => toggleSubscription(ch.userId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isSubscribed
                      ? 'bg-[var(--accent-color)] text-black'
                      : 'bg-[#262626] text-gray-400 hover:text-white'
                  }`}
                >
                  {isSubscribed ? '★ Suivi' : '+ Suivre'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
