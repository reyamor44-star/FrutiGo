import React from "react";
import { Sparkles, ShoppingCart, ChevronRight } from "lucide-react";
import { TopBannerData } from "../types";
import { Language } from "../translations";

interface UnignorableTopBannerProps {
  bannerData: TopBannerData;
  currentLang?: Language;
  onClickBanner: () => void;
}

export default function UnignorableTopBanner({
  bannerData,
  currentLang = "es",
  onClickBanner
}: UnignorableTopBannerProps) {
  const isEn = currentLang === "en";
  const isPt = currentLang === "pt";

  const defaultTag = isEn 
    ? "NEW! FRUTI GO ONLINE STORE" 
    : isPt 
    ? "NOVO! LOJA ONLINE FRUTI GO" 
    : "¡NUEVO! TIENDA EN LÍNEA FRUTI GO";

  const defaultTitle = isEn 
    ? "FRUTI GO ONLINE MARKET & STORE!" 
    : isPt 
    ? "MERCADO E LOJA ONLINE FRUTI GO!" 
    : "¡MERCADO Y TIENDA EN LÍNEA FRUTI GO!";

  const defaultSubtitle = isEn 
    ? "Click here to order 100% fresh fruits & vegetables directly from farm to table with fast delivery." 
    : isPt 
    ? "Clique aqui para encomendar frutas e vegetais 100% frescos do campo à sua mesa com entrega rápida." 
    : "Haz clic aquí para ordenar frutas y verduras 100% frescas del campo a tu hogar con envío rápido.";

  const defaultCta = isEn 
    ? "ENTER STORE & SHOP NOW 🍉" 
    : isPt 
    ? "ENTRAR NA LOJA E COMPRAR 🍉" 
    : "ENTRAR A LA TIENDA Y COMPRAR 🍉";

  // Language-specific banner image URL selection
  const activeBannerUrl = isEn
    ? (bannerData.bannerUrlEn || bannerData.bannerUrl || null)
    : (bannerData.bannerUrlEs || bannerData.bannerUrl || null);

  return (
    <div className="w-full mb-4 sm:mb-8 max-w-7xl mx-auto px-2 sm:px-6">
      <div
        onClick={onClickBanner}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-[0.99] border-2 ${
          activeBannerUrl
            ? "bg-zinc-950 border-zinc-700/80 hover:border-brand-yellow/80"
            : "bg-gradient-to-r from-emerald-950 via-emerald-800 to-green-900 border-emerald-400/40 hover:shadow-emerald-900/30"
        }`}
        title="Haz clic para entrar a la Tienda en Línea Fruti Go"
      >
        {/* Background Image - Full 100% Clarity when custom image exists */}
        {activeBannerUrl && (
          <div className="absolute inset-0 z-0">
            <img
              src={activeBannerUrl}
              alt="Fruti Go Banner"
              className="w-full h-full object-cover opacity-100 transition-all duration-300"
            />
            {/* Subtle contrast gradient for white text legibility, without green tint */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
          </div>
        )}

        {/* Ambient background glow FX (Only shown when no custom image is uploaded) */}
        {!activeBannerUrl && (
          <>
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-brand-yellow/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        <div className="relative z-10 p-3 sm:p-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-6">
          {/* Text Content */}
          <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3.5 sm:py-1 bg-brand-yellow text-zinc-950 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-full shadow-lg border border-yellow-200/50">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{defaultTag}</span>
            </div>

            <h2 className="text-base sm:text-3xl font-black italic tracking-tight text-white drop-shadow-md group-hover:text-brand-yellow transition-colors leading-tight">
              {bannerData.title || defaultTitle}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100 font-semibold leading-normal sm:leading-relaxed drop-shadow-xs line-clamp-2 sm:line-clamp-none">
              {bannerData.subtitle || defaultSubtitle}
            </p>
          </div>

          {/* Interactive CTA Button */}
          <div className="flex-shrink-0 flex items-center pt-1 md:pt-0">
            <div className="w-full md:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3.5 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl sm:rounded-2xl shadow-xl transition-all duration-200 border border-yellow-200">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950" />
              <span>{bannerData.ctaText || defaultCta}</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-950 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
