import React from 'react';
import { useExchange } from '../context/ExchangeContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useExchange();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-[#0b1c30] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold z-50 animate-bounce duration-300 border border-slate-700">
      <span className="material-symbols-outlined text-[#82f5c1] text-[18px]">check_circle</span>
      <span>{toastMessage}</span>
    </div>
  );
};
