import { AppLanguage, CountrySystem, SalarySettings } from '../types';

export interface CurrencyInfo {
  id: string;
  symbol: string;
  name: string;
  localName: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { id: 'CNY', symbol: '¥', name: 'Chinese Yuan', localName: '人民币' },
  { id: 'EUR', symbol: '€', name: 'Euro', localName: '欧元' },
  { id: 'USD', symbol: '$', name: 'US Dollar', localName: '美元' },
  { id: 'GBP', symbol: '£', name: 'British Pound', localName: '英镑' },
  { id: 'JPY', symbol: '¥', name: 'Japanese Yen', localName: '日元' },
  { id: 'CHF', symbol: 'Fr', name: 'Swiss Franc', localName: '瑞士法郎' },
  { id: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', localName: '港币' },
  { id: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar', localName: '新台币' },
  { id: 'SGD', symbol: 'S$', name: 'Singapore Dollar', localName: '新加坡元' },
  { id: 'CAD', symbol: 'C$', name: 'Canadian Dollar', localName: '加元' },
  { id: 'AUD', symbol: 'A$', name: 'Australian Dollar', localName: '澳元' },
  { id: 'KRW', symbol: '₩', name: 'South Korean Won', localName: '韩元' },
];

export function getCurrencySymbol(code: string): string {
  const c = SUPPORTED_CURRENCIES.find((item) => item.id === code);
  return c ? c.symbol : code;
}

// Currency Formatter adhering to dot for RMB/USD and comma for EUR
export function formatCurrencyValue(value: number, currency: string, decimals: number = 2): string {
  const isEuropean = ['EUR', 'CHF', 'SEK', 'NOK', 'DKK'].includes(currency.toUpperCase());

  const fixed = value.toFixed(decimals);
  const parts = fixed.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  if (isEuropean) {
    // 2 593,91
    const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decimals > 0 ? `${grouped},${decimalPart}` : grouped;
  } else {
    // 2,593.91
    const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimals > 0 ? `${grouped}.${decimalPart}` : grouped;
  }
}

export function formatFullCurrency(value: number, currency: string, decimals: number = 2): string {
  const symbol = getCurrencySymbol(currency);
  const formatted = formatCurrencyValue(value, currency, decimals);
  const isEuropean = ['EUR', 'CHF'].includes(currency.toUpperCase());
  return isEuropean ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

export const MOTIVATIONAL_QUOTES: Record<AppLanguage, string[]> = {
  zh: [
    'keep going 💪',
    'money is flowing 💰',
    '钱在路上了 🚀',
    '加油打工人 💼',
    '摸鱼也在赚 🐟',
    '每一秒都在变现 💵',
    '工资正在到账中... 🏦',
    '老板的每一秒都属于你 ⏰',
    '又赚了一点点 🤑',
    '今天也要元气满满 ☀️',
  ],
  fr: [
    'keep going 💪',
    "L'argent rentre 💰",
    'Chaque seconde compte ⏱',
    'Patience, ça monte 🚀',
    'En pause café payée ☕️',
    'Bientôt le week-end 🏖',
    'Objectif liberté financière 📈',
  ],
  en: [
    'keep going 💪',
    'money is flowing 💰',
    "you're doing great! ✨",
    'every second counts ⏱',
    'earning while breathing 🌬',
    'getting closer to freedom 📈',
    'paycheck loading... 🏦',
  ],
};

export const L10N = {
  zh: {
    appTitle: '上班加油器',
    todayEarned: '今日已赚',
    statusWorking: '在岗',
    statusOffDuty: '休息',
    perSecond: '每秒进账',
    hourlyRate: '时薪',
    dailyRate: '日薪',
    nextRest: '下一个休息',
    weekend: '周末',
    holiday: '假期',
    workTenure: '工作年限',
    yearsUntilRetirement: '距退休',
    workedToday: '已工作',
    remainingToday: '距下班',
    doubleClickHint: '数据保存在本地 · 点击右上角进入设置',
    paidBreakTitle: '带薪摸鱼 / 如厕计时器',
    stealthMode: '老板键 (隐身模式)',
    equivalence: '等价实物',
    paydayCountdown: '距发薪日',
  },
  fr: {
    appTitle: 'Booster Salaire',
    todayEarned: 'Gains du jour',
    statusWorking: 'En poste',
    statusOffDuty: 'Repos',
    perSecond: 'Par seconde',
    hourlyRate: 'Taux horaire',
    dailyRate: 'Par jour',
    nextRest: 'Prochain repos',
    weekend: 'Week-end',
    holiday: 'Férié',
    workTenure: 'Ancienneté',
    yearsUntilRetirement: 'Avant retraite',
    workedToday: 'Travaillé',
    remainingToday: 'Fin de journée',
    doubleClickHint: 'Données locales · Cliquez sur ⚙️ pour régler',
    paidBreakTitle: 'Chrono Pause Café / Toilettes Payée',
    stealthMode: 'Mode Discret (Boss Key)',
    equivalence: 'Équivalence',
    paydayCountdown: 'Avant la paie',
  },
  en: {
    appTitle: 'Work Fuel',
    todayEarned: 'Earned Today',
    statusWorking: 'Working',
    statusOffDuty: 'Off Duty',
    perSecond: 'Per second',
    hourlyRate: 'Hourly',
    dailyRate: 'Daily',
    nextRest: 'Next rest',
    weekend: 'Weekend',
    holiday: 'Holiday',
    workTenure: 'Work tenure',
    yearsUntilRetirement: 'To retirement',
    workedToday: 'Worked',
    remainingToday: 'Until off',
    doubleClickHint: 'Local data · Click ⚙️ for settings',
    paidBreakTitle: 'Paid Coffee / Bathroom Break Timer',
    stealthMode: 'Stealth Boss Key',
    equivalence: 'Equivalence',
    paydayCountdown: 'Until Payday',
  },
};

export const DEFAULT_SETTINGS: SalarySettings = {
  appLanguage: 'zh',
  countrySystem: 'china',

  salaryInputMode: 'monthly',
  salaryAmount: 10000,
  salaryCurrency: 'CNY',
  displayCurrency: 'CNY',

  workStartHour: 9,
  workStartMinute: 0,
  workEndHour: 18,
  workEndMinute: 0,
  workDays: [2, 3, 4, 5, 6], // Mon-Fri

  annualPaidHolidays: 5,
  annualPublicHolidays: 11,
  workStartDate: '2019-07-01',
  birthday: '1995-05-15',
  retirementAge: 60,

  chinaHousingFundEnabled: true,
  chinaHousingFundRate: 12,
  chinaIncludeSocialSecurity: false,

  franceStatus: 'cadre',
  franceDisplayFocus: 'cotisations',
  franceDailyTicketRestaurant: 6.0,
  franceMonthlyTransport: 43.2,
  franceRTTDays: 10,

  customBenefitName: '401(k) / 福利',
  customBenefitRate: 10,
  customEmployerMatch: true,

  paydayDay: 10,
  soundEnabled: false,
  activeEquivalence: 'latte',
};

export function getCountryDefaults(country: CountrySystem): Partial<SalarySettings> {
  switch (country) {
    case 'china':
      return {
        countrySystem: 'china',
        salaryCurrency: 'CNY',
        displayCurrency: 'CNY',
        annualPaidHolidays: 5,
        annualPublicHolidays: 11,
        retirementAge: 60,
        appLanguage: 'zh',
      };
    case 'france':
      return {
        countrySystem: 'france',
        salaryCurrency: 'EUR',
        displayCurrency: 'EUR',
        annualPaidHolidays: 25,
        annualPublicHolidays: 11,
        franceRTTDays: 10,
        retirementAge: 64,
        appLanguage: 'fr',
      };
    case 'us':
      return {
        countrySystem: 'us',
        salaryCurrency: 'USD',
        displayCurrency: 'USD',
        annualPaidHolidays: 15,
        annualPublicHolidays: 10,
        retirementAge: 67,
        appLanguage: 'en',
      };
    case 'custom':
      return {
        countrySystem: 'custom',
      };
  }
}
