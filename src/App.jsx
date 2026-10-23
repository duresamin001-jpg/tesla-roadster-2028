import React, { useState, useEffect } from 'react';
import { 
  Home, Box, Palette, BatteryCharging, DollarSign, Sliders, HelpCircle, 
  Languages, Sparkles, ShieldAlert, Rocket 
} from 'lucide-react';
import roadsterData from './data/roadsterData.json';
import { useLanguage } from './utils/LanguageContext';
import HomeScreen from './components/HomeScreen';
import ThreeViewer from './components/ThreeViewer';
import PaintStudio from './components/PaintStudio';
import BatteryCalculator from './components/BatteryCalculator';
import RegionalPricing from './components/RegionalPricing';
import Specifications from './components/Specifications';
import FaqSection from './components/FaqSection';

export default function App() {
  const { t, lang, toggleLanguage, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('roadster_active_tab') || 'home';
  });

  const [selectedColor, setSelectedColor] = useState(
    roadsterData?.viewer?.colourPresets?.[1] || { 
      id: "gloss_red", 
      name: "Gloss Red", 
      name_ar: "أحمر لامع", 
      hex: "#B30006", 
      roughness: 0.15, 
      metalness: 0.45, 
      clearcoat: 1.0 
    }
  );

  useEffect(() => {
    localStorage.setItem('roadster_active_tab', activeTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const navItems = [
    { id: 'home', labelKey: 'nav.home', icon: Home },
    { id: 'viewer', labelKey: 'nav.viewer', icon: Box },
    { id: 'paint', labelKey: 'nav.paint', icon: Palette },
    { id: 'battery', labelKey: 'nav.battery', icon: BatteryCharging },
    { id: 'pricing', labelKey: 'nav.pricing', icon: DollarSign },
    { id: 'specs', labelKey: 'nav.specs', icon: Sliders },
    { id: 'faq', labelKey: 'nav.faq', icon: HelpCircle }
  ];

  return (
    <div className={`min-h-screen bg-white text-[#14213D] flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & App Identity */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#007BFF] to-[#00BFFF] text-white flex items-center justify-center shadow-md transform group-hover:scale-105 transition">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-[#14213D] leading-tight">
                {t('appName')}
              </h1>
              <p className="text-[11px] font-semibold text-[#007BFF] tracking-wider uppercase">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Top Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-[#E5E7EB]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-[#007BFF] text-white shadow-sm' 
                      : 'text-[#64748B] hover:text-[#14213D] hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t(item.labelKey)}</span>
                </button>
              );
            })}
          </nav>

          {/* Language Toggle & Status Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 bg-[#F0F7FF] hover:bg-blue-100 text-[#007BFF] border border-blue-200 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-xs"
              title="Toggle Language"
            >
              <Languages className="w-4 h-4" />
              <span>{t('common.switchLang')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 lg:mb-6">
        {activeTab === 'home' && (
          <HomeScreen
            roadsterData={roadsterData}
            onNavigate={setActiveTab}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
        )}

        {activeTab === 'viewer' && (
          <div className="space-y-6">
            <div className="bg-[#F0F7FF] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#007BFF] text-xs font-semibold mb-2">
                <Box className="w-3.5 h-3.5" />
                <span>3D Geometry Viewport</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">
                {t('viewer.title')}
              </h2>
              <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
                {t('viewer.subtitle')}
              </p>
            </div>
            <ThreeViewer
              viewerData={roadsterData?.viewer}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />
          </div>
        )}

        {activeTab === 'paint' && (
          <PaintStudio
            viewerData={roadsterData?.viewer}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
        )}

        {activeTab === 'battery' && (
          <BatteryCalculator batteryData={roadsterData?.battery} />
        )}

        {activeTab === 'pricing' && (
          <RegionalPricing pricingData={roadsterData?.regionalPricing} />
        )}

        {activeTab === 'specs' && (
          <Specifications specsData={roadsterData?.specifications} />
        )}

        {activeTab === 'faq' && (
          <FaqSection faqData={roadsterData?.faq} />
        )}
      </main>

      {/* 
        Mobile Bottom Navigation Bar (Mobile-first app experience)
      */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E5E7EB] px-2 py-1.5 shadow-lg flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isActive ? 'text-[#007BFF] font-bold scale-105' : 'text-[#64748B] font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      {/* 
        EXACT FOOTER DISCLAIMER REQUIRED BY PROMPT (SECTION 17):
        “Concept details may change. This is a fan-made informational app, not official Tesla.”
      */}
      <footer className="w-full bg-[#F8FAFC] border-t border-[#E5E7EB] py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="text-sm font-semibold text-[#14213D]">
            “{t('footer.exactDisclaimer')}”
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748B]">
            <span>Version: 1.0.0 (Production Release)</span>
            <span>•</span>
            <a 
              href="https://www.tesla.com/roadster" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#007BFF] hover:underline"
            >
              Official Tesla US Portal
            </a>
            <span>•</span>
            <a 
              href="https://www.tesla.com/en_ae/roadster" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#007BFF] hover:underline"
            >
              Official Tesla UAE Portal
            </a>
            <span>•</span>
            <a 
              href="https://www.tesla.com/en_sa/roadster" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#007BFF] hover:underline"
            >
              Official Tesla Saudi Arabia Portal
            </a>
          </div>
          <p className="text-[11px] text-[#64748B]">
            3D Roadster model under CC-BY-4.0 by Michael. All trademarks and company names belong to their respective owners.
          </p>
        </div>
      </footer>
    </div>
  );
}
