import React, { useState, useEffect } from 'react';
import { X, Play, Square, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrencyValue, getCurrencySymbol } from '../utils/constants';

interface PaidBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  perSecondEarnings: number;
  currency: string;
  lang: 'zh' | 'fr' | 'en';
}

export const PaidBreakModal: React.FC<PaidBreakModalProps> = ({
  isOpen,
  onClose,
  perSecondEarnings,
  currency,
  lang,
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [finishedResult, setFinishedResult] = useState<{ time: string; earned: string } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setElapsed(0);
      setIsActive(true);
      setFinishedResult(null);
      return;
    }

    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isActive]);

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
    setIsActive(false);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    setFinishedResult({
      time: formatTimer(elapsed),
      earned: earnedFormatted,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0E2024] border border-[#1F3238] p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-grayteal hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#182F36] text-coral mb-3">
          <Coffee className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {lang === 'zh' ? '☕️ 带薪摸鱼 / 如厕计时' : (lang === 'fr' ? '☕️ Pause Café Payée' : '☕️ Paid Break Tracker')}
        </h3>
        <p className="text-xs text-grayteal mb-4">
          {lang === 'zh' ? '每一秒都是公司为你的休息买单' : (lang === 'fr' ? 'Chaque seconde de pause est rémunérée' : 'Every second of your break is paid')}
        </p>

        {!finishedResult ? (
          <>
            <div className="text-4xl font-mono font-bold text-white mb-2">
              {formatTimer(elapsed)}
            </div>

            <div className="text-xs text-grayteal uppercase tracking-wider mb-1">
              {lang === 'zh' ? '本次摸鱼已赚' : (lang === 'fr' ? 'Gains de la pause' : 'Earned during break')}
            </div>

            <div className="text-3xl font-bold font-mono text-coral mb-6">
              {currency.toUpperCase() === 'EUR' ? `${earnedFormatted} ${sym}` : `${sym}${earnedFormatted}`}
            </div>

            <div className="flex gap-2 justify-center">
              {isActive ? (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-coral hover:bg-coral/90 text-white font-medium text-sm transition-all"
                >
                  <Square className="w-4 h-4 fill-white" />
                  {lang === 'zh' ? '摸鱼结束，结算战报' : (lang === 'fr' ? 'Terminer la pause' : 'End Break')}
                </button>
              ) : (
                <button
                  onClick={() => setIsActive(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-mint hover:bg-mint/90 text-[#091417] font-semibold text-sm transition-all"
                >
                  <Play className="w-4 h-4 fill-[#091417]" />
                  {lang === 'zh' ? '继续摸鱼' : (lang === 'fr' ? 'Reprendre' : 'Resume')}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="py-2">
            <div className="p-4 rounded-xl bg-[#091417] border border-[#1F3238] mb-4">
              <div className="text-2xl mb-1">🎉</div>
              <div className="text-sm font-semibold text-white mb-1">
                {lang === 'zh' ? '带薪摸鱼大成功！' : (lang === 'fr' ? 'Pause réussie !' : 'Break Completed!')}
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
