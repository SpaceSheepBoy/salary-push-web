export type CountrySystem = 'china' | 'france' | 'us' | 'custom';
export type AppLanguage = 'zh' | 'fr' | 'en';
export type SalaryInputMode = 'monthly' | 'annual';
export type FranceStatus = 'cadre' | 'non_cadre' | 'fonctionnaire';
export type FranceDisplayFocus = 'cotisations' | 'net' | 'avantages';

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

  // Custom Specifics
  customBenefitName: string;
  customBenefitRate: number;
  customEmployerMatch: boolean;

  // Extra Fun Features
  paydayDay: number; // 1-31, day of month when salary is paid
  soundEnabled: boolean;
  activeEquivalence: 'latte' | 'meal' | 'gas' | 'movie';
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
