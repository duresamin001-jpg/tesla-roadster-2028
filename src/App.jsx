import React, { useState, useEffect } from 'react';
import { 
  Home, Box, Palette, BatteryCharging, DollarSign, Sliders, HelpCircle, 
  Languages, Sparkles, ShieldAlert, Rocket, Download, X, Smartphone, Monitor
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
import LaunchSplash from './components/LaunchSplash';
import { resolveAsset } from './utils/assetHelper';

export default function App() {
  const { t, lang, toggleLanguage, isRTL } = useLanguage();

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('roadster_active_tab') || 'home';
  });

  const [showLaunchSplash, setShowLaunchSplash] = useState(() => {
    return !sessionStorage.getItem('roadster_launched');
  });

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(true);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) {
      setIsInstallable(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

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
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-slate-200/80 transform group-hover:scale-105 transition shrink-0 bg-slate-900">
              <img src={resolveAsset('/apple-touch-icon.png')} alt="Roadster Icon" className="w-full h-full object-cover" />
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

          {/* Moving Action with Sound Button, Language Toggle & Install Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLaunchSplash(true)}
              className="px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[#00E5FF] border border-[#007BFF]/40 rounded-xl text-xs font-black flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              title="Play Moving Launch Action with Sound"
            >
              <Rocket className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'انطلاق وحركة' : 'Launch Action'}</span>
            </button>

            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 bg-[#007BFF] hover:bg-blue-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm"
                title="Install App on Device"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{lang === 'ar' ? 'تثبيت' : 'Install'}</span>
              </button>
            )}

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

      {/* Install Guide Modal for Mobile & Laptop */}
      {showInstallGuide && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowInstallGuide(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-[#14213D] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img src="/apple-touch-icon.png" alt="App Icon" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    {lang === 'ar' ? 'تثبيت تطبيق تيسلا رودستر' : 'Install Tesla Roadster App'}
                  </h3>
                  <span className="text-xs text-[#007BFF] font-semibold">
                    {lang === 'ar' ? 'على هاتفك أو حاسوبك المحمول' : 'On Your Laptop or Any Mobile'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowInstallGuide(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 bg-[#F0F7FF] rounded-xl border border-blue-100 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#007BFF] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#14213D] mb-0.5">
                    {lang === 'ar' ? 'على هواتف آيفون (Safari):' : 'On iPhone / iPad (Safari):'}
                  </strong>
                  <span>
                    {lang === 'ar' 
                      ? 'اضغط على زر المشاركة (Share ⎋) أسفل المتصفح، ثم اختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).' 
                      : 'Tap the Share button (⎋) at the bottom, then choose "Add to Home Screen".'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F0F7FF] rounded-xl border border-blue-100 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#14213D] mb-0.5">
                    {lang === 'ar' ? 'على هواتف أندرويد (Chrome):' : 'On Android Phones (Chrome):'}
                  </strong>
                  <span>
                    {lang === 'ar' 
                      ? 'اضغط على القائمة ذات النقاط الثلاث (⋮) أعلى اليمين، ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية".' 
                      : 'Tap the three-dots menu (⋮) in the top-right corner, then tap "Install App" or "Add to Home Screen".'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 flex items-start gap-3">
                <Monitor className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#14213D] mb-0.5">
                    {lang === 'ar' ? 'على الحاسوب المحمول (Chrome أو Edge):' : 'On Laptop / PC (Chrome or Edge):'}
                  </strong>
                  <span>
                    {lang === 'ar' 
                      ? 'اضغط على أيقونة التثبيت (⊕) داخل شريط العنوان أعلى المتصفح لتشغيله كتطبيق ويندوز مستقل.' 
                      : 'Click the Install icon (⊕) inside your browser address bar (top right) to run it as a desktop app.'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow transition"
            >
              {lang === 'ar' ? 'فهمت ذلك' : 'Got It'}
            </button>
          </div>
        </div>
      )}

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

      {/* Moving Action with Sound Launch Splash */}
      {showLaunchSplash && (
        <LaunchSplash 
          onComplete={() => {
            setShowLaunchSplash(false);
            sessionStorage.setItem('roadster_launched', 'true');
          }}
        />
      )}
    </div>
  );
}
