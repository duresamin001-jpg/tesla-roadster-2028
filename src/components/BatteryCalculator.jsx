import React, { useState, useMemo } from 'react';
import { BatteryCharging, Gauge, Clock, ShieldAlert, Sparkles, Thermometer, Zap, Activity, Info, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

export default function BatteryCalculator({ batteryData }) {
  const { t, isRTL, lang } = useLanguage();

  const [unit, setUnit] = useState('km'); // 'km' or 'miles'
  const [fullRange, setFullRange] = useState(1000); // 1000 km or 620 miles
  const [avgSpeed, setAvgSpeed] = useState(100); // 100 km/h or 62 mph
  const [startBattery, setStartBattery] = useState(100);
  const [remainingBattery, setRemainingBattery] = useState(80);

  // Handle unit switch with mathematical conversion
  const handleUnitToggle = (newUnit) => {
    if (newUnit === unit) return;
    if (newUnit === 'miles') {
      setUnit('miles');
      setFullRange(Math.round(fullRange * 0.621371));
      setAvgSpeed(Math.round(avgSpeed * 0.621371));
    } else {
      setUnit('km');
      setFullRange(Math.round(fullRange / 0.621371));
      setAvgSpeed(Math.round(avgSpeed / 0.621371));
    }
  };

  // Safe mathematical calculations
  const calculations = useMemo(() => {
    const validFullRange = Math.max(1, Number(fullRange) || 1);
    const validSpeed = Math.max(1, Number(avgSpeed) || 1);
    const validRemainingPct = Math.max(0, Math.min(100, Number(remainingBattery) || 0));

    // Estimated remaining distance = entered full-charge range × remaining battery percentage ÷ 100
    const remainingDistance = (validFullRange * validRemainingPct) / 100;

    // Estimated driving time = estimated remaining distance ÷ average driving speed
    const totalHours = remainingDistance / validSpeed;
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);

    return {
      remainingDistance: Math.round(remainingDistance),
      hours,
      minutes,
      validSpeed,
      validRemainingPct
    };
  }, [fullRange, avgSpeed, remainingBattery]);

  const officialSpecs = batteryData?.officialSpecifications || {};

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-[#F0F7FF] border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#007BFF] text-xs font-semibold mb-2">
          <BatteryCharging className="w-3.5 h-3.5" />
          <span>{t('battery.title')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14213D]">
          {t('battery.title')}
        </h2>
        <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
          {t('battery.subtitle')}
        </p>

        {/* Disclaimer banner */}
        <div className="mt-4 p-3 bg-white rounded-xl border border-blue-200 text-xs text-[#14213D] flex items-start gap-2 shadow-sm">
          <Info className="w-4 h-4 text-[#007BFF] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            {t('battery.calcDisclaimer')}
          </span>
        </div>
      </div>

      {/* Official Specification Records Grid */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-[#14213D] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#007BFF]" />
            <span>{t('battery.officialSpecsTitle')}</span>
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            Tesla Official Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(officialSpecs).map(([key, item]) => {
            const isAnnounced = item.value !== null && item.status !== 'Not announced';
            const statusLabel = lang === 'ar' ? (item.status_ar || item.status) : item.status;

            return (
              <div 
                key={key} 
                className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] hover:bg-white hover:border-blue-200 transition"
              >
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="mt-2 text-xl font-extrabold text-[#14213D] flex items-center gap-2">
                  {isAnnounced ? (
                    <span className="text-[#007BFF]">{item.value}</span>
                  ) : (
                    <span className="text-amber-600 text-base font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {statusLabel || t('common.statusUnconfirmed')}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                  {item.notes}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Driving-Time & Range Calculator */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#14213D] flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[#007BFF]" />
              <span>{t('battery.calculatorTitle')}</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live mathematical projection based on speed, battery state of charge, and full range rating.
            </p>
          </div>

          {/* Unit Toggle Button (km / miles) */}
          <div className="flex items-center gap-1 bg-[#F0F7FF] p-1 rounded-xl border border-blue-200 self-start sm:self-auto">
            <button
              onClick={() => handleUnitToggle('km')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                unit === 'km' ? 'bg-[#007BFF] text-white shadow-sm' : 'text-[#14213D] hover:bg-white/60'
              }`}
            >
              {t('battery.km')}
            </button>
            <button
              onClick={() => handleUnitToggle('miles')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                unit === 'miles' ? 'bg-[#007BFF] text-white shadow-sm' : 'text-[#14213D] hover:bg-white/60'
              }`}
            >
              {t('battery.miles')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Controls Column */}
          <div className="lg:col-span-6 space-y-5">
            {/* Full Range Parameter */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#14213D] mb-1.5">
                <span>{t('battery.fullRangeInput')}</span>
                <span className="font-mono text-[#007BFF] font-extrabold">{fullRange} {unit}</span>
              </div>
              <input
                type="range"
                min={unit === 'km' ? 300 : 200}
                max={unit === 'km' ? 1200 : 750}
                step={unit === 'km' ? 10 : 5}
                value={fullRange}
                onChange={(e) => setFullRange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#007BFF]"
              />
              <div className="flex justify-between text-[11px] text-[#64748B] mt-1">
                <span>{unit === 'km' ? '300 km' : '200 mi'}</span>
                <span className="text-[#007BFF] font-semibold">{unit === 'km' ? '1,000 km (Concept Claim)' : '620 mi (Concept Claim)'}</span>
                <span>{unit === 'km' ? '1,200 km' : '750 mi'}</span>
              </div>
            </div>

            {/* Average Driving Speed Parameter */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[#14213D] mb-1.5">
                <span>{t('battery.speedInput')}</span>
                <span className="font-mono text-[#007BFF] font-extrabold">{avgSpeed} {unit}/h</span>
              </div>
              <input
                type="range"
                min={unit === 'km' ? 30 : 20}
                max={unit === 'km' ? 200 : 130}
                step={unit === 'km' ? 5 : 5}
                value={avgSpeed}
                onChange={(e) => setAvgSpeed(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#007BFF]"
              />
              <div className="flex justify-between text-[11px] text-[#64748B] mt-1">
                <span>{unit === 'km' ? '30 km/h (City)' : '20 mph (City)'}</span>
                <span>{unit === 'km' ? '100 km/h (Highway)' : '65 mph (Highway)'}</span>
                <span>{unit === 'km' ? '200 km/h (Autobahn)' : '130 mph (Track)'}</span>
              </div>
            </div>

            {/* Starting & Remaining Battery % */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  {t('battery.startBattInput')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={startBattery}
                    onChange={(e) => setStartBattery(Math.max(1, Math.min(100, Number(e.target.value))))}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#64748B]">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#14213D] mb-1.5">
                  {t('battery.remBattInput')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={remainingBattery}
                    onChange={(e) => setRemainingBattery(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-[#64748B]">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Output Cards & Battery Visualizer */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-[#F0F7FF] border border-blue-100 rounded-2xl p-5 shadow-sm">
            <div>
              <span className="text-xs font-bold text-[#007BFF] uppercase tracking-wider block mb-3">
                {t('battery.calculatedResults')}
              </span>

              {/* Graphical Battery State Gauge */}
              <div className="mb-5 bg-white p-4 rounded-xl border border-blue-100 shadow-inner">
                <div className="flex items-center justify-between text-xs font-bold text-[#14213D] mb-2">
                  <span className="flex items-center gap-1.5">
                    <BatteryCharging className="w-4 h-4 text-[#007BFF]" />
                    <span>Battery State of Charge</span>
                  </span>
                  <span className="text-sm font-mono text-[#007BFF]">{calculations.validRemainingPct}%</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      calculations.validRemainingPct > 40
                        ? 'bg-gradient-to-r from-[#007BFF] to-[#00BFFF]'
                        : calculations.validRemainingPct > 15
                        ? 'bg-amber-500'
                        : 'bg-red-500 animate-pulse'
                    }`}
                    style={{ width: `${calculations.validRemainingPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Result Values Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <div className="text-xs text-[#64748B] font-medium mb-1">
                    {t('battery.remDistance')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#007BFF]">
                    {calculations.remainingDistance}
                    <span className="text-sm font-semibold text-[#14213D] ml-1">{unit}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                  <div className="text-xs text-[#64748B] font-medium mb-1">
                    {t('battery.drivingTime')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#14213D] flex items-baseline gap-1">
                    <span>{calculations.hours}</span>
                    <span className="text-xs font-semibold text-[#64748B]">{t('battery.hours')}</span>
                    <span className="ml-1">{calculations.minutes}</span>
                    <span className="text-xs font-semibold text-[#64748B]">{t('battery.minutes')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Assumptions Behind Result */}
            <div className="mt-4 pt-3 border-t border-blue-200 text-[11px] text-[#64748B] space-y-1">
              <span className="font-bold text-[#14213D] block">{t('battery.assumptionsBehind')}:</span>
              <p>• Entered full-charge baseline: {fullRange} {unit} at {avgSpeed} {unit}/h average speed.</p>
              <p>• Mathematical algorithm: remaining_range = {fullRange} × ({calculations.validRemainingPct} ÷ 100) = {calculations.remainingDistance} {unit}.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Battery Lifespan & Longevity Explainer */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[#14213D] mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          <span>{t('battery.lifespanTitle')}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#14213D] mb-1 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>Ambient Temperature</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Extreme desert heat (&gt;45°C) or freezing cold triggers battery thermal management systems, consuming auxiliary kWh.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#14213D] mb-1 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Charging Habits (80/20 Rule)</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Charging consistently to 80% rather than 100% daily maximizes lithium cell longevity and prevents chemical electrode stress.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-bold text-[#14213D] mb-1 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#007BFF]" />
              <span>Driving Dynamics & Drag</span>
            </div>
            <p className="text-[#64748B] leading-relaxed">
              Aerodynamic drag increases quadratically with velocity. Sustained 140+ km/h speeds reduce total range by 25-35%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
