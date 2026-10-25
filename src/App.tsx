/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExchangeProvider, useExchange } from './context/ExchangeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { MarketsView } from './components/MarketsView';
import { HistoricalView } from './components/HistoricalView';
import { SettingsView } from './components/SettingsView';
import { TransferModal } from './components/TransferModal';
import { AddAlertModal } from './components/AddAlertModal';
import { PayloadModal } from './components/PayloadModal';
import { Toast } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeTab, isMobilePreview } = useExchange();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0b1c30]">
      <Header />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'markets' && <MarketsView />}
        {activeTab === 'analytics' && <HistoricalView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {!isMobilePreview && <Footer />}

      {/* Global Interactive Modals and Toasts */}
      <TransferModal />
      <AddAlertModal />
      <PayloadModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ExchangeProvider>
      <MainContent />
    </ExchangeProvider>
  );
}
