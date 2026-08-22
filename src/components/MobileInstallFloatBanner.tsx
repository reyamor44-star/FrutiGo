import React, { useState, useEffect } from "react";
import { Download, X, Star, ShieldCheck, Sparkles } from "lucide-react";

export default function MobileInstallFloatBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const playStoreUrl = "https://play.google.com/store/apps/details?id=com.frutigo.app";

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("frutigo_install_banner_dismissed");
    if (isDismissed === "true") {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show after a brief delay for mobile visitors
    const timer = setTimeout(() => {
      if (!isDismissed) {
        setIsVisible(true);
      }
    }, 1500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async (e: React.MouseEvent) => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === "accepted") {
          setIsVisible(false);
          sessionStorage.setItem("frutigo_install_banner_dismissed", "true");
          return;
        }
      } catch (err) {
        console.log("Install prompt error:", err);
      }
    }

    // Default or fallback: open Google Play Store
    window.open(playStoreUrl, "_blank", "noopener,noreferrer");
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem("frutigo_install_banner_dismissed", "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-label="Banner de instalación de la aplicación FrutiGo"
      className="fixed bottom-3 inset-x-3 sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-950 via-emerald-950 to-zinc-900 text-white p-3.5 border-2 border-emerald-400/80 shadow-2xl shadow-emerald-950/80 backdrop-blur-md">
        {/* Ambient glow */}
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-brand-yellow/20 rounded-full blur-xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleDismiss}
          type="button"
          aria-label="Cerrar banner"
          className="absolute top-2 right-2 p-1 text-emerald-200/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          {/* App Icon */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-yellow to-emerald-500 p-0.5 shadow-md flex items-center justify-center">
              <img
                src="/logo.png"
                alt="FrutiGo App"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/logo.svg";
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white shadow-xs">
              <Sparkles className="w-2.5 h-2.5 text-brand-yellow" />
            </span>
          </div>

          {/* App Details */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-black text-white tracking-tight truncate">
                FrutiGo App
              </h4>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 rounded border border-emerald-400/30 shrink-0">
                <ShieldCheck className="w-2.5 h-2.5" />
                Oficial
              </span>
            </div>
            <p className="text-[11px] text-emerald-100/90 line-clamp-1">
              Paquetería Express & Taxi Pet
            </p>
            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold mt-0.5">
              <div className="flex text-brand-yellow">
                <Star className="w-2.5 h-2.5 fill-current" />
                <Star className="w-2.5 h-2.5 fill-current" />
                <Star className="w-2.5 h-2.5 fill-current" />
                <Star className="w-2.5 h-2.5 fill-current" />
                <Star className="w-2.5 h-2.5 fill-current" />
              </div>
              <span className="text-zinc-300">• Google Play</span>
            </div>
          </div>

          {/* Install Button */}
          <button
            onClick={handleInstallClick}
            type="button"
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-brand-yellow to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 text-zinc-950 font-black text-xs uppercase tracking-wide rounded-xl shadow-md transition-all transform active:scale-95 cursor-pointer border border-yellow-200"
          >
            <Download className="w-3.5 h-3.5 text-zinc-950 shrink-0 animate-bounce" />
            <span>Instalar</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
