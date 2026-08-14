import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onFinish) setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F0F0F] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-500">
      {/* Background ambient lighting */}
      <div className="absolute w-72 h-72 bg-[var(--accent-color)]/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-sm w-full">
        {/* Logo Container 120x120px with slow pulse animation */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[var(--accent-color)]/30 to-amber-500/30 rounded-full blur-md animate-pulse"></div>
          <div className="relative w-[120px] h-[120px] rounded-full bg-[#1A1A1A] border-2 border-[var(--accent-color)]/80 flex items-center justify-center overflow-hidden shadow-2xl p-1.5 animate-pulse">
            <img
              src="/logo-tak-tak.png"
              alt="TAK TAK TAXI Hippopotame Doré"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Brand Text */}
        <div>
          <h1 className="text-2xl font-black text-white tracking-wider flex items-center justify-center gap-1.5">
            TAK TAK <span className="text-[var(--accent-color)]">TAXI</span>
          </h1>
          <p className="text-xs text-amber-400 font-bold tracking-widest uppercase mt-1">
            Niamey • Niger
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Service de Taxi sans commission
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full space-y-2 pt-4">
          <div className="w-full bg-[#1C1C1C] h-2.5 rounded-full overflow-hidden border border-[#333] p-0.5">
            <div
              className="bg-gradient-to-r from-[var(--accent-color)] to-amber-400 h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(212,175,55,0.6)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1">
            <span>Initialisation GPS Niamey...</span>
            <span className="text-[var(--accent-color)] font-bold">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
