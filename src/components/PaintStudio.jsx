import React from 'react';
import { Sparkles, Palette, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import ThreeViewer from './ThreeViewer';

export default function PaintStudio({ viewerData, selectedColor, onSelectColor }) {
  const { t, isRTL, lang } = useLanguage();

  const colourPresets = viewerData?.colourPresets || [
    { id: "pearl_white", name: "Pearl White", name_ar: "أبيض لؤلؤي", hex: "#F4F6F9", roughness: 0.18, metalness: 0.3, clearcoat: 1.0 },
    { id: "gloss_red", name: "Gloss Red", name_ar: "أحمر لامع", hex: "#B30006", roughness: 0.15, metalness: 0.45, clearcoat: 1.0 },
    { id: "hot_pink", name: "Hot Pink", name_ar: "وردي ساطع", hex: "#E60067", roughness: 0.16, metalness: 0.4, clearcoat: 0.95 },
    { id: "diamond_pink", name: "Diamond Pink", name_ar: "وردي ماسي متلألئ", hex: "#FF599C", roughness: 0.22, metalness: 0.75, clearcoat: 1.0, sparkle: true },
    { id: "gloss_black", name: "Gloss Black", name_ar: "أسود لامع", hex: "#0D0E11", roughness: 0.2, metalness: 0.6, clearcoat: 0.9 },
    { id: "shiny_black", name: "Shiny Black", name_ar: "أسود براق فاخر", hex: "#050507", roughness: 0.08, metalness: 0.85, clearcoat: 1.0 },
    { id: "metallic_grey", name: "Metallic Grey", name_ar: "رمادي ميتاليك", hex: "#4A525D", roughness: 0.25, metalness: 0.8, clearcoat: 0.9 },
    { id: "silver", name: "Silver", name_ar: "فضي نقي", hex: "#D1D5DB", roughness: 0.2, metalness: 0.9, clearcoat: 0.95 },
    { id: "electric_blue", name: "Electric Blue", name_ar: "أزرق كهربائي", hex: "#007BFF", roughness: 0.15, metalness: 0.7, clearcoat: 1.0 }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Studio Header */}
      <div className="bg-[#F0F7FF] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#007BFF] text-xs font-semibold mb-2">
              <Palette className="w-3.5 h-3.5" />
              <span>{t('paint.title')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">
              {t('paint.title')}
            </h2>
            <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
              {t('paint.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm">
            <span className="text-xs text-[#64748B] font-medium">{t('paint.activeFinish')}</span>
            <div 
              className="w-5 h-5 rounded-full border border-slate-300 shadow-inner flex items-center justify-center"
              style={{ backgroundColor: selectedColor?.hex }}
            >
              {selectedColor?.sparkle && <Sparkles className="w-3 h-3 text-white drop-shadow" />}
            </div>
            <span className="text-xs font-bold text-[#14213D]">
              {lang === 'ar' ? (selectedColor?.name_ar || selectedColor?.name) : selectedColor?.name}
            </span>
          </div>
        </div>

        {/* Mandatory Official Colour Notice Banner */}
        <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed font-medium">
            “{t('paint.disclaimer')}”
          </span>
        </div>
      </div>

      {/* Live 3D Preview with Selected Finish Applied */}
      <div className="w-full">
        <ThreeViewer 
          viewerData={viewerData} 
          selectedColor={selectedColor} 
          onSelectColor={onSelectColor} 
        />
      </div>

      {/* 9 Selectable Paint Finish Cards */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <h4 className="text-base font-bold text-[#14213D] mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#007BFF]" />
          <span>{t('paint.switchColor')} (9 Selectable Finishes)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {colourPresets.map((preset) => {
            const isSelected = selectedColor?.id === preset.id;
            const displayName = lang === 'ar' ? (preset.name_ar || preset.name) : preset.name;

            return (
              <button
                key={preset.id}
                onClick={() => onSelectColor(preset)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'border-[#007BFF] bg-[#F0F7FF] ring-2 ring-[#007BFF]/30 shadow-md transform -translate-y-0.5'
                    : 'border-[#E5E7EB] bg-white hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Swatch Bubble */}
                  <div 
                    className="relative w-10 h-10 rounded-xl shadow-md border border-black/10 flex items-center justify-center shrink-0 transition group-hover:scale-105"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {preset.sparkle && (
                      <Sparkles className="w-4 h-4 text-white animate-sparkle drop-shadow-md" />
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-bold text-[#14213D] flex items-center gap-1.5">
                      <span>{displayName}</span>
                      {preset.sparkle && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 font-semibold">
                          Diamond Flake
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5">
                      <span className="font-mono">{preset.hex}</span>
                      <span>•</span>
                      <span>{preset.clearcoat ? 'Clearcoat Finish' : 'Standard'}</span>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-[#007BFF] text-white flex items-center justify-center shrink-0 shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
