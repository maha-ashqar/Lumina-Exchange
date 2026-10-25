import React, { useState, useMemo } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { getHistoricalData } from '../data/currencies';

export const HistoricalView: React.FC = () => {
  const { openAlertModal, openPayloadModal, showToast } = useExchange();

  const [selectedPair, setSelectedPair] = useState('USD/EUR');
  const [timeframe, setTimeframe] = useState<'24H' | '7D' | '30D' | '90D' | '1Y' | 'ALL'>('30D');
  const [showVolume, setShowVolume] = useState(true);
  const [showMovingAvg, setShowMovingAvg] = useState(true);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(18); // default to realistic benchmark point (around 68%)

  const points = useMemo(() => {
    return getHistoricalData(selectedPair, timeframe);
  }, [selectedPair, timeframe]);

  // Compute SVG coordinates
  const minRate = useMemo(() => Math.min(...points.map((p) => p.rate)) * 0.998, [points]);
  const maxRate = useMemo(() => Math.max(...points.map((p) => p.rate)) * 1.002, [points]);

  const svgWidth = 700;
  const svgHeight = 280;
  const chartHeight = 200; // top area for line, bottom for volume

  const getX = (idx: number) => (idx / (points.length - 1)) * svgWidth;
  const getY = (val: number) => {
    const range = maxRate - minRate || 0.01;
    return chartHeight - ((val - minRate) / range) * (chartHeight - 30) + 15;
  };

  // Build SVG path
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, p, idx) => {
      const x = getX(idx);
      const y = getY(p.rate);
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [points, minRate, maxRate]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const firstX = getX(0);
    const lastX = getX(points.length - 1);
    return `${linePath} L ${lastX},245 L ${firstX},245 Z`;
  }, [linePath, points]);

  const ma20Path = useMemo(() => {
    return points.reduce((acc, p, idx) => {
      const x = getX(idx);
      const y = getY(p.ma20);
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [points, minRate, maxRate]);

  const ma50Path = useMemo(() => {
    return points.reduce((acc, p, idx) => {
      const x = getX(idx);
      const y = getY(p.ma50);
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  }, [points, minRate, maxRate]);

  // Export handlers
  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    setIsExportMenuOpen(false);
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(points, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedPair.replace('/', '-')}-${timeframe}-trend.json`;
      a.click();
      showToast('Exported historical points as JSON');
    } else if (format === 'csv') {
      const csvHeader = 'Date,Rate,MA20,MA50,VolumeMillionsUSD\n';
      const csvRows = points.map((p) => `${p.date},${p.rate},${p.ma20},${p.ma50},${p.volume}`).join('\n');
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedPair.replace('/', '-')}-${timeframe}-trend.csv`;
      a.click();
      showToast('Exported historical points as CSV');
    } else {
      window.print();
      showToast('Triggered PDF audit print view');
    }
  };

  const activePoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : points[points.length - 1];
  const activeX = hoverIndex !== null ? getX(hoverIndex) : getX(points.length - 1);
  const activeY = hoverIndex !== null ? getY(activePoint.rate) : getY(activePoint.rate);

  return (
    <div className="w-full space-y-6">
      {/* HEADER BAR: TITLE, PAIR SELECTOR, TIMEFRAME & EXPORT */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Analytics</span>
            <span>/</span>
            <span className="text-[#006c4a] font-semibold">Historical Trends</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight">
            Currency Analytics &amp; Historical Trends
          </h1>
        </div>

        {/* Controls Matrix */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Currency Pair Selector Pill */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs">
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              <option value="USD/EUR">USD / EUR</option>
              <option value="USD/ILS">USD / ILS</option>
              <option value="USD/JOD">USD / JOD</option>
              <option value="GBP/USD">GBP / USD</option>
              <option value="USD/JPY">USD / JPY</option>
            </select>
            <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedPair('USD/ILS')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  selectedPair === 'USD/ILS' ? 'bg-[#006c4a] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                USD/ILS
              </button>
              <button
                onClick={() => setSelectedPair('USD/JOD')}
                className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                  selectedPair === 'USD/JOD' ? 'bg-[#006c4a] text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                USD/JOD
              </button>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs text-xs">
            {(['24H', '7D', '30D', '90D', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  timeframe === tf ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Export Menu Trigger */}
          <div className="relative inline-flex items-center text-xs">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">file_download</span>
              <span>Export Data</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">arrow_drop_down</span>
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 z-30">
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <span>CSV Format</span>
                  <span className="text-slate-400 text-[10px]">.csv</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <span>JSON Stream</span>
                  <span className="text-slate-400 text-[10px]">.json</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
                >
                  <span>PDF Audit</span>
                  <span className="text-slate-400 text-[10px]">.pdf</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN HERO ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RATE SUMMARY METRIC CARD (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#006c4a]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Spot Benchmark</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#006c4a] text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                  Real-Time
                </span>
              </div>
              <button
                onClick={() => openAlertModal(selectedPair)}
                className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
                title="Configure Alert"
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
              </button>
            </div>

            {/* Numerical Display */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-900 font-numeral tracking-tight">
                  {selectedPair.includes('ILS') ? '3.6800' : selectedPair.includes('JOD') ? '0.7090' : '0.9200'}
                </span>
                <span className="text-xl font-bold text-slate-500 font-display">
                  {selectedPair.split('/')[1] || 'EUR'}
                </span>
              </div>
              <p className="text-xs text-slate-500">1 {selectedPair.split('/')[0]} equivalent (Mid-market rate)</p>
            </div>

            {/* Trend Metric Pill */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#006c4a] font-bold">
                <span className="material-symbols-outlined text-lg">trending_up</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#006c4a] font-bold">+0.24%</span>
                  <span className="text-[11px] text-slate-500">(+0.0022 EUR)</span>
                </div>
                <p className="text-[11px] text-slate-500">24h Change vs Interbank</p>
              </div>
            </div>

            {/* Stat Matrix: Period High, Low, Volatility */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">30D High</span>
                <span className="font-bold text-slate-900 font-numeral">
                  {selectedPair.includes('ILS') ? '₪3.765' : selectedPair.includes('JOD') ? '0.7092' : '€0.9310'}
                </span>
                <span className="text-[10px] text-slate-400 block">Oct 14, 2025</span>
              </div>
              <div className="border-x border-slate-200 px-2">
                <span className="text-slate-400 block text-[11px]">30D Low</span>
                <span className="font-bold text-slate-900 font-numeral">
                  {selectedPair.includes('ILS') ? '₪3.681' : selectedPair.includes('JOD') ? '0.7088' : '€0.9140'}
                </span>
                <span className="text-[10px] text-slate-400 block">Sep 28, 2025</span>
              </div>
              <div className="pl-2">
                <span className="text-slate-400 block text-[11px]">Volatility Index</span>
                <span className="font-bold text-[#006c4a] font-numeral">
                  {selectedPair.includes('ILS') ? '4.80%' : selectedPair.includes('JOD') ? '0.05%' : '0.34%'}
                </span>
                <span className="text-[10px] text-[#006c4a] font-medium">
                  {selectedPair.includes('ILS') ? 'Moderate' : 'Low Variance'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">FreeCurrencyAPI:</span>
              <span className="font-mono text-slate-900 font-semibold">SYNCED (0.4s)</span>
            </div>
            <button
              onClick={() => openAlertModal(selectedPair)}
              className="text-[#006c4a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Create Rule
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* MAIN FINANCIAL INTERACTIVE TREND CHART (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          {/* Chart Controls & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#006c4a]"></span>
                <span className="font-semibold text-slate-900">{selectedPair} Rate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-400"></span>
                <span className="text-slate-500">MA-20 ({activePoint?.ma20})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#008cc7] border-t border-dashed"></span>
                <span className="text-slate-500">MA-50 ({activePoint?.ma50})</span>
              </div>
            </div>

            {/* Display Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVolume(!showVolume)}
                className={`px-2.5 py-1 rounded border flex items-center gap-1 cursor-pointer transition ${
                  showVolume ? 'bg-slate-100 text-slate-900 border-slate-300' : 'text-slate-400 border-slate-200'
                }`}
              >
                {showVolume && <span className="material-symbols-outlined text-[14px] text-[#006c4a]">check</span>}
                Volume
              </button>
              <button
                onClick={() => setShowMovingAvg(!showMovingAvg)}
                className={`px-2.5 py-1 rounded border flex items-center gap-1 cursor-pointer transition ${
                  showMovingAvg ? 'bg-slate-100 text-slate-900 border-slate-300' : 'text-slate-400 border-slate-200'
                }`}
              >
                {showMovingAvg && <span className="material-symbols-outlined text-[14px] text-[#006c4a]">check</span>}
                Moving Avg
              </button>
            </div>
          </div>

          {/* High-Fidelity Interactive SVG Chart Canvas */}
          <div
            className="relative w-full h-[280px] select-none cursor-crosshair"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const idx = Math.round(ratio * (points.length - 1));
              setHoverIndex(idx);
            }}
            onTouchMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const touch = e.touches[0];
              const ratio = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
              const idx = Math.round(ratio * (points.length - 1));
              setHoverIndex(idx);
            }}
          >
            {/* Interactive Tooltip Benchmark */}
            {activePoint && (
              <div
                className="absolute top-[14%] -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center transition-all duration-75"
                style={{ left: `${(activeX / svgWidth) * 100}%` }}
              >
                <div className="bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-left border border-slate-700 min-w-[130px]">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">
                    {activePoint.date} 2025 • 14:00 UTC
                  </span>
                  <div className="flex items-baseline justify-between gap-2 mt-0.5">
                    <span className="text-sm font-bold text-white font-numeral">
                      {activePoint.rate.toFixed(4)}
                    </span>
                    <span className="text-xs text-[#82f5c1] font-semibold">+0.41%</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-800 flex justify-between">
                    <span>Vol: ${activePoint.volume}M</span>
                    <span>MA: {activePoint.ma20}</span>
                  </div>
                </div>
                {/* Pointer node & guide line */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#006c4a] border-2 border-white shadow-md mt-1.5"></div>
                <div className="w-[1px] h-[160px] bg-[#006c4a]/40 border-l border-dashed border-[#006c4a]"></div>
              </div>
            )}

            {/* SVG Visuals */}
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#006c4a" stopOpacity="0.28" />
                  <stop offset="85%" stopColor="#006c4a" stopOpacity="0.01" />
                  <stop offset="100%" stopColor="#006c4a" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d3e4fe" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e5eeff" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <g stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1">
                <line x1="0" y1="20" x2={svgWidth} y2="20" />
                <line x1="0" y1="75" x2={svgWidth} y2="75" />
                <line x1="0" y1="130" x2={svgWidth} y2="130" />
                <line x1="0" y1="185" x2={svgWidth} y2="185" />
              </g>

              {/* Y Axis Values */}
              <text x={svgWidth - 5} y="24" textAnchor="end" className="fill-slate-400 text-[10px] font-mono">
                {maxRate.toFixed(4)}
              </text>
              <text x={svgWidth - 5} y="105" textAnchor="end" className="fill-slate-400 text-[10px] font-mono">
                {((maxRate + minRate) / 2).toFixed(4)}
              </text>
              <text x={svgWidth - 5} y="189" textAnchor="end" className="fill-slate-400 text-[10px] font-mono">
                {minRate.toFixed(4)}
              </text>

              {/* Volume Bars */}
              {showVolume &&
                points.map((p, idx) => {
                  const barW = Math.max(8, svgWidth / points.length - 6);
                  const barH = (p.volume / 7) * 55;
                  const bx = getX(idx) - barW / 2;
                  const by = 245 - barH;
                  return (
                    <rect
                      key={idx}
                      x={bx}
                      y={by}
                      width={barW}
                      height={barH}
                      rx="2"
                      fill={hoverIndex === idx ? '#82f5c1' : 'url(#volGradient)'}
                    />
                  );
                })}

              {/* Moving Averages */}
              {showMovingAvg && (
                <>
                  <path d={ma50Path} fill="none" stroke="#008cc7" strokeDasharray="4 4" strokeWidth="1.5" opacity="0.75" />
                  <path d={ma20Path} fill="none" stroke="#76777d" strokeWidth="1.5" opacity="0.8" />
                </>
              )}

              {/* Gradient Area & Main Line */}
              <path d={areaPath} fill="url(#chartGradient)" />
              <path
                d={linePath}
                fill="none"
                stroke="#006c4a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Timeline X-Axis Labels */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-400 font-mono">
            <span>Sep 20</span>
            <span>Sep 25</span>
            <span>Sep 30</span>
            <span>Oct 05</span>
            <span>Oct 10</span>
            <span>Oct 15</span>
            <span className="text-[#006c4a] font-bold">Today (Oct 20)</span>
          </div>
        </div>
      </div>

      {/* MULTI-CURRENCY RELATIVE PERFORMANCE MATRIX */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Normalized Relative Performance Matrix
            </h2>
            <p className="text-xs text-slate-500">
              Baseline normalized at 0.00% against USD base denomination over past 30 days.
            </p>
          </div>

          {/* Legend Pills */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#006c4a]"></span>
              <span className="text-slate-900">EUR (+1.42%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#008cc7]"></span>
              <span className="text-slate-900">ILS (+0.88%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ba1a1a]"></span>
              <span className="text-slate-900">JOD (-0.08%)</span>
            </div>
          </div>
        </div>

        {/* Comparative Canvas Area */}
        <div className="w-full h-44 relative mb-6">
          <svg className="w-full h-full" viewBox="0 0 900 160" preserveAspectRatio="none">
            {/* Zero Baseline */}
            <line x1="0" y1="80" x2="900" y2="80" stroke="#c6c6cd" strokeDasharray="2 2" strokeWidth="1.5" />
            <text x="10" y="75" className="fill-slate-400 text-[11px] font-mono">0.00% Baseline</text>

            {/* EUR Normalized Curve (+1.42%) */}
            <path d="M 0,80 C 150,90 280,60 450,50 C 600,40 750,25 900,32" fill="none" stroke="#006c4a" strokeWidth="2.5" />
            {/* ILS Normalized Curve (+0.88%) */}
            <path d="M 0,80 C 130,70 300,105 480,95 C 650,85 780,55 900,52" fill="none" stroke="#008cc7" strokeWidth="2" />
            {/* JOD Normalized Curve (-0.08% / Pegged stability) */}
            <path d="M 0,80 C 200,81 400,80 600,82 C 750,81 850,83 900,83" fill="none" stroke="#ba1a1a" strokeDasharray="5 3" strokeWidth="2" />
          </svg>
        </div>

        {/* Comparison Detailed Data Table */}
        <div className="overflow-x-auto custom-scroll text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">PAIR CODE</th>
                <th className="py-3 px-4">CURRENT SPOT</th>
                <th className="py-3 px-4">30D RETURN</th>
                <th className="py-3 px-4">HISTORICAL RANGE (30D)</th>
                <th className="py-3 px-4">ANNUALIZED VOLATILITY</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1: EUR */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#006c4a] flex items-center justify-center text-xs font-bold">€</span>
                  USD / EUR
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">0.9200</td>
                <td className="py-3.5 px-4 font-bold text-[#006c4a]">+1.42%</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">0.9140 — 0.9310</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">4.12% (Stable)</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedPair('USD/EUR');
                      showToast('Analyzed USD/EUR dataset');
                    }}
                    className="px-3 py-1 rounded text-xs bg-slate-100 text-slate-800 hover:bg-[#006c4a] hover:text-white transition-colors cursor-pointer font-medium"
                  >
                    Analyze
                  </button>
                </td>
              </tr>

              {/* Row 2: ILS */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#e5eeff] text-[#008cc7] flex items-center justify-center text-xs font-bold">₪</span>
                  USD / ILS
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">3.7125</td>
                <td className="py-3.5 px-4 font-bold text-[#008cc7]">+0.88%</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">3.6810 — 3.7650</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">7.65% (Moderate)</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedPair('USD/ILS');
                      showToast('Analyzed USD/ILS dataset');
                    }}
                    className="px-3 py-1 rounded text-xs bg-slate-100 text-slate-800 hover:bg-[#006c4a] hover:text-white transition-colors cursor-pointer font-medium"
                  >
                    Analyze
                  </button>
                </td>
              </tr>

              {/* Row 3: JOD */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-50 text-[#ba1a1a] flex items-center justify-center text-xs font-bold">د.أ</span>
                  USD / JOD
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">0.7090</td>
                <td className="py-3.5 px-4 font-bold text-[#ba1a1a]">-0.08%</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">0.7088 — 0.7092</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">0.05% (Pegged)</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedPair('USD/JOD');
                      showToast('Analyzed USD/JOD dataset');
                    }}
                    className="px-3 py-1 rounded text-xs bg-slate-100 text-slate-800 hover:bg-[#006c4a] hover:text-white transition-colors cursor-pointer font-medium"
                  >
                    Analyze
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* LOWER SECTION: VOLATILITY, SPREAD & CORRELATION BENCHMARK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Volatility & Session Spreads (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 font-display">Session Spread &amp; Oscillation Metrics</h3>
              <span className="text-xs text-slate-400">UTC Daily Average</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {/* London */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-600 font-semibold block">London Session</span>
                <div className="text-xl font-bold text-slate-900 my-1 font-numeral">
                  0.82 <span className="text-xs text-slate-400 font-normal">pips</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#006c4a]">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Deepest Liquidity
                </div>
              </div>

              {/* New York */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-600 font-semibold block">New York Session</span>
                <div className="text-xl font-bold text-slate-900 my-1 font-numeral">
                  0.94 <span className="text-xs text-slate-400 font-normal">pips</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-600">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  Overlap Volatility
                </div>
              </div>

              {/* Tokyo */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-600 font-semibold block">Tokyo Session</span>
                <div className="text-xl font-bold text-slate-900 my-1 font-numeral">
                  1.45 <span className="text-xs text-slate-400 font-normal">pips</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
                  Moderate Spread
                </div>
              </div>
            </div>

            {/* Micro Oscillation Visual Bar */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">Intraday Oscillation Frequency</span>
                  <span className="font-bold text-slate-900">64 cycles / 24h</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#006c4a] h-full rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600">Interbank Wholesale Fill Efficiency</span>
                  <span className="font-bold text-[#006c4a]">99.98%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#006c4a] h-full rounded-full" style={{ width: '99.98%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Target slippage safeguard enabled</span>
            <span className="font-mono text-[#006c4a] font-semibold">Max 0.02%</span>
          </div>
        </div>

        {/* Correlation Coefficient Matrix (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 font-display">Currency Correlation</h3>
              <span className="px-2 py-0.5 rounded bg-slate-100 text-xs text-slate-500 font-semibold">
                30D Window
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Statistical correlation coefficient (-1.00 inverse to +1.00 identical).</p>

            {/* Correlation Grid */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-4 bg-slate-50 text-slate-400 font-bold p-2.5 border-b border-slate-200">
                <div>PAIR</div>
                <div className="text-center">EUR</div>
                <div className="text-center">ILS</div>
                <div className="text-center">JOD</div>
              </div>

              <div className="grid grid-cols-4 items-center p-2.5 border-b border-slate-100">
                <div className="font-bold text-slate-900">USD/EUR</div>
                <div className="text-center font-mono font-bold text-slate-400">1.00</div>
                <div className="text-center font-mono font-bold text-[#006c4a]">+0.64</div>
                <div className="text-center font-mono font-bold text-slate-500">-0.04</div>
              </div>

              <div className="grid grid-cols-4 items-center p-2.5 border-b border-slate-100">
                <div className="font-bold text-slate-900">USD/ILS</div>
                <div className="text-center font-mono font-bold text-[#006c4a]">+0.64</div>
                <div className="text-center font-mono font-bold text-slate-400">1.00</div>
                <div className="text-center font-mono font-bold text-[#ba1a1a]">-0.12</div>
              </div>

              <div className="grid grid-cols-4 items-center p-2.5">
                <div className="font-bold text-slate-900">USD/JOD</div>
                <div className="text-center font-mono font-bold text-slate-500">-0.04</div>
                <div className="text-center font-mono font-bold text-[#ba1a1a]">-0.12</div>
                <div className="text-center font-mono font-bold text-slate-400">1.00</div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center gap-2 text-xs text-slate-600">
            <span className="material-symbols-outlined text-[#006c4a] text-base">info</span>
            <span>USD/JOD exhibits near-zero beta due to its statutory USD peg protocol.</span>
          </div>
        </div>
      </div>

      {/* TELEMETRY BADGE / FREECURRENCYAPI STATUS BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#006c4a]">
            <span className="material-symbols-outlined text-2xl">cloud_sync</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm font-display">FreeCurrencyAPI Historical Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#006c4a] text-[11px] font-bold">
                NODE OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Endpoint: <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">v1/historical?base_currency=USD&amp;currencies=EUR,ILS,JOD</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block">Historical Depth</span>
            <span className="font-bold text-slate-900">24,800+ Days</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-200"></div>
          <div className="text-right">
            <span className="text-slate-400 block">Latency / Quota</span>
            <span className="font-mono font-semibold text-[#006c4a]">28ms / 99.4% Left</span>
          </div>
          <button
            onClick={openPayloadModal}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
          >
            Inspect Payload
          </button>
        </div>
      </div>
    </div>
  );
};
