export interface CurrencyInfo {
  code: string;
  name: string;
  country: string;
  symbol: string;
  flag: string; // SVG or emoji flag
  defaultDecimals: number;
  rateVsUSD: number; // 1 USD = rateVsUSD currency
  change24h: number; // percentage e.g. 0.24 or -0.15
  high24h: number;
  low24h: number;
  isPegged?: boolean;
  pegTarget?: string;
  category: 'major' | 'levant' | 'pegged' | 'other';
  volume24h?: string;
  bidSpread?: number;
  trend7d?: number[];
}

export interface RateAlert {
  id: string;
  title: string;
  pair: string;
  condition: 'drops_below' | 'rises_above' | 'volatility_spike';
  threshold: number;
  isActive: boolean;
  typeBadge: string;
  description: string;
}

export interface AppSettings {
  apiKey: string;
  baseCurrency: string;
  precision: number; // 2, 3, 4, 6
  theme: 'light' | 'dark' | 'system';
  refreshInterval: '5s' | '15s' | '1m' | 'manual';
  offlineCache: boolean;
  webhookUrl: string;
}

export type ActiveTab = 'dashboard' | 'markets' | 'analytics' | 'settings';
