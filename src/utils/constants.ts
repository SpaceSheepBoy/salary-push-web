import { AppLanguage, CountrySystem, EquivalenceItem, SalarySettings } from '../types';

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

// Decimal and Grouping Separator: Dot for RMB/USD, Comma for EUR
export function formatCurrencyValue(value: number, currency: string, decimals: number = 2): string {
  const isEuropean = ['EUR', 'CHF', 'SEK', 'NOK', 'DKK'].includes(currency.toUpperCase());

  const fixed = value.toFixed(decimals);
  const parts = fixed.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  if (isEuropean) {
    const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decimals > 0 ? `${grouped},${decimalPart}` : grouped;
  } else {
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

// Rich Motivational Real-World Rewards Catalog
export const EQUIVALENCE_CATALOG: EquivalenceItem[] = [
  // 1. 日常小确幸 (Daily treats)
  {
    id: 'latte',
    name: '星巴克拿铁',
    icon: '☕️',
    unit: '杯',
    prices: { CNY: 32, EUR: 4.5, USD: 5.5 },
  },
  {
    id: 'boba',
    name: '喜茶/霸王茶姬',
    icon: '🧋',
    unit: '杯',
    prices: { CNY: 18, EUR: 6.5, USD: 6.0 },
  },
  {
    id: 'meal',
    name: '豪华打工午餐',
    icon: '🍱',
    unit: '顿',
    prices: { CNY: 38, EUR: 13.0, USD: 15.0 },
  },

  // 2. 休闲与犒赏 (Entertainment & Fun)
  {
    id: 'movie',
    name: 'IMAX 电影票',
    icon: '🎬',
    unit: '张',
    prices: { CNY: 55, EUR: 14.0, USD: 16.0 },
  },
  {
    id: 'fuel',
    name: '10升汽车汽油',
    icon: '⛽️',
    unit: '桶',
    prices: { CNY: 82, EUR: 18.5, USD: 11.0 },
  },
  {
    id: 'pet_food',
    name: '进口优质猫/狗粮',
    icon: '🐱',
    unit: '包',
    prices: { CNY: 160, EUR: 28.0, USD: 30.0 },
  },
  {
    id: 'steam_game',
    name: 'Steam 3A游戏大作',
    icon: '🎮',
    unit: '部',
    prices: { CNY: 268, EUR: 59.99, USD: 59.99 },
  },
  {
    id: 'massage',
    name: '周末泰式全身SPA',
    icon: '💆',
    unit: '次',
    prices: { CNY: 198, EUR: 65.0, USD: 75.0 },
  },

  // 3. 梦想与大件大目标 (Big milestones with progress %)
  {
    id: 'airpods',
    name: 'AirPods Pro 耳机',
    icon: '🎧',
    unit: '部',
    prices: { CNY: 1899, EUR: 279, USD: 249 },
    isGoal: true,
  },
  {
    id: 'flight',
    name: '海岛往返度假机票',
    icon: '🏖',
    unit: '趟',
    prices: { CNY: 2500, EUR: 450, USD: 500 },
    isGoal: true,
  },
  {
    id: 'iphone',
    name: 'iPhone 16 Pro 手机',
    icon: '📱',
    unit: '台',
    prices: { CNY: 7999, EUR: 1229, USD: 999 },
    isGoal: true,
  },
  {
    id: 'luxury_bag',
    name: '心动大牌轻奢包包',
    icon: '🎒',
    unit: '只',
    prices: { CNY: 6000, EUR: 950, USD: 1000 },
    isGoal: true,
  },
  {
    id: 'custom_wishlist',
    name: '我的私人心愿单',
    icon: '✨',
    unit: '个',
    prices: { CNY: 2000, EUR: 300, USD: 300 },
    isGoal: true,
  },
];

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
    equivalence: '实物激励',
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
    equivalence: 'Récompense',
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
    equivalence: 'Rewards',
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
  lunchBreakMinutes: 60,
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

  isMiniMode: false,
  paydayDay: 10,
  soundEnabled: false,
  activeEquivalenceId: 'latte',
  customWishlistName: 'PS5 Pro 游戏机',
  customWishlistPrice: 4299,
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
