import React, { useState } from 'react';
import { ZoomIn, X, ExternalLink, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';
import { resolveAsset } from '../utils/assetHelper';

export default function RealRoadsterPhoto({ photoData }) {
  const { t, lang, isRTL } = useLanguage();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const initialPhoto = resolveAsset(photoData?.highResAssetPath || photoData?.assetPath || "/assets/Tesla_roadster_Complete_Front.jpg");
  const [selectedPhoto, setSelectedPhoto] = useState(initialPhoto);
  const [imgError, setImgError] = useState(false);

  const caption = lang === 'ar' ? (photoData?.caption_ar || photoData?.caption) : photoData?.caption;
  const description = lang === 'ar' ? (photoData?.description_ar || photoData?.description) : photoData?.description;

  return (
    <div className="w-full mb-8">
      <div className="relative group cursor-pointer overflow-hidden rounded-2xl bg-white border border-[#E5E7EB] shadow-md hover:shadow-xl transition-all duration-300">
        {imgError ? (
          <div className="w-full aspect-[16/9] flex flex-col items-center justify-center p-8 bg-[#F0F7FF] text-[#14213D] text-center">
            <ImageIcon className="w-12 h-12 text-[#007BFF] mb-2" />
            <h5 className="font-bold">Real Roadster Concept Image Placeholder</h5>
            <p className="text-xs text-[#64748B] mt-1 max-w-sm">
              Image asset path: {photoData?.assetPath}. Click to view online source archive.
            </p>
          </div>
        ) : (
          <div 
            className="relative w-full aspect-[16/9] sm:aspect-[21/9] max-h-[500px] overflow-hidden bg-slate-900"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={selectedPhoto}
              alt={description || "Tesla Roadster Prototype Concept Vehicle"}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover sm:object-contain object-center transition-transform duration-500 group-hover:scale-102"
              loading="lazy"
            />
            {/* Interactive tap to enlarge pill */}
            <div className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20 transition">
              <ZoomIn className="w-3.5 h-3.5 text-[#00BFFF]" />
              <span>{t('common.expandPhoto')}</span>
            </div>
          </div>
        )}

        {/* Gallery Selector Thumbs if multiple concept photos exist */}
        {photoData?.alternativePhotos && photoData.alternativePhotos.length > 0 && (
          <div className="p-3 bg-[#F8FAFC] border-t border-[#E5E7EB] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider shrink-0 mr-1">
              Views:
            </span>
            {photoData.alternativePhotos.map((item) => (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(resolveAsset(item.path));
                  setImgError(false);
                }}
                className={`text-xs px-2.5 py-1 rounded-md transition font-medium shrink-0 flex items-center gap-1.5 ${
                  selectedPhoto === resolveAsset(item.path)
                    ? 'bg-[#007BFF] text-white shadow-sm'
                    : 'bg-white text-[#14213D] border border-[#E5E7EB] hover:bg-blue-50'
                }`}
              >
                <span>{item.title}</span>
                {item.verified && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Caption beneath photograph, NOT over it */}
      <div className="mt-3 px-1 text-center sm:text-left">
        <p className="text-sm font-semibold text-[#14213D] leading-relaxed">
          “{caption || 'Tesla Roadster concept — explore the vehicle and its experimental thruster concept.'}”
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Official Concept Media</span>
          </span>
          <span>•</span>
          <a
            href={photoData?.sourceUrl || "https://www.tesla.com/roadster"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#007BFF] flex items-center gap-1 underline underline-offset-2"
          >
            <span>{photoData?.licensingNotes || 'Tesla Press Concept Archive'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition z-10"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="max-w-6xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto}
              alt={description || "Tesla Roadster Prototype"}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
            />
            <div className="mt-4 text-center text-white max-w-xl">
              <p className="text-sm font-medium">{caption}</p>
              <p className="text-xs text-slate-400 mt-1">
                Official high-resolution photography asset from central data repository.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
