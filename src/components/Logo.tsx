import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  onClick
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl'
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-xl bg-[#1C1C1C] border border-[var(--accent-color)] flex items-center justify-center p-0.5 overflow-hidden shadow-lg shrink-0`}
      >
        {!hasError ? (
          <img
            src="/logo-tak-tak.png"
            alt="TAK TAK TAXI Logo"
            className="w-full h-full object-cover rounded-lg"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--accent-color)] to-amber-600 rounded-lg flex items-center justify-center text-black font-black">
            🚖
          </div>
        )}
      </div>

      {showText && (
        <div>
          <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block leading-none">
            TAK TAK <span className="text-[var(--accent-color)]">TAXI</span>
          </span>
          <span className="text-[10px] text-gray-400 font-medium">Niamey • Niger</span>
        </div>
      )}
    </div>
  );
};
