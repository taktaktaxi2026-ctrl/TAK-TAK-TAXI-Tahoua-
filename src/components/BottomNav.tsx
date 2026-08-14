import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, PlusCircle, Navigation, Clock, User, ShieldAlert } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, activeCourse, t } = useApp();

  const navItems = [
    { id: 'home' as const, label: t('tab_home'), icon: Home },
    { id: 'menu' as const, label: t('tab_menu'), icon: PlusCircle },
    { id: 'course' as const, label: t('tab_course'), icon: Navigation, hasBadge: !!activeCourse },
    { id: 'history' as const, label: t('tab_history'), icon: Clock },
    { id: 'profile' as const, label: t('tab_profile'), icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#121212] border-t border-[#262626] bottom-nav-safe shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full py-1 relative transition-all touch-target ${
                isActive
                  ? 'text-[var(--accent-color)] font-bold scale-105'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {/* Active gold underline accent */}
              {isActive && (
                <span className="absolute top-0 w-10 h-0.5 rounded-full bg-[var(--accent-color)] glow-gold"></span>
              )}
              
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] sm:text-xs mt-1 leading-tight truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
