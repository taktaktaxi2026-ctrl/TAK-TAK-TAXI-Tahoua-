import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  Car,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  DollarSign,
  UserCheck,
  PhoneCall,
  ChevronDown,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Smartphone,
  Navigation,
  FileText,
  Star,
  Users,
  Award,
  Globe,
  Lock,
  MessageSquare,
  Building2,
  Check
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setIsAuthModalOpen,
    setIsDriverModalOpen,
    setIsSosModalOpen,
    setActiveTab,
    t
  } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTabFlow, setActiveTabFlow] = useState<'passager' | 'chauffeur'>('passager');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#0F0F0F] text-white font-sans overflow-x-hidden rounded-3xl border border-[#262626] shadow-2xl relative">
      {/* 1. TOP HEADER / BRAND BAR */}
      <nav className="sticky top-0 z-30 bg-[#0F0F0F]/90 backdrop-blur-md border-b border-[#262626] px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <div>
            <span className="font-black text-lg tracking-tight text-white block leading-none">
              TAK TAK <span className="text-[var(--accent-color)]">TAXI</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold tracking-wider">
              NIAMEY • NIGER 🇳🇪
            </span>
          </div>
        </div>

        {/* Quick Nav Links (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-300">
          <button onClick={() => scrollToSection('pourquoi')} className="hover:text-[var(--accent-color)] transition">
            Pourquoi nous
          </button>
          <button onClick={() => scrollToSection('comment-ca-marche')} className="hover:text-[var(--accent-color)] transition">
            Comment ça marche
          </button>
          <button onClick={() => scrollToSection('fonctionnalites')} className="hover:text-[var(--accent-color)] transition">
            Fonctionnalités
          </button>
          <button onClick={() => scrollToSection('chauffeurs')} className="hover:text-[var(--accent-color)] transition">
            Espace Chauffeurs
          </button>
          <button onClick={() => scrollToSection('temoignages')} className="hover:text-[var(--accent-color)] transition">
            Avis
          </button>
          <button onClick={() => scrollToSection('faq')} className="hover:text-[var(--accent-color)] transition">
            FAQ
          </button>
        </div>

        {/* Header CTAs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('menu');
            }}
            className="hidden sm:inline-flex bg-[#1C1C1C] hover:bg-[#262626] text-white border border-[#333] px-3.5 py-2 rounded-xl text-xs font-bold transition"
          >
            Tester la Carte
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-gradient-to-r from-[var(--accent-color)] to-amber-500 hover:brightness-110 text-black font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
          >
            <span>S'inscrire</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-10 pb-16 px-4 sm:px-8 max-w-6xl mx-auto overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[var(--accent-color)]/10 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Hero Text Left */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--accent-color)]">
              <Sparkles className="w-4 h-4" />
              <span>N°1 de la réservation de Taxi à Niamey</span>
              <span className="bg-[var(--accent-color)] text-black px-1.5 py-0.2 rounded text-[10px] font-black">
                BÊTA 0% COMMISSION
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Le taxi le plus <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[var(--accent-color)] via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                rapide du Niger.
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Commandez un taxi en quelques secondes à Niamey. Prix transparents et négociables, chauffeurs vérifiés par IA, géolocalisation 3D en direct. Simple, rapide et 100% sécurisé.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-[var(--accent-color)] to-amber-500 hover:brightness-110 text-black font-black px-7 py-4 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-2xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 active:scale-95 group"
              >
                <span>Commencer maintenant</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('comment-ca-marche')}
                className="w-full sm:w-auto bg-[#1C1C1C] hover:bg-[#262626] border border-[#333] text-white font-extrabold px-6 py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition"
              >
                <span>Découvrir l'application</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Key Live Metrics */}
            <div className="pt-6 border-t border-[#262626] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-[var(--accent-color)]">5,000+</p>
                <p className="text-[11px] text-gray-400 font-semibold">Courses effectuées</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">0%</p>
                <p className="text-[11px] text-gray-400 font-semibold">Commission Bêta</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-amber-400">4.9/5 ⭐</p>
                <p className="text-[11px] text-gray-400 font-semibold">Note moyenne</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-blue-400">24h/24</p>
                <p className="text-[11px] text-gray-400 font-semibold">Support Niamey</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Showcase Right - Smartphone Mockup & Map Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-sm bg-[#1C1C1C] border-2 border-[#333] rounded-[36px] p-4 shadow-2xl relative overflow-hidden group">
              {/* Fake Phone Status Bar */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono px-2 mb-3">
                <span>09:41</span>
                <div className="w-16 h-3 bg-black rounded-full mx-auto border border-[#333]" />
                <span className="text-emerald-400 font-bold">5G • 100%</span>
              </div>

              {/* App Interactive Preview inside phone */}
              <div className="bg-[#0F0F0F] rounded-2xl p-3 border border-[#262626] space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[var(--accent-color)] text-black font-extrabold flex items-center justify-center text-xs">
                      🚖
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">Course en Direct</p>
                      <p className="text-[10px] text-emerald-400 font-bold">Chauffeur en route (3 min)</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Confirmé
                  </span>
                </div>

                {/* Simulated Route Card */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 bg-[#1C1C1C] p-2 rounded-xl border border-[#262626]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-gray-300 font-semibold truncate">Grand Marché de Niamey</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#1C1C1C] p-2 rounded-xl border border-[#262626]">
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    <span className="text-gray-300 font-semibold truncate">Aéroport Diori Hamani</span>
                  </div>
                </div>

                {/* Driver Card Inside Phone */}
                <div className="bg-[#1C1C1C] border border-[var(--accent-color)]/40 p-2.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] text-black font-black flex items-center justify-center text-xs">
                      MA
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">Moussa Abdoulaye</p>
                      <p className="text-[10px] text-gray-400">Toyota Corolla • 11-NE-4500</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[var(--accent-color)]">1 500 FCFA</span>
                </div>

                {/* Simulated Interactive Button */}
                <button
                  onClick={() => setActiveTab('menu')}
                  className="w-full bg-[var(--accent-color)] text-black font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 transition"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Tester une réservation</span>
                </button>
              </div>

              {/* Floating Shield Badge */}
              <div className="absolute -bottom-2 -left-2 bg-black/90 backdrop-blur-md border border-emerald-500/50 rounded-2xl p-2.5 shadow-2xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-[10px]">
                  <p className="font-extrabold text-white">Chauffeur Vérifié par IA</p>
                  <p className="text-gray-400">CNI & Permis validés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POURQUOI TAK TAK TAXI ? */}
      <section id="pourquoi" className="py-16 px-4 sm:px-8 bg-[#141414] border-t border-[#262626]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-[var(--accent-color)] uppercase tracking-wider bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
              AVANTAGES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Pourquoi choisir TAK TAK TAXI à Niamey ?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Une application pensée spécifiquement pour la mobilité nigérienne : rapidité, négociation directe et sécurité absolue.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#1C1C1C] border border-[#262626] hover:border-[var(--accent-color)]/50 p-6 rounded-3xl space-y-3 transition group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/30 flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-[var(--accent-color)] transition">
                Réservation instantanée
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Commandez un taxi en 2 clics directement sur la carte de Niamey sans perdre de temps à attendre au bord de la rue.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1C1C1C] border border-[#262626] hover:border-[var(--accent-color)]/50 p-6 rounded-3xl space-y-3 transition group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-[var(--accent-color)] transition">
                Géolocalisation 3D en direct
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Suivez votre chauffeur en temps réel sur la carte MapLibre interactive avec la vue satellite et relief de Niamey.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#1C1C1C] border border-[#262626] hover:border-[var(--accent-color)]/50 p-6 rounded-3xl space-y-3 transition group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-[var(--accent-color)] transition">
                Négociation directe du tarif
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Proposez votre prix et échangez en direct avec le chauffeur dans le tchat sécurisé (limité à 5 offres).
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#1C1C1C] border border-[#262626] hover:border-[var(--accent-color)]/50 p-6 rounded-3xl space-y-3 transition group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-[var(--accent-color)] transition">
                Chauffeurs vérifiés par IA
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Extraction OCR automatique CNI & Permis par l'IA Gemini 1.5 Flash pour garantir zéro faux profil sur la route.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#1C1C1C] border border-[#262626] hover:border-[var(--accent-color)]/50 p-6 rounded-3xl space-y-3 transition group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-[var(--accent-color)] transition">
                Urgence & Bouton SOS
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Bouton rouge SOS d'urgence pour envoyer immédiatement un SMS d'alerte avec lien GPS à vos contacts d'urgence.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#1C1C1C] border border-[#262626] hover:border-[var(--accent-color)]/50 p-6 rounded-3xl space-y-3 transition group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-white group-hover:text-[var(--accent-color)] transition">
                Reçus & Factures PDF
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Téléchargez une facture officielle avec NIF et Logo TAK TAK TAXI pour toutes vos dépenses de déplacement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMMENT ÇA MARCHE ? (3 étapes) */}
      <section id="comment-ca-marche" className="py-16 px-4 sm:px-8 border-t border-[#262626] relative">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              SIMPLICITÉ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Comment ça marche ?
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Trois étapes ultra simples pour commander votre taxi à Niamey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-[#1C1C1C] border border-[#262626] p-6 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-color)] text-black font-black text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="font-extrabold text-lg text-white">Créer un compte</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Inscrivez-vous gratuitement en 30 secondes avec votre numéro de téléphone ou votre compte Google.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Validation OTP instantanée</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Choix du rôle (Passager / Chauffeur)</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-[#1C1C1C] border border-[#262626] p-6 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-color)] text-black font-black text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="font-extrabold text-lg text-white">Commander & Négocier</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Indiquez votre lieu de départ et d'arrivée sur la carte de Niamey, fixez votre prix et validez la course.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Estimation OSRM automatique</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dialogue en direct avec le chauffeur</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-[#1C1C1C] border border-[#262626] p-6 rounded-3xl space-y-4 relative">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-color)] text-black font-black text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="font-extrabold text-lg text-white">Arriver en sécurité</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Suivez le véhicule en direct, profitez de votre trajet et payez directement en espèces à l'arrivée.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Suivi GPS en temps réel</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Reçu PDF disponible immédiatement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ESPACE CHAUFFEURS */}
      <section id="chauffeurs" className="py-16 px-4 sm:px-8 bg-gradient-to-br from-[#1C1C1C] to-[#0F0F0F] border-t border-[#262626]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-extrabold text-[var(--accent-color)] uppercase tracking-wider bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
              ESPACE CHAUFFEURS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Gagnez plus avec <br />
              <span className="text-[var(--accent-color)]">TAK TAK TAXI</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Vous possédez un taxi ou un véhicule personnel à Niamey ? Rejoignez la plateforme qui valorise les chauffeurs. Pendant la phase Bêta, profitez de **0% de commission** et conservez 100% de vos revenus.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-200">
              <div className="flex items-center gap-2 bg-[#121212] p-3 rounded-2xl border border-[#262626]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>0% de commission sur vos courses</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121212] p-3 rounded-2xl border border-[#262626]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Paiement direct en cash par le passager</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121212] p-3 rounded-2xl border border-[#262626]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Validation rapide CNI/Permis via Gemini</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121212] p-3 rounded-2xl border border-[#262626]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Liberté totale d'horaires et de trajets</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsDriverModalOpen(true);
                }}
                className="bg-[var(--accent-color)] hover:brightness-110 text-black font-extrabold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-xl transition"
              >
                <Car className="w-4 h-4" />
                <span>Devenir chauffeur maintenant</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#121212] border border-[#333] rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[var(--accent-color)]" />
              <span>Inscrire mon véhicule en 2 min</span>
            </h3>
            <p className="text-xs text-gray-400">
              Uploadez simplement une photo de votre Carte Nationale d'Identité et de votre Permis de Conduire. Notre IA Gemini validera vos pièces.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#1C1C1C] rounded-xl border border-[#262626]">
                <span className="text-gray-300">1. Carte d'Identité (CNI)</span>
                <span className="text-emerald-400 font-bold">Inclus OCR Gemini</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#1C1C1C] rounded-xl border border-[#262626]">
                <span className="text-gray-300">2. Permis de Conduire</span>
                <span className="text-emerald-400 font-bold">Vérification Validité</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#1C1C1C] rounded-xl border border-[#262626]">
                <span className="text-gray-300">3. Carte Grise</span>
                <span className="text-emerald-400 font-bold">Immatriculation NE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TÉMOIGNAGES */}
      <section id="temoignages" className="py-16 px-4 sm:px-8 border-t border-[#262626]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              AVIS COMMUNAUTÉ
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Ce que disent nos utilisateurs à Niamey
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-[#1C1C1C] border border-[#262626] p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                « TAK TAK TAXI a changé mes déplacements quotidiens entre l'UAM et le Grand Marché. Je peux négocier le prix à l'avance et le chauffeur arrive en 3 minutes ! »
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#262626]">
                <div className="w-9 h-9 rounded-full bg-[var(--accent-color)]/20 text-[var(--accent-color)] font-bold flex items-center justify-center text-xs">
                  AG
                </div>
                <div>
                  <p className="font-extrabold text-xs text-white">Aïchatou Garba</p>
                  <p className="text-[10px] text-gray-400">Étudiante à l'UAM • Niamey</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#1C1C1C] border border-[#262626] p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                « En tant que chauffeur de taxi vert, le 0% de commission me permet de garder l'intégralité de mon argent à la fin de la journée. La vérification CNI par l'IA est ultra rapide. »
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#262626]">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                  IS
                </div>
                <div>
                  <p className="font-extrabold text-xs text-white">Ibrahim Souley</p>
                  <p className="text-[10px] text-gray-400">Chauffeur Taxi • Harobanda</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-[#1C1C1C] border border-[#262626] p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <p className="text-xs text-gray-300 italic leading-relaxed">
                « Le bouton SOS et le suivi en direct sur la carte me rassurent énormément quand mes proches voyagent tard le soir. Une vraie innovation pour le Niger ! »
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#262626]">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                  MO
                </div>
                <div>
                  <p className="font-extrabold text-xs text-white">Moussa Oumarou</p>
                  <p className="text-[10px] text-gray-400">Commerçant • Niamey</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDÉON */}
      <section id="faq" className="py-16 px-4 sm:px-8 bg-[#141414] border-t border-[#262626]">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-[var(--accent-color)] uppercase tracking-wider bg-[var(--accent-color)]/10 px-3 py-1 rounded-full border border-[var(--accent-color)]/20">
              QUESTIONS FRÉQUENTES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Foire Aux Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Comment créer un compte sur TAK TAK TAXI ?",
                a: "Cliquez simplement sur 'S'inscrire', entrez votre numéro de téléphone nigérien (+227) ou connectez-vous en 1 clic via votre compte Google. L'inscription prend moins de 30 secondes."
              },
              {
                q: "Quels sont les frais de commission pour les chauffeurs ?",
                a: "Pendant toute la période Bêta actuelle, la commission est de 0% ! 100% des gains de la course restent dans la poche du chauffeur."
              },
              {
                q: "Comment sont vérifiés les chauffeurs de taxi ?",
                a: "Chaque chauffeur doit uploader sa CNI, son Permis de conduire et sa Carte grise. Notre technologie d'IA Gemini 1.5 Flash extrait et vérifie automatiquement la validité des documents avant l'activation."
              },
              {
                q: "L'application fonctionne-t-elle sans connexion Internet ?",
                a: "Oui ! Grâce à notre technologie PWA et Dexie.js (IndexedDB), vos 50 dernières courses et vos reçus restent consultables en mode hors-ligne."
              },
              {
                q: "Le service est-il disponible uniquement à Niamey ?",
                a: "TAK TAK TAXI couvre actuellement l'intégralité du district de Niamey (Grand Marché, Harobanda, Aéroport, Wadata, Plateau, etc.) avec une extension prévue très prochainement dans tout le Niger."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#1C1C1C] border border-[#262626] rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-[var(--accent-color)] transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      activeFaq === idx ? 'rotate-180 text-[var(--accent-color)]' : 'text-gray-400'
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-5 sm:px-5 text-xs text-gray-300 leading-relaxed border-t border-[#262626] pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-[var(--accent-color)]/20 via-[#1C1C1C] to-amber-500/20 border-t border-[#262626] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-[var(--accent-color)] text-black flex items-center justify-center font-black mx-auto shadow-2xl">
            <Car className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Prêt à vivre l'expérience du taxi du futur au Niger ?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Rejoignez des milliers de Nigériens qui réservent leurs trajets en toute sérénité.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto bg-[var(--accent-color)] hover:brightness-110 text-black font-black px-8 py-4 rounded-2xl text-sm shadow-2xl transition"
            >
              Créer mon compte gratuitement
            </button>
            <button
              onClick={() => {
                setActiveTab('menu');
              }}
              className="w-full sm:w-auto bg-[#121212] hover:bg-[#262626] border border-[#333] text-white font-extrabold px-6 py-4 rounded-2xl text-sm transition"
            >
              Voir la carte interactive
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#0A0A0A] border-t border-[#262626] py-12 px-4 sm:px-8 text-xs text-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-[#262626]">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/logo-tak-tak.png" alt="TAK TAK TAXI Logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-extrabold text-white text-sm">
                TAK TAK <span className="text-[var(--accent-color)]">TAXI</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              La plateforme moderne de mise en relation de taxis pour la ville de Niamey et le Niger.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Navigation</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => scrollToSection('pourquoi')} className="hover:text-white">Pourquoi nous</button></li>
              <li><button onClick={() => scrollToSection('comment-ca-marche')} className="hover:text-white">Comment ça marche</button></li>
              <li><button onClick={() => scrollToSection('chauffeurs')} className="hover:text-white">Espace Chauffeur</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="hover:text-white">Foire aux questions</button></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Informations Légal & Support</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><span className="text-gray-400">NIF : 48921/NE</span></li>
              <li><span className="text-gray-400">Quartier Plateau, Niamey - Niger</span></li>
              <li><span className="text-gray-400">Email : taktaktaxi2026@gmail.com</span></li>
              <li><span className="text-gray-400">Assistance 24/7 : +227 96 00 00 00</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs">Sécurité & Confiance</h4>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Chauffeurs certifiés IA Gemini</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 text-[11px]">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Cryptage Supabase & SSL</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© 2026 TAK TAK TAXI Niger. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-gray-300">Confidentialité</button>
            <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-gray-300">Conditions d'utilisation</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
