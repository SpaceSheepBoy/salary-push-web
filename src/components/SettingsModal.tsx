import React from 'react';
import { X, Globe, DollarSign, Clock, Calendar, Check, Gift, Calculator } from 'lucide-react';
import { AppLanguage, CountrySystem, FranceDisplayFocus, FranceStatus, SalaryInputMode, SalarySettings } from '../types';
import { EQUIVALENCE_CATALOG, formatCurrencyValue, getCountryDefaults, getCurrencySymbol, SUPPORTED_CURRENCIES } from '../utils/constants';
import { EarningsCalculator } from '../utils/calculator';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SalarySettings;
  onUpdate: (newSettings: SalarySettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdate,
}) => {
  if (!isOpen) return null;

  const handleChange = <K extends keyof SalarySettings>(key: K, value: SalarySettings[K]) => {
    onUpdate({ ...settings, [key]: value });
  };

  const handleCountryChange = (country: CountrySystem) => {
    const defaults = getCountryDefaults(country);
    onUpdate({
      ...settings,
      countrySystem: country,
      ...defaults,
    });
  };

  const workDayOptions = [
    { label: '一', weekday: 2 },
    { label: '二', weekday: 3 },
    { label: '三', weekday: 4 },
    { label: '四', weekday: 5 },
    { label: '五', weekday: 6 },
    { label: '六', weekday: 7 },
    { label: '日', weekday: 1 },
  ];

  const isEuropean = ['EUR', 'CHF'].includes(settings.displayCurrency.toUpperCase());

  // Real-time calculation preview
  const calc = new EarningsCalculator(settings, 1.0);
  const sym = getCurrencySymbol(settings.salaryCurrency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-md my-6 rounded-2xl bg-[#0E2024] border border-[#1F3238] shadow-2xl p-4 sm:p-5 text-white max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F3238]">
          <div>
            <h3 className="text-base font-bold text-white">⚙️ 设置 Settings</h3>
            <p className="text-xs text-grayteal">国家国情、社保公积金、假期与薪酬精准核算</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-grayteal hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Live Calculation Preview Banner */}
          <div className="p-3 rounded-xl bg-[#081518] border border-[#1E3E47] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-mint">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-mint" />
                <span>实时薪酬与工时核算明细 (Calculation Breakdown)</span>
              </div>
              <span className="text-[10px] text-grayteal">关联实际假期</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center py-1 bg-[#0E2024] rounded-lg border border-[#162B30]">
              <div>
                <div className="text-[10px] text-grayteal">全年出勤工作日</div>
                <div className="text-xs font-bold font-mono text-white mt-0.5">
                  {Math.round(calc.workingDaysPerYear)} 天
                </div>
              </div>
              <div>
                <div className="text-[10px] text-grayteal">核算日薪 (Daily)</div>
                <div className="text-xs font-bold font-mono text-coral mt-0.5">
                  {sym}{formatCurrencyValue(calc.dailyEarningsSalaryCurrency, settings.salaryCurrency, 2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-grayteal">核算时薪 (Hourly)</div>
                <div className="text-xs font-bold font-mono text-cyanaccent mt-0.5">
                  {sym}{formatCurrencyValue(calc.hourlyEarningsSalaryCurrency, settings.salaryCurrency, 2)}
                </div>
              </div>
            </div>

            <p className="text-[10px] text-grayteal leading-relaxed">
              💡 公式：年薪 ÷ 全年实际出勤日 ({Math.round(calc.workingDaysPerYear)} 天)。您享受的带薪年假和法定假期越多，实际出勤日的日薪和时薪就越高！修改下方假期，金额实时联动更新。
            </p>
          </div>

          {/* 1. Language & Country */}
          <div className="p-3 rounded-xl bg-[#091417] border border-[#182A2E] space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Globe className="w-3.5 h-3.5 text-mint" />
              <span>语言与国家制度 (Language & Country)</span>
            </div>

            {/* Language */}
            <div>
              <label className="text-[11px] text-grayteal block mb-1">界面语言 (Language)</label>
              <div className="grid grid-cols-5 gap-1 p-1 bg-[#14262A] rounded-lg text-center">
                {(['zh', 'en', 'fr', 'de', 'ja'] as AppLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleChange('appLanguage', lang)}
                    className={`py-1 text-xs font-medium rounded-md transition-all ${
                      settings.appLanguage === lang
                        ? 'bg-coral text-white shadow'
                        : 'text-grayteal hover:text-white'
                    }`}
                  >
                    {lang === 'zh'
                      ? '中文'
                      : lang === 'en'
                      ? 'EN'
                      : lang === 'fr'
                      ? 'FR'
                      : lang === 'de'
                      ? 'DE'
                      : '日本語'}
                  </button>
                ))}
              </div>
            </div>

            {/* Country System */}
            <div>
              <label className="text-[11px] text-grayteal block mb-1">国家/地区社会保障制度 (Country System)</label>
              <select
                value={settings.countrySystem}
                onChange={(e) => handleCountryChange(e.target.value as CountrySystem)}
                className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-coral"
              >
                <option value="china">中国 🇨🇳 (五险一金 · 住房公积金 · 中位数 ¥8,000)</option>
                <option value="france">法国 🇫🇷 (Cotisations · RTT · 饭补 · 中位数 2 500 €)</option>
                <option value="germany">德国 🇩🇪 (Rentenversicherung · 28天假 · 中位数 3 500 €)</option>
                <option value="uk">英国 🇬🇧 (Workplace Pension · 28天假 · 中位数 £2,900)</option>
                <option value="japan">日本 🇯🇵 (社会保険 · 16天祝日 · 中位数 ¥350,000)</option>
                <option value="us">美国 🇺🇸 (401k · PTO · 联邦假 · 中位数 $4,500)</option>
                <option value="custom">其他/自定义 🌐 (Custom)</option>
              </select>
            </div>

            {/* Country Specific Details */}
            {settings.countrySystem === 'china' && (
              <div className="pt-2 border-t border-[#182A2E] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">启用住房公积金计算 (Housing Fund)</span>
                  <input
                    type="checkbox"
                    checked={settings.chinaHousingFundEnabled}
                    onChange={(e) => handleChange('chinaHousingFundEnabled', e.target.checked)}
                    className="accent-coral"
                  />
                </div>

                {settings.chinaHousingFundEnabled && (
                  <div>
                    <div className="flex justify-between text-[11px] text-grayteal mb-1">
                      <span>公积金费率 (个人/企业各一份)</span>
                      <span className="text-white font-mono font-bold">{settings.chinaHousingFundRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="12"
                      step="1"
                      value={settings.chinaHousingFundRate}
                      onChange={(e) => handleChange('chinaHousingFundRate', Number(e.target.value))}
                      className="w-full accent-coral"
                    />
                    <p className="text-[10px] text-grayteal">
                      • 个人 {settings.chinaHousingFundRate}% + 企业 {settings.chinaHousingFundRate}% = {settings.chinaHousingFundRate * 2}% 双倍计入个人公积金账户
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-grayteal">合并统计社保个人账户 (养老8% + 医保2%)</span>
                  <input
                    type="checkbox"
                    checked={settings.chinaIncludeSocialSecurity}
                    onChange={(e) => handleChange('chinaIncludeSocialSecurity', e.target.checked)}
                    className="accent-coral"
                  />
                </div>
              </div>
            )}

            {settings.countrySystem === 'france' && (
              <div className="pt-2 border-t border-[#182A2E] space-y-2">
                <div>
                  <label className="text-[11px] text-grayteal block mb-1">法国员工身份 (Statut)</label>
                  <select
                    value={settings.franceStatus}
                    onChange={(e) => handleChange('franceStatus', e.target.value as FranceStatus)}
                    className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="cadre">Cadre (管理/技术干部 ~25% 社保)</option>
                    <option value="non_cadre">Non-cadre (普通雇员 ~22% 社保)</option>
                    <option value="fonctionnaire">Fonctionnaire (公职人员 ~15% 社保)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-grayteal block mb-1">卡片重点追踪项目 (Affichage)</label>
                  <select
                    value={settings.franceDisplayFocus}
                    onChange={(e) => handleChange('franceDisplayFocus', e.target.value as FranceDisplayFocus)}
                    className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="cotisations">社保缴费累计 (Cotisations Sociales)</option>
                    <option value="net">净薪到手实时 (Net avant impôt)</option>
                    <option value="avantages">餐券+交通福利 (Tickets Resto + Navigo)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] text-grayteal block mb-0.5">餐券补贴 (€/天)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={settings.franceDailyTicketRestaurant}
                      onChange={(e) => handleChange('franceDailyTicketRestaurant', Number(e.target.value))}
                      className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-grayteal block mb-0.5">交通月补 (€/月)</label>
                    <input
                      type="number"
                      step="1"
                      value={settings.franceMonthlyTransport}
                      onChange={(e) => handleChange('franceMonthlyTransport', Number(e.target.value))}
                      className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {settings.countrySystem === 'germany' && (
              <div className="pt-2 border-t border-[#182A2E] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">德国法定养老保险 (Gesetzliche Rentenversicherung)</span>
                  <span className="text-xs font-mono font-bold text-mint">9.3% 个人 + 9.3% 雇主</span>
                </div>
                <p className="text-[10px] text-grayteal">
                  • 德国养老保险缴费比例为 18.6%（个人与雇主各 9.3%）；年假通常为 28~30 天；法定公休假按 10 天核算。
                </p>
              </div>
            )}

            {settings.countrySystem === 'uk' && (
              <div className="pt-2 border-t border-[#182A2E] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">英国职业年金 (Workplace Pension Auto-Enrolment)</span>
                  <span className="text-xs font-mono font-bold text-mint">5% 个人 + 3% 雇主</span>
                </div>
                <p className="text-[10px] text-grayteal">
                  • 英国自动加入职业年金计划（最低个人 5% + 雇主 3% = 8%）；法定标准休假为 28 天（20 天年假 + 8 天 Bank Holidays）。
                </p>
              </div>
            )}

            {settings.countrySystem === 'japan' && (
              <div className="pt-2 border-t border-[#182A2E] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">日本社会保険 (厚生年金+健康保険)</span>
                  <span className="text-xs font-mono font-bold text-mint">~15% 个人 + 15% 会社</span>
                </div>
                <p className="text-[10px] text-grayteal">
                  • 厚生年金（9.15%）与健康保险（约5%）由公司与个人对半承担；拥有 G7 最高的 16 天国民祝日。
                </p>
              </div>
            )}
          </div>

          {/* 2. Leave & Holidays (Auto-filled but fully adjustable) */}
          <div className="p-3 rounded-xl bg-[#091417] border border-[#182A2E] space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Calendar className="w-3.5 h-3.5 text-coral" />
              <span>假期与工龄制度 (Holidays - 自动关联日薪)</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">带薪年假 (天)</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={settings.annualPaidHolidays}
                  onChange={(e) => handleChange('annualPaidHolidays', Number(e.target.value))}
                  className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">法定公休节假日 (天)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={settings.annualPublicHolidays}
                  onChange={(e) => handleChange('annualPublicHolidays', Number(e.target.value))}
                  className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1"
                />
              </div>
            </div>

            {settings.countrySystem === 'france' && (
              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">RTT 调休假天数 (35h 工时制)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={settings.franceRTTDays}
                  onChange={(e) => handleChange('franceRTTDays', Number(e.target.value))}
                  className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">法定退休年龄</label>
                <input
                  type="number"
                  min="50"
                  max="75"
                  value={settings.retirementAge}
                  onChange={(e) => handleChange('retirementAge', Number(e.target.value))}
                  className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1"
                />
              </div>

              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">每月发薪日</label>
                <select
                  value={settings.paydayDay ?? 0}
                  onChange={(e) => handleChange('paydayDay', Number(e.target.value))}
                  className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1"
                >
                  <option value={0}>📅 每月月底 (默认)</option>
                  <option value={1}>每月 1 号</option>
                  <option value={5}>每月 5 号</option>
                  <option value={8}>每月 8 号</option>
                  <option value={10}>每月 10 号</option>
                  <option value={15}>每月 15 号</option>
                  <option value={20}>每月 20 号</option>
                  <option value={25}>每月 25 号</option>
                  <option value={28}>每月 28 号</option>
                  <option value={30}>每月 30 号</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Salary & Currency */}
          <div className="p-3 rounded-xl bg-[#091417] border border-[#182A2E] space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <DollarSign className="w-3.5 h-3.5 text-cyanaccent" />
              <span>薪水与货币 (Salary & Currency)</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#14262A] rounded-lg">
              <button
                onClick={() => handleChange('salaryInputMode', 'monthly')}
                className={`py-1 text-xs font-medium rounded-md transition-all ${
                  settings.salaryInputMode === 'monthly'
                    ? 'bg-coral text-white shadow'
                    : 'text-grayteal hover:text-white'
                }`}
              >
                月薪 Monthly
              </button>
              <button
                onClick={() => handleChange('salaryInputMode', 'annual')}
                className={`py-1 text-xs font-medium rounded-md transition-all ${
                  settings.salaryInputMode === 'annual'
                    ? 'bg-coral text-white shadow'
                    : 'text-grayteal hover:text-white'
                }`}
              >
                年薪 Annual
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] text-grayteal">薪资金额</label>
                <button
                  type="button"
                  onClick={() => {
                    const defs = getCountryDefaults(settings.countrySystem);
                    if (defs.salaryAmount) handleChange('salaryAmount', defs.salaryAmount);
                  }}
                  className="text-[10px] text-coral hover:underline flex items-center gap-1"
                  title="自动重置为该国真实官方中位数月薪/年薪"
                >
                  <span>↺ 填入该国真实中位数</span>
                </button>
              </div>
              <input
                type="number"
                value={settings.salaryAmount}
                onChange={(e) => handleChange('salaryAmount', Number(e.target.value))}
                className="w-full bg-[#14262A] border border-[#1F3238] text-white text-sm font-mono font-bold rounded-lg px-3 py-1.5 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">合同币种</label>
                <select
                  value={settings.salaryCurrency}
                  onChange={(e) => handleChange('salaryCurrency', e.target.value)}
                  className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.symbol} {c.id} - {c.localName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">显示币种</label>
                <select
                  value={settings.displayCurrency}
                  onChange={(e) => handleChange('displayCurrency', e.target.value)}
                  className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.symbol} {c.id} - {c.localName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-[10px] text-cyanaccent">
              {isEuropean
                ? '💡 欧元/欧洲货币以逗号作为小数分隔符 (如 2 593,91 €)'
                : '💡 人民币及美元以小数点作为分隔符 (如 ¥2,593.91)'}
            </p>
          </div>

          {/* 4. Motivational Rewards & Custom Wishlist */}
          <div className="p-3 rounded-xl bg-[#091417] border border-[#182A2E] space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Gift className="w-3.5 h-3.5 text-amberbadge" />
              <span>今日已赚实物与心愿单 (Rewards & Wishlist)</span>
            </div>

            <div>
              <label className="text-[11px] text-grayteal block mb-1">默认展示的实物奖励</label>
              <select
                value={settings.activeEquivalenceId}
                onChange={(e) => handleChange('activeEquivalenceId', e.target.value)}
                className="w-full bg-[#14262A] border border-[#1F3238] text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {EQUIVALENCE_CATALOG.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.icon} {item.name} ({item.unit})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Wishlist item */}
            <div className="p-2.5 rounded-lg bg-[#14262A] border border-[#1E363D] space-y-2">
              <div className="text-[11px] font-semibold text-white flex items-center justify-between">
                <span>✨ 我的私人心愿目标 (定制大件)</span>
                <span className="text-[10px] text-mint">显示进度%</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-grayteal block mb-0.5">心愿名称</label>
                  <input
                    type="text"
                    value={settings.customWishlistName}
                    onChange={(e) => handleChange('customWishlistName', e.target.value)}
                    placeholder="例如 PS5 / 显卡"
                    className="w-full bg-[#0E2024] border border-[#1F3238] text-white text-xs rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-grayteal block mb-0.5">目标金额 ({sym})</label>
                  <input
                    type="number"
                    value={settings.customWishlistPrice}
                    onChange={(e) => handleChange('customWishlistPrice', Number(e.target.value))}
                    className="w-full bg-[#0E2024] border border-[#1F3238] text-white text-xs rounded px-2 py-1 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. Schedule */}
          <div className="p-3 rounded-xl bg-[#091417] border border-[#182A2E] space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Clock className="w-3.5 h-3.5 text-amberbadge" />
              <span>工作时间安排 (Schedule)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">上班时间</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.workStartHour}
                    onChange={(e) => handleChange('workStartHour', Number(e.target.value))}
                    className="w-12 bg-[#14262A] border border-[#1F3238] text-white text-xs rounded px-1.5 py-1 text-center"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="15"
                    value={settings.workStartMinute}
                    onChange={(e) => handleChange('workStartMinute', Number(e.target.value))}
                    className="w-12 bg-[#14262A] border border-[#1F3238] text-white text-xs rounded px-1.5 py-1 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-grayteal block mb-0.5">下班时间</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={settings.workEndHour}
                    onChange={(e) => handleChange('workEndHour', Number(e.target.value))}
                    className="w-12 bg-[#14262A] border border-[#1F3238] text-white text-xs rounded px-1.5 py-1 text-center"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="15"
                    value={settings.workEndMinute}
                    onChange={(e) => handleChange('workEndMinute', Number(e.target.value))}
                    className="w-12 bg-[#14262A] border border-[#1F3238] text-white text-xs rounded px-1.5 py-1 text-center"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-grayteal block mb-1">每周工作日</label>
              <div className="flex gap-1.5">
                {workDayOptions.map((opt) => {
                  const isSelected = settings.workDays.includes(opt.weekday);
                  return (
                    <button
                      key={opt.weekday}
                      onClick={() => {
                        let newDays = [...settings.workDays];
                        if (isSelected) {
                          newDays = newDays.filter((d) => d !== opt.weekday);
                        } else {
                          newDays.push(opt.weekday);
                        }
                        handleChange('workDays', newDays);
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        isSelected ? 'bg-coral text-white shadow' : 'bg-[#14262A] text-grayteal hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-coral hover:bg-coral/90 text-white font-medium text-sm transition-all shadow-lg shadow-coral/20"
          >
            <Check className="w-4 h-4" />
            <span>保存并生效 (Save & Apply)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
