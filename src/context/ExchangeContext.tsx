import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CurrencyInfo, RateAlert, AppSettings, ActiveTab } from '../types';
import { INITIAL_CURRENCIES, INITIAL_ALERTS } from '../data/currencies';

interface ExchangeContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currencies: CurrencyInfo[];
  baseCurrency: string;
  setBaseCurrency: (code: string) => void;
  sendAmount: string;
  setSendAmount: (val: string) => void;
  rates: Record<string, number>;
  convert: (amount: number, from: string, to: string) => number;
  formatAmount: (amount: number, currencyCode: string) => string;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
  alerts: RateAlert[];
  toggleAlert: (id: string) => void;
  deleteAlert: (id: string) => void;
  addAlert: (alert: Omit<RateAlert, 'id'>) => void;
  watchlist: string[];
  toggleWatchlist: (pair: string) => void;
  lastSyncTime: string;
  isSyncing: boolean;
  refreshRates: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isTransferModalOpen: boolean;
  openTransferModal: (targetCode?: string) => void;
  closeTransferModal: () => void;
  transferTargetCode: string;
  isAlertModalOpen: boolean;
  openAlertModal: (pair?: string) => void;
  closeAlertModal: () => void;
  alertPrefillPair: string;
  isPayloadModalOpen: boolean;
  openPayloadModal: () => void;
  closePayloadModal: () => void;
  isMobilePreview: boolean;
  setIsMobilePreview: React.Dispatch<React.SetStateAction<boolean>>;
}

const DEFAULT_SETTINGS: AppSettings = {
  apiKey: 'fca_live_9d8B312e74AA09f872c114e9102cae4',
  baseCurrency: 'USD',
  precision: 3, // 3 decimals default for Middle East / Levant precision
  theme: 'light',
  refreshInterval: '15s',
  offlineCache: true,
  webhookUrl: 'https://engine.internal.lumina.io/api/v2/fx/inbound'
};

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export const ExchangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>(INITIAL_CURRENCIES);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [sendAmount, setSendAmount] = useState<string>('1,000.00');
  const [watchlist, setWatchlist] = useState<string[]>(['EUR/USD', 'ILS/USD', 'JOD/USD']);
  const [alerts, setAlerts] = useState<RateAlert[]>(INITIAL_ALERTS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [lastSyncTime, setLastSyncTime] = useState<string>('1s ago');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
  const [transferTargetCode, setTransferTargetCode] = useState<string>('EUR');
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertPrefillPair, setAlertPrefillPair] = useState<string>('EUR/USD');
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState<boolean>(false);
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // Build current rate lookup relative to USD
  const rates = React.useMemo(() => {
    const map: Record<string, number> = {};
    currencies.forEach((c) => {
      map[c.code] = c.rateVsUSD;
    });
    return map;
  }, [currencies]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  }, []);

  // Conversion logic: (amount / fromRateVsUSD) * toRateVsUSD
  const convert = useCallback(
    (amount: number, from: string, to: string) => {
      if (from === to) return amount;
      const fromRate = rates[from] || 1;
      const toRate = rates[to] || 1;
      // Convert to USD first then to target
      const usdValue = amount / fromRate;
      return usdValue * toRate;
    },
    [rates]
  );

  // Formatter respecting currency precision
  const formatAmount = useCallback(
    (val: number, currencyCode: string) => {
      if (isNaN(val)) return '0.00';
      const curr = currencies.find((c) => c.code === currencyCode);
      // For JOD or if settings specify 3 decimals for regional:
      let decimals = curr?.defaultDecimals ?? settings.precision;
      if (settings.precision >= 3 && (currencyCode === 'JOD' || currencyCode === 'KWD')) {
        decimals = 3;
      }
      return val.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    },
    [currencies, settings.precision]
  );

  const refreshRates = useCallback(() => {
    setIsSyncing(true);
    setLastSyncTime('Syncing...');

    setTimeout(() => {
      // Micro-jitter rates to simulate live market tick
      setCurrencies((prev) =>
        prev.map((c) => {
          if (c.code === 'USD' || c.isPegged) return c;
          const jitter = (Math.random() - 0.49) * 0.0015;
          const newRate = Number((c.rateVsUSD + jitter).toFixed(4));
          const newChange = Number((c.change24h + (Math.random() - 0.5) * 0.02).toFixed(2));
          return {
            ...c,
            rateVsUSD: newRate,
            change24h: newChange
          };
        })
      );
      setIsSyncing(false);
      setLastSyncTime('Just now');
      showToast('Rates re-synchronized with FreeCurrencyAPI');
    }, 600);
  }, [showToast]);

  // Periodic tick simulation based on settings interval
  useEffect(() => {
    if (settings.refreshInterval === 'manual') return;
    const intervalMap: Record<string, number> = {
      '5s': 5000,
      '15s': 15000,
      '1m': 60000
    };
    const ms = intervalMap[settings.refreshInterval] || 15000;
    const interval = setInterval(() => {
      setCurrencies((prev) =>
        prev.map((c) => {
          if (c.code === 'USD' || c.isPegged) return c;
          const jitter = (Math.random() - 0.49) * 0.0008;
          return {
            ...c,
            rateVsUSD: Number((c.rateVsUSD + jitter).toFixed(4))
          };
        })
      );
      setLastSyncTime('Just now');
    }, ms);

    return () => clearInterval(interval);
  }, [settings.refreshInterval]);

  const updateSettings = useCallback(
    (newSettings: Partial<AppSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...newSettings };
        return updated;
      });
      showToast('Settings successfully updated');
    },
    [showToast]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setBaseCurrency('USD');
    showToast('Reset configuration to factory defaults');
  }, [showToast]);

  const toggleWatchlist = useCallback(
    (pair: string) => {
      setWatchlist((prev) => {
        const next = prev.includes(pair) ? prev.filter((p) => p !== pair) : [...prev, pair];
        showToast(prev.includes(pair) ? `Removed ${pair} from watchlist` : `Added ${pair} to watchlist`);
        return next;
      });
    },
    [showToast]
  );

  const toggleAlert = useCallback(
    (id: string) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
      );
      showToast('Alert rule status toggled');
    },
    [showToast]
  );

  const deleteAlert = useCallback(
    (id: string) => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
      showToast('Alert trigger deleted');
    },
    [showToast]
  );

  const addAlert = useCallback(
    (alert: Omit<RateAlert, 'id'>) => {
      const newAlert: RateAlert = {
        ...alert,
        id: `alert-${Date.now()}`
      };
      setAlerts((prev) => [newAlert, ...prev]);
      showToast(`Alert created for ${alert.pair}`);
    },
    [showToast]
  );

  const openTransferModal = useCallback((targetCode: string = 'EUR') => {
    setTransferTargetCode(targetCode);
    setIsTransferModalOpen(true);
  }, []);

  const closeTransferModal = useCallback(() => {
    setIsTransferModalOpen(false);
  }, []);

  const openAlertModal = useCallback((pair: string = 'EUR/USD') => {
    setAlertPrefillPair(pair);
    setIsAlertModalOpen(true);
  }, []);

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const openPayloadModal = useCallback(() => {
    setIsPayloadModalOpen(true);
  }, []);

  const closePayloadModal = useCallback(() => {
    setIsPayloadModalOpen(false);
  }, []);

  return (
    <ExchangeContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currencies,
        baseCurrency,
        setBaseCurrency,
        sendAmount,
        setSendAmount,
        rates,
        convert,
        formatAmount,
        settings,
        updateSettings,
        resetSettings,
        alerts,
        toggleAlert,
        deleteAlert,
        addAlert,
        watchlist,
        toggleWatchlist,
        lastSyncTime,
        isSyncing,
        refreshRates,
        toastMessage,
        showToast,
        isTransferModalOpen,
        openTransferModal,
        closeTransferModal,
        transferTargetCode,
        isAlertModalOpen,
        openAlertModal,
        closeAlertModal,
        alertPrefillPair,
        isPayloadModalOpen,
        openPayloadModal,
        closePayloadModal,
        isMobilePreview,
        setIsMobilePreview
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchange = () => {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
};
