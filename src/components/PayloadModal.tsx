import React from 'react';
import { useExchange } from '../context/ExchangeContext';

export const PayloadModal: React.FC = () => {
  const { isPayloadModalOpen, closePayloadModal, rates, baseCurrency, showToast } = useExchange();

  if (!isPayloadModalOpen) return null;

  const payload = {
    endpoint: "v1/latest",
    status: 200,
    timestamp: new Date().toISOString(),
    base_currency: baseCurrency,
    meta: {
      provider: "FreeCurrencyAPI Global Core",
      latency_ms: 18,
      quota_remaining: "4,858 / 5,000",
      edge_node: "fra1-frankfurt",
      tier: "free_tier",
      cache_status: "HIT_EDGE_SWR"
    },
    data: rates
  };

  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    showToast('Payload copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4a] text-[20px]">terminal</span>
            <h3 className="font-bold text-slate-900 text-sm font-display">FreeCurrencyAPI Raw Response</h3>
          </div>
          <button
            onClick={closePayloadModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 flex-1 overflow-auto bg-slate-900 text-emerald-400 font-mono text-xs">
          <pre>{jsonString}</pre>
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center text-xs">
          <span className="text-slate-500">200 OK • Content-Type: application/json</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-white transition cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copy JSON</span>
            </button>
            <button
              onClick={closePayloadModal}
              className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
