import React, { useState, useEffect } from 'react';
import { useExchange } from '../context/ExchangeContext';

export const TransferModal: React.FC = () => {
  const {
    isTransferModalOpen,
    closeTransferModal,
    baseCurrency,
    transferTargetCode,
    sendAmount,
    convert,
    formatAmount,
    currencies,
    rates,
    showToast
  } = useExchange();

  const [recipient, setRecipient] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 min lock
  const [txHash, setTxHash] = useState('');

  const numAmount = parseFloat(sendAmount.replace(/,/g, '')) || 0;
  const targetCurrency = currencies.find((c) => c.code === transferTargetCode) || currencies[1];
  const convertedTotal = convert(numAmount, baseCurrency, transferTargetCode);

  useEffect(() => {
    if (!isTransferModalOpen) {
      setStep('form');
      setSecondsRemaining(900);
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isTransferModalOpen]);

  if (!isTransferModalOpen) return null;

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      setTxHash(`LX-FX-${Math.floor(100000 + Math.random() * 900000)}-${baseCurrency}${transferTargetCode}`);
      setStep('success');
      showToast('Zero-spread order settled via interbank network');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#006c4a] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                {step === 'success' ? 'Transfer Executed Successfully' : 'Execute Zero-Spread Order'}
              </h3>
              <p className="text-xs text-slate-500">Institutional Interbank Settlement Window</p>
            </div>
          </div>
          <button
            onClick={closeTransferModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleExecute} className="p-6 space-y-4">
            {/* Rate lock guarantee countdown */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs">
              <div className="flex items-center gap-2 text-[#006c4a] font-semibold">
                <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                <span>Interbank Mid-Rate Locked (0.00% Spread)</span>
              </div>
              <span className="font-mono font-bold text-[#006c4a] bg-white px-2 py-0.5 rounded shadow-xs">
                {formatTimer(secondsRemaining)}
              </span>
            </div>

            {/* Conversion Details Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">You Send (From {baseCurrency}):</span>
                <span className="font-bold text-slate-900 font-numeral text-sm">
                  {formatAmount(numAmount, baseCurrency)} {baseCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Recipient Receives ({transferTargetCode}):</span>
                <span className="font-bold text-[#006c4a] font-numeral text-base">
                  {formatAmount(convertedTotal, transferTargetCode)} {transferTargetCode}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
                <span>FreeCurrencyAPI Live Quote:</span>
                <span className="font-mono font-semibold text-slate-700">
                  1 {baseCurrency} = {(rates[transferTargetCode] / rates[baseCurrency]).toFixed(4)} {transferTargetCode}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Interbank Markup / Commission:</span>
                <span className="font-bold text-[#006c4a]">$0.00 (Zero Fee)</span>
              </div>
            </div>

            {/* Recipient Details Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="transferRecipient">
                Recipient IBAN / Account Number
              </label>
              <input
                id="transferRecipient"
                type="text"
                required
                placeholder="e.g. GB29 XFER 4040 2912 3456 78"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#006c4a] focus:ring-2 focus:ring-[#006c4a]/20 font-mono"
              />
            </div>

            {/* Security Notice */}
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#006c4a]">verified_user</span>
              <span>Encrypted via TLS 1.3 straight through to regional liquidity hubs.</span>
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={closeTransferModal}
                className="px-4 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#006c4a] text-white text-xs font-bold hover:bg-[#005137] shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Confirm & Execute</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-10 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-3 border-[#006c4a] border-t-transparent animate-spin"></div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Transmitting to FX Settlement Window...</h4>
              <p className="text-xs text-slate-500 mt-1">Routing order through zero-markup interbank pool.</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#006c4a] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">check</span>
            </div>
            <div className="text-center">
              <h4 className="font-bold text-slate-900 text-lg font-display">Settlement Authorized</h4>
              <p className="text-xs text-slate-500">Funds dispatched with zero interbank spread.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">{txHash}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Sent:</span>
                <span className="font-bold text-slate-800 font-numeral">
                  {formatAmount(numAmount, baseCurrency)} {baseCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivered Total:</span>
                <span className="font-bold text-[#006c4a] font-numeral">
                  {formatAmount(convertedTotal, transferTargetCode)} {transferTargetCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-[#006c4a] font-bold">Instant Interbank Completed</span>
              </div>
            </div>

            <button
              onClick={closeTransferModal}
              className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
