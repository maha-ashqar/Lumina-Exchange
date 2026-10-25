import React, { useState, useEffect } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { CurrencyInfo } from '../types';

export const MarketsView: React.FC = () => {
  const {
    currencies,
    baseCurrency,
    setBaseCurrency,
    rates,
    watchlist,
    toggleWatchlist,
    setActiveTab,
    openTransferModal,
    openAlertModal,
    refreshRates,
    isSyncing,
    showToast
  } = useExchange();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'major' | 'levant' | 'pegged'>('all');
  const [sortBy, setSortBy] = useState<'change' | 'name' | 'volume' | 'rate'>('change');
  const [currentPage, setCurrentPage] = useState(1);
  const [liveClock, setLiveClock] = useState('14:02:18.420 UTC');

  // Live millisecond UTC clock matching Image 8
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getUTCMilliseconds() / 10)).padStart(2, '0');
      setLiveClock(`${h}:${m}:${s}.${ms} UTC`);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Filter and sort currency pairs
  const filteredCurrencies = currencies.filter((c) => {
    // category filter
    if (selectedCategory === 'major' && c.category !== 'major') return false;
    if (selectedCategory === 'levant' && c.category !== 'levant' && c.code !== 'JOD' && c.code !== 'AED' && c.code !== 'SAR') return false;
    if (selectedCategory === 'pegged' && !c.isPegged) return false;

    // search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = c.code.toLowerCase().includes(q);
      const matchName = c.name.toLowerCase().includes(q);
      const matchCountry = c.country.toLowerCase().includes(q);
      const matchPair = `${c.code}/USD`.toLowerCase().includes(q) || `USD/${c.code}`.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchCountry && !matchPair) return false;
    }
    return true;
  });

  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rate') return b.rateVsUSD - a.rateVsUSD;
    if (sortBy === 'change') return Math.abs(b.change24h) - Math.abs(a.change24h);
    return 0;
  });

  // Pagination (8 items per page)
  const pageSize = 8;
  const totalPages = Math.ceil(sortedCurrencies.length / pageSize) || 1;
  const paginatedList = sortedCurrencies.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getPairRate = (c: CurrencyInfo) => {
    if (c.code === 'EUR') {
      // Return EUR/USD quote: 1 EUR = ~1.0870 USD
      return (1 / c.rateVsUSD).toFixed(4);
    }
    if (c.code === 'GBP') {
      return (1 / c.rateVsUSD).toFixed(4);
    }
    return c.rateVsUSD.toFixed(c.defaultDecimals);
  };

  const getPairName = (c: CurrencyInfo) => {
    if (c.code === 'EUR' || c.code === 'GBP') return `${c.code}/USD`;
    if (c.code === 'USD') return 'USD/USD';
    return `${c.code}/USD`;
  };

  const getBidAsk = (c: CurrencyInfo) => {
    const rate = parseFloat(getPairRate(c));
    const spread = c.bidSpread || 0.0004;
    const bid = (rate - spread / 2).toFixed(c.code === 'JPY' ? 2 : 4);
    const ask = (rate + spread / 2).toFixed(c.code === 'JPY' ? 2 : 4);
    return { bid, ask };
  };

  return (
    <div className="w-full space-y-6">
      {/* Real-time Connectivity Notice */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006c4a] text-[18px]">verified_user</span>
          <span>
            Institutional Multi-Hub Feed via <strong className="text-slate-900 font-semibold">FreeCurrencyAPI Global Core</strong>
          </span>
          <span className="hidden md:inline px-2 py-0.5 rounded bg-slate-100 text-[11px] text-[#006c4a] font-mono font-medium">
            99.995% UPTIME
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-mono text-slate-900">
            <span className="material-symbols-outlined text-[14px] text-[#006c4a]">schedule</span>
            Last Tick: <span className="font-semibold text-[#006c4a]">{liveClock}</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          <span className="text-[#006c4a] font-medium">Latency: 14ms</span>
        </div>
      </div>

      {/* PAGE HERO & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-[#006c4a] font-bold">FX Interbank Spot Rates</span>
            <span className="text-xs text-slate-300">•</span>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#006c4a] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a] animate-pulse"></span>
              Real-Time Engine Active
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display tracking-tight">
            Global Live Rates &amp; Market Watch
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live streaming interbank mid-market currency pricing, liquidity depth analysis, and regional currency baskets.
          </p>
        </div>

        {/* Global Controls: Base Currency & Search */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Base Switcher */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-0.5 text-xs">
            <span className="text-slate-400 px-2 hidden sm:inline">Base:</span>
            {['USD', 'EUR', 'ILS', 'JOD'].map((b) => (
              <button
                key={b}
                onClick={() => {
                  setBaseCurrency(b);
                  showToast(`Base currency shifted to ${b}`);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  baseCurrency === b ? 'bg-[#006c4a] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Filter Search Bar */}
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pair or country (e.g. EUR, ILS, JOD)..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#006c4a] focus:ring-2 focus:ring-[#006c4a]/20 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* CORE HIGHLIGHT METRIC BENTO TILES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: 24h Global Volume */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">24h Global FX Volume</span>
            <span className="p-1.5 rounded-lg bg-slate-50 text-[#006c4a] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">stacked_line_chart</span>
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-numeral tracking-tight">
            $4.20B
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#006c4a] font-medium">
            <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
            <span>+8.4% vs 7-day average</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#006c4a]/40 via-[#006c4a] to-[#82f5c1]"></div>
        </div>

        {/* Metric 2: Benchmark Rate (EUR/USD) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Benchmark Rate (EUR/USD)</span>
            <span className="p-1.5 rounded-lg bg-slate-50 text-[#006c4a] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">euro</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-numeral tracking-tight">
              1.0870
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#006c4a] text-xs font-bold border border-[#A7F3D0]">
              +0.24%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Day Low: 1.0841</span>
            <span>Day High: 1.0892</span>
          </div>
        </div>

        {/* Metric 3: High Volatility Alert (ILS/USD) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold flex items-center gap-1 text-slate-700">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[16px]">warning</span>
              High Volatility Alert (ILS/USD)
            </span>
            <span className="p-1.5 rounded-lg bg-red-50 text-[#ba1a1a] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">show_chart</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-numeral tracking-tight">
              3.6800
            </div>
            <span className="px-2 py-0.5 rounded-md bg-red-50 text-[#ba1a1a] text-xs font-bold border border-red-200">
              -0.15%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span className="text-[#ba1a1a] font-medium">Levant Flow Momentum</span>
            <span>Spread: 0.0025</span>
          </div>
        </div>

        {/* Metric 4: Pegged Stability (JOD/USD) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Pegged Stability (JOD/USD)</span>
            <span className="p-1.5 rounded-lg bg-slate-50 text-[#006c4a] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-numeral tracking-tight">
              0.7090
            </div>
            <span className="px-2 py-0.5 rounded-md bg-[#82f5c1] text-[#00714e] text-xs font-bold">
              100% Fixed
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>CBJ Official Target Range</span>
            <span className="font-mono text-[#006c4a] font-semibold">Zero Variance</span>
          </div>
        </div>
      </section>

      {/* MARKET TABLE SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filter Bar & Category Navigation */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 custom-scroll text-xs">
            {[
              { id: 'all', label: 'All Currencies' },
              { id: 'major', label: 'Major FX' },
              { id: 'levant', label: 'Middle East & Levant' },
              { id: 'pegged', label: 'Pegged Assets' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedCategory(tab.id as any);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort by Controls */}
          <div className="flex items-center gap-2 self-end md:self-auto text-xs">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg text-slate-700 px-3 py-1.5 focus:outline-none focus:border-[#006c4a]"
            >
              <option value="change">24h Change %</option>
              <option value="name">Currency Name</option>
              <option value="volume">24h Trading Volume</option>
              <option value="rate">Exchange Rate</option>
            </select>
            <button
              onClick={refreshRates}
              className={`p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer ${
                isSyncing ? 'animate-spin' : ''
              }`}
              title="Sync live ticks"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-10 text-center">★</th>
                <th className="py-3 px-4">Currency Pair</th>
                <th className="py-3 px-4">Country &amp; Name</th>
                <th className="py-3 px-4 text-right font-mono">Real-Time Bid</th>
                <th className="py-3 px-4 text-right font-mono">Real-Time Ask</th>
                <th className="py-3 px-4 text-right">24h Change</th>
                <th className="py-3 px-4 text-right font-mono">24h High</th>
                <th className="py-3 px-4 text-right font-mono">24h Low</th>
                <th className="py-3 px-4 text-center">7-Day Trend</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedList.map((c) => {
                const pairStr = getPairName(c);
                const isStarred = watchlist.includes(pairStr);
                const { bid, ask } = getBidAsk(c);
                const isPositive = c.change24h >= 0;

                return (
                  <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                    {/* Watchlist star */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleWatchlist(pairStr)}
                        className="text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                        title="Add to Watchlist"
                      >
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            isStarred ? 'text-amber-500 fill-amber-500' : ''
                          }`}
                        >
                          star
                        </span>
                      </button>
                    </td>

                    {/* Pair & Tag */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-display text-sm">{pairStr}</span>
                        {c.isPegged ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#82f5c1] text-[#00714e]">
                            PEGGED
                          </span>
                        ) : c.code === 'ILS' ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            VOLATILE
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            FX
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Country & Flag */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl leading-none">{c.flag}</span>
                        <div>
                          <div className="font-semibold text-slate-900">{c.country}</div>
                          <div className="text-[11px] text-slate-400">{c.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Bid & Ask */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 text-xs">
                      {bid}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 text-xs">
                      {ask}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3 px-4 text-right">
                      {c.isPegged && c.change24h === 0 ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                          0.00%
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            isPositive
                              ? 'bg-[#ECFDF5] text-[#006c4a] border border-[#A7F3D0]'
                              : 'bg-red-50 text-[#ba1a1a] border border-red-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isPositive ? 'arrow_drop_up' : 'arrow_drop_down'}
                          </span>
                          {isPositive ? `+${c.change24h}%` : `${c.change24h}%`}
                        </span>
                      )}
                    </td>

                    {/* 24h High & Low */}
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500">
                      {c.high24h.toFixed(c.defaultDecimals)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500">
                      {c.low24h.toFixed(c.defaultDecimals)}
                    </td>

                    {/* 7-Day Trend SVG */}
                    <td className="py-3 px-4 text-center">
                      <svg className="w-20 h-6 mx-auto overflow-visible" viewBox="0 0 100 30">
                        {c.isPegged ? (
                          <line x1="0" y1="15" x2="100" y2="15" stroke="#76777d" strokeDasharray="2,2" strokeWidth="2" />
                        ) : isPositive ? (
                          <polyline
                            fill="none"
                            points="0,22 15,18 30,24 45,14 60,16 75,8 100,6"
                            stroke="#006c4a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        ) : (
                          <polyline
                            fill="none"
                            points="0,8 20,12 40,9 60,19 80,15 100,24"
                            stroke="#ba1a1a"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        )}
                      </svg>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setBaseCurrency('USD');
                            openTransferModal(c.code);
                          }}
                          className="px-2.5 py-1 rounded bg-[#006c4a] text-white text-[11px] font-semibold hover:bg-[#005137] transition cursor-pointer"
                        >
                          Convert
                        </button>
                        <button
                          onClick={() => openAlertModal(pairStr)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                          title="Set Rate Alert"
                        >
                          <span className="material-symbols-outlined text-[16px]">notifications</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination & Table Footer */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-900">{paginatedList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {Math.min(currentPage * pageSize, sortedCurrencies.length)}</span> of{' '}
            <span className="font-bold text-slate-900">{sortedCurrencies.length}</span> world currency pairs
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer ${
                  currentPage === i + 1 ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {/* MARKET CONTEXT & CROSS-BORDER ANALYTICS CALLOUT */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card 1: Regional Middle East & Levant Liquidity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm font-display">Middle East &amp; Levant Corridor</h3>
            <span className="material-symbols-outlined text-[#006c4a] text-[22px]">hub</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cross-border remittance liquidity between ILS, JOD, AED, and SAR remains steady at tight institutional spreads with zero settlement delay.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">Aggregated 24h Flow:</span>
            <span className="font-mono font-bold text-[#006c4a]">$384,120,000</span>
          </div>
        </div>

        {/* Card 2: Pegged Asset Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm font-display">Pegged Asset Health</h3>
            <span className="material-symbols-outlined text-[#006c4a] text-[22px]">lock_clock</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Jordanian Dinar (0.7090) and Gulf Cooperation Council currencies maintain perfect sovereign peg buffers with 0.0001% aggregate drift.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">Sovereign Reserve Health:</span>
            <span className="text-[#006c4a] font-bold">100% Optimal (A+)</span>
          </div>
        </div>

        {/* Card 3: FreeCurrencyAPI Telemetry */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm font-display">API Webhook Telemetry</h3>
            <span className="material-symbols-outlined text-[#006c4a] text-[22px]">webhook</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Integrating high-frequency interbank feeds into your fintech stack? Access our FreeCurrencyAPI ultra-low latency WebSocket clusters.
          </p>
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">Developer Cluster:</span>
            <button
              onClick={() => setActiveTab('settings')}
              className="text-[#006c4a] font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View API Docs
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
