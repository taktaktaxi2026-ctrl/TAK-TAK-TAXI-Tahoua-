import React from 'react';
import { useApp } from '../context/AppContext';
import { Car, ShieldAlert, UserCheck, Key, Sparkles, RefreshCw } from 'lucide-react';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const {
    user,
    setUser,
    t,
    setIsAuthModalOpen,
    setIsAdminModalOpen,
    setIsVersionModalOpen,
    sosAlertFeedback
  } = useApp();

  const handleRoleToggle = (role: 'passager' | 'chauffeur' | 'admin') => {
    setUser((prev) => ({
      ...prev,
      role,
      phone: role === 'admin' ? '+227 96 00 00 00' : prev.phone
    }));
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#262626] px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand & Bêta badge with 40x40px Golden Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Logo
            size="md"
            onClick={() => setIsVersionModalOpen(true)}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                TAK TAK <span className="text-[var(--accent-color)]">TAXI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30">
                NIAMEY
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('beta_badge')}
            </p>
          </div>
        </div>

        {/* Center: Quick Role Switcher for seamless Bêta evaluation */}
        <div className="hidden md:flex items-center bg-[#1C1C1C] rounded-full p-1 border border-[#333]">
          <button
            onClick={() => handleRoleToggle('passager')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              user.role === 'passager'
                ? 'bg-[var(--accent-color)] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Passager
          </button>
          <button
            onClick={() => handleRoleToggle('chauffeur')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              user.role === 'chauffeur'
                ? 'bg-[var(--accent-color)] text-black font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Chauffeur
          </button>
          <button
            onClick={() => handleRoleToggle('admin')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              user.role === 'admin'
                ? 'bg-red-600 text-white font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Key className="w-3 h-3" />
            Admin Caché
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Admin Supervisor quick access if role is Admin */}
          {user.role === 'admin' && (
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition"
              title="Ouvrir le Dashboard Superviseur"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Superviseur</span>
            </button>
          )}

          {/* Quick role toggle on mobile */}
          <div className="md:hidden flex items-center bg-[#1C1C1C] rounded-lg p-0.5 border border-[#333]">
            <button
              onClick={() =>
                handleRoleToggle(
                  user.role === 'passager' ? 'chauffeur' : user.role === 'chauffeur' ? 'admin' : 'passager'
                )
              }
              className="px-2 py-1 text-[11px] font-bold text-[var(--accent-color)] flex items-center gap-1"
              title="Changer de rôle (Bêta Test)"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="capitalize">{user.role}</span>
            </button>
          </div>

          {/* Auth modal toggle */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#262626] border border-[#333] text-xs font-semibold text-gray-200 transition"
          >
            <UserCheck className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span className="hidden sm:inline">{user.phone || 'Connexion'}</span>
            <span className="sm:hidden">{user.phone.slice(-4)}</span>
          </button>
        </div>
      </div>

      {/* SOS Toast notification if triggered */}
      {sosAlertFeedback.show && (
        <div className="max-w-md mx-auto mt-2 bg-red-600 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{sosAlertFeedback.text}</span>
          </div>
        </div>
      )}
    </header>
  );
};
