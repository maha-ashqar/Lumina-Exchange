import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { ActiveTab } from '../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    lastSyncTime,
    isSyncing,
    refreshRates,
    settings,
    updateSettings,
    isMobilePreview,
    setIsMobilePreview,
    showToast
  } = useExchange();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const navLinks: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'markets', label: 'Markets' },
    { id: 'analytics', label: 'Rate Alerts' },
    { id: 'settings', label: 'API Docs' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] flex items-center justify-between h-16">
        {/* Left: Brand Anchor & Live Status */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#006c4a] transition-transform group-hover:scale-105 shadow-xs">
              <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b1c30] font-display">
              Lumina Exchange
            </span>
          </button>

          {/* Live Status Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#006c4a] text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c4a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006c4a]"></span>
            </span>
            <span>FreeCurrencyAPI: Live Mode</span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`text-sm font-semibold pb-1 transition-colors relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#006c4a] border-b-2 border-[#006c4a]'
                    : 'text-[#45464d] hover:text-[#006c4a]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#006c4a] md:hidden"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile vs Desktop View Toggle (Helpful to switch between Image 1/2 mobile screen & Image 4 desktop) */}
          <button
            onClick={() => {
              setIsMobilePreview(!isMobilePreview);
              showToast(isMobilePreview ? 'Switched to Standard Responsive View' : 'Switched to Mobile Mockup Screen View');
            }}
            title={isMobilePreview ? 'Switch to Full Desktop View' : 'Preview Exact Mobile Device View'}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isMobilePreview
                ? 'bg-[#006c4a] text-white border-[#006c4a]'
                : 'bg-white text-[#45464d] border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isMobilePreview ? 'devices' : 'smartphone'}
            </span>
            <span className="hidden xl:inline">{isMobilePreview ? 'Desktop Mode' : 'Mobile View'}</span>
          </button>

          {/* Offline Cache Switch */}
          <div className="hidden lg:flex items-center gap-2 pr-3 border-r border-[#E2E8F0]">
            <span className="text-xs text-[#76777d]">Offline Cache</span>
            <button
              onClick={() => updateSettings({ offlineCache: !settings.offlineCache })}
              className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none cursor-pointer ${
                settings.offlineCache ? 'bg-[#006c4a]' : 'bg-[#c6c6cd]'
              }`}
              type="button"
              aria-label="Toggle offline cache"
            >
              <span
                className={`block w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-transform ${
                  settings.offlineCache ? 'right-[3px]' : 'left-[3px]'
                }`}
              />
            </button>
          </div>

          {/* Sync status */}
          <div className="hidden xl:flex items-center gap-1 text-[#76777d] text-xs font-mono">
            <span className="material-symbols-outlined text-[15px]">sync</span>
            <span>Sync: {lastSyncTime}</span>
          </div>

          {/* Refresh Action */}
          <button
            onClick={refreshRates}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#0b1c30] text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            title="Refresh Exchange Rates"
          >
            <span
              className={`material-symbols-outlined text-[16px] text-[#006c4a] ${
                isSyncing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 rounded-lg text-[#45464d] hover:text-[#006c4a] hover:bg-slate-50 relative cursor-pointer"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </button>

            {/* Notification Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-bold text-slate-800">
                  <span>Market & System Alerts</span>
                  <span className="text-[#006c4a] text-[11px] font-semibold">2 New</span>
                </div>
                <div className="divide-y divide-slate-100 py-1">
                  <div className="py-2">
                    <p className="font-semibold text-slate-800">EUR/USD Momentum Trigger</p>
                    <p className="text-slate-500 text-[11px]">Euro trading close to 0.9200 boundary.</p>
                  </div>
                  <div className="py-2">
                    <p className="font-semibold text-slate-800">ILS Regional Volatility</p>
                    <p className="text-slate-500 text-[11px]">30d volatility registered at 4.8%.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    setIsNotifOpen(false);
                  }}
                  className="w-full mt-1 pt-1.5 border-t border-slate-100 text-[#006c4a] font-semibold text-center hover:underline block"
                >
                  Manage Rate Alerts &rarr;
                </button>
              </div>
            )}
          </div>

          {/* User Avatar Badge */}
          <div className="w-8 h-8 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-xs select-none">
            LX
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer / Horizontal Link Strip */}
      <div className="md:hidden border-t border-[#E2E8F0] bg-[#f8f9ff] px-4 py-2 flex items-center justify-around text-xs font-semibold">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#006c4a] text-white'
                  : 'text-[#45464d] hover:bg-slate-200/50'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
