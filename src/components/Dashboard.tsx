import React, { useState, useEffect } from 'react';
import { Settings, Coffee, Eye, Sparkles, Minimize2, Maximize2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SalarySettings } from '../types';
import { EarningsCalculator, formatDaysAndTime, formatTimeInterval } from '../utils/calculator';
import {
  formatCurrencyValue,
  getCurrencySymbol,
  L10N,
  MOTIVATIONAL_QUOTES,
  formatTenureText,
  formatRetirementYearsText,
  formatPaydayDayText,
  getEquivalenceName,
  getEquivalenceUnit,
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
  const monthInfo = calculator.monthToDateEarnings(now);

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
  const wishlist = calculator.customWishlistGoal(todayEarned);

  const isMini = settings.isMiniMode;

  return (
    <div className={`w-full ${isMini ? 'max-w-[280px]' : 'max-w-[346px]'} flex flex-col gap-2 mx-auto transition-all duration-300`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-1 text-grayteal">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-xs text-white tracking-wide">{l10n.appTitle}</span>
          <span className="text-[10px] opacity-60">SalaryPush</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mini Mode Toggle - Enlarge to 36px touch target */}
          <button
            type="button"
            onClick={onToggleMini}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#122429] hover:bg-[#1C363D] active:bg-coral/30 border border-[#1F3238] text-gray-300 hover:text-white transition-all touch-manipulation select-none active:scale-95 shadow-sm"
            title={isMini ? 'Expand' : 'Mini Mode'}
          >
            {isMini ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>

          {/* Settings Button - Enlarge to 36px touch target */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-[#122429] hover:bg-[#1C363D] active:bg-coral/30 border border-[#1F3238] text-gray-300 hover:text-white transition-all touch-manipulation select-none active:scale-95 shadow-sm"
            title="Settings"
          >
            <Settings className="w-4.5 h-4.5 text-white" />
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
        {/* 1. Header: 今日已赚 + [Net / Brut 状态徽章] + ● 在岗 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-grayteal">{l10n.todayEarned}</span>
            <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-mint">
              {calculator.isCountingNet ? l10n.heroSubNet : l10n.heroSubBrut}
            </span>
          </div>

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

        {/* 2. Big Animated Number (Golden yellow with cash emoji 💰, 2 decimals, dot for RMB/USD, comma for EUR) */}
        <div className="flex flex-col items-center justify-center text-center pt-0.5">
          <div className="flex items-baseline justify-center font-mono font-bold text-[#FBBF24] drop-shadow-[0_2px_12px_rgba(251,191,36,0.3)]">
            <span className={`${isMini ? 'text-xl' : 'text-2xl'} mr-1.5 select-none`}>💰</span>
            {!isEuropean && <span className={`${isMini ? 'text-xl' : 'text-2xl'} mr-0.5`}>{sym}</span>}
            <span className={`${isMini ? 'text-3xl' : 'text-4xl'} tracking-tight select-all font-extrabold`}>
              {todayEarnedFormatted}
            </span>
            {isEuropean && <span className={`${isMini ? 'text-xl' : 'text-2xl'} ml-1`}>{sym}</span>}
          </div>

          {/* Month-to-Date Live Pill right under Hero Amount */}
          <div className="mt-1 flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-[#122429]/90 border border-[#1C363D] text-[11px] text-grayteal shadow-sm">
            <span className="text-grayteal/80">{l10n.monthEarned}:</span>
            <span className="font-bold text-mint font-mono">
              {isEuropean
                ? `${formatCurrencyValue(monthInfo.totalEarned, settings.displayCurrency, 2)} ${sym}`
                : `${sym}${formatCurrencyValue(monthInfo.totalEarned, settings.displayCurrency, 2)}`}
            </span>
            <span className="text-[10px] text-grayteal/70">
              ({l10n.monthProgress} {monthInfo.progressPercent.toFixed(1)}%)
            </span>
          </div>

          <p className="text-xs font-serif italic text-white/90 mt-1.5 transition-all">
            {currentQuote}
          </p>

          {/* Mini mode compact reward badge */}
          {isMini && (
            <button
              onClick={onCycleEquivalence}
              className="mt-2 px-2.5 py-1 rounded-full bg-[#081518] border border-[#14262A] hover:border-[#FBBF24]/40 text-[11px] text-white flex items-center gap-1.5 transition-all shadow-sm"
              title={`单价: ${sym}${equivalence.formattedPrice}`}
            >
              <span>{equivalence.item.icon}</span>
              {equivalence.isGoal ? (
                <>
                  <span className="font-mono text-mint font-bold">{equivalence.progressPercent.toFixed(1)}%</span>
                  <span className="text-grayteal text-[10px] truncate max-w-[120px]">{getEquivalenceName(equivalence.item, lang)}</span>
                </>
              ) : (
                <>
                  <span className="font-mono text-mint font-bold">{equivalence.count.toFixed(1)}</span>
                  <span className="text-grayteal text-[10px] truncate max-w-[120px]">{getEquivalenceUnit(equivalence.item, lang)}{getEquivalenceName(equivalence.item, lang)}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Below sections are only shown in Full Mode */}
        {!isMini && (
          <>
            {/* 3. 4-Column Stats Row (每秒进账, 时薪, 日薪, 年薪) */}
            <div className="grid grid-cols-4 gap-1 py-1.5 text-left border-y border-white/[0.04]">
              <div>
                <div className="text-[10px] text-grayteal truncate">{l10n.perSecond}</div>
                <div className="text-xs font-bold font-mono text-white truncate">
                  {isEuropean
                    ? `${formatCurrencyValue(calculator.perSecondEarnings, settings.displayCurrency, 5)} ${sym}`
                    : `${sym}${formatCurrencyValue(calculator.perSecondEarnings, settings.displayCurrency, 5)}`}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-grayteal truncate">{l10n.hourlyRate}</div>
                <div className="text-xs font-bold font-mono text-white truncate">
                  {isEuropean
                    ? `${formatCurrencyValue(calculator.hourlyEarnings, settings.displayCurrency, 2)} ${sym}`
                    : `${sym}${formatCurrencyValue(calculator.hourlyEarnings, settings.displayCurrency, 2)}`}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-grayteal truncate">{l10n.dailyRate}</div>
                <div className="text-xs font-bold font-mono text-white truncate">
                  {isEuropean
                    ? `${formatCurrencyValue(calculator.dailyEarnings, settings.displayCurrency, 2)} ${sym}`
                    : `${sym}${formatCurrencyValue(calculator.dailyEarnings, settings.displayCurrency, 2)}`}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-grayteal truncate">{l10n.annualSalary}</div>
                <div className="text-xs font-bold font-mono text-white truncate">
                  {isEuropean
                    ? `${formatCurrencyValue(calculator.annualEarnings, settings.displayCurrency, 0)} ${sym}`
                    : `${sym}${formatCurrencyValue(calculator.annualEarnings, settings.displayCurrency, 0)}`}
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
                  {formatTenureText(tenure.years, tenure.months, lang)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-grayteal">{l10n.yearsUntilRetirement}</div>
                <div className="text-xs font-bold text-white mt-0.5">
                  {formatRetirementYearsText(retireYears, lang)}
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
          {/* Dedicated Private Wishlist Milestone Goal with Already-Saved Progress */}
          <div className="p-3 rounded-xl bg-cardbg/80 border border-cardborder text-left hover:border-mint/50 transition-all group space-y-1.5">
            <div className="text-[10px] text-grayteal flex items-center justify-between w-full">
              <span className="flex items-center gap-1.5 font-semibold text-white">
                <span className="text-sm">🎯</span>
                <span>{l10n.wishlistGoal || '私人心愿目标'}</span>
              </span>
              <button
                type="button"
                onClick={onOpenSettings}
                className="text-[11px] text-coral hover:underline flex items-center gap-1 transition-colors"
                title="Settings"
              >
                <span className="font-medium">{wishlist.name}</span>
                <span className="text-grayteal/60 group-hover:text-coral transition-colors">✎</span>
              </button>
            </div>

            {/* Visual Multi-Segment Progress Bar */}
            <div className="w-full h-2 bg-[#0E1F24] rounded-full overflow-hidden flex relative border border-[#182C31]">
              {/* Segment 1: Already Saved (Mint) */}
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-mint transition-all duration-300"
                style={{ width: `${wishlist.savedPercent}%` }}
                title={`已存: ${sym}${wishlist.formattedSaved}`}
              />
              {/* Segment 2: Today's Earned (Gold) */}
              <div
                className="h-full bg-[#FBBF24] transition-all duration-300"
                style={{ width: `${wishlist.todayPercent}%` }}
                title={`今日进账: ${sym}${formatCurrencyValue(wishlist.todayEarned, settings.displayCurrency, 2)}`}
              />
            </div>

            {/* Clear Multi-Row Data Breakdown */}
            <div className="flex items-center justify-between text-[10.5px] font-mono pt-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-mint font-mono">{wishlist.progressPercent.toFixed(1)}%</span>
                {wishlist.saved > 0 && (
                  <span className="text-grayteal">
                    {l10n.wishlistSavedLabel}: <span className="text-white font-medium">{isEuropean ? `${wishlist.formattedSaved} ${sym}` : `${sym}${wishlist.formattedSaved}`}</span>
                  </span>
                )}
                <span className="text-grayteal">
                  +{l10n.todayContribution}: <span className="text-[#FBBF24] font-medium">{isEuropean ? `${formatCurrencyValue(wishlist.todayEarned, settings.displayCurrency, 2)} ${sym}` : `${sym}${formatCurrencyValue(wishlist.todayEarned, settings.displayCurrency, 2)}`}</span>
                </span>
              </div>

              <div className="text-right text-grayteal whitespace-nowrap">
                <span>{l10n.targetLabel}: </span>
                <span className="text-white font-bold">{isEuropean ? `${wishlist.formattedPrice} ${sym}` : `${sym}${wishlist.formattedPrice}`}</span>
                {wishlist.remaining > 0 ? (
                  <span className="text-coral ml-1 text-[10px]">
                    ({l10n.wishlistRemainingLabel} {isEuropean ? `${wishlist.formattedRemaining} ${sym}` : `${sym}${wishlist.formattedRemaining}`})
                  </span>
                ) : (
                  <span className="text-mint ml-1 text-[10px]">🎉 已达成</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Equivalence Pill */}
            <button
              onClick={onCycleEquivalence}
              className="p-2.5 rounded-xl bg-cardbg/80 border border-cardborder text-left hover:border-coral/50 transition-all group flex flex-col justify-between"
              title={`单价: ${sym}${equivalence.formattedPrice}`}
            >
              <div className="text-[10px] text-grayteal flex items-center justify-between w-full">
                <span>{equivalence.isGoal ? `🎯 ${l10n.savingGoal}` : l10n.earnedGoods}</span>
                <span className="text-[9px] text-coral opacity-0 group-hover:opacity-100 transition-opacity">↻</span>
              </div>
              <div className="text-xs font-bold text-white mt-1 flex items-center gap-1 w-full truncate">
                <span>{equivalence.item.icon}</span>
                {equivalence.isGoal ? (
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="font-mono text-mint font-bold">{equivalence.progressPercent.toFixed(1)}%</span>
                    <span className="text-grayteal text-[10px] truncate">{getEquivalenceName(equivalence.item, lang)}</span>
                  </div>
                ) : (
                  <>
                    <span className="font-mono text-mint font-bold">{equivalence.count.toFixed(1)}</span>
                    <span className="text-grayteal text-[10px] truncate">{getEquivalenceUnit(equivalence.item, lang)}{getEquivalenceName(equivalence.item, lang)}</span>
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
                  {l10n.unitPriceLabel} {isEuropean ? `${equivalence.formattedPrice} ${sym}` : `${sym}${equivalence.formattedPrice}`}
                </div>
              )}
            </button>

            {/* Payday Pill */}
            <div className="p-2 rounded-xl bg-cardbg/80 border border-cardborder text-left">
              <div className="text-[10px] text-grayteal flex items-center justify-between">
                <span>{l10n.paydayCountdown}</span>
                <span className="text-[9px] text-amberbadge">
                  {payday.isEndOfMonth ? l10n.paydayEndOfMonth : formatPaydayDayText(settings.paydayDay, lang)}
                </span>
              </div>
              <div className="text-xs font-bold text-white mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amberbadge" />
                <span className="font-mono">{payday.days}</span>
                <span className="text-[10px] text-grayteal">{l10n.daysUnit}</span>
                <span className="font-mono">{payday.hours}</span>
                <span className="text-[10px] text-grayteal">{l10n.hoursUnit}</span>
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
            <span className="text-[10px] text-mint font-mono font-bold">{l10n.startBreakTimer}</span>
          </button>

          {/* Footer info & Usage Tips Toggle */}
          <div className="flex items-center justify-between px-2 text-[10px] text-grayteal/70 font-mono">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-coral" />
              <span>{l10n.cheatsheet}</span>
              {showTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <span>{now.toLocaleTimeString()}</span>
          </div>

          {/* Usage Tips Accordion */}
          {showTips && (
            <div className="p-3 rounded-xl bg-[#091518] border border-[#16292E] text-left text-[11px] text-grayteal flex flex-col gap-1.5 animate-fadeIn">
              <div className="font-semibold text-white flex items-center gap-1.5 pb-1 border-b border-white/[0.06]">
                <span>💡 {l10n.cheatsheet}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-coral font-bold">⌨️ ESC:</span>
                <span>{lang === 'fr' ? 'Mode discret instantané (masque en horloge, ESC pour restaurer)' : lang === 'zh' ? '老板键瞬间隐身（伪装成极简日历时钟，再按 ESC 退出）' : lang === 'ja' ? 'ボスキーで瞬時に仕事用時計画面にカモフラージュ（ESCで復归）' : 'Instant Boss-Key stealth mode (minimal clock, ESC to restore)'}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-mint font-bold">🪟 Mini:</span>
                <span>{lang === 'fr' ? 'Double-clic ou icône pour réduire en widget ultra-compact' : lang === 'zh' ? '点击右上角或双击卡片，缩减为超窄便签' : lang === 'ja' ? 'ダブルクリックで超省スペースなミニ付箋モードに切替' : 'Double-click or icon to collapse into ultra-compact widget'}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amberbadge font-bold">🎁 Rewards:</span>
                <span>{lang === 'fr' ? 'Cliquez sur la récompense pour faire défiler café, ciné, jeux, etc.' : lang === 'zh' ? '轻点实物卡片可循环切换咖啡、电影票、3A游戏、大件心愿单等目标' : lang === 'ja' ? 'カードをタップしてコーヒー、映画、ゲーム、目標を切替' : 'Tap rewards to cycle coffees, movies, games, wishlist'}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-cyanaccent font-bold">💾 Offline:</span>
                <span>{lang === 'fr' ? 'Toutes vos données et cotisations restent 100% locales' : lang === 'zh' ? '所有薪资、国家福利与工作日配置全自动离线保存在本地浏览器中' : lang === 'ja' ? '設定や福利厚生データはブラウザ内に安全に完全ローカル保存' : 'All salary and benefits data stays 100% offline in browser'}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-lavender font-bold">📲 PWA:</span>
                <span>{lang === 'fr' ? 'Installez en PWA via la barre du navigateur pour une app bureau' : lang === 'zh' ? '支持 PWA，可在浏览器地址栏或分享菜单点击“添加到主屏幕/安装应用”' : lang === 'ja' ? 'ブラウザのインストールボタンからデスクトップアプリとして使えます' : 'Install via browser address bar as a desktop app'}</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Mini Mode Footer Hint */}
      {isMini && (
        <div className="text-center text-[10px] text-grayteal/60 font-mono flex items-center justify-center gap-2">
          <span>{lang === 'fr' ? 'Double-cliquez pour agrandir' : lang === 'zh' ? '双击卡片展开完整面板' : 'Double click to expand'}</span>
          <span>·</span>
          <span>ESC</span>
        </div>
      )}
    </div>
  );
};
