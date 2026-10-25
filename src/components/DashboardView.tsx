import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';

export const DashboardView: React.FC = () => {
  const {
    baseCurrency,
    setBaseCurrency,
    sendAmount,
    setSendAmount,
    currencies,
    rates,
    convert,
    formatAmount,
    settings,
    updateSettings,
    openTransferModal,
    setActiveTab,
    showToast,
    isMobilePreview,
    setIsMobilePreview
  } = useExchange();

  const [isInverse, setIsInverse] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  // Parse amount cleanly
  const parseAmount = (val: string): number => {
    if (!val) return 0;
    const cleaned = val.replace(/,/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const baseVal = parseAmount(sendAmount);

  // Helper for quick additions
  const handleQuickAdd = (addVal: number) => {
    const current = parseAmount(sendAmount);
    const next = current + addVal;
    setSendAmount(next.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleResetAmount = () => {
    setSendAmount('1,000.00');
  };

  const handleClear = () => {
    setSendAmount('');
  };

  // Base swap handler
  const handleSwap = () => {
    const list = ['USD', 'EUR', 'ILS', 'JOD'];
    const idx = list.indexOf(baseCurrency);
    const nextBase = list[(idx + 1) % list.length];
    setBaseCurrency(nextBase);
    setIsInverse(!isInverse);
    showToast(`Base currency switched to ${nextBase}`);
  };

  // Copy rate helper
  const handleCopyRate = (rate: number, code: string) => {
    navigator.clipboard?.writeText(rate.toString());
    showToast(`${code} rate (${rate}) copied to clipboard`);
  };

  // Calculated conversions
  const eurRate = (rates.EUR / rates[baseCurrency]) || 0.9200;
  const ilsRate = (rates.ILS / rates[baseCurrency]) || 3.6800;
  const jodRate = (rates.JOD / rates[baseCurrency]) || 0.7090;
  const usdRate = (rates.USD / rates[baseCurrency]) || 1.0000;

  const eurTotal = convert(baseVal, baseCurrency, 'EUR');
  const ilsTotal = convert(baseVal, baseCurrency, 'ILS');
  const jodTotal = convert(baseVal, baseCurrency, 'JOD');
  const usdTotal = convert(baseVal, baseCurrency, 'USD');

  // Inverse representation
  const inverseEurVal = (1 / eurRate).toFixed(4);

  const baseCurrInfo = currencies.find((c) => c.code === baseCurrency) || currencies[0];

  return (
    <div className="w-full space-y-6">
      {/* Mobile Screen Device Frame (When isMobilePreview is activated) */}
      {isMobilePreview ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl border-8 border-slate-900 shadow-2xl overflow-hidden pb-20 relative">
          {/* Mobile Status Bar */}
          <div className="bg-[#0b1c30] text-white px-6 py-2 flex items-center justify-between text-[11px] font-mono">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
              <span className="material-symbols-outlined text-[14px]">wifi</span>
              <span className="material-symbols-outlined text-[14px]">battery_full</span>
            </div>
          </div>

          {/* Mobile Top App Bar */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c4a]">currency_exchange</span>
              <span className="font-bold text-slate-900 font-display">Lumina Exchange</span>
              <span className="w-2 h-2 rounded-full bg-[#006c4a] animate-pulse"></span>
            </div>
            <button
              onClick={() => showToast('Rates refreshed')}
              className="p-1 rounded-full text-slate-500 hover:bg-slate-100 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* FreeCurrencyAPI status bar & fallback */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
                <span className="font-semibold text-slate-800">FreeCurrencyAPI: Live Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px]">Safe Fallback</span>
                <button
                  onClick={() => updateSettings({ offlineCache: !settings.offlineCache })}
                  className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                    settings.offlineCache ? 'bg-[#006c4a]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-3 h-3 bg-white rounded-full absolute top-[2px] transition-all ${
                      settings.offlineCache ? 'right-[2px]' : 'left-[2px]'
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            {/* Mobile Conversion Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">You Send (Base)</span>
                <span className="text-[#006c4a] bg-[#ECFDF5] px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span> 0% Fee Guaranteed
                </span>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full bg-transparent border-0 p-0 text-slate-900 font-numeral text-2xl font-bold focus:ring-0 focus:outline-none"
                    placeholder="0.00"
                  />
                  {sendAmount && (
                    <button onClick={handleClear} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                    className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-full py-1 px-3 shadow-xs font-bold text-xs cursor-pointer"
                  >
                    <span>{baseCurrInfo.flag}</span>
                    <span>{baseCurrency}</span>
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-slate-500">
                  <span>{baseCurrInfo.name}</span>
                  <span className="text-[#006c4a] font-medium">Mid-market rate</span>
                </div>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-xs">
                {[10, 50, 100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleQuickAdd(val)}
                    className="px-2 py-1 rounded-full border border-slate-200 text-slate-600 text-[11px] hover:border-[#006c4a] hover:text-[#006c4a] cursor-pointer"
                  >
                    +{val >= 1000 ? '1,000' : val}
                  </button>
                ))}
                <button
                  onClick={handleResetAmount}
                  className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Swap Floating Action Node */}
            <div className="relative flex items-center justify-center -my-2 z-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <button
                onClick={handleSwap}
                className="relative bg-white border border-slate-300 rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-slate-50 transition active:scale-90 cursor-pointer"
                title="Swap Base Currency"
              >
                <span className="material-symbols-outlined text-[#006c4a] text-[18px]">swap_vert</span>
              </button>
            </div>

            {/* Live Spot Rate Card */}
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4a] text-[18px]">trending_up</span>
                <div>
                  <span className="font-bold text-slate-900 block">
                    {isInverse ? `1 EUR = ${inverseEurVal} ${baseCurrency}` : `1 ${baseCurrency} = ${eurRate.toFixed(4)} EUR`}
                  </span>
                  <span className="text-[10px] text-slate-500">Live mid-rate • Interbank spread</span>
                </div>
              </div>
              <button
                onClick={() => setIsInverse(!isInverse)}
                className="text-[10px] px-2 py-1 bg-white rounded-full border border-slate-200 shadow-xs font-semibold cursor-pointer"
              >
                Inverse
              </button>
            </div>

            {/* Target Currencies Cards */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-bold text-slate-900 text-sm font-display">Target Currencies</h3>
                <span className="text-xs text-slate-400">4 Active Pairs</span>
              </div>

              {/* EUR */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇪🇺</span>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                      <span>EUR</span>
                      <span className="text-xs text-slate-400 font-normal">Euro</span>
                    </div>
                    <p className="text-[11px] text-slate-500">1 {baseCurrency} = €{eurRate.toFixed(4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-numeral text-base block">€{formatAmount(eurTotal, 'EUR')}</span>
                  <span className="text-[11px] text-[#006c4a] font-semibold flex items-center justify-end">
                    <span className="material-symbols-outlined text-[12px]">north</span> +0.24% today
                  </span>
                </div>
              </div>

              {/* ILS */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇮🇱</span>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                      <span>ILS</span>
                      <span className="text-xs text-slate-400 font-normal">Israeli Shekel</span>
                    </div>
                    <p className="text-[11px] text-slate-500">1 {baseCurrency} = ₪{ilsRate.toFixed(4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-numeral text-base block">₪{formatAmount(ilsTotal, 'ILS')}</span>
                  <span className="text-[11px] text-[#ba1a1a] font-semibold flex items-center justify-end">
                    <span className="material-symbols-outlined text-[12px]">south</span> -0.15% today
                  </span>
                </div>
              </div>

              {/* JOD */}
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇯🇴</span>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                      <span>JOD</span>
                      <span className="text-xs text-slate-400 font-normal">Jordanian Dinar</span>
                    </div>
                    <p className="text-[11px] text-slate-500">1 {baseCurrency} = {jodRate.toFixed(4)} د.أ</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 font-numeral text-base block">{formatAmount(jodTotal, 'JOD')} JOD</span>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-semibold inline-block">
                    Stable (Pegged)
                  </span>
                </div>
              </div>

              {/* USD */}
              <div className="bg-slate-50/70 rounded-xl p-3 border border-dashed border-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇺🇸</span>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                      <span>USD</span>
                      <span className="text-xs text-slate-400 font-normal">Base Reference</span>
                    </div>
                    <p className="text-[11px] text-slate-500">1 {baseCurrency} = ${usdRate.toFixed(4)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-700 font-numeral text-base block">${formatAmount(usdTotal, 'USD')}</span>
                  <span className="text-[10px] text-slate-400">Parity ({usdRate.toFixed(2)})</span>
                </div>
              </div>
            </div>

            {/* Mobile Bottom CTA */}
            <div className="pt-2">
              <button
                onClick={() => openTransferModal('EUR')}
                className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-black transition active:scale-[0.99] cursor-pointer"
              >
                <span>Proceed to Secure Transfer</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Mobile Bottom Navigation Bar (Image 1 & 2) */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-30">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex flex-col items-center text-[#006c4a] font-semibold text-[11px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">content_copy</span>
              <span>Copy Rates</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="flex flex-col items-center text-slate-500 hover:text-[#006c4a] text-[11px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span>Alerts</span>
            </button>
            <button
              onClick={() => setActiveTab('markets')}
              className="flex flex-col items-center text-slate-500 hover:text-[#006c4a] text-[11px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">history</span>
              <span>History</span>
            </button>
          </div>
        </div>
      ) : (
        /* Standard Responsive Desktop View (Matching Image 3 & 4) */
        <>
          {/* HERO / CENTRAL CONVERSION STATION */}
          <section className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-ambient p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ECFDF5] rounded-full blur-3xl opacity-60 pointer-events-none"></div>

            {/* Station Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] font-display">
                    Currency Converter &amp; Live Interbank Rates
                  </h1>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]">
                    Zero-Markup
                  </span>
                </div>
                <p className="text-sm text-[#45464d]">
                  Real-time FX rates powered by FreeCurrencyAPI with zero-fee interbank benchmark.
                </p>
              </div>

              {/* Live Mid-market Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] self-start md:self-auto shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#006c4a]"></span>
                <span className="text-xs font-bold text-slate-900">
                  {isInverse ? `1 EUR = ${inverseEurVal} ${baseCurrency}` : `1 ${baseCurrency} = ${eurRate.toFixed(4)} EUR`}
                </span>
                <span className="text-xs font-bold text-[#006c4a] flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> 0.24% today
                </span>
              </div>
            </div>

            {/* Side-by-side Conversion Layout */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
              {/* Left Column: Base Amount Input */}
              <div className="lg:col-span-7 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5 focus-within:border-[#006c4a]/50 focus-within:ring-4 focus-within:ring-[#006c4a]/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#76777d]">You Send / Base Currency</label>
                  <span className="text-xs font-semibold text-[#006c4a] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">lock</span> Interbank Mid-Rate Guaranteed
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={sendAmount}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.,]/g, '');
                        setSendAmount(val);
                      }}
                      placeholder="0.00"
                      className="w-full bg-transparent border-0 p-0 text-3xl sm:text-4xl text-[#0b1c30] font-numeral font-bold focus:ring-0 focus:outline-none placeholder:text-slate-300 leading-none"
                    />
                  </div>

                  {/* Currency Selector Pill */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                      className="flex items-center gap-2.5 bg-white border border-[#E2E8F0] rounded-full py-2 px-3.5 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xl leading-none">{baseCurrInfo.flag}</span>
                      <span className="text-sm font-bold text-slate-900">{baseCurrency}</span>
                      <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
                    </button>

                    {/* Currency selector dropdown */}
                    {isCurrencyDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-30 max-h-60 overflow-y-auto custom-scroll text-xs">
                        <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Select Base Currency
                        </div>
                        {currencies.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => {
                              setBaseCurrency(c.code);
                              setIsCurrencyDropdownOpen(false);
                              showToast(`Base currency set to ${c.code}`);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ${
                              baseCurrency === c.code ? 'bg-[#ECFDF5] text-[#006c4a] font-bold' : 'text-slate-700'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span>{c.code}</span>
                            </span>
                            <span className="text-[11px] text-slate-400 truncate max-w-[90px]">{c.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Increment Buttons Tray */}
                <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
                  <span className="text-xs text-[#76777d] mr-1">Quick Add:</span>
                  {[10, 50, 100, 500, 1000].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleQuickAdd(val)}
                      className="px-2.5 py-1 rounded-full border border-slate-300 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 hover:border-[#006c4a] transition-colors cursor-pointer active:scale-95"
                    >
                      +{val >= 1000 ? '1,000' : val}
                    </button>
                  ))}
                  <button
                    onClick={handleResetAmount}
                    className="px-2.5 py-1 rounded-full border border-dashed border-slate-300 text-xs text-[#76777d] hover:text-[#ba1a1a] hover:border-[#ba1a1a] transition-colors ml-auto cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Center Swap Action */}
              <div className="lg:col-span-1 flex justify-center -my-2 lg:my-0">
                <button
                  onClick={handleSwap}
                  className="w-11 h-11 rounded-full bg-white border border-[#E2E8F0] shadow-md hover:border-[#006c4a] flex items-center justify-center text-[#006c4a] transition-all active:scale-95 hover:rotate-180 duration-300 cursor-pointer"
                  title="Invert / Cycle Base Currency"
                >
                  <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                </button>
              </div>

              {/* Right Column: Calculation Summary / Instant Breakdown */}
              <div className="lg:col-span-4 bg-[#eff4ff] rounded-2xl border border-[#dce9ff] p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#dce9ff]">
                    <span className="text-xs font-semibold text-[#76777d]">Interbank Spread</span>
                    <span className="text-xs font-bold text-[#006c4a]">0.00% (Free)</span>
                  </div>
                  <div className="py-3 space-y-2 text-xs text-[#45464d]">
                    <div className="flex justify-between">
                      <span>FreeCurrencyAPI Quote</span>
                      <span className="font-semibold text-[#0b1c30] font-mono">
                        1 {baseCurrency} = {eurRate.toFixed(4)} EUR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inverse Ratio</span>
                      <span className="font-semibold text-[#0b1c30] font-mono">
                        1 EUR = {inverseEurVal} {baseCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transfer Processing</span>
                      <span className="text-[#006c4a] font-semibold">Instant Interbank</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#dce9ff]">
                  <button
                    onClick={() => openTransferModal('EUR')}
                    className="w-full h-[52px] bg-slate-900 hover:bg-[#1E293B] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5 active:scale-98 cursor-pointer"
                  >
                    <span>Execute Zero-Spread Order</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* TARGET CURRENCIES GRID (4 RESPONSIVE CARDS) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006c4a] text-[22px]">dashboard</span>
                <h2 className="text-xl font-bold text-[#0b1c30] font-display">
                  Core Multi-Currency Conversions
                </h2>
              </div>
              <div className="text-xs text-[#76777d]">
                Base Reference:{' '}
                <strong className="text-slate-900 font-semibold font-numeral">
                  {formatAmount(baseVal, baseCurrency)} {baseCurrency}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* CARD 1: USD (Parity Benchmark) */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 custom-shadow-card flex flex-col justify-between hover:border-[#006c4a]/50 transition-all">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🇺🇸</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">USD</h3>
                        <p className="text-xs text-[#76777d]">US Dollar</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                      Base / Parity
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="text-2xl font-bold text-slate-900 font-numeral tracking-tight">
                      ${formatAmount(usdTotal, 'USD')}
                    </div>
                    <p className="text-xs text-[#76777d] mt-0.5">1 {baseCurrency} = {usdRate.toFixed(4)} USD</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#76777d] bg-[#F8FAFC] p-2 rounded-lg">
                    <span>24h Range:</span>
                    <span className="font-semibold text-slate-800">$1.000 - $1.000</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {baseCurrency === 'USD' ? (
                    <span className="text-[#006c4a] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span> Active Base
                    </span>
                  ) : (
                    <button
                      onClick={() => setBaseCurrency('USD')}
                      className="text-slate-700 font-semibold hover:text-[#006c4a] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">swap_horiz</span> Set as Base
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyRate(usdRate, 'USD')}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copy Rate"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>

              {/* CARD 2: EUR (Euro) */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 custom-shadow-card flex flex-col justify-between hover:border-[#006c4a]/50 transition-all">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🇪🇺</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">EUR</h3>
                        <p className="text-xs text-[#76777d]">Euro</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF5] text-[#006c4a] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">arrow_upward</span> +0.24%
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="text-2xl font-bold text-slate-900 font-numeral tracking-tight">
                      €{formatAmount(eurTotal, 'EUR')}
                    </div>
                    <p className="text-xs text-[#76777d] mt-0.5">1 {baseCurrency} = {eurRate.toFixed(4)} EUR</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#76777d] bg-[#F8FAFC] p-2 rounded-lg">
                    <span>Spread Spark:</span>
                    <span className="font-semibold text-[#006c4a]">H: €0.924 • L: €0.918</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {baseCurrency === 'EUR' ? (
                    <span className="text-[#006c4a] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span> Active Base
                    </span>
                  ) : (
                    <button
                      onClick={() => setBaseCurrency('EUR')}
                      className="text-slate-700 font-semibold hover:text-[#006c4a] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">swap_horiz</span> Set as Base
                    </button>
                  )}
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={() => handleCopyRate(eurRate, 'EUR')}
                      className="hover:text-slate-700 cursor-pointer"
                      title="Copy Rate"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="hover:text-slate-700 cursor-pointer"
                      title="View Trend Chart"
                    >
                      <span className="material-symbols-outlined text-[16px]">show_chart</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 3: ILS (Israeli New Shekel) */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 custom-shadow-card flex flex-col justify-between hover:border-[#006c4a]/50 transition-all">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🇮🇱</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">ILS</h3>
                        <p className="text-xs text-[#76777d]">Israeli New Shekel</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF2F2] text-[#DC2626] flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">arrow_downward</span> -0.15%
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="text-2xl font-bold text-slate-900 font-numeral tracking-tight">
                      ₪{formatAmount(ilsTotal, 'ILS')}
                    </div>
                    <p className="text-xs text-[#76777d] mt-0.5">1 {baseCurrency} = {ilsRate.toFixed(4)} ILS</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#76777d] bg-[#F8FAFC] p-2 rounded-lg">
                    <span>24h Spread:</span>
                    <span className="font-semibold text-slate-800">H: ₪3.694 • L: ₪3.671</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {baseCurrency === 'ILS' ? (
                    <span className="text-[#006c4a] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span> Active Base
                    </span>
                  ) : (
                    <button
                      onClick={() => setBaseCurrency('ILS')}
                      className="text-slate-700 font-semibold hover:text-[#006c4a] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">swap_horiz</span> Set as Base
                    </button>
                  )}
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={() => handleCopyRate(ilsRate, 'ILS')}
                      className="hover:text-slate-700 cursor-pointer"
                      title="Copy Rate"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="hover:text-slate-700 cursor-pointer"
                      title="View Trend Chart"
                    >
                      <span className="material-symbols-outlined text-[16px]">show_chart</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD 4: JOD (Jordanian Dinar) */}
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 custom-shadow-card flex flex-col justify-between hover:border-[#006c4a]/50 transition-all">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🇯🇴</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">JOD</h3>
                        <p className="text-xs text-[#76777d]">Jordanian Dinar</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                      Pegged Stable
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="text-2xl font-bold text-slate-900 font-numeral tracking-tight">
                      {formatAmount(jodTotal, 'JOD')} د.أ
                    </div>
                    <p className="text-xs text-[#76777d] mt-0.5">1 {baseCurrency} = {jodRate.toFixed(4)} د.أ (3 Decimals)</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#76777d] bg-[#F8FAFC] p-2 rounded-lg">
                    <span>Peg Anchor:</span>
                    <span className="font-semibold text-slate-800">0.7090 Fixed Benchmark</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {baseCurrency === 'JOD' ? (
                    <span className="text-[#006c4a] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span> Active Base
                    </span>
                  ) : (
                    <button
                      onClick={() => setBaseCurrency('JOD')}
                      className="text-slate-700 font-semibold hover:text-[#006c4a] flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">swap_horiz</span> Set as Base
                    </button>
                  )}
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={() => handleCopyRate(jodRate, 'JOD')}
                      className="hover:text-slate-700 cursor-pointer"
                      title="Copy Rate"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="hover:text-slate-700 cursor-pointer"
                      title="View Trend Chart"
                    >
                      <span className="material-symbols-outlined text-[16px]">show_chart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LOWER SECTION / MARKET INTELLIGENCE & API TELEMETRY */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Market Insights Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 custom-shadow-card">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006c4a] text-[22px]">insights</span>
                  <h3 className="text-lg font-bold text-slate-900 font-display">Market Insights</h3>
                </div>
                <span className="text-xs text-[#76777d]">Updated 2m ago</span>
              </div>

              <div className="mt-4 space-y-4">
                {/* USD / EUR Momentum */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">USD / EUR Momentum</span>
                    <span className="text-xs font-bold text-[#006c4a]">Bullish Dollar Bias</span>
                  </div>
                  <p className="text-xs text-[#45464d] mt-1.5 leading-relaxed">
                    The Euro tests lower boundaries near 0.9200 EUR per USD as rate divergence narratives continue between the Federal Reserve and ECB. Low volume sustains tight bid-ask spreads.
                  </p>
                </div>

                {/* ILS Volatility */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">ILS Regional Volatility</span>
                    <span className="text-xs font-bold text-[#DC2626]">30d Volatility: 4.8%</span>
                  </div>
                  <p className="text-xs text-[#45464d] mt-1.5 leading-relaxed">
                    Shekel spot rate stabilizes near 3.680 ILS. Bank of Israel liquidity facilities and FX swap windows maintain moderate fluctuation bands between 3.67 and 3.69 levels.
                  </p>
                </div>

                {/* JOD Peg Report */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">JOD Fixed Peg Parity</span>
                    <span className="text-xs font-semibold text-slate-900">Stability Index 100%</span>
                  </div>
                  <p className="text-xs text-[#45464d] mt-1.5 leading-relaxed">
                    Central Bank of Jordan keeps official peg rock-solid at 0.7090 JOD / USD with foreign exchange reserve ratios well within recommended IMF adequacy margins.
                  </p>
                </div>
              </div>
            </div>

            {/* FreeCurrencyAPI Live Telemetry Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 custom-shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006c4a] text-[22px]">network_ping</span>
                    <h3 className="text-lg font-bold text-slate-900 font-display">API Telemetry</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#ECFDF5] text-[#006c4a]">
                    200 OK
                  </span>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-xs text-[#76777d]">Latency</span>
                    <div className="text-xl font-bold text-slate-900 font-numeral mt-1">48 ms</div>
                    <span className="text-[11px] text-[#006c4a] font-medium">Global Edge Cloud</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-xs text-[#76777d]">Monthly Quota</span>
                    <div className="text-xl font-bold text-slate-900 font-numeral mt-1">
                      142 <span className="text-xs font-normal text-slate-400">/ 5,000</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-[#006c4a] h-full rounded-full" style={{ width: '2.84%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="mt-4 space-y-2 text-xs text-[#45464d]">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Provider</span>
                    <span className="font-semibold text-slate-900">FreeCurrencyAPI v1</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span>Base Currency Fix</span>
                    <span className="font-semibold text-slate-900">{baseCurrency}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Cache Strategy</span>
                    <span className="font-semibold text-[#006c4a]">Browser LocalStorage + SWR</span>
                  </div>
                </div>
              </div>

              {/* API Config Prompt */}
              <div className="mt-6 pt-4 border-t border-[#BFDBFE]/50 bg-[#EFF6FF] -mx-6 -mb-6 p-4 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1D4ED8]">Custom API Key</span>
                    <p className="text-[11px] text-[#1E40AF]">Unlock unlimited requests &amp; custom webhooks.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-3 py-1.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
