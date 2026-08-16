import React from "react";
import { Package, Dog, Download, ExternalLink, Sparkles, ShieldCheck } from "lucide-react";

interface AppDownloadBannerProps {
  className?: string;
  variant?: "full" | "compact" | "card";
}

export default function AppDownloadBanner({
  className = "",
  variant = "full"
}: AppDownloadBannerProps) {
  const googlePlayUrl = "https://play.google.com/store/apps/details?id=com.frutigo.app";

  if (variant === "compact") {
    return (
      <a
        href={googlePlayUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet"
        className={`group flex items-center justify-between gap-3 p-3 bg-gradient-to-r from-emerald-950 via-zinc-900 to-emerald-900 text-white rounded-2xl border-2 border-emerald-500/60 shadow-lg hover:shadow-emerald-900/40 hover:border-brand-yellow transition-all duration-200 active:scale-[0.99] cursor-pointer select-none ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-emerald-500/50 flex items-center justify-center shrink-0 p-1.5 shadow-inner">
            <svg className="w-full h-full" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M325.8 243.7L88.1 6.1C82.5 0.5 74.3 -1.4 66.8 1.1 59.3 3.6 54.1 10.1 54.1 18.1V493.9c0 8 5.2 14.5 12.7 17 7.5 2.5 15.7 0.6 21.3-5L325.8 268.3c6.8-6.8 6.8-17.8 0-24.6z" fill="#00D2FF" />
              <path d="M325.8 243.7L411.4 158.1 120.3 6.1l205.5 237.6z" fill="#00F076" />
              <path d="M325.8 268.3L120.3 505.9 411.4 353.9 325.8 268.3z" fill="#FF3A44" />
              <path d="M411.4 158.1l43.2 24.9c18.5 10.7 18.5 37.9 0 48.6l-43.2 24.9-38.3-38.3 38.3-40.1z" fill="#FFE000" />
            </svg>
          </div>
          <div className="text-left min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
              Google Play Store
            </span>
            <p className="text-xs sm:text-sm font-black text-white group-hover:text-brand-yellow transition-colors truncate">
              Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-brand-yellow text-zinc-950 font-black text-xs px-3 py-1.5 rounded-xl shrink-0 group-hover:bg-yellow-400 transition-colors shadow-xs">
          <span>Descargar</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      </a>
    );
  }

  return (
    <aside
      aria-label="Descarga de la aplicación oficial Fruti Go"
      className={`w-full my-3 sm:my-5 ${className}`}
    >
      <a
        href={googlePlayUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet en Google Play"
        className="group relative block overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-zinc-950 via-emerald-950 to-zinc-900 border-2 border-emerald-500/70 hover:border-brand-yellow text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-900/30 transition-all duration-300 transform active:scale-[0.99] cursor-pointer"
      >
        {/* Glow ambient background circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-400/30 transition-colors" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-yellow/15 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-yellow/25 transition-colors" />

        <div className="relative z-10 p-4 sm:p-6 lg:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          {/* Main content info */}
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 min-w-0">
            {/* Google Play & Fruti Go Icon */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-900 border-2 border-emerald-400/60 p-2.5 shadow-xl flex items-center justify-center group-hover:scale-105 group-hover:border-brand-yellow transition-all">
                <svg className="w-full h-full" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M325.8 243.7L88.1 6.1C82.5 0.5 74.3 -1.4 66.8 1.1 59.3 3.6 54.1 10.1 54.1 18.1V493.9c0 8 5.2 14.5 12.7 17 7.5 2.5 15.7 0.6 21.3-5L325.8 268.3c6.8-6.8 6.8-17.8 0-24.6z" fill="#00D2FF" />
                  <path d="M325.8 243.7L411.4 158.1 120.3 6.1l205.5 237.6z" fill="#00F076" />
                  <path d="M325.8 268.3L120.3 505.9 411.4 353.9 325.8 268.3z" fill="#FF3A44" />
                  <path d="M411.4 158.1l43.2 24.9c18.5 10.7 18.5 37.9 0 48.6l-43.2 24.9-38.3-38.3 38.3-40.1z" fill="#FFE000" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-brand-yellow text-zinc-950 p-1 rounded-full shadow-md">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            {/* Typography & text */}
            <div className="space-y-1.5 text-left min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  App Oficial Fruti Go • frutigo.com.mx
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-400/20 text-amber-300 border border-yellow-400/30 text-[10px] font-bold">
                  Disponible en Google Play
                </span>
              </div>

              {/* Exact requested text */}
              <h3 className="text-base sm:text-lg lg:text-xl font-black italic tracking-tight text-white group-hover:text-brand-yellow transition-colors leading-snug">
                Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-100/90 font-medium">
                <span className="inline-flex items-center gap-1 text-emerald-200">
                  <Package className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                  Paquetería Exprés Urbana
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-200">
                  <Dog className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  Taxi Pet (Mascotas Seguras)
                </span>
              </div>
            </div>
          </div>

          {/* CTA Action Button */}
          <div className="shrink-0 w-full md:w-auto flex items-center justify-end pt-1 md:pt-0">
            <div className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wide rounded-xl sm:rounded-2xl shadow-xl transition-all border border-yellow-200 group-hover:shadow-yellow-400/30">
              <Download className="w-4 h-4 text-zinc-950 shrink-0" />
              <span>Descargar en Google Play</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </a>
    </aside>
  );
}
