import React from 'react';
import { Sliders, ShieldCheck, AlertCircle, FileText, ExternalLink, HelpCircle } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

export default function Specifications({ specsData }) {
  const { t, isRTL, lang } = useLanguage();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-[#F0F7FF] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#007BFF] text-xs font-semibold mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>{t('specs.title')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">
          {t('specs.title')}
        </h2>
        <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
          {t('specs.subtitle')}
        </p>

        {/* Legend strip */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-blue-200 text-xs">
          <span className="font-bold text-[#14213D]">Status Classification:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Official Published Spec
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#007BFF] font-semibold flex items-center gap-1">
            <FileText className="w-3 h-3" /> Tesla Statement / Claim
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Media Reported
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Unconfirmed / Estimate
          </span>
        </div>
      </div>

      {/* Specifications Categories */}
      <div className="space-y-6">
        {specsData && specsData.map((category, catIdx) => {
          const categoryTitle = lang === 'ar' ? (category.category_ar || category.category) : category.category;

          return (
            <div key={catIdx} className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#14213D] mb-4 pb-2 border-b border-slate-100">
                {categoryTitle}
              </h3>

              <div className="divide-y divide-slate-100">
                {category.items.map((item, itemIdx) => {
                  const specName = lang === 'ar' ? (item.spec_ar || item.spec) : item.spec;

                  return (
                    <div 
                      key={itemIdx} 
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 px-2 rounded-lg transition"
                    >
                      <div className="sm:w-1/3">
                        <span className="text-sm font-semibold text-[#14213D]">
                          {specName}
                        </span>
                      </div>

                      <div className="sm:w-1/3">
                        <span className="text-sm font-extrabold text-[#007BFF]">
                          {item.value}
                        </span>
                      </div>

                      <div className="sm:w-1/3 flex items-center justify-start sm:justify-end gap-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          item.status === 'official'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.status === 'claimed'
                            ? 'bg-blue-50 text-[#007BFF] border border-blue-200'
                            : item.status === 'reported'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-[#64748B] truncate max-w-[140px]" title={item.source}>
                          {item.source}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mandatory Non-Affiliation Disclaimer */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-[#64748B] text-center">
        {t('specs.disclaimer')}
      </div>
    </div>
  );
}
