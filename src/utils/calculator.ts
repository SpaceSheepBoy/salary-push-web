import { AppLanguage, BenefitSummary, NextRestInfo, SalarySettings } from '../types';
import { EQUIVALENCE_CATALOG, formatCurrencyValue, getCurrencySymbol } from './constants';

export class EarningsCalculator {
  settings: SalarySettings;
  exchangeRate: number; // from salaryCurrency to displayCurrency

  constructor(settings: SalarySettings, exchangeRate: number = 1.0) {
    this.settings = settings;
    this.exchangeRate = exchangeRate;
  }

  get annualSalary(): number {
    return this.settings.salaryInputMode === 'monthly'
      ? this.settings.salaryAmount * 12
      : this.settings.salaryAmount;
  }

  get monthlySalary(): number {
    return this.settings.salaryInputMode === 'monthly'
      ? this.settings.salaryAmount
      : this.settings.salaryAmount / 12;
  }

  get workHoursPerDay(): number {
    const startMin = this.settings.workStartHour * 60 + this.settings.workStartMinute;
    const endMin = this.settings.workEndHour * 60 + this.settings.workEndMinute;
    return Math.max(0, (endMin - startMin) / 60);
  }

  /**
   * Precise working days calculation:
   * 365 days / 7 = 52.142857 weeks.
   * Total potential working days = 52.142857 * workDaysPerWeek (e.g. 260.71 for 5-day week).
   * Minus statutory public holidays (e.g. 11 days).
   * Minus annual paid leave (e.g. 5-25 days).
   * Minus French RTT days (if applicable).
   * Result = actual working days the user sits at work.
   */
  get workingDaysPerYear(): number {
    const weeksPerYear = 365.25 / 7.0; // 52.1785
    const workDaysPerWeek = this.settings.workDays.length;
    const totalPotentialDays = weeksPerYear * workDaysPerWeek;

    let totalHolidays = Number(this.settings.annualPaidHolidays) + Number(this.settings.annualPublicHolidays);
    if (this.settings.countrySystem === 'france') {
      totalHolidays += Number(this.settings.franceRTTDays);
    }
    return Math.max(1, totalPotentialDays - totalHolidays);
  }

  get workingHoursPerYear(): number {
    return this.workingDaysPerYear * this.workHoursPerDay;
  }

  get dailyEarnings(): number {
    return (this.annualSalary / this.workingDaysPerYear) * this.exchangeRate;
  }

  get dailyEarningsSalaryCurrency(): number {
    return this.workingDaysPerYear > 0 ? this.annualSalary / this.workingDaysPerYear : 0;
  }

  get hourlyEarnings(): number {
    return this.workHoursPerDay > 0 ? this.dailyEarnings / this.workHoursPerDay : 0;
  }

  get hourlyEarningsSalaryCurrency(): number {
    return this.workHoursPerDay > 0 ? this.dailyEarningsSalaryCurrency / this.workHoursPerDay : 0;
  }

  get perSecondEarnings(): number {
    return this.hourlyEarnings / 3600;
  }

  isCurrentlyWorking(now: Date = new Date()): boolean {
    const dayOfWeek = now.getDay() + 1; // 1=Sun, 2=Mon...
    if (!this.settings.workDays.includes(dayOfWeek)) return false;

    const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const startMinutes = this.settings.workStartHour * 60 + this.settings.workStartMinute;
    const endMinutes = this.settings.workEndHour * 60 + this.settings.workEndMinute;

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }

  secondsWorkedToday(now: Date = new Date()): number {
    const dayOfWeek = now.getDay() + 1;
    if (!this.settings.workDays.includes(dayOfWeek)) return 0;

    const start = new Date(now);
    start.setHours(this.settings.workStartHour, this.settings.workStartMinute, 0, 0);

    const end = new Date(now);
    end.setHours(this.settings.workEndHour, this.settings.workEndMinute, 0, 0);

    if (now.getTime() < start.getTime()) return 0;
    const effectiveEnd = Math.min(now.getTime(), end.getTime());
    return Math.max(0, (effectiveEnd - start.getTime()) / 1000);
  }

  secondsUntilEndOfWork(now: Date = new Date()): number {
    const end = new Date(now);
    end.setHours(this.settings.workEndHour, this.settings.workEndMinute, 0, 0);
    return Math.max(0, (end.getTime() - now.getTime()) / 1000);
  }

  todayEarnings(now: Date = new Date()): number {
    return this.secondsWorkedToday(now) * this.perSecondEarnings;
  }

  dayProgress(now: Date = new Date()): number {
    const totalSeconds = this.workHoursPerDay * 3600;
    if (totalSeconds <= 0) return 0;
    return Math.min(1.0, this.secondsWorkedToday(now) / totalSeconds);
  }

  benefitSummary(now: Date = new Date()): BenefitSummary {
    const sym = getCurrencySymbol(this.settings.displayCurrency);
    const curr = this.settings.displayCurrency;
    const secondsWorked = this.secondsWorkedToday(now);
    const lang = this.settings.appLanguage;

    if (this.settings.countrySystem === 'china') {
      const rate = this.settings.chinaHousingFundRate / 100;
      const extra = this.settings.chinaIncludeSocialSecurity ? 0.1 : 0.0;
      const totalMonthly = this.monthlySalary * (rate * 2.0 + extra);
      const perSec = (totalMonthly * 12 / this.workingDaysPerYear / this.workHoursPerDay / 3600) * this.exchangeRate;
      const accumulated = secondsWorked * perSec;
      const monthlyDisp = totalMonthly * this.exchangeRate;
      const title = this.settings.chinaIncludeSocialSecurity
        ? (lang === 'zh' ? '公积金+社保' : 'Housing+Social')
        : (lang === 'zh' ? '公积金' : 'Housing Fund');
      const fmtMonthly = formatCurrencyValue(monthlyDisp, curr, 0);
      const formula = lang === 'zh'
        ? `月入 ${sym}${fmtMonthly} · ${this.settings.chinaHousingFundRate}%×2`
        : `Monthly ${sym}${fmtMonthly} · ${this.settings.chinaHousingFundRate}%×2`;

      return {
        title,
        todayAccumulated: accumulated,
        monthlyAmount: monthlyDisp,
        formulaText: formula,
      };
    } else if (this.settings.countrySystem === 'france') {
      const cotisationRate = this.settings.franceStatus === 'cadre' ? 0.25 : (this.settings.franceStatus === 'non_cadre' ? 0.22 : 0.15);

      if (this.settings.franceDisplayFocus === 'cotisations') {
        const monthly = this.monthlySalary * cotisationRate;
        const perSec = (monthly * 12 / this.workingDaysPerYear / this.workHoursPerDay / 3600) * this.exchangeRate;
        const accumulated = secondsWorked * perSec;
        const monthlyDisp = monthly * this.exchangeRate;
        const statusLabel = this.settings.franceStatus === 'cadre' ? 'Cadre' : (this.settings.franceStatus === 'non_cadre' ? 'Non-cadre' : 'Fonctionnaire');
        const fmtMonthly = formatCurrencyValue(monthlyDisp, curr, 0);
        const formula = `${fmtMonthly} ${sym}/mois · ${statusLabel} (-${Math.round(cotisationRate * 100)}%)`;

        return {
          title: lang === 'zh' ? '社保 Cotisations' : 'Cotisations',
          todayAccumulated: accumulated,
          monthlyAmount: monthlyDisp,
          formulaText: formula,
        };
      } else if (this.settings.franceDisplayFocus === 'net') {
        const netMonthly = this.monthlySalary * (1.0 - cotisationRate);
        const perSec = (netMonthly * 12 / this.workingDaysPerYear / this.workHoursPerDay / 3600) * this.exchangeRate;
        const accumulated = secondsWorked * perSec;
        const netDisp = netMonthly * this.exchangeRate;
        const brutDisp = this.monthlySalary * this.exchangeRate;
        const brutFmt = formatCurrencyValue(brutDisp, curr, 0);
        const netFmt = formatCurrencyValue(netDisp, curr, 0);

        return {
          title: lang === 'zh' ? '净到手 Net' : 'Net à payer',
          todayAccumulated: accumulated,
          monthlyAmount: netDisp,
          formulaText: `Brut ${brutFmt} ${sym} → Net ${netFmt} ${sym}`,
        };
      } else {
        const daysPerMonth = this.workingDaysPerYear / 12;
        const monthlyTickets = this.settings.franceDailyTicketRestaurant * daysPerMonth;
        const monthlyTotal = monthlyTickets + this.settings.franceMonthlyTransport;
        const perSec = (monthlyTotal * 12 / this.workingDaysPerYear / this.workHoursPerDay / 3600) * this.exchangeRate;
        const accumulated = secondsWorked * perSec;
        const totalDisp = monthlyTotal * this.exchangeRate;
        const ticketFmt = formatCurrencyValue(this.settings.franceDailyTicketRestaurant * this.exchangeRate, curr, 1);

        return {
          title: lang === 'zh' ? '饭补福利' : 'Tickets Resto',
          todayAccumulated: accumulated,
          monthlyAmount: totalDisp,
          formulaText: `Tickets: ${ticketFmt} ${sym}/j + Navigo 50%`,
        };
      }
    } else if (this.settings.countrySystem === 'germany') {
      const pensionRate = (this.settings.germanyPensionRate || 9.3) / 100;
      const totalPensionMonthly = this.monthlySalary * pensionRate * 2.0; // 9.3% AN + 9.3% AG
      const perSec = (totalPensionMonthly * 12 / this.workingDaysPerYear / this.workHoursPerDay / 3600) * this.exchangeRate;
      const accumulated = secondsWorked * perSec;
      const monthlyDisp = totalPensionMonthly * this.exchangeRate;
      const fmtMonthly = formatCurrencyValue(monthlyDisp, curr, 0);

      return {
        title: lang === 'zh' ? '德国法定养老' : (lang === 'de' ? 'Rentenbeitrag' : 'German Pension'),
        todayAccumulated: accumulated,
        monthlyAmount: monthlyDisp,
        formulaText: `${fmtMonthly} ${sym}/M · 9.3% AN + 9.3% AG`,
      };
    } else if (this.settings.countrySystem === 'uk') {
      const empRate = (this.settings.ukPensionRate || 5.0) / 100;
      const matchRate = (this.settings.ukEmployerMatchRate || 3.0) / 100;
      const totalPensionMonthly = this.monthlySalary * (empRate + matchRate);
      const perSec = (totalPensionMonthly * 12 / this.workingDaysPerYear / this.workHoursPerDay / 3600) * this.exchangeRate;
      const accumulated = secondsWorked * perSec;
      const monthlyDisp = totalPensionMonthly * this.exchangeRate;
      const fmtMonthly = formatCurrencyValue(monthlyDisp, curr, 0);

      return {
        title: lang === 'zh' ? '职业年金 Pension' : 'Workplace Pension',
        todayAccumulated: accumulated,
        monthlyAmount: monthlyDisp,
        formulaText: `${sym}${fmtMonthly}/mo · 5% + 3% Match`,
      };
    } else if (this.settings.countrySystem === 'japan') {
      const rate = (this.settings.japanSocialInsuranceRate || 15.0) / 100;
      const totalMonthly = this.monthlySalary * rate * 2.0; // 厚生年金+健康保険 劳资对半
      const perSec = (totalMonthly * 12 / this.workingDaysPerYear / this.workHoursPerDay / 3600) * this.exchangeRate;
      const accumulated = secondsWorked * perSec;
      const monthlyDisp = totalMonthly * this.exchangeRate;
      const fmtMonthly = formatCurrencyValue(monthlyDisp, curr, 0);

      return {
        title: lang === 'zh' ? '日本社会保険' : (lang === 'ja' ? '社会保険(年金+健康)' : 'Social Insurance'),
        todayAccumulated: accumulated,
        monthlyAmount: monthlyDisp,
        formulaText: `${sym}${fmtMonthly}/月 · 厚生年金+健康 折算`,
      };
    } else {
      const rate = this.settings.customBenefitRate / 100;
      const mult = this.settings.customEmployerMatch ? 2.0 : 1.0;
      const totalMonthly = this.monthlySalary * rate * mult;
      const perSec = (totalMonthly * 12 / this.workingDaysPerYear / this.workHoursPerDay / 3600) * this.exchangeRate;
      const accumulated = secondsWorked * perSec;
      const monthlyDisp = totalMonthly * this.exchangeRate;
      const matchText = this.settings.customEmployerMatch ? '×2' : '';
      const fmtMonthly = formatCurrencyValue(monthlyDisp, curr, 0);

      return {
        title: this.settings.customBenefitName || '401(k) / Benefits',
        todayAccumulated: accumulated,
        monthlyAmount: monthlyDisp,
        formulaText: `${sym}${fmtMonthly}/mo · ${this.settings.customBenefitRate}%${matchText}`,
      };
    }
  }

  workTenure(now: Date = new Date()): { years: number; months: number } {
    const start = new Date(this.settings.workStartDate);
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years: Math.max(0, years), months: Math.max(0, months) };
  }

  yearsUntilRetirement(now: Date = new Date()): number {
    const birth = new Date(this.settings.birthday);
    const retireYear = birth.getFullYear() + this.settings.retirementAge;
    const retireDate = new Date(birth);
    retireDate.setFullYear(retireYear);
    const diff = retireDate.getTime() - now.getTime();
    return Math.max(0, Math.round(diff / (365.25 * 24 * 3600 * 1000)));
  }

  nextRestInfo(now: Date = new Date()): NextRestInfo {
    const lang = this.settings.appLanguage;
    const strips = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay() + 1;
      const isWork = this.settings.workDays.includes(dayOfWeek);
      strips.push({
        id: i,
        dayNumber: String(d.getDate()),
        isToday: i === 0,
        isWorkDay: isWork,
        isPastOrToday: i === 0,
      });
    }

    let foundOffset = 1;
    let restLength = 1;

    for (let dayOffset = 0; dayOffset <= 14; dayOffset++) {
      const d = new Date(now);
      d.setDate(d.getDate() + dayOffset);
      const dayOfWeek = d.getDay() + 1;

      if (!this.settings.workDays.includes(dayOfWeek)) {
        foundOffset = dayOffset;
        for (let nextOffset = dayOffset + 1; nextOffset <= dayOffset + 14; nextOffset++) {
          const nd = new Date(now);
          nd.setDate(nd.getDate() + nextOffset);
          const nw = nd.getDay() + 1;
          if (!this.settings.workDays.includes(nw)) {
            restLength++;
          } else {
            break;
          }
        }
        break;
      }
    }

    const restStartDate = new Date(now);
    restStartDate.setDate(restStartDate.getDate() + foundOffset);
    const restDayOfWeek = restStartDate.getDay() + 1;
    const isWeekend = restDayOfWeek === 1 || restDayOfWeek === 7;
    const badgeName = isWeekend
      ? (lang === 'zh' ? '周末' : (lang === 'fr' ? 'Week-end' : 'Weekend'))
      : (lang === 'zh' ? '假期' : (lang === 'fr' ? 'Férié' : 'Holiday'));

    const month = restStartDate.getMonth() + 1;
    const day = restStartDate.getDate();
    let startDateFormatted = '';
    if (lang === 'zh') {
      startDateFormatted = `${month}/${day} 起 · 共 ${restLength} 天`;
    } else if (lang === 'fr') {
      startDateFormatted = `Dès le ${day}/${month} · ${restLength} jours`;
    } else {
      startDateFormatted = `From ${month}/${day} · ${restLength} days`;
    }

    let targetDate = new Date(restStartDate);
    if (foundOffset === 0) {
      targetDate = now;
    } else {
      targetDate.setDate(targetDate.getDate() - 1);
      targetDate.setHours(this.settings.workEndHour, this.settings.workEndMinute, 0, 0);
      if (targetDate.getTime() < now.getTime()) {
        targetDate = new Date(restStartDate);
        targetDate.setHours(0, 0, 0, 0);
      }
    }

    const countdownSeconds = Math.max(0, (targetDate.getTime() - now.getTime()) / 1000);

    return {
      badgeName,
      countdownSeconds,
      startDateFormatted,
      dayStrips: strips,
    };
  }

  paydayCountdown(now: Date = new Date()): { days: number; hours: number; isEndOfMonth: boolean; displayLabel: string } {
    const rawDay = this.settings.paydayDay;
    const isEndOfMonth = rawDay === 0 || !rawDay || rawDay > 30;

    let target: Date;
    if (isEndOfMonth) {
      // Last day of current month (e.g. Feb 28, Apr 30, May 31)
      const lastDayCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      if (now.getTime() >= lastDayCurrent.getTime() - 86400000) {
        // Today is the last day or past it, target last day of next month
        target = new Date(now.getFullYear(), now.getMonth() + 2, 0, 0, 0, 0);
      } else {
        target = new Date(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, 0);
      }
    } else {
      target = new Date(now.getFullYear(), now.getMonth(), rawDay, 0, 0, 0);
      if (now.getDate() >= rawDay) {
        target.setMonth(target.getMonth() + 1);
      }
    }

    const diffSec = Math.max(0, (target.getTime() - now.getTime()) / 1000);
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);

    return {
      days,
      hours,
      isEndOfMonth,
      displayLabel: isEndOfMonth ? '月底' : `${rawDay}号`,
    };
  }

  // Dedicated Private Custom Wishlist progress
  customWishlistGoal(earnedToday: number): {
    name: string;
    price: number;
    formattedPrice: string;
    todayEarned: number;
    progressPercent: number;
  } {
    const name = this.settings.customWishlistName || '我的私人心愿';
    const price = Math.max(1, this.settings.customWishlistPrice || 2000);
    const progressPercent = Math.min(100, (earnedToday / price) * 100);
    const formattedPrice = formatCurrencyValue(price, this.settings.displayCurrency, 2);

    return {
      name,
      price,
      formattedPrice,
      todayEarned: earnedToday,
      progressPercent,
    };
  }

  // Enhanced Reward / Equivalence System
  salaryEquivalence(earnedToday: number): {
    item: typeof EQUIVALENCE_CATALOG[0];
    count: number;
    unitPrice: number;
    isGoal: boolean;
    progressPercent: number;
    formattedPrice: string;
  } {
    const curr = this.settings.displayCurrency.toUpperCase();
    const activeId = this.settings.activeEquivalenceId || 'latte';
    let item = EQUIVALENCE_CATALOG.find((i) => i.id === activeId) || EQUIVALENCE_CATALOG[0];

    let unitPrice = 32;
    if (item.id === 'custom_wishlist') {
      unitPrice = this.settings.customWishlistPrice || 2000;
      item = {
        ...item,
        name: this.settings.customWishlistName || '我的心愿单',
      };
    } else {
      if (curr === 'EUR') {
        unitPrice = item.prices.EUR;
      } else if (curr === 'USD') {
        unitPrice = item.prices.USD;
      } else {
        // Base CNY price, scaled if different currency
        unitPrice = item.prices.CNY;
      }
    }

    const count = unitPrice > 0 ? earnedToday / unitPrice : 0;
    const isGoal = Boolean(item.isGoal);
    const progressPercent = Math.min(100, count * 100);
    const formattedPrice = formatCurrencyValue(unitPrice, this.settings.displayCurrency, item.prices.EUR % 1 !== 0 ? 2 : 0);

    return {
      item,
      count,
      unitPrice,
      isGoal,
      progressPercent,
      formattedPrice,
    };
  }
}

export function formatTimeInterval(seconds: number): string {
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatDaysAndTime(seconds: number, lang: AppLanguage): { days: number; time: string; daySuffix: string } {
  const total = Math.max(0, Math.floor(seconds));
  const days = Math.floor(total / 86400);
  const remaining = total % 86400;
  const time = formatTimeInterval(remaining);
  let daySuffix = 'd ';
  if (lang === 'zh') daySuffix = '天';
  else if (lang === 'ja') daySuffix = '日';
  else if (lang === 'fr') daySuffix = 'j ';
  else if (lang === 'de') daySuffix = 'T ';
  return { days, time, daySuffix };
}
