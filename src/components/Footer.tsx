import React from 'react';
import { useExchange } from '../context/ExchangeContext';

export const Footer: React.FC = () => {
  const { setActiveTab, showToast, openPayloadModal } = useExchange();

  return (
    <footer className="bg-[#eff4ff] border-t border-[#dce9ff] w-full mt-12 py-6">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        {/* Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="font-bold text-[#0b1c30] flex items-center gap-1.5 font-display text-sm">
            <span className="material-symbols-outlined text-[#006c4a] text-[18px]">currency_exchange</span>
            <span>Lumina Exchange</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="text-[#45464d]">
            © 2025 Lumina Exchange. Powered by FreeCurrencyAPI. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#45464d]">
          <button
            onClick={() => setActiveTab('analytics')}
            className="hover:text-[#006c4a] transition-colors cursor-pointer"
          >
            Market Insights
          </button>
          <button
            onClick={openPayloadModal}
            className="hover:text-[#006c4a] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
            API Status
          </button>
          <button
            onClick={() => showToast('Privacy Policy: Lumina Exchange stores zero personal telemetry and processes conversions client-side.')}
            className="hover:text-[#006c4a] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => showToast('Terms of Service: Free interbank rates benchmarked at zero-markup spreads.')}
            className="hover:text-[#006c4a] transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
};
