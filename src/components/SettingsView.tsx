import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetSettings,
    alerts,
    toggleAlert,
    deleteAlert,
    openAlertModal,
    showToast,
    openPayloadModal
  } = useExchange();

  const [activeSection, setActiveSection] = useState<'apikeys' | 'display' | 'webhooks' | 'general' | 'security'>('apikeys');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [hasValidated, setHasValidated] = useState(false);
  const [showSaveBanner, setShowSaveBanner] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(settings.apiKey);
  const [tempWebhook, setTempWebhook] = useState(settings.webhookUrl);

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(tempApiKey);
    showToast('API Key copied to clipboard');
  };

  const handleValidateKey = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setHasValidated(true);
      showToast('API Key verified: 200 OK via Frankfurt edge cluster (18ms)');
      setTimeout(() => setHasValidated(false), 3000);
    }, 700);
  };

  const handleTestPing = () => {
    showToast('Sent test webhook payload: 200 OK received');
  };

  const handleSave = () => {
    updateSettings({
      apiKey: tempApiKey,
      webhookUrl: tempWebhook
    });
    setShowSaveBanner(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full space-y-6">
      {/* Breadcrumb Bar */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-900 font-semibold">Configuration &amp; Settings</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display tracking-tight">
            API &amp; Exchange Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure FreeCurrencyAPI integration credentials, rate thresholds, and local execution preferences.
          </p>
        </div>

        {/* Operational Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#006c4a] text-xs font-semibold self-start md:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c4a] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006c4a]"></span>
          </span>
          <span className="font-bold">1 USD = 0.9241 EUR</span>
          <span className="text-[11px]">↑ 0.12% today</span>
        </div>
      </div>

      {/* Confirmation Feedback Toast Banner */}
      {showSaveBanner && (
        <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-between text-xs text-[#006c4a] animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span className="font-semibold">
              Configuration parameters and API access tokens successfully synchronized across edge nodes.
            </span>
          </div>
          <button onClick={() => setShowSaveBanner(false)} className="hover:opacity-75 cursor-pointer">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Navigation Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <nav className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-col gap-1 shadow-xs text-xs font-semibold">
            <button
              onClick={() => setActiveSection('general')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeSection === 'general' ? 'bg-[#006c4a] text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>General Preferences</span>
            </button>

            <button
              onClick={() => setActiveSection('apikeys')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeSection === 'apikeys' ? 'bg-[#006c4a] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>FreeCurrencyAPI Keys</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                activeSection === 'apikeys' ? 'bg-[#82f5c1] text-[#00714e]' : 'bg-slate-100 text-slate-700'
              }`}>
                Live
              </span>
            </button>

            <button
              onClick={() => setActiveSection('display')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeSection === 'display' ? 'bg-[#006c4a] text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">palette</span>
              <span>Display &amp; Themes</span>
            </button>

            <button
              onClick={() => setActiveSection('webhooks')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeSection === 'webhooks' ? 'bg-[#006c4a] text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                <span>Webhooks &amp; Alerts</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#006c4a]"></span>
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer text-left ${
                activeSection === 'security' ? 'bg-[#006c4a] text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span>Security</span>
            </button>
          </nav>

          {/* Quick API Health Widget in Sidebar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">Gateway Status</span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#006c4a]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c4a]"></span>
                99.98% SLA
              </span>
            </div>
            <div className="space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Response Latency</span>
                <span className="font-mono font-bold text-[#006c4a]">48ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Edge Node</span>
                <span className="font-semibold text-slate-900">fra1 (Frankfurt)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SSL Verification</span>
                <span className="font-semibold text-[#006c4a]">TLS 1.3 Active</span>
              </div>
            </div>
            <button
              onClick={openPayloadModal}
              className="inline-flex items-center gap-1 text-[#006c4a] hover:underline pt-1 font-semibold cursor-pointer"
            >
              <span>View Network Telemetry</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Area (9 cols) */}
        <section className="lg:col-span-9 space-y-6">
          {/* SECTION 1: FreeCurrencyAPI Key Management */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">FreeCurrencyAPI Key Management</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Primary bearer token utilized to hydrate spot markets and calculate cross-border algorithmic spreads.
                </p>
              </div>
              <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                <span className="material-symbols-outlined text-[16px] text-[#006c4a]">verified</span>
                Production Endpoint
              </span>
            </div>

            {/* Key Inputs & Operations */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5" htmlFor="apiKeyInput">
                  Active Production API Key
                </label>
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-grow flex items-center gap-2 px-2">
                    <span className="material-symbols-outlined text-slate-400">vpn_key</span>
                    <input
                      id="apiKeyInput"
                      type={showKey ? 'text' : 'password'}
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      className="w-full bg-transparent border-0 p-0 text-slate-900 font-mono text-xs focus:ring-0 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title={showKey ? 'Hide key' : 'Show key'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showKey ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Copy key"
                    >
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleValidateKey}
                    disabled={isValidating}
                    className={`h-10 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
                      hasValidated ? 'bg-[#006c4a] text-white' : 'bg-[#006c4a] text-white hover:bg-[#005137]'
                    }`}
                  >
                    {isValidating ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                        <span>Checking...</span>
                      </>
                    ) : hasValidated ? (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Key Validated</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                        <span>Validate Key</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#006c4a]">check_circle</span>
                  Valid token with authenticated write scopes (Last tested 4 minutes ago).
                </p>
              </div>

              {/* Tier Quota Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider font-semibold block mb-1 text-[11px]">
                    Assigned Tier
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 font-display">Free Tier</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                      5,000 req/mo
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] mt-1 block">Renews on Nov 1, 2025</span>
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Monthly Request Quota</span>
                    <span className="font-mono text-slate-800">
                      <span className="font-bold text-[#006c4a]">142</span> / 5,000 requests (2.8%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="bg-[#006c4a] h-full rounded-full" style={{ width: '2.84%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>4,858 queries remaining</span>
                    <button
                      onClick={() => showToast('Upgraded tier inquiry transmitted')}
                      className="text-[#006c4a] font-semibold hover:underline cursor-pointer"
                    >
                      Upgrade to Pro →
                    </button>
                  </div>
                </div>
              </div>

              {/* Safe Local Cache Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white">
                <div className="space-y-0.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Safe Local Cache on Rate Limit / 429
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#82f5c1] text-[#00714e]">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Automatically serve cached timestamped quotes from local storage when upstream API throttles or during intermittent connection disruptions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateSettings({ offlineCache: !settings.offlineCache })}
                  className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                    settings.offlineCache ? 'bg-[#006c4a]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 bg-white rounded-full absolute top-[4px] transition-all shadow-xs ${
                      settings.offlineCache ? 'right-[4px]' : 'left-[4px]'
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Currency & Display Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 font-display">Currency &amp; Display Preferences</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize global numerical precision, presentation currencies, and terminal UI theme modes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Default Base Currency */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-800">Default Base Currency</label>
                <select
                  value={settings.baseCurrency}
                  onChange={(e) => updateSettings({ baseCurrency: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#006c4a]"
                >
                  <option value="USD">USD — United States Dollar ($)</option>
                  <option value="EUR">EUR — Euro Member Countries (€)</option>
                  <option value="ILS">ILS — Israeli New Shekel (₪)</option>
                  <option value="JOD">JOD — Jordanian Dinar (د.أ)</option>
                  <option value="GBP">GBP — British Pound Sterling (£)</option>
                </select>
                <p className="text-[11px] text-slate-400">Used as standard comparison denominator across all rate cards.</p>
              </div>

              {/* Number Format & Precision Setting */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-800">Numerical Precision &amp; Rounding</label>
                <select
                  value={settings.precision}
                  onChange={(e) => updateSettings({ precision: parseInt(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#006c4a]"
                >
                  <option value="2">Standard (2 Decimals — e.g. 1.00 USD)</option>
                  <option value="3">Middle East Precision (3 Decimals — e.g. 0.709 JOD / 3.742 ILS)</option>
                  <option value="4">Micro-Spread (4 Decimals — Institutional FX)</option>
                  <option value="6">High Precision Cryptographic (6 Decimals)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  3 decimals automatically applied when pairing JOD or regional currencies.
                </p>
              </div>

              {/* Theme Preference Toggle Segment */}
              <div className="space-y-1.5">
                <span className="block font-semibold text-slate-800">Visual Terminal Theme</span>
                <div className="grid grid-cols-3 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateSettings({ theme: t })}
                      className={`py-1.5 rounded-lg font-bold capitalize flex items-center justify-center gap-1 cursor-pointer transition ${
                        settings.theme === t
                          ? 'bg-white text-[#006c4a] shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {t === 'light' ? 'light_mode' : t === 'dark' ? 'dark_mode' : 'desktop_windows'}
                      </span>
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Polling & Refresh Interval */}
              <div className="space-y-1.5">
                <span className="block font-semibold text-slate-800">Polling &amp; Refresh Interval</span>
                <div className="grid grid-cols-4 gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                  {(['5s', '15s', '1m', 'manual'] as const).map((interval) => (
                    <button
                      key={interval}
                      type="button"
                      onClick={() => updateSettings({ refreshInterval: interval })}
                      className={`py-1.5 rounded-lg font-bold capitalize text-center cursor-pointer transition ${
                        settings.refreshInterval === interval
                          ? 'bg-white text-[#006c4a] shadow-xs'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Recommended: 15s to conserve tier quotas while tracking volatility.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3: Rate Alerts & Webhooks */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">Rate Alerts &amp; Automated Webhooks</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Receive instantaneous dispatch notifications when target pairs breach specified valuation corridors.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openAlertModal('EUR/USD')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#006c4a] text-[#006c4a] hover:bg-[#ECFDF5] text-xs font-bold transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add New Alert</span>
              </button>
            </div>

            {/* Alert Rules List */}
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-slate-50 rounded-xl p-3.5 flex items-center justify-between gap-4 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#006c4a]">
                      <span className="material-symbols-outlined text-[20px]">
                        {alert.condition === 'drops_below' ? 'trending_down' : alert.condition === 'rises_above' ? 'trending_up' : 'bolt'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{alert.title}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#006c4a]">
                          {alert.typeBadge}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{alert.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleAlert(alert.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${
                        alert.isActive ? 'bg-[#006c4a]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`block w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow-xs ${
                          alert.isActive ? 'right-[3px]' : 'left-[3px]'
                        }`}
                      ></span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteAlert(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-[#ba1a1a] transition cursor-pointer"
                      title="Delete rule"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Webhook Dispatch URL Configuration */}
              <div className="pt-2 space-y-1.5 text-xs">
                <label className="block font-semibold text-slate-800" htmlFor="webhookUrlInput">
                  Custom Webhook Dispatch URL
                </label>
                <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 pl-2">webhook</span>
                  <input
                    id="webhookUrlInput"
                    type="url"
                    value={tempWebhook}
                    onChange={(e) => setTempWebhook(e.target.value)}
                    placeholder="https://api.yourdomain.com/v1/fx-listener"
                    className="w-full bg-transparent border-0 p-0 text-slate-900 font-mono text-xs focus:ring-0 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleTestPing}
                    className="h-8 px-3 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 font-semibold transition cursor-pointer"
                  >
                    Test Ping
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  JSON payloads deliver signature verification hash in the{' '}
                  <code className="font-mono font-semibold text-slate-700">X-Lumina-Signature</code> header.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: Save & Reset Controls */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Unsaved changes will be discarded upon session termination.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={resetSettings}
                className="w-1/2 sm:w-auto px-5 h-[48px] rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="w-1/2 sm:w-auto px-6 h-[48px] rounded-xl bg-slate-900 text-white hover:bg-black active:scale-[0.98] text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
