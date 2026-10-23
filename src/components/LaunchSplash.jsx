import React, { useState, useEffect } from 'react';
import { Rocket, Volume2, VolumeX, Sparkles, Zap, Gauge, Play } from 'lucide-react';
import { audioService } from '../utils/audioSynth';
import { resolveAsset } from '../utils/assetHelper';
import { useLanguage } from '../utils/LanguageContext';

export default function LaunchSplash({ onComplete, isReplay = false }) {
  const { isRTL, lang } = useLanguage();
  const [stage, setStage] = useState('ready'); // 'ready', 'launching', 'completed'
  const [speed, setSpeed] = useState(0);
  const [thrusterPercent, setThrusterPercent] = useState(0);

  const startLaunch = (withSound = true) => {
    setStage('launching');

    if (withSound) {
      audioService.playLaunchIntroSound();
    }

    // Dynamic speed and thruster gauge animation
    const startTime = Date.now();
    const duration = 2800; // ms

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Non-linear acceleration curve: 0 to 258 mph
      const currentSpeed = Math.floor(Math.pow(progress, 1.8) * 258);
      const currentThrust = Math.floor(Math.min(100, progress * 130));

      setSpeed(currentSpeed);
      setThrusterPercent(currentThrust);

      if (progress >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          setStage('completed');
          if (onComplete) onComplete();
        }, 400);
      }
    }, 40);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617] text-white overflow-hidden select-none">
      {/* Background Cyber Grid & Speed Lines */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:28px_28px] animate-pulse" />
      </div>

      {stage === 'launching' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Hyperspace Speed Lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[200vw] h-[200vh] bg-[radial-gradient(circle_at_center,transparent_20%,#00E5FF_90%)] opacity-30 animate-ping" />
          </div>
          {/* Animated Light Streaks */}
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 bg-gradient-to-r from-transparent via-[#00E5FF] to-white rounded-full opacity-70 animate-pulse"
              style={{
                top: `${10 + i * 6}%`,
                left: `${(i * 19) % 80}%`,
                width: `${120 + (i * 35)}px`,
                transform: `rotate(${i % 2 === 0 ? '-3deg' : '3deg'})`,
                animationDuration: `${0.3 + (i % 3) * 0.2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 max-w-lg w-full mx-4 flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-slate-700/60 shadow-[0_0_60px_rgba(0,123,255,0.25)]">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-[#007BFF]/40 text-[#00E5FF] text-xs font-bold tracking-widest uppercase mb-6 shadow-inner">
          <Zap className="w-3.5 h-3.5 animate-bounce" />
          <span>{stage === 'ready' ? 'Tesla Roadster 2028 Experience' : 'SpaceX Thruster Launch Sequence'}</span>
        </div>

        {/* Dynamic Moving Action Vehicle Stage */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-6 flex items-center justify-center">
          
          {/* Ambient Thruster Glow Arc */}
          <div 
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#007BFF] via-[#00E5FF] to-blue-500 blur-2xl transition-all duration-700 ${
              stage === 'launching' ? 'opacity-90 scale-125 animate-pulse' : 'opacity-40 scale-95'
            }`} 
          />

          {/* Underbody Hover Pulse Ring */}
          <div 
            className={`absolute -bottom-4 w-40 h-8 rounded-full bg-[#00E5FF]/40 blur-md transition-all duration-300 ${
              stage === 'launching' ? 'scale-150 opacity-100' : 'scale-90 opacity-40'
            }`}
          />

          {/* Tesla Car Icon with Moving Action Dynamics */}
          <div 
            className={`relative w-40 h-40 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 transition-all duration-700 ease-out flex items-center justify-center bg-slate-950 ${
              stage === 'launching' 
                ? 'scale-110 -translate-y-4 shadow-[0_0_50px_#00E5FF] rotate-1' 
                : 'hover:scale-105'
            }`}
          >
            <img 
              src={resolveAsset('/assets/app-icon-1024.png')} 
              alt="Tesla Roadster" 
              className={`w-full h-full object-cover transition-all duration-500 ${
                stage === 'launching' ? 'filter brightness-125 contrast-115' : ''
              }`}
            />

            {/* Glowing Laser Headlight Flare Animation */}
            {stage === 'launching' && (
              <>
                <div className="absolute top-1/2 left-4 w-6 h-6 bg-[#00E5FF] rounded-full blur-md animate-ping" />
                <div className="absolute top-1/2 right-4 w-6 h-6 bg-[#00E5FF] rounded-full blur-md animate-ping" />
              </>
            )}

            {/* Jet Exhaust Thruster Flame at Bottom */}
            {stage === 'launching' && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                <div className="w-3 h-8 bg-gradient-to-t from-transparent via-[#00E5FF] to-white rounded-full blur-xs animate-bounce" />
                <div className="w-4 h-12 bg-gradient-to-t from-transparent via-[#FF5900] to-yellow-200 rounded-full blur-xs animate-pulse" />
                <div className="w-3 h-8 bg-gradient-to-t from-transparent via-[#00E5FF] to-white rounded-full blur-xs animate-bounce" />
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          Tesla Roadster 2028
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
          {lang === 'ar' 
            ? 'سيارة المستقبل الطائرة مع حزمة صواريخ سبيس إكس بـ 10 دفعات هواء بارد'
            : 'The Future Flying Car featuring the optional SpaceX Cold-Gas Thruster Package.'
          }
        </p>

        {/* Telemetry HUD during Launch */}
        {stage === 'launching' && (
          <div className="w-full bg-slate-950/90 rounded-2xl p-4 border border-slate-700/80 mb-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-[#00E5FF]" /> Speed (MPH)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-[#00E5FF] tabular-nums mt-0.5">
                  {speed}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Rocket className="w-3.5 h-3.5 text-orange-400" /> Thrusters
                </div>
                <div className="text-3xl sm:text-4xl font-black text-orange-400 tabular-nums mt-0.5">
                  {thrusterPercent}%
                </div>
              </div>
            </div>

            {/* Launch Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#007BFF] via-[#00E5FF] to-orange-400 transition-all duration-75"
                style={{ width: `${(speed / 258) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 font-semibold tracking-wider mt-2 animate-pulse">
              ⚡ 0-60 MPH IN 0.99 SECONDS • LEVITATION ACTIVE
            </p>
          </div>
        )}

        {/* Action Buttons in Ready State */}
        {stage === 'ready' && (
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => startLaunch(true)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#007BFF] via-[#00BFFF] to-[#00E5FF] hover:from-[#0069D9] hover:to-[#00BFFF] text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(0,191,255,0.4)] hover:shadow-[0_0_40px_rgba(0,191,255,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>{lang === 'ar' ? 'تشغيل الحركة والصوت (انطلاق)' : 'START WITH SOUND & MOTION'}</span>
            </button>

            <button
              onClick={() => startLaunch(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold tracking-wider transition border border-slate-700/40 cursor-pointer"
            >
              {lang === 'ar' ? 'الدخول بدون صوت' : 'Enter Silently (No Sound)'}
            </button>
          </div>
        )}

        {/* Launching Status Message */}
        {stage === 'launching' && (
          <div className="text-xs font-bold text-[#00E5FF] tracking-widest uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>{lang === 'ar' ? 'جاري إطلاق سبيس إكس...' : 'ACCELERATING TO HYPERSPEED...'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
