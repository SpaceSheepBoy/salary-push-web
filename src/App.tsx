import { useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from './utils/constants';
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

  const [exchangeRate, setExchangeRate] = useState<number>(1.0);
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
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates) {
            localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(data.rates));
            computeRate(data.rates);
          }
        }
      } catch {
        // Fallback to cached rates
        try {
          const cached = localStorage.getItem(RATES_CACHE_KEY);
          if (cached) {
            computeRate(JSON.parse(cached));
          }
        } catch {
          // ignore
        }
      }
    };

    const computeRate = (rates: Record<string, number>) => {
      const from = settings.salaryCurrency.toUpperCase();
      const to = settings.displayCurrency.toUpperCase();
      if (from === to) {
        setExchangeRate(1.0);
        return;
      }
      const fromRate = rates[from];
      const toRate = rates[to];
      if (fromRate && toRate && fromRate > 0) {
        setExchangeRate(toRate / fromRate);
      }
    };

    fetchRates();
  }, [settings.salaryCurrency, settings.displayCurrency]);

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
    const modes: Array<'latte' | 'meal' | 'gas' | 'movie'> = ['latte', 'meal', 'gas', 'movie'];
    const currentIdx = modes.indexOf(settings.activeEquivalence);
    const nextMode = modes[(currentIdx + 1) % modes.length];
    handleUpdateSettings({ ...settings, activeEquivalence: nextMode });
  };

  const calculator = new EarningsCalculator(settings, exchangeRate);
  const now = new Date();
  const todayEarned = calculator.todayEarnings(now);

  return (
    <div className="min-h-screen bg-[#091417] text-white flex flex-col items-center justify-center p-3 sm:p-6 antialiased">
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
            exchangeRate={exchangeRate}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenPaidBreak={() => setIsPaidBreakOpen(true)}
            onToggleStealth={() => setIsStealthMode(true)}
            onCycleEquivalence={cycleEquivalence}
          />

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
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
