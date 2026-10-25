import { CurrencyInfo } from '../types';

export const INITIAL_CURRENCIES: CurrencyInfo[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    country: 'United States',
    symbol: '$',
    flag: '🇺🇸',
    defaultDecimals: 2,
    rateVsUSD: 1.0000,
    change24h: 0.00,
    high24h: 1.0000,
    low24h: 1.0000,
    category: 'major',
    volume24h: '$4.20B',
    bidSpread: 0.0001,
    trend7d: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
  },
  {
    code: 'EUR',
    name: 'Euro',
    country: 'Eurozone',
    symbol: '€',
    flag: '🇪🇺',
    defaultDecimals: 2,
    rateVsUSD: 0.9200,
    change24h: 0.24,
    high24h: 0.9240,
    low24h: 0.9180,
    category: 'major',
    volume24h: '$1.48B',
    bidSpread: 0.0002,
    trend7d: [0.914, 0.918, 0.916, 0.922, 0.920, 0.925, 0.920]
  },
  {
    code: 'ILS',
    name: 'Israeli New Shekel',
    country: 'Israel',
    symbol: '₪',
    flag: '🇮🇱',
    defaultDecimals: 2,
    rateVsUSD: 3.6800,
    change24h: -0.15,
    high24h: 3.6940,
    low24h: 3.6710,
    category: 'levant',
    volume24h: '$384M',
    bidSpread: 0.0010,
    trend7d: [3.71, 3.69, 3.70, 3.67, 3.69, 3.68, 3.68]
  },
  {
    code: 'JOD',
    name: 'Jordanian Dinar',
    country: 'Jordan',
    symbol: 'د.أ',
    flag: '🇯🇴',
    defaultDecimals: 3,
    rateVsUSD: 0.7090,
    change24h: 0.00,
    high24h: 0.7090,
    low24h: 0.7090,
    isPegged: true,
    pegTarget: '0.7090 Fixed Benchmark',
    category: 'pegged',
    volume24h: '$96M',
    bidSpread: 0.0002,
    trend7d: [0.709, 0.709, 0.709, 0.709, 0.709, 0.709, 0.709]
  },
  {
    code: 'GBP',
    name: 'British Pound',
    country: 'United Kingdom',
    symbol: '£',
    flag: '🇬🇧',
    defaultDecimals: 2,
    rateVsUSD: 0.7910, // 1/1.2642
    change24h: 0.18,
    high24h: 0.7925,
    low24h: 0.7890,
    category: 'major',
    volume24h: '$890M',
    bidSpread: 0.0002,
    trend7d: [0.788, 0.789, 0.790, 0.791, 0.790, 0.792, 0.791]
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    country: 'Japan',
    symbol: '¥',
    flag: '🇯🇵',
    defaultDecimals: 2,
    rateVsUSD: 154.22,
    change24h: -0.41,
    high24h: 154.90,
    low24h: 153.95,
    category: 'major',
    volume24h: '$1.12B',
    bidSpread: 0.04,
    trend7d: [153.1, 153.5, 153.8, 154.0, 154.5, 154.8, 154.22]
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    country: 'United Arab Emirates',
    symbol: 'د.إ',
    flag: '🇦🇪',
    defaultDecimals: 2,
    rateVsUSD: 3.6725,
    change24h: 0.00,
    high24h: 3.6730,
    low24h: 3.6725,
    isPegged: true,
    pegTarget: '3.6725 Fixed Peg',
    category: 'pegged',
    volume24h: '$240M',
    bidSpread: 0.0005,
    trend7d: [3.6725, 3.6725, 3.6725, 3.6725, 3.6725, 3.6725, 3.6725]
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    country: 'Saudi Arabia',
    symbol: '﷼',
    flag: '🇸🇦',
    defaultDecimals: 2,
    rateVsUSD: 3.7505,
    change24h: 0.01,
    high24h: 3.7515,
    low24h: 3.7500,
    isPegged: true,
    pegTarget: '3.7500 Fixed Peg',
    category: 'pegged',
    volume24h: '$310M',
    bidSpread: 0.0007,
    trend7d: [3.750, 3.751, 3.750, 3.751, 3.750, 3.751, 3.7505]
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    country: 'Switzerland',
    symbol: 'CHF',
    flag: '🇨🇭',
    defaultDecimals: 2,
    rateVsUSD: 0.8872,
    change24h: 0.09,
    high24h: 0.8890,
    low24h: 0.8858,
    category: 'major',
    volume24h: '$420M',
    bidSpread: 0.0003,
    trend7d: [0.885, 0.886, 0.887, 0.886, 0.888, 0.887, 0.8872]
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    country: 'Canada',
    symbol: 'C$',
    flag: '🇨🇦',
    defaultDecimals: 2,
    rateVsUSD: 1.3780,
    change24h: 0.05,
    high24h: 1.3810,
    low24h: 1.3760,
    category: 'major',
    volume24h: '$360M',
    bidSpread: 0.0004,
    trend7d: [1.375, 1.377, 1.376, 1.379, 1.378, 1.380, 1.378]
  },
  {
    code: 'QAR',
    name: 'Qatari Riyal',
    country: 'Qatar',
    symbol: 'ر.ق',
    flag: '🇶🇦',
    defaultDecimals: 2,
    rateVsUSD: 3.6410,
    change24h: 0.00,
    high24h: 3.6415,
    low24h: 3.6405,
    isPegged: true,
    pegTarget: '3.6400 Fixed Peg',
    category: 'pegged',
    volume24h: '$110M',
    bidSpread: 0.0005,
    trend7d: [3.641, 3.641, 3.641, 3.641, 3.641, 3.641, 3.641]
  },
  {
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    country: 'Kuwait',
    symbol: 'د.ك',
    flag: '🇰🇼',
    defaultDecimals: 3,
    rateVsUSD: 0.3065,
    change24h: 0.02,
    high24h: 0.3070,
    low24h: 0.3060,
    isPegged: true,
    pegTarget: 'Currency Basket Peg',
    category: 'pegged',
    volume24h: '$180M',
    bidSpread: 0.0002,
    trend7d: [0.306, 0.306, 0.307, 0.306, 0.307, 0.306, 0.3065]
  }
];

export const INITIAL_ALERTS = [
  {
    id: 'alert-1',
    title: 'EUR / USD Drop Corridor',
    pair: 'EUR/USD',
    condition: 'drops_below' as const,
    threshold: 0.9150,
    isActive: true,
    typeBadge: 'Active Trigger',
    description: 'Notify when EUR/USD drops below 0.9150'
  },
  {
    id: 'alert-2',
    title: 'ILS Volatility Spike Watch',
    pair: 'USD/ILS',
    condition: 'volatility_spike' as const,
    threshold: 1.5,
    isActive: true,
    typeBadge: 'Active Trigger',
    description: 'Notify when ILS intra-day deviation spike > 1.5%'
  }
];

// Historical time-series generator for the selected pair and timeframe
export interface HistoricalPoint {
  date: string;
  rate: number;
  ma20: number;
  ma50: number;
  volume: number; // in Millions USD
}

export function getHistoricalData(pair: string, timeframe: string): HistoricalPoint[] {
  // Generate realistic historical points matching the chart in Image 5 & 6
  let count = 24;
  let baseRate = 0.9200;
  if (pair.includes('ILS')) baseRate = 3.6800;
  else if (pair.includes('JOD')) baseRate = 0.7090;
  else if (pair.includes('GBP')) baseRate = 1.2642;
  else if (pair.includes('JPY')) baseRate = 154.22;

  if (timeframe === '24H') count = 24;
  else if (timeframe === '7D') count = 14;
  else if (timeframe === '30D') count = 30;
  else if (timeframe === '90D') count = 30;
  else if (timeframe === '1Y') count = 24;
  else count = 30;

  const points: HistoricalPoint[] = [];
  const now = new Date('2025-10-20T14:00:00Z');

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * (24 * 3600 * 1000 * 30 / count));
    const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Wave math for authentic financial series
    const isPeg = pair.includes('JOD');
    const wave = isPeg ? 0.0002 * Math.sin(i * 0.4) : (0.006 * Math.sin(i * 0.5) + 0.003 * Math.cos(i * 0.9));
    const rate = Number((baseRate + wave + (Math.sin(i * 1.7) * 0.002)).toFixed(4));
    const ma20 = Number((baseRate + (wave * 0.6) + 0.001).toFixed(4));
    const ma50 = Number((baseRate + (wave * 0.3) - 0.0015).toFixed(4));
    const volume = Number((2.8 + Math.abs(Math.sin(i * 0.8) * 3.5)).toFixed(2));

    points.push({
      date: dayStr,
      rate,
      ma20,
      ma50,
      volume
    });
  }

  return points;
}
