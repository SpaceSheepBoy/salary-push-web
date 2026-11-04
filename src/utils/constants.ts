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
    name: '星巴克大杯拿铁',
    icon: '☕️',
    unit: '杯',
    prices: { CNY: 32, EUR: 4.8, USD: 5.45, GBP: 3.95, JPY: 540 },
  },
  {
    id: 'boba',
    name: '喜茶/霸王茶姬',
    icon: '🧋',
    unit: '杯',
    prices: { CNY: 18, EUR: 6.8, USD: 6.5, GBP: 5.2, JPY: 680 },
  },
  {
    id: 'meal',
    name: '打工午市套餐',
    icon: '🍱',
    unit: '顿',
    prices: { CNY: 35, EUR: 14.5, USD: 15.0, GBP: 11.5, JPY: 1100 },
  },

  // 2. 休闲与犒赏 (Entertainment & Fun)
  {
    id: 'movie',
    name: '电影院正价票',
    icon: '🎬',
    unit: '张',
    prices: { CNY: 50, EUR: 13.5, USD: 15.5, GBP: 12.5, JPY: 2000 },
  },
  {
    id: 'fuel',
    name: '10升汽车汽油',
    icon: '⛽️',
    unit: '桶',
    prices: { CNY: 80, EUR: 18.5, USD: 9.5, GBP: 14.5, JPY: 1750 },
  },
  {
    id: 'pet_food',
    name: '进口优质猫/狗粮',
    icon: '🐱',
    unit: '包',
    prices: { CNY: 180, EUR: 26.0, USD: 28.0, GBP: 22.0, JPY: 4200 },
  },
  {
    id: 'steam_game',
    name: 'Steam 3A游戏大作',
    icon: '🎮',
    unit: '部',
    prices: { CNY: 298, EUR: 69.99, USD: 69.99, GBP: 59.99, JPY: 8800 },
  },
  {
    id: 'massage',
    name: '周末全身SPA按摩',
    icon: '💆',
    unit: '次',
    prices: { CNY: 198, EUR: 65.0, USD: 75.0, GBP: 55.0, JPY: 7500 },
  },

  // 3. 梦想与大件大目标 (Big milestones with progress %)
  {
    id: 'airpods',
    name: 'AirPods Pro 2',
    icon: '🎧',
    unit: '部',
    prices: { CNY: 1899, EUR: 279, USD: 249, GBP: 229, JPY: 39800 },
    isGoal: true,
  },
  {
    id: 'ps5',
    name: 'PS5 游戏机 (光驱版)',
    icon: '🕹️',
    unit: '台',
    prices: { CNY: 3599, EUR: 549, USD: 499, GBP: 479, JPY: 79980 },
    isGoal: true,
  },
  {
    id: 'iphone',
    name: 'iPhone 16 Pro',
    icon: '📱',
    unit: '台',
    prices: { CNY: 7999, EUR: 1229, USD: 999, GBP: 999, JPY: 159800 },
    isGoal: true,
  },
  {
    id: 'flight',
    name: '海岛往返度假机票',
    icon: '🏖',
    unit: '趟',
    prices: { CNY: 2600, EUR: 450, USD: 500, GBP: 380, JPY: 68000 },
    isGoal: true,
  },
  {
    id: 'custom_wishlist',
    name: '我的私人心愿单',
    icon: '✨',
    unit: '个',
    prices: { CNY: 3599, EUR: 549, USD: 499, GBP: 479, JPY: 79980 },
    isGoal: true,
  },
];

export const MOTIVATIONAL_QUOTES: Record<AppLanguage, string[]> = {
  zh: [
    'keep going 💪',
    'money is flowing 💰',
    '钱在路上了 🚀',
    '加油打工人 💼',
    '专注进账 ⚡️',
    '每一秒都在变现 💵',
    '工资正在到账中... 🏦',
    '每一刻付出都算数 ⏰',
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
  de: [
    'Weiter so! 💪',
    'Das Geld fließt 💰',
    'Jede Sekunde zählt ⏱',
    'Schritt für Schritt zur Freiheit 🚀',
    'Bezahlte Kaffeepause ☕️',
    'Bald ist Wochenende 🏖',
    'Das Gehalt wächst kontinuierlich 📈',
  ],
  ja: [
    '一歩ずつ前進 💪',
    'お給料チャージ中 💰',
    '毎秒があなたの価値 ⏱',
    '給料日へカウントダウン 🚀',
    '有給コーヒーブレイク中 ☕️',
    'もうすぐ週末 🏖',
    '今日も一日お疲れ様です ✨',
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
    paidBreakTitle: '工间休息 / 能量补给计时器',
    stealthMode: '老板键 (隐身模式)',
    equivalence: '实物激励',
    paydayCountdown: '距发薪日',
    wishlistGoal: '私人心愿目标',
    paydayEndOfMonth: '每月月底',
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
    wishlistGoal: 'Objectif Personnel',
    paydayEndOfMonth: 'Fin de mois',
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
    wishlistGoal: 'Private Wishlist Goal',
    paydayEndOfMonth: 'End of Month',
  },
  de: {
    appTitle: 'GehaltsRechner',
    todayEarned: 'Heute verdient',
    statusWorking: 'Bei der Arbeit',
    statusOffDuty: 'Feierabend',
    perSecond: 'Pro Sekunde',
    hourlyRate: 'Stundensatz',
    dailyRate: 'Tagessatz',
    nextRest: 'Nächste Pause',
    weekend: 'Wochenende',
    holiday: 'Feiertag',
    workTenure: 'Betriebszugehörigkeit',
    yearsUntilRetirement: 'Bis zur Rente',
    workedToday: 'Gearbeitet',
    remainingToday: 'Bis Feierabend',
    doubleClickHint: 'Lokale Daten · Klicke auf ⚙️ für Einstellungen',
    paidBreakTitle: 'Bezahlte Kaffeepause / WC-Timer',
    stealthMode: 'Boss-Key (Tarnmodus)',
    equivalence: 'Belohnung',
    paydayCountdown: 'Bis zum Zahltag',
    wishlistGoal: 'Persönliches Sparziel',
    paydayEndOfMonth: 'Monatsende',
  },
  ja: {
    appTitle: '給料チャージャー',
    todayEarned: '本日の稼ぎ',
    statusWorking: '勤務中',
    statusOffDuty: '退勤済',
    perSecond: '毎秒の稼ぎ',
    hourlyRate: '時給換算',
    dailyRate: '日給換算',
    nextRest: '次の休日',
    weekend: '週末',
    holiday: '祝日',
    workTenure: '勤続年数',
    yearsUntilRetirement: '定年まで',
    workedToday: '本日の勤務',
    remainingToday: '退勤まで',
    doubleClickHint: '設定はブラウザに保存 · 右上⚙️で設定',
    paidBreakTitle: '有給休憩 / トイレタイマー',
    stealthMode: 'ボスキー (ステルスモード)',
    equivalence: 'ご褒美換算',
    paydayCountdown: '給料日まで',
    wishlistGoal: '個人目標・ウィッシュリスト',
    paydayEndOfMonth: '月末',
  },
};

export const DEFAULT_SETTINGS: SalarySettings = {
  appLanguage: 'zh',
  countrySystem: 'china',

  salaryInputMode: 'monthly',
  salaryAmount: 8000, // 🇨🇳 中国城镇在岗职工真实月薪中位数 ~¥8,000
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

  germanyPensionRate: 9.3,
  germanyIncludeHealth: true,

  ukPensionRate: 5.0,
  ukEmployerMatchRate: 3.0,

  japanSocialInsuranceRate: 15.0,
  japanCommuteAllowance: 10000,

  customBenefitName: '401(k) / 福利',
  customBenefitRate: 10,
  customEmployerMatch: true,

  isMiniMode: false,
  paydayDay: 0, // 0 = 月底最后一天 (默认)
  soundEnabled: false,
  activeEquivalenceId: 'latte',
  customWishlistName: 'PS5 游戏机 (光驱版)',
  customWishlistPrice: 3599,
};

export function getCountryDefaults(country: CountrySystem): Partial<SalarySettings> {
  switch (country) {
    case 'china':
      return {
        countrySystem: 'china',
        salaryAmount: 8000, // 真实中位数月薪
        salaryCurrency: 'CNY',
        displayCurrency: 'CNY',
        annualPaidHolidays: 5,
        annualPublicHolidays: 11,
        retirementAge: 60,
        appLanguage: 'zh',
        customWishlistName: 'PS5 游戏机 (光驱版)',
        customWishlistPrice: 3599, // 🇨🇳 国行官方建议零售价
      };
    case 'france':
      return {
        countrySystem: 'france',
        salaryAmount: 2500, // 法国全职中位数月薪 ~2 500 € brut
        salaryCurrency: 'EUR',
        displayCurrency: 'EUR',
        annualPaidHolidays: 25,
        annualPublicHolidays: 11,
        franceRTTDays: 10,
        retirementAge: 64,
        appLanguage: 'fr',
        customWishlistName: 'Console PS5',
        customWishlistPrice: 549, // 🇫🇷 欧洲官方售价 549.99 €
      };
    case 'germany':
      return {
        countrySystem: 'germany',
        salaryAmount: 3500, // 德国中位数月薪 ~3 500 € brut
        salaryCurrency: 'EUR',
        displayCurrency: 'EUR',
        annualPaidHolidays: 28, // 德国常规 28-30 天带薪年假
        annualPublicHolidays: 10,
        germanyPensionRate: 9.3,
        germanyIncludeHealth: true,
        retirementAge: 67,
        appLanguage: 'de',
        customWishlistName: 'PS5 Konsole',
        customWishlistPrice: 549, // 🇩🇪 欧洲官方售价 549.99 €
      };
    case 'uk':
      return {
        countrySystem: 'uk',
        salaryAmount: 2900, // 英国中位数月薪 ~£2,900
        salaryCurrency: 'GBP',
        displayCurrency: 'GBP',
        annualPaidHolidays: 20, // 法定 28 天（20 天年假 + 8 天 Bank Holidays）
        annualPublicHolidays: 8,
        ukPensionRate: 5.0,
        ukEmployerMatchRate: 3.0,
        retirementAge: 66,
        appLanguage: 'en',
        customWishlistName: 'PS5 Console',
        customWishlistPrice: 479, // 🇬🇧 英国官方售价 £479.99
      };
    case 'japan':
      return {
        countrySystem: 'japan',
        salaryAmount: 350000, // 日本中位数月薪 ~¥350,000
        salaryCurrency: 'JPY',
        displayCurrency: 'JPY',
        annualPaidHolidays: 14, // 法定有給休暇 10-20 天
        annualPublicHolidays: 16, // 国民の祝日 16 天
        japanSocialInsuranceRate: 15.0,
        retirementAge: 65,
        appLanguage: 'ja',
        customWishlistName: 'PS5 本体',
        customWishlistPrice: 79980, // 🇯🇵 日本官方定価 ¥79,980
      };
    case 'us':
      return {
        countrySystem: 'us',
        salaryAmount: 4500, // 美国全职中位数月薪 ~$4,500
        salaryCurrency: 'USD',
        displayCurrency: 'USD',
        annualPaidHolidays: 15,
        annualPublicHolidays: 10,
        retirementAge: 67,
        appLanguage: 'en',
        customWishlistName: 'PS5 Console',
        customWishlistPrice: 499, // 🇺🇸 美国官方建议售价 $499.99
      };
    case 'custom':
      return {
        countrySystem: 'custom',
      };
  }
}
