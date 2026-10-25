import React, { useState, useEffect } from 'react';
import { useExchange } from '../context/ExchangeContext';

export const AddAlertModal: React.FC = () => {
  const { isAlertModalOpen, closeAlertModal, alertPrefillPair, addAlert, rates } = useExchange();
  const [pair, setPair] = useState(alertPrefillPair);
  const [condition, setCondition] = useState<'drops_below' | 'rises_above' | 'volatility_spike'>('drops_below');
  const [threshold, setThreshold] = useState('0.9150');
  const [channel, setChannel] = useState<'webhook' | 'email'>('webhook');

  useEffect(() => {
    if (alertPrefillPair) {
      setPair(alertPrefillPair);
      if (alertPrefillPair.includes('ILS')) setThreshold('3.6500');
      else if (alertPrefillPair.includes('JOD')) setThreshold('0.7088');
      else setThreshold('0.9150');
    }
  }, [alertPrefillPair]);

  if (!isAlertModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const condLabel =
      condition === 'drops_below'
        ? `drops below ${threshold}`
        : condition === 'rises_above'
        ? `rises above ${threshold}`
        : `intra-day deviation spike > ${threshold}%`;

    addAlert({
      title: `${pair} ${condition === 'drops_below' ? 'Drop' : condition === 'rises_above' ? 'Surge' : 'Volatility'} Alert`,
      pair,
      condition,
      threshold: parseFloat(threshold) || 0,
      isActive: true,
      typeBadge: 'Active Trigger',
      description: `Notify via ${channel} when ${pair} ${condLabel}`
    });
    closeAlertModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c4a] text-[22px]">notifications_active</span>
            <h3 className="font-bold text-slate-900 text-sm font-display">Create FX Rate Alert</h3>
          </div>
          <button
            onClick={closeAlertModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Currency Pair</label>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#006c4a]"
            >
              <option value="EUR/USD">EUR/USD (Euro / US Dollar)</option>
              <option value="USD/ILS">USD/ILS (US Dollar / Israeli Shekel)</option>
              <option value="USD/JOD">USD/JOD (US Dollar / Jordanian Dinar)</option>
              <option value="GBP/USD">GBP/USD (British Pound / US Dollar)</option>
              <option value="USD/JPY">USD/JPY (US Dollar / Japanese Yen)</option>
              <option value="AED/USD">AED/USD (UAE Dirham / US Dollar)</option>
              <option value="SAR/USD">SAR/USD (Saudi Riyal / US Dollar)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Trigger Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#006c4a]"
            >
              <option value="drops_below">Rate Drops Below Threshold</option>
              <option value="rises_above">Rate Rises Above Threshold</option>
              <option value="volatility_spike">Intra-day Volatility Spike (%)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {condition === 'volatility_spike' ? 'Deviation Threshold (%)' : 'Price Target Threshold'}
            </label>
            <input
              type="number"
              step="any"
              required
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="e.g. 0.9150"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#006c4a] font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notification Dispatch Channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannel('webhook')}
                className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${
                  channel === 'webhook'
                    ? 'bg-[#ECFDF5] border-[#006c4a] text-[#006c4a]'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Inbound Webhook
              </button>
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${
                  channel === 'email'
                    ? 'bg-[#ECFDF5] border-[#006c4a] text-[#006c4a]'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                Instant Push Email
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeAlertModal}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#006c4a] text-white font-bold hover:bg-[#005137] cursor-pointer"
            >
              Create Trigger Rule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
