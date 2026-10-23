import React, { useRef, useState, useEffect } from 'react';
import { Maximize, Minimize, Play, Pause, RotateCcw, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

export default function FullscreenVideoPlayer({ videoData }) {
  const { t, isRTL } = useLanguage();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [hasError, setHasError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
      setIsFullscreen(isFull);
      if (isFull && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {
          // Orientation lock not permitted or supported; keep upright
        });
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (document.fullscreenElement || document.webkitFullscreenElement)) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Video play error:", err);
      });
    }
  };

  const handleWatchFullScreen = async () => {
    if (!containerRef.current) return;
    try {
      if (containerRef.current.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        await containerRef.current.webkitRequestFullscreen();
      } else if (videoRef.current && videoRef.current.webkitEnterFullscreen) {
        // iOS Safari fallback
        videoRef.current.webkitEnterFullscreen();
      }
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn("Fullscreen request error:", err);
    }
  };

  const exitFullScreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      }
    } catch (err) {
      console.warn("Exit fullscreen error:", err);
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMute = !isMuted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (sec) => {
    if (isNaN(sec)) return "00:00";
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full mb-6">
      <div 
        ref={containerRef}
        className={`relative w-full overflow-hidden bg-black rounded-2xl shadow-xl transition-all duration-300 ${
          isFullscreen 
            ? 'fixed inset-0 z-50 rounded-none flex items-center justify-center h-screen' 
            : 'aspect-video max-h-[560px] border border-[#E5E7EB]'
        }`}
      >
        {hasError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
            <h4 className="text-lg font-bold mb-1">Demonstration Video Unavailable</h4>
            <p className="text-sm text-slate-300 max-w-md mb-4">
              The video asset could not be loaded. Please ensure {videoData?.assetPath || 'video file'} is available in the assets directory.
            </p>
            <button 
              onClick={() => { setHasError(false); if (videoRef.current) videoRef.current.load(); }}
              className="px-4 py-2 bg-[#007BFF] hover:bg-blue-600 rounded-lg text-white font-medium text-sm transition"
            >
              Retry Loading Video
            </button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoData?.assetPath || "/assets/roadster-launch-video.mp4"}
              poster={videoData?.fallbackPoster || "/assets/roadster-flying-stage.jpg"}
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onError={() => setHasError(true)}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain bg-black"
            />

            {/* Prominent Overlay Button when paused or initial state */}
            {!isPlaying && !isFullscreen && (
              <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px] transition-all">
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-[#007BFF] hover:bg-blue-600 text-white flex items-center justify-center shadow-2xl transform hover:scale-105 transition"
                  aria-label="Play Video"
                >
                  <Play className="w-8 h-8 fill-current ml-0.5" />
                </button>
                <button
                  onClick={handleWatchFullScreen}
                  className="px-5 py-2.5 rounded-full bg-white/90 hover:bg-white text-[#14213D] font-bold text-sm tracking-wide shadow-lg flex items-center gap-2 transform hover:scale-105 transition border border-white/40"
                >
                  <Maximize className="w-4 h-4 text-[#007BFF]" />
                  <span>{t('common.watchFullScreen')}</span>
                </button>
              </div>
            )}

            {/* Custom On-Player Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 text-white flex flex-col gap-2">
              {/* Progress Slider */}
              <div className="w-full flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const time = parseFloat(e.target.value);
                    setCurrentTime(time);
                    if (videoRef.current) videoRef.current.currentTime = time;
                  }}
                  className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#00BFFF]"
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1.5 hover:bg-white/20 rounded-md transition"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>

                  <button
                    onClick={handleReplay}
                    className="p-1.5 hover:bg-white/20 rounded-md transition"
                    title={t('common.replay')}
                    aria-label="Replay"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={toggleMute}
                      className="p-1.5 hover:bg-white/20 rounded-md transition"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00BFFF]" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 h-1 bg-white/30 rounded appearance-none cursor-pointer accent-[#00BFFF]"
                    />
                  </div>

                  <span className="text-slate-300 font-mono text-[11px] sm:text-xs">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {!isFullscreen ? (
                    <button
                      onClick={handleWatchFullScreen}
                      className="px-3 py-1.5 bg-[#007BFF] hover:bg-blue-600 rounded-md text-white font-semibold text-xs flex items-center gap-1.5 shadow transition"
                    >
                      <Maximize className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('common.watchFullScreen')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={exitFullScreen}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold text-xs flex items-center gap-1.5 shadow transition"
                    >
                      <Minimize className="w-3.5 h-3.5" />
                      <span>{t('common.exitFullScreen')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Asset Provenance & License strip */}
      <div className="mt-2 px-1 flex flex-wrap items-center justify-between text-[11px] text-[#64748B] gap-2">
        <span>{videoData?.title || 'Tesla Roadster Official Launch Reel'}</span>
        <span className="bg-[#F0F7FF] text-[#007BFF] px-2 py-0.5 rounded font-medium border border-blue-100">
          HTML5 Fullscreen API Compliant
        </span>
      </div>
    </div>
  );
}
