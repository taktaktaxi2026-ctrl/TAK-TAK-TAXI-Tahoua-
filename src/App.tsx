/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/tabs/HomeTab';
import { MenuTab } from './components/tabs/MenuTab';
import { CourseTab } from './components/tabs/CourseTab';
import { HistoryTab } from './components/tabs/HistoryTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { AuthModal } from './components/modals/AuthModal';
import { DriverVerificationModal } from './components/modals/DriverVerificationModal';
import { SosModal } from './components/modals/SosModal';
import { AdminDashboardModal } from './components/modals/AdminDashboardModal';
import { VersionUpdateModal } from './components/modals/VersionUpdateModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { SplashScreen } from './components/SplashScreen';

const AppContent: React.FC = () => {
  const {
    activeTab,
    showSplash,
    setShowSplash,
    isReceiptModalOpen,
    setIsReceiptModalOpen,
    selectedReceiptCourse,
    downloadReceipt
  } = useApp();

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[#F3F4F6] flex flex-col font-sans selection:bg-[var(--accent-color)] selection:text-black">
      {/* 1. Splash Screen on initial load or reload */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 2. Sticky Top Bar (Header with 40x40px logo) */}
      <Navbar />

      {/* Main Container - Mobile first & Desktop responsive */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 pt-3 pb-24">
        {activeTab === 'home' && <HomeTab />}
        {activeTab === 'menu' && <MenuTab />}
        {activeTab === 'course' && <CourseTab />}
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Style 1xBet 5-Tab Bottom Navigation */}
      <BottomNav />

      {/* Modals */}
      <AuthModal />
      <DriverVerificationModal />
      <SosModal />
      <AdminDashboardModal />
      <VersionUpdateModal />
      {isReceiptModalOpen && (
        <ReceiptModal
          course={selectedReceiptCourse}
          onClose={() => setIsReceiptModalOpen(false)}
          onDownloadTxt={downloadReceipt}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
