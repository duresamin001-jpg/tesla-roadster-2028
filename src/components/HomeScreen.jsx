import React from 'react';
import { 
  Rocket, Box, BatteryCharging, DollarSign, Sliders, ShieldAlert, 
  ExternalLink, ArrowRight, Zap, CheckCircle2, ChevronRight, AlertTriangle 
} from 'lucide-react';
import FullscreenVideoPlayer from './FullscreenVideoPlayer';
import RealRoadsterPhoto from './RealRoadsterPhoto';
import SoundEffectsPanel from './SoundEffectsPanel';
import FaqSection from './FaqSection';
import { useLanguage } from '../utils/LanguageContext';

export default function HomeScreen({ 
  roadsterData, 
  onNavigate, 
  selectedColor, 
  onSelectColor 
}) {
  const { t, isRTL, lang } = useLanguage();

  const homepageData = roadsterData?.homepage;
  const productionStatus = homepageData?.productionStatus;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      {/* 
        EXACT CONTENT ORDER REQUIREMENT (SECTION 2):
        1. Fullscreen launch or demonstration video
      */}
      <section id="home-video" className="w-full">
        <FullscreenVideoPlayer videoData={homepageData?.video} />
      </section>

      {/* 
        2. Real Tesla Roadster photograph directly beneath the video
      */}
      <section id="home-photo" className="w-full">
        <RealRoadsterPhoto photoData={homepageData?.roadsterPhoto} />
      </section>

      {/* 
        3. Sound-effects controls
      */}
      <section id="home-sounds" className="w-full">
        <SoundEffectsPanel soundData={homepageData?.soundEffects} />
      </section>

      {/* 
        4. Flying/Thruster Demonstration information and disclaimer
      */}
      <section id="home-thruster-info" className="w-full">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-500/30 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00BFFF]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-[#00BFFF] border border-blue-400/30 text-xs font-bold tracking-wide">
                <Rocket className="w-3.5 h-3.5" />
                <span>SpaceX Cold-Gas Thruster Technology</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {t('home.thrusterBannerTitle')}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {t('home.thrusterBannerText')}
              </p>

              {/* Mandatory Prompt Disclaimer */}
              <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-xs text-red-200 font-bold flex items-center gap-2.5 shadow-inner">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>“{t('home.thrusterDisclaimerTag')}”</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('viewer')}
              className="px-6 py-3.5 bg-gradient-to-r from-[#007BFF] to-[#00BFFF] hover:from-blue-600 hover:to-cyan-600 text-white font-extrabold text-sm rounded-xl shadow-lg transform hover:scale-105 transition flex items-center gap-2 shrink-0 border border-white/20"
            >
              <span>{t('home.explore3D')}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* 
        5. Roadster headline and production countdown/status
      */}
      <section id="home-headline-status" className="w-full">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold text-[#007BFF] uppercase tracking-wider block mb-1">
                Engineering Prototype Concept
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#14213D]">
                {t('home.headline')}
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-[#F0F7FF] px-4 py-2 rounded-xl border border-blue-100">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span className="text-xs font-bold text-[#14213D]">{t('home.productionTitle')}</span>
            </div>
          </div>

          {/* Truthful Production Status Message (Prompt Rule: Only show countdown if verified target exists) */}
          <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Verified Manufacturing Schedule Disclosure:
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  {lang === 'ar' ? productionStatus?.statusMessage_ar : productionStatus?.statusMessage}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-700">
                  <span>Source: {productionStatus?.source}</span>
                  <span>•</span>
                  <span>Verified: {productionStatus?.lastVerified}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        6. Navigation buttons to 3D viewer, battery calculator, specifications, and regional prices
      */}
      <section id="home-quick-navigation" className="w-full">
        <h3 className="text-base font-extrabold text-[#14213D] mb-4 flex items-center gap-2">
          <Box className="w-4 h-4 text-[#007BFF]" />
          <span>{t('home.quickNavTitle')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Button 1: 3D Explorer */}
          <button
            onClick={() => onNavigate('viewer')}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left group flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#007BFF] flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#14213D] flex items-center justify-between">
                <span>{t('home.explore3D')}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-[#007BFF] transition ${isRTL ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Explore 3D geometry, interactive wheel rotation, and lighting presets.
              </p>
            </div>
          </button>

          {/* Button 2: Battery Calculator */}
          <button
            onClick={() => onNavigate('battery')}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left group flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#14213D] flex items-center justify-between">
                <span>{t('home.exploreBattery')}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition ${isRTL ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Calculate driving hours and remaining range with unit conversions.
              </p>
            </div>
          </button>

          {/* Button 3: Regional Pricing */}
          <button
            onClick={() => onNavigate('pricing')}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left group flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#14213D] flex items-center justify-between">
                <span>{t('home.explorePricing')}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-purple-600 transition ${isRTL ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                USA, UAE, and Saudi Arabia reservation terms and budget converter.
              </p>
            </div>
          </button>

          {/* Button 4: Full Specifications */}
          <button
            onClick={() => onNavigate('specs')}
            className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-blue-300 hover:shadow-lg transition-all duration-200 text-left group flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#14213D] flex items-center justify-between">
                <span>{t('home.exploreSpecs')}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-amber-600 transition ${isRTL ? 'rotate-180' : ''}`} />
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Separating official published engineering data from concept claims.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 
        7. Remaining home-screen content (Concept Highlights & Innovations)
      */}
      <section id="home-highlights" className="w-full">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-[#14213D] mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#007BFF]" />
            <span>{t('home.highlightsTitle')}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
              <div className="text-xs font-bold text-[#007BFF] uppercase mb-1">Concept Acceleration</div>
              <div className="text-2xl font-black text-[#14213D]">0-60 in 1.9s</div>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Tesla's 2017 target for the base tri-motor layout, with sub-1 second claimed for the experimental rocket package.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
              <div className="text-xs font-bold text-[#007BFF] uppercase mb-1">Target Range</div>
              <div className="text-2xl font-black text-[#14213D]">620 mi / 1,000 km</div>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                Theoretical highway endurance projected from early 200 kWh structural prototype pack statements.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
              <div className="text-xs font-bold text-[#007BFF] uppercase mb-1">Architecture</div>
              <div className="text-2xl font-black text-[#14213D]">Tri-Motor AWD</div>
              <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                One front electric motor and two rear motors providing continuous torque vectoring and glass targa roof stowage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 
        8. FAQ — FINAL MAIN APP SECTION (SECTION 12)
      */}
      <section id="home-faq" className="w-full pt-4">
        <FaqSection faqData={roadsterData?.faq} />
      </section>
    </div>
  );
}
