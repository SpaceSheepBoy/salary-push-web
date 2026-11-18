import { useState, useEffect } from 'react';
import { BASELINE_USD_RATES, DEFAULT_SETTINGS, EQUIVALENCE_CATALOG, normalizeExchangeRates } from './utils/constants';
import { SalarySettings } from './types';
import { Dashboard } from './components/Dashboard';
import { SettingsModal } from './components/SettingsModal';
import { PaidBreakModal } from './components/PaidBreakModal';
import { StealthView } from './components/StealthView';
import { EarningsCalculator } from './utils/calculator';

const STORAGE_KEY = 'salarypush_web_settings_v1';
const RATES_CACHE_KEY = 'salarypush_rates_cache';

export default function App() {
  const [settings, setSettings] = useState<SalarySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [rates, setRates] = useState(() => {
    try {
      const cached = localStorage.getItem(RATES_CACHE_KEY) ?? localStorage.getItem('salary_push_exchange_rates');
      return normalizeExchangeRates(JSON.parse(cached ?? 'null')) ?? BASELINE_USD_RATES;
    } catch {
      return BASELINE_USD_RATES;
    }
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPaidBreakOpen, setIsPaidBreakOpen] = useState(false);
  const [isStealthMode, setIsStealthMode] = useState(false);

  // Save settings to LocalStorage
  const handleUpdateSettings = (newSettings: SalarySettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    } catch {
      // ignore
    }
  };

  // Fetch live exchange rates
  useEffect(() => {
    const controller = new AbortController();
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', { signal: controller.signal });
        if (!res.ok) return;

        const data = await res.json();
        const updatedRates = normalizeExchangeRates(data?.rates);
        if (!updatedRates || controller.signal.aborted) return;

        setRates(updatedRates);
        localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(updatedRates));
      } catch {
        // Keep the rates already in memory if the request or cache write fails.
      }
    };

    fetchRates();
    return () => controller.abort();
  }, []);

  // Global Keyboard shortcut: Esc to toggle Boss / Stealth Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else if (isPaidBreakOpen) {
          setIsPaidBreakOpen(false);
        } else {
          setIsStealthMode((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, isPaidBreakOpen]);

  const cycleEquivalence = () => {
    const ids = EQUIVALENCE_CATALOG.map((i) => i.id);
    const currentId = settings.activeEquivalenceId || 'latte';
    const currentIdx = ids.indexOf(currentId);
    const nextId = ids[(currentIdx + 1) % ids.length];
    handleUpdateSettings({
      ...settings,
      activeEquivalenceId: nextId,
    });
  };

  const calculator = new EarningsCalculator(settings, rates);
  const now = new Date();
  const todayEarned = calculator.todayEarnings(now);

  return (
    <div className="min-h-screen bg-[#091417] text-white flex flex-col items-center justify-start sm:justify-center px-3 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)] sm:p-6 antialiased selection:bg-mint/30">
      {isStealthMode ? (
        <StealthView
          onExit={() => setIsStealthMode(false)}
          todayEarned={todayEarned}
          currency={settings.displayCurrency}
        />
      ) : (
        <>
          <Dashboard
            settings={settings}
            calculator={calculator}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenPaidBreak={() => setIsPaidBreakOpen(true)}
            onToggleStealth={() => setIsStealthMode(true)}
            onCycleEquivalence={cycleEquivalence}
            onToggleMini={() => handleUpdateSettings({ ...settings, isMiniMode: !settings.isMiniMode })}
          />

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            rates={rates}
            onUpdate={handleUpdateSettings}
          />

          <PaidBreakModal
            isOpen={isPaidBreakOpen}
            onClose={() => setIsPaidBreakOpen(false)}
            perSecondEarnings={calculator.perSecondEarnings}
            currency={settings.displayCurrency}
            lang={settings.appLanguage}
          />
        </>
      )}
    </div>
  );
}
