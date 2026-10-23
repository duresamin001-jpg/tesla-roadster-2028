import React, { useState } from 'react';
import { DollarSign, Landmark, Globe, ExternalLink, Calculator, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

export default function RegionalPricing({ pricingData }) {
  const { t, isRTL, lang } = useLanguage();

  const [hypotheticalBudgetUSD, setHypotheticalBudgetUSD] = useState(200000);
  const [estimatedCustomsRate, setEstimatedCustomsRate] = useState(5);
  const [estimatedShippingUSD, setEstimatedShippingUSD] = useState(3500);

  // Exchange rates from central data
  const exchangeRates = pricingData?.exchangeRates?.rates || {
    USD_AED: 3.6725,
    USD_SAR: 3.75,
    AED_SAR: 1.021
  };

  const usData = pricingData?.us;
  const uaeData = pricingData?.uae;
  const ksaData = pricingData?.saudiArabia;

  // Conversions for user budget
  const budgetAED = Math.round(hypotheticalBudgetUSD * exchangeRates.USD_AED);
  const budgetSAR = Math.round(hypotheticalBudgetUSD * exchangeRates.USD_SAR);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-[#F0F7FF] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#007BFF] text-xs font-semibold mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>{t('pricing.title')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">
          {t('pricing.title')}
        </h2>
        <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
          {t('pricing.subtitle')}
        </p>

        {/* High-visibility official price disclaimer */}
        <div className="mt-4 p-3 bg-white rounded-xl border border-blue-200 text-xs text-[#14213D] flex items-start gap-2 shadow-sm">
          <Info className="w-4 h-4 text-[#007BFF] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Important Regulatory Notice:</strong> {t('pricing.ratesNotice')}
          </span>
        </div>
      </div>

      {/* 3 Regional Cards: USA, UAE, Saudi Arabia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: United States */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇺🇸</span>
                <div>
                  <h3 className="font-extrabold text-base text-[#14213D]">
                    {lang === 'ar' ? usData?.country_ar : usData?.country}
                  </h3>
                  <span className="text-xs font-mono text-[#64748B]">USD ($)</span>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 text-[#007BFF] rounded-full border border-blue-200">
                Primary Market
              </span>
            </div>

            {/* Final Price Status */}
            <div className="mb-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                {t('pricing.finalPrice')}
              </div>
              <div className="text-base font-extrabold text-amber-600">
                {lang === 'ar' ? usData?.finalPurchasePrice?.status_ar : usData?.finalPurchasePrice?.status}
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                {usData?.finalPurchasePrice?.historicalReference}
              </p>
            </div>

            {/* Official Reservation Deposit */}
            <div className="mb-4 p-3.5 bg-[#F0F7FF] rounded-xl border border-blue-100">
              <div className="text-xs font-bold text-[#007BFF] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>{t('pricing.reservationDeposit')}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#14213D]">
                ${usData?.reservationDeposit?.amount?.toLocaleString()} <span className="text-xs font-normal text-slate-500">USD</span>
              </div>
              <p className="text-xs text-[#14213D] mt-1.5 leading-relaxed font-medium">
                {lang === 'ar' ? usData?.reservationDeposit?.details_ar : usData?.reservationDeposit?.details}
              </p>
            </div>

            {/* Estimated Additional Fees */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-[#64748B]">
              <div className="font-bold text-[#14213D]">
                {lang === 'ar' ? usData?.estimatedExtraCosts?.title_ar : usData?.estimatedExtraCosts?.title}
              </div>
              <p>• Estimated State Sales Tax: ~8.0% (variable by state)</p>
              <p>• Tesla Destination & Delivery Fee: ~$1,400</p>
              <p>• DMV Title & Registration: ~$600</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Verified: {usData?.reservationDeposit?.lastVerified}</span>
            <a
              href={usData?.reservationDeposit?.sourceUrl || "https://www.tesla.com/roadster"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007BFF] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Official Tesla US Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 2: United Arab Emirates */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇦🇪</span>
                <div>
                  <h3 className="font-extrabold text-base text-[#14213D]">
                    {lang === 'ar' ? uaeData?.country_ar : uaeData?.country}
                  </h3>
                  <span className="text-xs font-mono text-[#64748B]">AED (د.إ)</span>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 text-[#007BFF] rounded-full border border-blue-200">
                Official GCC Portal
              </span>
            </div>

            {/* Final Price Status */}
            <div className="mb-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                {t('pricing.finalPrice')}
              </div>
              <div className="text-base font-extrabold text-amber-600">
                {lang === 'ar' ? uaeData?.finalPurchasePrice?.status_ar : uaeData?.finalPurchasePrice?.status}
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                {uaeData?.finalPurchasePrice?.historicalReference}
              </p>
            </div>

            {/* Official Reservation Deposit */}
            <div className="mb-4 p-3.5 bg-[#F0F7FF] rounded-xl border border-blue-100">
              <div className="text-xs font-bold text-[#007BFF] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>{t('pricing.reservationDeposit')}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#14213D]">
                AED {uaeData?.reservationDeposit?.amount?.toLocaleString()} <span className="text-xs font-normal text-slate-500">(د.إ)</span>
              </div>
              <p className="text-xs text-[#14213D] mt-1.5 leading-relaxed font-medium">
                {lang === 'ar' ? uaeData?.reservationDeposit?.details_ar : uaeData?.reservationDeposit?.details}
              </p>
            </div>

            {/* Estimated Additional Fees */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-[#64748B]">
              <div className="font-bold text-[#14213D]">
                {lang === 'ar' ? uaeData?.estimatedExtraCosts?.title_ar : uaeData?.estimatedExtraCosts?.title}
              </div>
              <p>• UAE Standard VAT: 5% of vehicle value</p>
              <p>• Customs Duty (GCC Tariff): 5% CIF value</p>
              <p>• Ocean Freight & Handling: ~AED 12,000</p>
              <p>• RTA Registration & Passing: ~AED 1,500</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Verified: {uaeData?.reservationDeposit?.lastVerified}</span>
            <a
              href={uaeData?.reservationDeposit?.sourceUrl || "https://www.tesla.com/en_ae/roadster"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007BFF] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Official Tesla UAE Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 3: Saudi Arabia */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇸🇦</span>
                <div>
                  <h3 className="font-extrabold text-base text-[#14213D]">
                    {lang === 'ar' ? ksaData?.country_ar : ksaData?.country}
                  </h3>
                  <span className="text-xs font-mono text-[#64748B]">SAR (ر.س)</span>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 text-[#007BFF] rounded-full border border-blue-200">
                Official GCC Portal
              </span>
            </div>

            {/* Final Price Status */}
            <div className="mb-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                {t('pricing.finalPrice')}
              </div>
              <div className="text-base font-extrabold text-amber-600">
                {lang === 'ar' ? ksaData?.finalPurchasePrice?.status_ar : ksaData?.finalPurchasePrice?.status}
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                {ksaData?.finalPurchasePrice?.historicalReference}
              </p>
            </div>

            {/* Official Reservation Deposit */}
            <div className="mb-4 p-3.5 bg-[#F0F7FF] rounded-xl border border-blue-100">
              <div className="text-xs font-bold text-[#007BFF] uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>{t('pricing.reservationDeposit')}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-[#14213D]">
                SAR {ksaData?.reservationDeposit?.amount?.toLocaleString()} <span className="text-xs font-normal text-slate-500">(ر.س)</span>
              </div>
              <p className="text-xs text-[#14213D] mt-1.5 leading-relaxed font-medium">
                {lang === 'ar' ? ksaData?.reservationDeposit?.details_ar : ksaData?.reservationDeposit?.details}
              </p>
            </div>

            {/* Estimated Additional Fees */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-[#64748B]">
              <div className="font-bold text-[#14213D]">
                {lang === 'ar' ? ksaData?.estimatedExtraCosts?.title_ar : ksaData?.estimatedExtraCosts?.title}
              </div>
              <p>• Saudi VAT (ZATCA): 15%</p>
              <p>• Saudi Customs Duty: 5%</p>
              <p>• SASO Standards Clearance & Inspection: ~SAR 3,000</p>
              <p>• Traffic Dept Registration: ~SAR 2,000</p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">Verified: {ksaData?.reservationDeposit?.lastVerified}</span>
            <a
              href={ksaData?.reservationDeposit?.sourceUrl || "https://www.tesla.com/en_sa/roadster"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007BFF] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Official Tesla KSA Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Hypothetical Budget & Currency Converter */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#14213D] mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[#007BFF]" />
          <span>{t('pricing.converterTitle')}</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                {t('pricing.enterBudget')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="5000"
                  min="50000"
                  max="1000000"
                  value={hypotheticalBudgetUSD}
                  onChange={(e) => setHypotheticalBudgetUSD(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl font-mono font-bold text-[#14213D] focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                />
              </div>
              <p className="text-[11px] text-[#64748B] mt-1">
                Editable assumption: Enter any anticipated MSRP to convert automatically to regional currencies.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F0F7FF] rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-[#64748B] block mb-1">
                {t('pricing.convertedAed')}
              </span>
              <div className="text-2xl font-black text-[#007BFF]">
                AED {budgetAED.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Official Peg: 1 USD = 3.6725 AED
              </span>
            </div>

            <div className="p-4 bg-[#F0F7FF] rounded-xl border border-blue-100">
              <span className="text-xs font-bold text-[#64748B] block mb-1">
                {t('pricing.convertedSar')}
              </span>
              <div className="text-2xl font-black text-[#007BFF]">
                SAR {budgetSAR.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Official Peg: 1 USD = 3.7500 SAR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
