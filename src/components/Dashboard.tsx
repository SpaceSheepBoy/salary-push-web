import React, { useState, useEffect } from 'react';
import { Settings, Coffee, Eye, Sparkles, Minimize2, Maximize2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SalarySettings } from '../types';
import { EarningsCalculator, formatDaysAndTime, formatTimeInterval } from '../utils/calculator';
import {
  formatCurrencyValue,
  getCurrencySymbol,
  L10N,
  MOTIVATIONAL_QUOTES,
} from '../utils/constants';

interface DashboardProps {
  settings: SalarySettings;
  exchangeRate: number;
  onOpenSettings: () => void;
  onOpenPaidBreak: () => void;
  onToggleStealth: () => void;
  onCycleEquivalence: () => void;
  onToggleMini: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  settings,
  exchangeRate,
  onOpenSettings,
  onOpenPaidBreak,
  onToggleStealth,
  onCycleEquivalence,
  onToggleMini,
}) => {
  const [now, setNow] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showTips, setShowTips] = useState(false);

  // High-frequency 30fps animation for real-time ticker
  useEffect(() => {
    let animationFrameId: number;
    const update = () => {
      setNow(new Date());
      animationFrameId = requestAnimationFrame(update);
    };
    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Motivational quote rotator every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => prev + 1);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const calculator = new EarningsCalculator(settings, exchangeRate);
  const lang = settings.appLanguage;
  const l10n = L10N[lang];
  const sym = getCurrencySymbol(settings.displayCurrency);
  const isEuropean = ['EUR', 'CHF'].includes(settings.displayCurrency.toUpperCase());

  const isWorking = calculator.isCurrentlyWorking(now);
  const todayEarned = calculator.todayEarnings(now);
  const todayEarnedFormatted = formatCurrencyValue(todayEarned, settings.displayCurrency, 2);

  const benefit = calculator.benefitSummary(now);
  const benefitFormatted = formatCurrencyValue(benefit.todayAccumulated, settings.displayCurrency, 2);

  const restInfo = calculator.nextRestInfo(now);
  const restCountdown = formatDaysAndTime(restInfo.countdownSeconds, lang);

  const tenure = calculator.workTenure(now);
  const retireYears = calculator.yearsUntilRetirement(now);

  const workedSeconds = calculator.secondsWorkedToday(now);
  const remainingSeconds = calculator.secondsUntilEndOfWork(now);
  const progress = calculator.dayProgress(now);

  const quotes = MOTIVATIONAL_QUOTES[lang];
  const currentQuote = quotes[quoteIndex % quotes.length];

  const equivalence = calculator.salaryEquivalence(todayEarned);
  const payday = calculator.paydayCountdown(now);

  const isMini = settings.isMiniMode;

  return (
    <div className={`w-full ${isMini ? 'max-w-[280px]' : 'max-w-[346px]'} flex flex-col gap-2 mx-auto transition-all duration-300`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-1 text-grayteal">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-grayteal">{l10n.appTitle}</span>
          <span className="text-[10px] opacity-60">SalaryPush · 带薪摸鱼</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Mini Mode Toggle */}
          <button
            onClick={onToggleMini}
            className="p-1 rounded text-grayteal hover:text-white hover:bg-white/5 transition-all"
            title={isMini ? '展开完整面板 (Expand)' : '迷你悬浮窗 (Mini Mode)'}
          >
            {isMini ? <Maximize2 className="w-3.5 h-3.5 text-mint" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>

          {!isMini && (
            <button
              onClick={onToggleStealth}
              className="p-1 rounded text-grayteal hover:text-white hover:bg-white/5 transition-all"
              title="老板键 (ESC 隐身)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-1 rounded text-grayteal hover:text-white hover:bg-white/5 transition-all"
            title="设置"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Reference Card (Supports Full & Mini Modes) */}
      <div
        onDoubleClick={isMini ? onToggleMini : onOpenSettings}
        className={`w-full rounded-2xl bg-cardbg border border-cardborder ${
          isMini ? 'p-3 gap-1.5' : 'p-3.5 gap-2.5'
        } flex flex-col shadow-2xl relative cursor-default transition-all duration-300`}
      >
        {/* 1. Header: 今日已赚 + ● 在岗 */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-grayteal">{l10n.todayEarned}</span>

          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
              isWorking
                ? 'bg-[#331518] text-coral'
                : 'bg-[#14262A] text-grayteal'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isWorking ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span>{isWorking ? l10n.statusWorking : l10n.statusOffDuty}</span>
          </div>
        </div>

        {/* 2. Big Animated Number (Coral pink, 2 decimals, dot for RMB/USD, comma for EUR) */}
        <div className="flex flex-col items-center justify-center text-center pt-0.5">
          <div className="flex items-baseline justify-center font-mono font-bold text-coral drop-shadow-[0_2px_10px_rgba(231,117,121,0.25)]">
            {!isEuropean && <span className={`${isMini ? 'text-xl' : 'text-2xl'} mr-0.5`}>{sym}</span>}
            <span className={`${isMini ? 'text-3xl' : 'text-4xl'} tracking-tight select-all font-extrabold`}>
              {todayEarnedFormatted}
            </span>
            {isEuropean && <span className={`${isMini ? 'text-xl' : 'text-2xl'} ml-1`}>{sym}</span>}
          </div>

          <p className="text-xs font-serif italic text-white/90 mt-1 transition-all">
            {currentQuote}
          </p>

          {/* Mini mode compact reward badge */}
          {isMini && (
            <button
              onClick={onCycleEquivalence}
              className="mt-2 px-2.5 py-1 rounded-full bg-[#081518] border border-[#14262A] hover:border-coral/40 text-[11px] text-white flex items-center gap-1.5 transition-all shadow-sm"
              title={`点击切换实物奖励 · 单价: ${sym}${equivalence.formattedPrice}`}
            >
              <span>{equivalence.item.icon}</span>
              {equivalence.isGoal ? (
                <>
                  <span className="font-mono text-mint font-bold">{equivalence.progressPercent.toFixed(1)}%</span>
                  <span className="text-grayteal text-[10px] truncate max-w-[120px]">{equivalence.item.name}</span>
                </>
              ) : (
                <>
                  <span className="font-mono text-mint font-bold">{equivalence.count.toFixed(1)}</span>
                  <span className="text-grayteal text-[10px] truncate max-w-[120px]">{equivalence.item.unit}{equivalence.item.name}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Below sections are only shown in Full Mode */}
        {!isMini && (
          <>
            {/* 3. 3-Column Stats Row (每秒进账, 时薪, 日薪) */}
            <div className="grid grid-cols-3 gap-1 py-1 text-left border-y border-white/[0.04]">
              <div>
                <div className="text-[10px] text-grayteal">{l10n.perSecond}</div>
                <div className="text-xs font-bold font-mono text-white truncate">
                  {isEuropean
                    ? `${formatCurrencyValue(calculator.perSecondEarnings, settings.displayCurrency, 5)} ${sym}`
                    : `${sym}${formatCurrencyValue(calculator.perSecondEarnings, settings.displayCurrency, 5)}`}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-grayteal">{l10n.hourlyRate}</div>
                <div className="text-xs font-bold font-mono text-white truncate">
                  {isEuropean
                    ? `${formatCurrencyValue(calculator.hourlyEarnings, settings.displayCurrency, 2)} ${sym}`
                    : `${sym}${formatCurrencyValue(calculator.hourlyEarnings, settings.displayCurrency, 2)}`}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-grayteal">{l10n.dailyRate}</div>
                <div className="text-xs font-bold font-mono text-white truncate">
                  {isEuropean
                    ? `${formatCurrencyValue(calculator.dailyEarnings, settings.displayCurrency, 2)} ${sym}`
                    : `${sym}${formatCurrencyValue(calculator.dailyEarnings, settings.displayCurrency, 2)}`}
                </div>
              </div>
            </div>

            {/* 4. Social Benefit / Housing Fund Row */}
            <div className="flex items-baseline justify-between text-xs">
              <div className="flex items-baseline gap-1.5">
                <span className="text-grayteal text-[11px]">{benefit.title}</span>
                <span className="font-mono font-bold text-cyanaccent text-[13px]">
                  {isEuropean ? `${benefitFormatted} ${sym}` : `${sym}${benefitFormatted}`}
                </span>
              </div>
              <span className="text-[10px] text-grayteal/80 truncate max-w-[140px] text-right">
                {benefit.formulaText}
              </span>
            </div>

            {/* 5. Divider */}
            <div className="h-[1px] bg-white/[0.06] -my-1" />

            {/* 6. Next Rest Countdown & 7-Day Pill Strip */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-grayteal">{l10n.nextRest}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#362C13] text-amberbadge">
                  {restInfo.badgeName}
                </span>
              </div>

              <div className="flex items-baseline gap-0.5 font-mono font-bold text-white text-2xl">
                {restCountdown.days > 0 && (
                  <>
                    <span>{restCountdown.days}</span>
                    <span className="text-lg mr-1">{restCountdown.daySuffix}</span>
                  </>
                )}
                <span>{restCountdown.time}</span>
              </div>

              <div className="text-[10px] text-grayteal -mt-1">
                {restInfo.startDateFormatted}
              </div>

              {/* 7-day pill strip */}
              <div className="grid grid-cols-7 gap-1 pt-0.5">
                {restInfo.dayStrips.map((item) => (
                  <div key={item.id} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-full h-1 rounded-full ${
                        item.isToday
                          ? 'bg-mint'
                          : item.isWorkDay
                          ? 'bg-[#182F36]'
                          : 'bg-[#223E47]'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-mono ${
                        item.isToday ? 'text-white font-bold' : 'text-grayteal'
                      }`}
                    >
                      {item.dayNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Work Tenure & Retirement */}
            <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-[#081518] border border-[#14262A]">
              <div>
                <div className="text-[10px] text-grayteal">{l10n.workTenure}</div>
                <div className="text-xs font-bold text-lavender mt-0.5">
                  {tenure.years} 年 {tenure.months} 个月
                </div>
              </div>
              <div>
                <div className="text-[10px] text-grayteal">{l10n.yearsUntilRetirement}</div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {retireYears} 年
                </div>
              </div>
            </div>

            {/* 8. Today's Progress Bar */}
            <div className="flex flex-col gap-1.5 pt-0.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-grayteal">
                  {l10n.workedToday} {formatTimeInterval(workedSeconds)}
                </span>
                <span className="text-coral font-semibold">
                  {l10n.remainingToday} {formatTimeInterval(remainingSeconds)}
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-[#182F36] overflow-hidden">
                <div
                  className="h-full bg-coral rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Extra Interactive Cards (Full Mode Only) */}
      {!isMini && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {/* Equivalence Pill */}
            <button
              onClick={onCycleEquivalence}
              className="p-2.5 rounded-xl bg-cardbg/80 border border-cardborder text-left hover:border-coral/50 transition-all group flex flex-col justify-between"
              title={`点击切换实物奖励 · 当前单价: ${sym}${equivalence.formattedPrice}`}
            >
              <div className="text-[10px] text-grayteal flex items-center justify-between w-full">
                <span>{equivalence.isGoal ? '🎯 攒钱目标' : '今日已赚实物'}</span>
                <span className="text-[9px] text-coral opacity-0 group-hover:opacity-100 transition-opacity">切换 ↻</span>
              </div>
              <div className="text-xs font-bold text-white mt-1 flex items-center gap-1 w-full truncate">
                <span>{equivalence.item.icon}</span>
                {equivalence.isGoal ? (
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="font-mono text-mint font-bold">{equivalence.progressPercent.toFixed(1)}%</span>
                    <span className="text-grayteal text-[10px] truncate">{equivalence.item.name}</span>
                  </div>
                ) : (
                  <>
                    <span className="font-mono text-mint font-bold">{equivalence.count.toFixed(1)}</span>
                    <span className="text-grayteal text-[10px] truncate">{equivalence.item.unit}{equivalence.item.name}</span>
                  </>
                )}
              </div>
              {equivalence.isGoal ? (
                <div className="w-full h-1 bg-[#182F36] rounded-full overflow-hidden mt-1.5">
                  <div
                    className="h-full bg-mint rounded-full transition-all duration-300"
                    style={{ width: `${equivalence.progressPercent}%` }}
                  />
                </div>
              ) : (
                <div className="text-[9px] text-grayteal/60 truncate mt-0.5">
                  单价 {sym}{equivalence.formattedPrice}
                </div>
              )}
            </button>

            {/* Payday Pill */}
            <div className="p-2 rounded-xl bg-cardbg/80 border border-cardborder text-left">
              <div className="text-[10px] text-grayteal flex items-center justify-between">
                <span>{l10n.paydayCountdown}</span>
                <span className="text-[9px] text-amberbadge">每月{settings.paydayDay}号</span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amberbadge" />
                <span className="font-mono">{payday.days}</span>
                <span className="text-[10px] text-grayteal">天</span>
                <span className="font-mono">{payday.hours}</span>
                <span className="text-[10px] text-grayteal">时</span>
              </div>
            </div>
          </div>

          {/* Action Bar (Paid Coffee Break) */}
          <button
            onClick={onOpenPaidBreak}
            className="w-full py-2 px-3 rounded-xl bg-[#132A30] hover:bg-[#18353D] border border-[#1E3E47] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <Coffee className="w-4 h-4 text-coral group-hover:rotate-12 transition-transform" />
            <span>{l10n.paidBreakTitle}</span>
            <span className="text-[10px] text-mint font-mono font-bold">+开始计时</span>
          </button>

          {/* Footer info & Usage Tips Toggle */}
          <div className="flex items-center justify-between px-2 text-[10px] text-grayteal/70 font-mono">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-coral" />
              <span>使用秘籍</span>
              {showTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <span>{now.toLocaleTimeString()}</span>
          </div>

          {/* Usage Tips Accordion */}
          {showTips && (
            <div className="p-3 rounded-xl bg-[#091518] border border-[#16292E] text-left text-[11px] text-grayteal flex flex-col gap-1.5 animate-fadeIn">
              <div className="font-semibold text-white flex items-center gap-1.5 pb-1 border-b border-white/[0.06]">
                <span>💡 上班加油器快捷指南</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-coral font-bold">⌨️ ESC:</span>
                <span>老板键瞬间隐身（伪装成极简工作日历时钟，再按 ESC 或双击退出）</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-mint font-bold">🪟 迷你模式:</span>
                <span>点击右上角最小化图标或双击卡片，缩减为仅保留“今日已赚”超窄便签</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amberbadge font-bold">🎁 实物激励:</span>
                <span>轻点实物卡片可循环切换咖啡、电影票、3A游戏、大件心愿单等目标</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-cyanaccent font-bold">💾 自动记忆:</span>
                <span>所有薪资、国家福利与工作日配置全自动离线保存在本地浏览器中</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-lavender font-bold">📲 桌面安装:</span>
                <span>支持 PWA，可在浏览器地址栏或分享菜单点击“添加到主屏幕/安装应用”</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mini Mode Footer Hint */}
      {isMini && (
        <div className="text-center text-[10px] text-grayteal/60 font-mono flex items-center justify-center gap-2">
          <span>双击卡片展开完整面板</span>
          <span>·</span>
          <span>按 ESC 老板键</span>
        </div>
      )}
    </div>
  );
};
