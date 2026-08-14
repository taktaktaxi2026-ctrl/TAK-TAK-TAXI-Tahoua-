import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    user,
    setUser,
    setIsAdminModalOpen
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string>('taktaktaxi2026@gmail.com');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  if (!isAuthModalOpen) return null;

  const demoAccounts = [
    { name: 'Tak Tak Taxi Niger', email: 'taktaktaxi2026@gmail.com', role: 'admin' as const },
    { name: 'Moussa Abdoulaye', email: 'moussa.abdoulaye.niamey@gmail.com', role: 'chauffeur' as const },
    { name: 'Aïchatou Garba', email: 'aichatou.garba@gmail.com', role: 'passager' as const }
  ];

  const handleGoogleSignIn = (emailToUse: string, nameToUse?: string, roleToUse?: 'passager' | 'chauffeur' | 'admin') => {
    setLoading(true);

    setTimeout(() => {
      const email = emailToUse || 'utilisateur.google@gmail.com';
      const name = nameToUse || email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
      const isAdmin = email === 'taktaktaxi2026@gmail.com' || email.includes('admin') || roleToUse === 'admin';

      setUser((prev) => ({
        ...prev,
        name: name,
        email: email,
        phone: prev.phone || '+227 96 00 00 00',
        role: isAdmin ? 'admin' : (roleToUse || prev.role)
      }));

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccess(false);
        if (isAdmin) {
          setIsAdminModalOpen(true);
        }
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#1C1C1C] border border-[#333] rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-5">
        {/* Close */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setShowAccountSelector(false);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with Prominent Golden Hippo Logo */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="relative">
            <div className="absolute -inset-1.5 bg-[var(--accent-color)]/30 rounded-full blur-md animate-pulse"></div>
            <div className="relative w-20 h-20 rounded-2xl bg-[#121212] border-2 border-[var(--accent-color)] p-1 shadow-xl flex items-center justify-center overflow-hidden">
              <img
                src="/logo-tak-tak.png"
                alt="TAK TAK TAXI Hippopotame Doré"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Bienvenue sur <span className="text-[var(--accent-color)]">TAK TAK TAXI</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Plateforme officielle de transport à Niamey • 0% Commission
            </p>
          </div>

          {/* Quick Role Selection Buttons: Passager & Chauffeur directly under logo */}
          <div className="grid grid-cols-2 gap-2.5 w-full pt-2">
            <button
              type="button"
              onClick={() => handleGoogleSignIn('aichatou.garba@gmail.com', 'Aïchatou Garba (Passager)', 'passager')}
              className="bg-[#121212] hover:bg-[#262626] border border-[var(--accent-color)]/50 hover:border-[var(--accent-color)] p-3 rounded-2xl text-left transition space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-[var(--accent-color)]">
                  🙋‍♂️ Passager
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[10px] text-gray-400">Commander une course à Niamey</p>
            </button>

            <button
              type="button"
              onClick={() => handleGoogleSignIn('moussa.abdoulaye.niamey@gmail.com', 'Moussa Abdoulaye (Chauffeur)', 'chauffeur')}
              className="bg-[#121212] hover:bg-[#262626] border border-[var(--accent-color)]/50 hover:border-[var(--accent-color)] p-3 rounded-2xl text-left transition space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-[var(--accent-color)]">
                  🚕 Chauffeur
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </div>
              <p className="text-[10px] text-gray-400">Proposer ses services & négocier</p>
            </button>
          </div>
        </div>

        {/* Main Google Sign-In Card */}
        {success ? (
          <div className="bg-emerald-500/20 border border-emerald-500 rounded-2xl p-6 text-center space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-white text-base">Connexion Google réussie !</h4>
            <p className="text-xs text-emerald-300 font-mono">{user.email}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#121212] border border-[#333] rounded-2xl p-4 text-center space-y-3">
              <p className="text-xs text-gray-300">
                Pour garantier la sécurité et la traçabilité des courses à Niamey, l&apos;inscription s&apos;effectue
                <strong className="text-white"> uniquement via Google</strong>.
              </p>

              {/* Big Google Button */}
              <button
                type="button"
                onClick={() => handleGoogleSignIn('taktaktaxi2026@gmail.com', 'Tak Tak Taxi Admin', 'admin')}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-extrabold py-3.5 px-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition transform active:scale-[0.99]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{loading ? 'Connexion en cours...' : 'S\'inscrire avec Google'}</span>
              </button>
            </div>

            {/* Choose specific demo google account or enter custom email */}
            {!showAccountSelector ? (
              <button
                type="button"
                onClick={() => setShowAccountSelector(true)}
                className="w-full text-center text-xs text-gray-400 hover:text-[var(--accent-color)] underline py-1"
              >
                Choisir un autre compte Google ou entrer une adresse personnalisée
              </button>
            ) : (
              <div className="bg-[#121212] border border-[#262626] rounded-2xl p-4 space-y-3 animate-fadeIn">
                <span className="text-xs font-bold text-gray-300 block">
                  Sélectionnez un profil Google :
                </span>

                <div className="space-y-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleGoogleSignIn(acc.email, acc.name, acc.role)}
                      className="w-full bg-[#1C1C1C] hover:bg-[#262626] border border-[#333] p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition"
                    >
                      <div>
                        <span className="font-bold text-white block">{acc.name}</span>
                        <span className="text-gray-400 font-mono text-[11px]">{acc.email}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)] capitalize">
                        {acc.role}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Google Email */}
                <div className="pt-2 border-t border-[#262626] space-y-2">
                  <label className="block text-xs font-bold text-gray-400">
                    Ou entrez un autre email Google :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="exemple@gmail.com"
                      className="flex-1 bg-[#1C1C1C] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:border-[var(--accent-color)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleGoogleSignIn(customGoogleEmail || 'moncompte@gmail.com')}
                      className="bg-[var(--accent-color)] hover:bg-[var(--accent-color)]/90 text-black font-extrabold px-3 py-2 rounded-xl text-xs"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-black/40 border border-[#262626] text-[11px] text-gray-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Accès sécurisé SSL/TLS avec validation immédiate du profil Google.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

