export type CountrySystem = 'china' | 'france' | 'germany' | 'uk' | 'japan' | 'us' | 'custom';
export type AppLanguage = 'zh' | 'fr' | 'en' | 'de' | 'ja';
export type SalaryInputMode = 'monthly' | 'annual';
export type FranceStatus = 'cadre' | 'non_cadre' | 'fonctionnaire';
export type FranceDisplayFocus = 'cotisations' | 'net' | 'avantages';

export interface EquivalenceItem {
  id: string;
  name: string;
  icon: string;
  unit: string;
  localizedNames?: Partial<Record<AppLanguage, string>>;
  localizedUnits?: Partial<Record<AppLanguage, string>>;
  // Prices in CNY, EUR, USD, GBP, JPY
  prices: {
    CNY: number;
    EUR: number;
    USD: number;
    GBP?: number;
    JPY?: number;
  };
  isGoal?: boolean; // If true, displays progress bar (e.g. AirPods, iPhone)
}

export interface SalarySettings {
  // Locale & Country
  appLanguage: AppLanguage;
  countrySystem: CountrySystem;

  // Salary
  salaryInputMode: SalaryInputMode;
  salaryAmount: number;
  salaryCurrency: string;
  displayCurrency: string;

  // Work Schedule
  workStartHour: number;
  workStartMinute: number;
  workEndHour: number;
  workEndMinute: number;
  lunchBreakMinutes: number; // e.g. 60 mins lunch
  workDays: number[]; // 1=Sun, 2=Mon, ..., 7=Sat

  // Holidays & Tenure
  annualPaidHolidays: number;
  annualPublicHolidays: number;
  workStartDate: string; // YYYY-MM-DD
  birthday: string; // YYYY-MM-DD
  retirementAge: number;

  // China Specifics
  chinaHousingFundEnabled: boolean;
  chinaHousingFundRate: number;
  chinaIncludeSocialSecurity: boolean;

  // France Specifics
  franceStatus: FranceStatus;
  franceDisplayFocus: FranceDisplayFocus;
  franceDailyTicketRestaurant: number;
  franceMonthlyTransport: number;
  franceRTTDays: number;

  // Germany Specifics
  germanyPensionRate: number;
  germanyIncludeHealth: boolean;

  // UK Specifics
  ukPensionRate: number;
  ukEmployerMatchRate: number;

  // Japan Specifics
  japanSocialInsuranceRate: number;
  japanCommuteAllowance: number;

  // Custom Specifics
  customBenefitName: string;
  customBenefitRate: number;
  customEmployerMatch: boolean;

  // Extra Features
  isMiniMode: boolean;
  paydayDay: number; // 1-31, day of month
  soundEnabled: boolean;
  activeEquivalenceId: string;
  customWishlistName: string;
  customWishlistPrice: number;
  customWishlistCurrency?: string;
}

export interface BenefitSummary {
  title: string;
  todayAccumulated: number;
  monthlyAmount: number;
  formulaText: string;
}

export interface DayStripItem {
  id: number;
  dayNumber: string;
  isToday: boolean;
  isWorkDay: boolean;
  isPastOrToday: boolean;
}

export interface NextRestInfo {
  badgeName: string;
  countdownSeconds: number;
  startDateFormatted: string;
  dayStrips: DayStripItem[];
}
