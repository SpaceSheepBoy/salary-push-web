import React, { useState, useEffect, useRef } from 'react';
import { X, Square, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrencyValue, getCurrencySymbol } from '../utils/constants';
import { AppLanguage } from '../types';

interface PaidBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  perSecondEarnings: number;
  currency: string;
  lang: AppLanguage;
}

function secondsSince(startedAt: number): number {
  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}

export const PaidBreakModal: React.FC<PaidBreakModalProps> = ({
  isOpen,
  onClose,
  perSecondEarnings,
  currency,
  lang,
}) => {
  const startedAt = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [finishedResult, setFinishedResult] = useState<{ time: string; earned: string } | null>(null);
  const isFinished = finishedResult !== null;

  useEffect(() => {
    if (!isOpen) {
      setElapsed(0);
      setFinishedResult(null);
      return;
    }
    if (isFinished) return;

    startedAt.current = Date.now();
    const refresh = () => setElapsed(secondsSince(startedAt.current));
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    const interval = setInterval(refresh, 1000);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [isOpen, isFinished]);

  if (!isOpen) return null;

  const earnedNow = elapsed * perSecondEarnings;
  const sym = getCurrencySymbol(currency);
  const earnedFormatted = formatCurrencyValue(earnedNow, currency, 2);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStop = () => {
    const finalElapsed = secondsSince(startedAt.current);
    setFinishedResult({
      time: formatTimer(finalElapsed),
      earned: formatCurrencyValue(finalElapsed * perSecondEarnings, currency, 2),
    });
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0E2024] border border-[#1F3238] p-6 shadow-2xl text-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-grayteal hover:text-white transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#182F36] text-coral mb-3">
          <Coffee className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {lang === 'zh' ? '☕️ 工间休息 / 能量补给' : (lang === 'fr' ? '☕️ Pause Café Payée' : '☕️ Paid Break Tracker')}
        </h3>
        <p className="text-xs text-grayteal mb-4">
          {lang === 'zh' ? '劳逸结合，工间休息时间同样计算在工时内' : (lang === 'fr' ? 'Chaque seconde de pause est rémunérée' : 'Every second of your break is paid')}
        </p>

        {!finishedResult ? (
          <>
            <div className="text-4xl font-mono font-bold text-white mb-2">
              {formatTimer(elapsed)}
            </div>

            <div className="text-xs text-grayteal uppercase tracking-wider mb-1">
              {lang === 'zh' ? '本次休息已进账' : (lang === 'fr' ? 'Gains de la pause' : 'Earned during break')}
            </div>

            <div className="text-3xl font-bold font-mono text-coral mb-6">
              {currency.toUpperCase() === 'EUR' ? `${earnedFormatted} ${sym}` : `${sym}${earnedFormatted}`}
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-coral hover:bg-coral/90 text-white font-medium text-sm transition-all"
              >
                <Square className="w-4 h-4 fill-white" />
                {lang === 'zh' ? '休息结束，结算收益' : (lang === 'fr' ? 'Terminer la pause' : 'End Break')}
              </button>
            </div>
          </>
        ) : (
          <div className="py-2">
            <div className="p-4 rounded-xl bg-[#091417] border border-[#1F3238] mb-4">
              <div className="text-2xl mb-1">🎉</div>
              <div className="text-sm font-semibold text-white mb-1">
                {lang === 'zh' ? '能量补给完成！' : (lang === 'fr' ? 'Pause réussie !' : 'Break Completed!')}
              </div>
              <p className="text-xs text-grayteal mb-3">
                {lang === 'zh' ? `本次共休息 ${finishedResult.time}` : `Duration: ${finishedResult.time}`}
              </p>
              <div className="text-2xl font-bold font-mono text-mint">
                +{currency.toUpperCase() === 'EUR' ? `${finishedResult.earned} ${sym}` : `${sym}${finishedResult.earned}`}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#182F36] hover:bg-[#1E3B44] text-white text-sm font-medium transition-all"
            >
              {lang === 'zh' ? '收下战果，返回工位' : (lang === 'fr' ? 'Fermer' : 'Close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
