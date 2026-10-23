import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Zap, Gauge, Rocket, AlertTriangle, ShieldCheck } from 'lucide-react';
import { audioService } from '../utils/audioSynth';
import { useLanguage } from '../utils/LanguageContext';

export default function SoundEffectsPanel({ soundData }) {
  const { t, isRTL, lang } = useLanguage();
  const [activeTrack, setActiveTrack] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    audioService.onStateChange = () => {
      setActiveTrack(audioService.currentTrack);
      setIsMuted(audioService.isMuted);
      setVolume(audioService.volume);
    };
    return () => {
      audioService.stopAll();
      audioService.onStateChange = null;
    };
  }, []);

  const handlePlayMotor = () => {
    audioService.playMotorSound();
  };

  const handlePlayAcceleration = () => {
    audioService.playAccelerationSound();
  };

  const handlePlayThruster = () => {
    audioService.playThrusterSound();
  };

  const handleStop = () => {
    audioService.stopAll();
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    audioService.setVolume(val);
  };

  const handleToggleMute = () => {
    audioService.toggleMute();
  };

  return (
    <div className="w-full mb-8 bg-[#F0F7FF] border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-blue-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-[#14213D] flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#007BFF]" />
            <span>{t('home.soundHeading')}</span>
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            {t('home.soundSub')}
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            activeTrack 
              ? 'bg-blue-100 text-[#007BFF] animate-pulse border border-blue-300' 
              : 'bg-slate-100 text-slate-500'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-1.5 ${activeTrack ? 'bg-[#007BFF]' : 'bg-slate-400'}`}></span>
            {activeTrack ? `${t('home.soundPlaying')} ${activeTrack.toUpperCase()}` : t('home.soundStopped')}
          </span>
        </div>
      </div>

      {/* Main Sound Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-5">
        <button
          onClick={handlePlayMotor}
          className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm ${
            activeTrack === 'motor'
              ? 'bg-[#007BFF] text-white ring-2 ring-[#00BFFF]'
              : 'bg-white hover:bg-blue-50 text-[#14213D] border border-[#E5E7EB]'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{t('home.playMotor')}</span>
        </button>

        <button
          onClick={handlePlayAcceleration}
          className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm ${
            activeTrack === 'acceleration'
              ? 'bg-[#007BFF] text-white ring-2 ring-[#00BFFF]'
              : 'bg-white hover:bg-blue-50 text-[#14213D] border border-[#E5E7EB]'
          }`}
        >
          <Gauge className="w-4 h-4 text-emerald-500" />
          <span>{t('home.playAccel')}</span>
        </button>

        <button
          onClick={handlePlayThruster}
          className={`px-4 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm ${
            activeTrack === 'thruster'
              ? 'bg-[#007BFF] text-white ring-2 ring-[#00BFFF]'
              : 'bg-white hover:bg-blue-50 text-[#14213D] border border-[#E5E7EB]'
          }`}
        >
          <Rocket className="w-4 h-4 text-[#00BFFF]" />
          <span>{t('home.playThruster')}</span>
        </button>

        <button
          onClick={handleStop}
          disabled={!activeTrack}
          className="px-4 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition disabled:opacity-40 disabled:pointer-events-none"
        >
          <Square className="w-4 h-4 fill-current" />
          <span>{t('home.stopSound')}</span>
        </button>
      </div>

      {/* Volume & Audio Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-lg hover:bg-slate-100 text-[#14213D] transition"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-[#007BFF]" />}
          </button>

          <div className="flex items-center gap-2 flex-1 sm:w-48">
            <span className="text-xs font-medium text-[#64748B]">{t('home.volume')}:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#007BFF]"
            />
            <span className="text-xs font-mono font-bold text-[#14213D] w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </div>

        {/* Clear Synthetic Audio Disclaimer */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>{t('home.soundNotice')}</span>
        </div>
      </div>
    </div>
  );
}
