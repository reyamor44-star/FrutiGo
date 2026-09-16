/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, 
  ShieldCheck, 
  Info, 
  LifeBuoy, 
  Settings, 
  ChevronRight, 
  Save, 
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  X,
  Trash2,
  UserX,
  UserCheck,
  Code2,
  Image as ImageIcon,
  RotateCcw,
  Upload,
  Globe,
  Store,
  ShoppingBag,
  Share2,
  Copy,
  Check,
  Youtube,
  ExternalLink,
  Sparkles,
  Download,
  Building2,
  Cpu
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import AccountDeletionForm from "./components/AccountDeletionForm";
import { Language, LANGUAGES, UI_TRANSLATIONS, DEFAULT_POLICIES_BY_LANG } from "./translations";
import { Product, CartItem, TopBannerData, ActiveView, OpenPayConfig, OrderSummary, PdfConfig } from "./types";
import { DEFAULT_PRODUCTS, DEFAULT_BANNER } from "./data/defaultStoreData";
import OnlineStore from "./components/OnlineStore";
import AdminPanel from "./components/AdminPanel";
import { FounderProfileCard } from "./components/FounderProfileCard";
import CorporateAboutUs from "./components/CorporateAboutUs";
import FundadorGaleriaPublica from "./components/FundadorGaleriaPublica";
import { updateDynamicMetadata, SEO_SECTION_DATA } from "./utils/seo";
import RegistroFrutigo from "./components/RegistroFrutigo";
import FaqSection from "./components/FaqSection";
import MobileInstallFloatBanner from "./components/MobileInstallFloatBanner";
import SocialFooterLinks from "./components/SocialFooterLinks";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Section = "politicas" | "terminos" | "privacidad" | "desarrollador" | "medios" | "nosotros" | "soporte" | "cuenta";

interface Policies {
  politicas: string;
  terminos: string;
  privacidad: string;
  nosotros: string;
  soporte: string;
}

const SECTION_LABELS: Record<Section, string> = {
  politicas: "Políticas",
  terminos: "Términos",
  privacidad: "Privacidad",
  desarrollador: "Acerca de Nosotros",
  medios: "Medios y Galería",
  nosotros: "Acerca de Nosotros",
  soporte: "Soporte",
  cuenta: "Eliminar Cuenta",
};

const SECTION_ICONS: Record<Section, any> = {
  politicas: FileText,
  terminos: ShieldCheck,
  privacidad: Lock,
  desarrollador: Building2,
  medios: Sparkles,
  nosotros: Building2,
  soporte: LifeBuoy,
  cuenta: UserX,
};

function FrutiGoLogo({ className = "w-12 h-12", customUrl }: { className?: string; customUrl?: string | null }) {
  return (
    <img 
      src={customUrl || "/logo.svg"} 
      alt="Fruti Go Driver - 3D Logo Oficial" 
      className={cn("select-none flex-shrink-0 object-contain drop-shadow-sm transition-transform hover:scale-105", className)} 
    />
  );
}

function GooglePlayBadge({ className = "", lang = "es" }: { className?: string; lang?: Language }) {
  const labelTop = lang === "es" ? "DISPONIBLE EN" : lang === "pt" ? "DISPONÍVEL NO" : "GET IT ON";
  return (
    <a
      href="https://play.google.com/store/apps/details?id=com.frutigo.app"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-brand-green hover:bg-emerald-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 border border-brand-yellow/30 group select-none flex-shrink-0 cursor-pointer",
        className
      )}
      title="Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet en Google Play"
      aria-label="Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet en Google Play"
    >
      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M325.8 243.7L88.1 6.1C82.5 0.5 74.3 -1.4 66.8 1.1 59.3 3.6 54.1 10.1 54.1 18.1V493.9c0 8 5.2 14.5 12.7 17 7.5 2.5 15.7 0.6 21.3-5L325.8 268.3c6.8-6.8 6.8-17.8 0-24.6z" fill="#00D2FF" />
        <path d="M325.8 243.7L411.4 158.1 120.3 6.1l205.5 237.6z" fill="#00F076" />
        <path d="M325.8 268.3L120.3 505.9 411.4 353.9 325.8 268.3z" fill="#FF3A44" />
        <path d="M411.4 158.1l43.2 24.9c18.5 10.7 18.5 37.9 0 48.6l-43.2 24.9-38.3-38.3 38.3-40.1z" fill="#FFE000" />
      </svg>
      <div className="flex flex-col text-left leading-none">
        <span className="text-[8px] uppercase tracking-wider text-zinc-400 font-semibold">
          {labelTop}
        </span>
        <span className="text-xs font-black tracking-tight text-white group-hover:text-brand-yellow transition-colors">
          Google Play
        </span>
      </div>
    </a>
  );
}

function StyledFrutiGo({ legal = false }: { legal?: boolean }) {
  return (
    <span className="font-black italic text-zinc-900 tracking-tighter select-none inline-block whitespace-nowrap normal-case">
      Fruti Go{legal && " Legal"}
    </span>
  );
}

function highlightBrandName(html: string) {
  if (!html) return "";
  let res = html;
  // Replace references with unique placeholders to avoid nested tag generation issues
  res = res.replace(/Fruti Go Legal/g, "##FRUTIGOLEGAL##");
  res = res.replace(/Fruti Go/g, "##FRUTIGO##");
  // Also catch any occasional alternative capitalization or with dot inside the text formatting
  res = res.replace(/Fruti Go\./g, "##FRUTIGO##.");
  
  res = res.replace(/##FRUTIGOLEGAL##/g, '<span class="font-black italic text-zinc-900 tracking-tighter inline-block whitespace-nowrap normal-case">Fruti Go Legal</span>');
  res = res.replace(/##FRUTIGO##/g, '<span class="font-black italic text-zinc-900 tracking-tighter inline-block whitespace-nowrap normal-case">Fruti Go</span>');
  return res;
}

interface SavedAppState {
  activeView?: ActiveView;
  currentSection?: Section;
  isAdminPanelOpen?: boolean;
  scrollY?: number;
  timestamp?: number;
}

function getSavedAppState(): SavedAppState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("fg_app_state") || sessionStorage.getItem("fg_app_state");
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

export default function App() {
  // Domain detection for frutgo.com.mx or frutigo.com.mx domains or explicit legal-only mode
  const [isFrutgoDomain, setIsFrutgoDomain] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname.toLowerCase();
      const search = window.location.search.toLowerCase();
      return (
        hostname.includes("frutgo.com.mx") ||
        hostname.includes("frutigo.com.mx") ||
        search.includes("domain=frutgo.com.mx") ||
        search.includes("domain=frutigo.com.mx") ||
        search.includes("legalonly=true") ||
        search.includes("sololegal=true")
      );
    }
    return false;
  });

  const [activeView, setActiveView] = useState<ActiveView>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      // Check if user is navigating to registration page
      if (
        path === "/registrofrutigo" ||
        path === "/registro" ||
        path === "/registro-app" ||
        path === "/registro-frutigo" ||
        search.includes("registrofrutigo") ||
        search.includes("registro") ||
        hash.includes("registrofrutigo") ||
        hash.includes("registro")
      ) {
        return "registro";
      }

      // Check if user is navigating directly to cliente / bodega / tienda route
      if (
        path === "/cliente" ||
        path === "/bodega" ||
        path === "/tienda" ||
        path === "/catalogo" ||
        path === "/store" ||
        search.includes("cliente") ||
        search.includes("bodega") ||
        search.includes("tienda") ||
        search.includes("catalogo") ||
        search.includes("store") ||
        hash.includes("cliente") ||
        hash.includes("bodega") ||
        hash.includes("tienda") ||
        hash.includes("catalogo") ||
        hash.includes("store")
      ) {
        return "tienda";
      }

      if (
        path === "/fundador" ||
        path === "/desarrollador" ||
        path === "/sobre-el-desarrollador" ||
        path === "/medios" ||
        path === "/galeria" ||
        path === "/multimedia" ||
        path === "/prensa" ||
        path.startsWith("/articulo") ||
        path.startsWith("/articulos") ||
        path.startsWith("/blog") ||
        path.includes("medios") ||
        path.includes("galeria") ||
        hash.includes("medios") ||
        hash.includes("galeria") ||
        hash.includes("modulo-medios") ||
        hash.includes("articulos") ||
        hash.includes("articulo") ||
        search.includes("medios") ||
        search.includes("galeria") ||
        search.includes("articulo") ||
        search.includes("art=")
      ) {
        return "legal";
      }

      // Check saved state from minimize / reload
      const saved = getSavedAppState();
      if (saved && saved.activeView) {
        return saved.activeView;
      }
    }
    return "legal";
  });

  // Control Route & Admin Screen Route Detection
  const [isControlRoute, setIsControlRoute] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return (
        path === "/control" ||
        path.endsWith("/control") ||
        path.includes("control") ||
        path === "/admin" ||
        path.endsWith("/admin") ||
        path.includes("admin") ||
        path.includes("subida-productos") ||
        search.includes("control") ||
        search.includes("admin") ||
        search.includes("subida-productos") ||
        hash.includes("control") ||
        hash.includes("admin") ||
        hash.includes("subida-productos") ||
        localStorage.getItem("frutigo_control_enabled") === "true"
      );
    }
    return false;
  });

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === "/control" ||
        path.endsWith("/control") ||
        path.includes("control") ||
        path === "/admin" ||
        path.endsWith("/admin") ||
        path.includes("admin") ||
        path.includes("subida-productos") ||
        search.includes("control") ||
        search.includes("admin") ||
        search.includes("subida-productos") ||
        hash.includes("control") ||
        hash.includes("admin") ||
        hash.includes("subida-productos")
      ) {
        return true;
      }

      const saved = getSavedAppState();
      if (saved && typeof saved.isAdminPanelOpen === "boolean") {
        return saved.isAdminPanelOpen;
      }
    }
    return false;
  });

  useEffect(() => {
    const checkRoutes = () => {
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname.toLowerCase();
        const search = window.location.search.toLowerCase();
        const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
        const hash = window.location.hash.toLowerCase();

        const isFrutgo = (
          hostname.includes("frutgo.com.mx") ||
          hostname.includes("frutigo.com.mx") ||
          search.includes("domain=frutgo.com.mx") ||
          search.includes("domain=frutigo.com.mx") ||
          search.includes("legalonly=true") ||
          search.includes("sololegal=true")
        );
        setIsFrutgoDomain(isFrutgo);

        const hasExplicitRoute = (
          path.length > 1 || search.length > 0 || hash.length > 0
        );

        const isControl = (
          path === "/control" ||
          path.endsWith("/control") ||
          path.includes("control") ||
          path === "/admin" ||
          path.endsWith("/admin") ||
          path.includes("admin") ||
          search.includes("control") ||
          search.includes("admin") ||
          hash.includes("control") ||
          hash.includes("admin")
        );
        if (isControl) {
          setIsControlRoute(true);
          try {
            localStorage.setItem("frutigo_control_enabled", "true");
          } catch (e) {}
        }

        if (
          path === "/registrofrutigo" ||
          path.endsWith("/registrofrutigo") ||
          path === "/registro" ||
          path.endsWith("/registro") ||
          path === "/registro-app" ||
          path === "/registro-frutigo" ||
          search.includes("registrofrutigo") ||
          search.includes("registro") ||
          hash.includes("registrofrutigo") ||
          hash.includes("registro")
        ) {
          setActiveView("registro");
          updateDynamicMetadata(SEO_SECTION_DATA.registro);
        } else if (
          path === "/fundador" ||
          path.endsWith("/fundador") ||
          path.includes("fundador") ||
          path === "/desarrollador" ||
          path.endsWith("/desarrollador") ||
          path === "/sobre-el-desarrollador" ||
          path.endsWith("/sobre-el-desarrollador") ||
          path === "/medios" ||
          path.endsWith("/medios") ||
          path.includes("medios") ||
          path === "/galeria" ||
          path.endsWith("/galeria") ||
          path.includes("galeria") ||
          path.includes("multimedia") ||
          path.includes("prensa") ||
          path.includes("articulo") ||
          path.includes("articulos") ||
          path.includes("blog") ||
          search.includes("fundador") ||
          search.includes("desarrollador") ||
          search.includes("medios") ||
          search.includes("galeria") ||
          search.includes("articulo") ||
          search.includes("art=") ||
          hash.includes("fundador") ||
          hash.includes("desarrollador") ||
          hash.includes("medios") ||
          hash.includes("galeria") ||
          hash.includes("modulo-medios") ||
          hash.includes("articulo") ||
          hash.includes("articulos")
        ) {
          setActiveView("legal");
          setCurrentSection("desarrollador");
        } else if (
          path === "/cliente" ||
          path.endsWith("/cliente") ||
          path.includes("cliente") ||
          path === "/bodega" ||
          path.endsWith("/bodega") ||
          path.includes("bodega") ||
          path === "/tienda" ||
          path.endsWith("/tienda") ||
          path.includes("tienda") ||
          path === "/catalogo" ||
          path.endsWith("/catalogo") ||
          path.includes("catalogo") ||
          path === "/store" ||
          path.endsWith("/store") ||
          path.includes("store") ||
          search.includes("cliente") ||
          search.includes("bodega") ||
          search.includes("tienda") ||
          search.includes("catalogo") ||
          search.includes("store") ||
          hash.includes("cliente") ||
          hash.includes("bodega") ||
          hash.includes("tienda") ||
          hash.includes("catalogo") ||
          hash.includes("store")
        ) {
          setActiveView("tienda");
        } else if (hasExplicitRoute) {
          setActiveView("legal");
          if (
            path === "/desarrollador" ||
            path.endsWith("/desarrollador") ||
            path === "/sobre-el-desarrollador" ||
            path.endsWith("/sobre-el-desarrollador") ||
            path === "/fundador" ||
            path.includes("articulo") ||
            path.includes("articulos") ||
            path.includes("blog") ||
            hash.includes("desarrollador") ||
            hash.includes("fundador") ||
            hash.includes("articulo") ||
            search.includes("section=desarrollador") ||
            search.includes("articulo") ||
            search.includes("art=")
          ) {
            setCurrentSection("desarrollador");
          } else if (
            path === "/medios" ||
            path.endsWith("/medios") ||
            path === "/galeria" ||
            path.endsWith("/galeria") ||
            path.includes("medios") ||
            path.includes("galeria") ||
            hash.includes("medios") ||
            hash.includes("galeria") ||
            search.includes("section=medios") ||
            search.includes("medios")
          ) {
            setCurrentSection("medios");
          } else if (
            path === "/terminos" ||
            path.endsWith("/terminos") ||
            hash.includes("terminos") ||
            search.includes("section=terminos")
          ) {
            setCurrentSection("terminos");
          } else if (
            path === "/privacidad" ||
            path.endsWith("/privacidad") ||
            hash.includes("privacidad") ||
            search.includes("section=privacidad")
          ) {
            setCurrentSection("privacidad");
          } else if (
            path === "/sobre-nosotros" ||
            path === "/nosotros" ||
            path.endsWith("/nosotros") ||
            hash.includes("nosotros") ||
            search.includes("section=nosotros")
          ) {
            setCurrentSection("nosotros");
          } else if (
            path === "/soporte" ||
            path.endsWith("/soporte") ||
            hash.includes("soporte") ||
            search.includes("section=soporte")
          ) {
            setCurrentSection("soporte");
          } else if (
            path === "/cuenta" ||
            path.endsWith("/cuenta") ||
            hash.includes("cuenta") ||
            search.includes("section=cuenta")
          ) {
            setCurrentSection("cuenta");
          } else {
            setCurrentSection("politicas");
          }
        }

        if (
          path === "/control" ||
          path.endsWith("/control") ||
          path.includes("control") ||
          path === "/admin" ||
          path.endsWith("/admin") ||
          path.includes("admin") ||
          path.includes("subida-productos") ||
          search.includes("control") ||
          search.includes("admin") ||
          search.includes("subida-productos") ||
          hash.includes("control") ||
          hash.includes("admin") ||
          hash.includes("subida-productos")
        ) {
          setIsControlRoute(true);
          setIsAdminPanelOpen(true);
        }
      }
    };
    checkRoutes();
    window.addEventListener("popstate", checkRoutes);
    window.addEventListener("hashchange", checkRoutes);
    return () => {
      window.removeEventListener("popstate", checkRoutes);
      window.removeEventListener("hashchange", checkRoutes);
    };
  }, []);

  // Top Banner State
  const [topBanner, setTopBanner] = useState<TopBannerData>(() => {
    try {
      const saved = localStorage.getItem("fg_top_banner");
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BANNER;
  });

  // Store Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("fg_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_PRODUCTS;
  });

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("fg_cart");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // OpenPay Config State
  const [openpayConfig, setOpenpayConfig] = useState<OpenPayConfig>(() => {
    try {
      const saved = localStorage.getItem("fg_openpay_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          openpayUrl: parsed.openpayUrl || "",
          merchantId: parsed.merchantId || "mhary0zwpt8y6jwt6fju",
          publicKey: parsed.publicKey || "pk_ecd829b752774461b8cbc9383f4a414c",
          sandboxMode: parsed.sandboxMode !== undefined ? parsed.sandboxMode : true,
        };
      }
    } catch {}
    return {
      openpayUrl: "",
      merchantId: "mhary0zwpt8y6jwt6fju",
      publicKey: "pk_ecd829b752774461b8cbc9383f4a414c",
      sandboxMode: true
    };
  });

  // Orders State
  const [orders, setOrders] = useState<OrderSummary[]>(() => {
    try {
      const saved = localStorage.getItem("fg_orders");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // OpenPay Success Confirmation State
  const [openpaySuccessOrder, setOpenpaySuccessOrder] = useState<OrderSummary | null>(null);

  // PDF Note Config State
  const [pdfConfig, setPdfConfig] = useState<PdfConfig>(() => {
    try {
      const saved = localStorage.getItem("fg_pdf_config");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      pdfLogoUrl: null,
      pdfQrUrl: null
    };
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      if (path === "/cuenta" || path.endsWith("/cuenta")) {
        return "cuenta";
      }
      if (
        path === "/medios" ||
        path.endsWith("/medios") ||
        path === "/galeria" ||
        path.endsWith("/galeria") ||
        path === "/multimedia" ||
        path === "/prensa" ||
        path.includes("medios") ||
        path.includes("galeria")
      ) {
        return "medios";
      }

      if (
        path === "/desarrollador" ||
        path.endsWith("/desarrollador") ||
        path === "/sobre-el-desarrollador" ||
        path.endsWith("/sobre-el-desarrollador") ||
        path === "/fundador" ||
        path.includes("articulo") ||
        path.includes("articulos") ||
        path.includes("blog")
      ) {
        return "desarrollador";
      }

      const searchParams = new URLSearchParams(window.location.search);
      const sectionParam = searchParams.get("section") || searchParams.get("tab") || searchParams.get("page");
      if (sectionParam && ["politicas", "terminos", "privacidad", "nosotros", "soporte", "cuenta", "desarrollador", "medios"].includes(sectionParam)) {
        return sectionParam as Section;
      }
      if (searchParams.has("medios") || searchParams.has("galeria")) {
        return "medios";
      }
      if (searchParams.has("articulo") || searchParams.has("art")) {
        return "desarrollador";
      }
      
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("politicas")) return "politicas";
      if (hash.includes("terminos")) return "terminos";
      if (hash.includes("privacidad")) return "privacidad";
      if (hash.includes("medios") || hash.includes("galeria") || hash.includes("modulo-medios")) return "medios";
      if (hash.includes("nosotros")) return "nosotros";
      if (hash.includes("soporte")) return "soporte";
      if (hash.includes("cuenta")) return "cuenta";
      if (hash.includes("desarrollador") || hash.includes("fundador") || hash.includes("articulo") || hash.includes("articulos")) return "desarrollador";

      const saved = getSavedAppState();
      if (saved && saved.currentSection) {
        return saved.currentSection;
      }
    }
    return "politicas";
  });

  // Auto-save and synchronize navigation state + scroll position across minimize / reload
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saveCurrentAppState = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const stateObj: SavedAppState = {
        activeView,
        currentSection,
        isAdminPanelOpen,
        scrollY,
        timestamp: Date.now()
      };
      try {
        localStorage.setItem("fg_app_state", JSON.stringify(stateObj));
        sessionStorage.setItem("fg_app_state", JSON.stringify(stateObj));
      } catch (e) {}
    };

    saveCurrentAppState();

    // Throttled scroll listener
    let scrollTimer: any = null;
    const handleScroll = () => {
      if (scrollTimer) return;
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        saveCurrentAppState();
      }, 250);
    };

    // When visibility changes (e.g. minimizing, switching tabs, returning from background)
    const handleVisibilityChange = () => {
      saveCurrentAppState();
      if (document.visibilityState === "visible") {
        // Restore scroll position when un-minimizing
        const saved = getSavedAppState();
        if (saved && typeof saved.scrollY === "number" && saved.scrollY > 0) {
          setTimeout(() => {
            window.scrollTo({ top: saved.scrollY, behavior: "instant" as any });
          }, 30);
        }
      }
    };

    const handleUnload = () => {
      saveCurrentAppState();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [activeView, currentSection, isAdminPanelOpen]);

  // Restore scroll position on initial load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = getSavedAppState();
    if (saved && typeof saved.scrollY === "number" && saved.scrollY > 0) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: saved.scrollY, behavior: "instant" as any });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);
  const [policies, setPolicies] = useState<Policies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Language selection state
  const [currentLang, setCurrentLang] = useState<Language>("es");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareSection = async () => {
    let sharePath = "";
    if (currentSection === "desarrollador") {
      sharePath = "/desarrollador";
    } else if (currentSection === "medios") {
      sharePath = "/medios";
    } else if (currentSection === "cuenta") {
      sharePath = "/cuenta";
    } else {
      sharePath = `/#${currentSection}`;
    }
    
    const shareUrl = `${window.location.origin}${window.location.pathname.replace(/\/$/, "")}${sharePath}`;
    const sectionTitle = SECTION_LABELS[currentSection] || "Legal";

    if (typeof navigator !== "undefined" && navigator.share && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `Fruti Go - ${sectionTitle}`,
          text: `Consulta ${sectionTitle} en Fruti Go Legal:`,
          url: shareUrl,
        });
        return;
      } catch {
        // If user cancelled or device fails, fallback to clipboard copy
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error("Error al copiar enlace:", err);
    }
  };

  // Admin state
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [editData, setEditData] = useState<Policies | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  // Logo management state - persistent with localStorage as primary fallback
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem("fg_custom_logo") || null;
    } catch {
      return null;
    }
  });
  const [newLogoPreview, setNewLogoPreview] = useState<string | null>(null);
  const [logoSaving, setLogoSaving] = useState(false);
  const [logoSuccessMsg, setLogoSuccessMsg] = useState<string | null>(null);

  // Admin tabs
  const [adminTab, setAdminTab] = useState<"edit" | "requests" | "logo">("edit");
  const [deletionRequests, setDeletionRequests] = useState<any[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { product, quantity: 1 }];
      }
      localStorage.setItem("fg_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      localStorage.setItem("fg_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      localStorage.setItem("fg_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.removeItem("fg_cart");
  };

  // Banner, Product & Logo Admin Handlers
  const handleSaveBanner = async (newBanner: TopBannerData, pass: string): Promise<boolean> => {
    setTopBanner(newBanner);
    localStorage.setItem("fg_top_banner", JSON.stringify(newBanner));
    try {
      const res = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass, ...newBanner }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleSaveProducts = async (newProducts: Product[], pass: string): Promise<boolean> => {
    setProducts(newProducts);
    localStorage.setItem("fg_products", JSON.stringify(newProducts));
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass, products: newProducts }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleSaveLogoFromAdmin = async (logoUrl: string | null, pass: string): Promise<boolean> => {
    if (logoUrl) {
      setCustomLogo(logoUrl);
      localStorage.setItem("fg_custom_logo", logoUrl);
    } else {
      setCustomLogo(null);
      localStorage.removeItem("fg_custom_logo");
    }
    try {
      const res = await fetch("/api/admin/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass, logoUrl }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleSaveOpenPay = async (newConfig: OpenPayConfig, pass: string): Promise<boolean> => {
    setOpenpayConfig(newConfig);
    localStorage.setItem("fg_openpay_config", JSON.stringify(newConfig));
    try {
      const res = await fetch("/api/admin/openpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass, ...newConfig }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleSavePdfConfig = async (newConfig: PdfConfig, pass: string): Promise<boolean> => {
    setPdfConfig(newConfig);
    localStorage.setItem("fg_pdf_config", JSON.stringify(newConfig));
    try {
      const res = await fetch("/api/pdf-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass || "1234", pdfConfig: newConfig }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: "pending" | "completed" | "paid", pass: string): Promise<boolean> => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status } : o));
    setOrders(updated);
    localStorage.setItem("fg_orders", JSON.stringify(updated));

    try {
      const res = await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass, orderId, status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const fetchServerProducts = async () => {
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          try {
            localStorage.setItem("fg_products", JSON.stringify(data));
          } catch {}
        }
      }
    } catch (err) {
      console.error("Error al cargar productos del servidor:", err);
    }
  };

  // Re-fetch products from server whenever user enters store view
  useEffect(() => {
    if (activeView === "tienda") {
      fetchServerProducts();
    }
  }, [activeView]);

  useEffect(() => {
    // Check for OpenPay return success parameter in URL (Requirement #3)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const pagoParam = urlParams.get("pago") || urlParams.get("payment") || urlParams.get("openpay");
      if (pagoParam === "exitoso" || pagoParam === "success") {
        // a) Clear shopping cart
        handleClearCart();

        // b) Retrieve last saved order
        let lastOrder: OrderSummary | null = null;
        try {
          const saved = localStorage.getItem("fg_last_order");
          if (saved) lastOrder = JSON.parse(saved);
        } catch {}

        if (lastOrder) {
          lastOrder.status = "completed";
          localStorage.setItem("fg_last_order", JSON.stringify(lastOrder));
          setOpenpaySuccessOrder(lastOrder);
        } else {
          setOpenpaySuccessOrder({
            orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
            items: [],
            total: 0,
            status: "completed"
          });
        }

        // Switch active view to tienda so user sees confirmation modal immediately
        setActiveView("tienda");

        // Clean query parameter from URL address bar
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    // Fetch server banner, products, and openpay config if available
    fetch("/api/banner")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.title) {
          setTopBanner(data);
          localStorage.setItem("fg_top_banner", JSON.stringify(data));
        }
      })
      .catch(() => {});

    fetchServerProducts();

    fetch("/api/openpay")
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.openpayUrl !== undefined || data.merchantId !== undefined)) {
          setOpenpayConfig(data);
          localStorage.setItem("fg_openpay_config", JSON.stringify(data));
        }
      })
      .catch(() => {});

    const localPdfRaw = localStorage.getItem("fg_pdf_config");
    let localPdf: PdfConfig | null = null;
    try {
      if (localPdfRaw) localPdf = JSON.parse(localPdfRaw);
    } catch {}

    fetch("/api/pdf-config")
      .then((res) => res.json())
      .then((data) => {
        if (data && (data.pdfLogoUrl || data.pdfQrUrl)) {
          setPdfConfig(data);
          localStorage.setItem("fg_pdf_config", JSON.stringify(data));
        } else if (localPdf && (localPdf.pdfLogoUrl || localPdf.pdfQrUrl)) {
          setPdfConfig(localPdf);
          fetch("/api/pdf-config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: "1234", pdfConfig: localPdf }),
          }).catch(() => {});
        }
      })
      .catch(() => {
        if (localPdf) setPdfConfig(localPdf);
      });

    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
          localStorage.setItem("fg_orders", JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, []);

  const fetchCustomLogo = async () => {
    let localLogo = localStorage.getItem("fg_custom_logo");
    // Purge legacy motorcycle or base64 logos
    if (localLogo && (localLogo.startsWith("data:image") || localLogo.includes("frutigo-logo-oficial-amarillo"))) {
      localStorage.removeItem("fg_custom_logo");
      localLogo = null;
    }

    try {
      const res = await fetch("/api/logo");
      if (res.ok) {
        const data = await res.json();
        if (data.logoUrl && !data.logoUrl.startsWith("data:image") && !data.logoUrl.includes("frutigo-logo-oficial-amarillo")) {
          setCustomLogo(data.logoUrl);
          localStorage.setItem("fg_custom_logo", data.logoUrl);
        } else {
          setCustomLogo("/logo.svg");
          localStorage.setItem("fg_custom_logo", "/logo.svg");
        }
      } else {
        setCustomLogo("/logo.svg");
      }
    } catch (err) {
      console.error("Error al obtener logo:", err);
      setCustomLogo("/logo.svg");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP, SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setNewLogoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = async () => {
    if (!newLogoPreview) return;
    setLogoSaving(true);
    try {
      // Instantly persist in browser localStorage
      localStorage.setItem("fg_custom_logo", newLogoPreview);
      setCustomLogo(newLogoPreview);

      const res = await fetch("/api/admin/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, logoUrl: newLogoPreview }),
      });
      const result = await res.json();
      if (!res.ok) {
        console.warn("Advertencia en servidor al guardar logo:", result.error);
      }
      setNewLogoPreview(null);
      setLogoSuccessMsg("¡Logo guardado permanentemente en la aplicación!");
      setTimeout(() => setLogoSuccessMsg(null), 4000);
    } catch (err) {
      setLogoSuccessMsg("¡Logo guardado permanentemente en tu navegador!");
      setTimeout(() => setLogoSuccessMsg(null), 4000);
    } finally {
      setLogoSaving(false);
    }
  };

  const handleResetLogo = async () => {
    if (!confirm("¿Deseas restablecer el logo al diseño vectorial por defecto?")) return;
    setLogoSaving(true);
    try {
      localStorage.removeItem("fg_custom_logo");
      setCustomLogo(null);
      setNewLogoPreview(null);
      await fetch("/api/admin/logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, logoUrl: null }),
      });
      setLogoSuccessMsg("Logo restablecido al diseño vectorial por defecto.");
      setTimeout(() => setLogoSuccessMsg(null), 4000);
    } catch (err) {
      setLogoSuccessMsg("Logo restablecido al diseño vectorial por defecto.");
      setTimeout(() => setLogoSuccessMsg(null), 4000);
    } finally {
      setLogoSaving(false);
    }
  };

  const fetchDeletionRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch(`/api/admin/deletion-requests?password=${encodeURIComponent(password)}`);
      if (res.ok) {
        const data = await res.json();
        setDeletionRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleResolveRequest = async (id: string, action: "resolve" | "delete") => {
    if (action === "delete" && !confirm("¿Estás seguro de eliminar permanentemente este registro de solicitud?")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/deletion-requests/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id, action }),
      });
      if (res.ok) {
        fetchDeletionRequests();
      } else {
        const err = await res.json();
        alert(err.error || "Error al procesar la solicitud");
      }
    } catch (err) {
      alert("Error de conexión en el servidor");
    }
  };

  useEffect(() => {
    fetchPolicies();
    fetchCustomLogo();
    const cookiesAccepted = localStorage.getItem("fg_cookies_accepted");
    if (cookiesAccepted) setShowCookieBanner(false);

    const handleHashAndSearch = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (
        path === "/bodega" ||
        path.endsWith("/bodega") ||
        path === "/tienda" ||
        path.endsWith("/tienda") ||
        path === "/catalogo" ||
        path.endsWith("/catalogo") ||
        path === "/store" ||
        path.endsWith("/store") ||
        search.includes("bodega") ||
        search.includes("tienda") ||
        search.includes("catalogo") ||
        hash.includes("bodega") ||
        hash.includes("tienda") ||
        hash.includes("catalogo") ||
        hash.includes("store")
      ) {
        setActiveView("tienda");
        return;
      }

      let targetSection: Section | null = null;
      
      if (path === "/cuenta" || path.endsWith("/cuenta")) {
        targetSection = "cuenta";
      } else if (
        path === "/medios" ||
        path.endsWith("/medios") ||
        path === "/galeria" ||
        path.endsWith("/galeria") ||
        path === "/multimedia" ||
        path === "/prensa" ||
        path.includes("medios") ||
        path.includes("galeria")
      ) {
        targetSection = "medios";
      } else if (
        path === "/desarrollador" ||
        path.endsWith("/desarrollador") ||
        path === "/sobre-el-desarrollador" ||
        path.endsWith("/sobre-el-desarrollador")
      ) {
        targetSection = "desarrollador";
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        const sectionParam = searchParams.get("section") || searchParams.get("tab") || searchParams.get("page");
        
        if (sectionParam && ["politicas", "terminos", "privacidad", "nosotros", "soporte", "cuenta", "desarrollador", "medios"].includes(sectionParam)) {
          targetSection = sectionParam as Section;
        } else if (searchParams.has("medios") || searchParams.has("galeria")) {
          targetSection = "medios";
        } else {
          if (hash.includes("politicas")) targetSection = "politicas";
          else if (hash.includes("terminos")) targetSection = "terminos";
          else if (hash.includes("privacidad")) targetSection = "privacidad";
          else if (hash.includes("medios") || hash.includes("galeria") || hash.includes("modulo-medios")) targetSection = "medios";
          else if (hash.includes("nosotros")) targetSection = "nosotros";
          else if (hash.includes("soporte")) targetSection = "soporte";
          else if (hash.includes("cuenta")) targetSection = "cuenta";
          else if (hash.includes("desarrollador")) targetSection = "desarrollador";
        }
      }
      
      if (targetSection) {
        setCurrentSection(targetSection);
      }
    };

    window.addEventListener("hashchange", handleHashAndSearch);
    window.addEventListener("popstate", handleHashAndSearch);
    return () => {
      window.removeEventListener("hashchange", handleHashAndSearch);
      window.removeEventListener("popstate", handleHashAndSearch);
    };
  }, []);

  // Update Metadata & Open Graph dynamically for SEO & direct route navigation
  useEffect(() => {
    if (typeof document !== "undefined") {
      const pathname = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      const isMediaTarget = (
        pathname.includes("medios") ||
        pathname.includes("galeria") ||
        pathname.includes("multimedia") ||
        pathname.includes("prensa") ||
        hash.includes("medios") ||
        hash.includes("galeria") ||
        hash.includes("modulo-medios") ||
        search.includes("medios") ||
        search.includes("galeria")
      );

      const isAboutTarget = (
        pathname.includes("nosotros") ||
        pathname.includes("desarrollador") ||
        pathname.includes("sobre-el-desarrollador") ||
        hash.includes("nosotros") ||
        hash.includes("desarrollador") ||
        search.includes("nosotros") ||
        search.includes("desarrollador")
      );

      if (activeView === "tienda") {
        updateDynamicMetadata(SEO_SECTION_DATA.tienda);
      } else if (isMediaTarget || currentSection === "medios") {
        updateDynamicMetadata(SEO_SECTION_DATA.medios);
      } else if (isAboutTarget || currentSection === "nosotros" || currentSection === "desarrollador") {
        updateDynamicMetadata(SEO_SECTION_DATA.nosotros);
      } else if (currentSection && SEO_SECTION_DATA[currentSection]) {
        updateDynamicMetadata(SEO_SECTION_DATA[currentSection]);
      } else {
        updateDynamicMetadata(SEO_SECTION_DATA.inicio);
      }
    }
  }, [activeView, currentSection]);

  const acceptCookies = () => {
    localStorage.setItem("fg_cookies_accepted", "true");
    setShowCookieBanner(false);
  };

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/policies");
      if (!res.ok) throw new Error("Error al cargar datos");
      const data = await res.json();
      setPolicies(data);
      setEditData(data);
    } catch (err) {
      setError("No se pudieron cargar las políticas. Reintentando...");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editData) return;
    setSaving(true);
    try {
      const res = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, data: editData }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Error al guardar");
      } else {
        setPolicies(editData);
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center bg-mesh">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="relative"
        >
          <FrutiGoLogo customUrl={customLogo} className="w-16 h-16 animate-bounce shadow-2xl shadow-brand-yellow/20" />
          <Loader2 className="w-20 h-20 text-brand-green/20 animate-spin absolute inset-0 -m-2" />
        </motion.div>
      </div>
    );
  }

  if (activeView === "registro") {
    return (
      <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white bg-mesh">
        {/* Header */}
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2.5 sm:py-0 sm:h-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center justify-between gap-3">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  setActiveView("legal");
                  window.history.pushState(null, "", "/");
                }}
              >
                <FrutiGoLogo customUrl={customLogo} className="w-10 h-10 sm:w-11 sm:h-11" />
                <div>
                  <h1 className="text-lg sm:text-xl font-black italic tracking-tighter text-zinc-900 select-none">
                    Fruti Go
                  </h1>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
                    Registro Oficial en la App
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full flex-nowrap">
              {/* Botón Descarga la App */}
              <a
                href="https://play.google.com/store/apps/details?id=com.frutigo.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-brand-green hover:bg-emerald-800 text-white rounded-2xl border border-brand-yellow/30 font-bold text-xs shadow-xs hover:shadow-md transition transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
                title="Descarga la app oficial de Fruti Go en Google Play Store"
              >
                <Download className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                <span className="tracking-tight">Descarga la app</span>
              </a>

              {/* Botón Ir a la Tienda */}
              <button
                onClick={() => {
                  setActiveView("tienda");
                  window.history.pushState(null, "", "/tienda");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-brand-yellow hover:bg-yellow-400 text-brand-black rounded-2xl border border-brand-yellow/40 font-black text-xs shadow-xs hover:shadow-md transition-all transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
                title="Ir a la Tienda Online de Fruti Go"
              >
                <Store className="w-3.5 h-3.5 text-brand-black shrink-0" />
                <span className="tracking-tight">Ir a la Tienda</span>
              </button>

              <button
                onClick={() => {
                  setActiveView("legal");
                  window.history.pushState(null, "", "/");
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-brand-green rounded-2xl border border-brand-green/20 text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-brand-green" />
                <span>Volver al Inicio</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-2 sm:px-6 py-4 sm:py-8">
          <RegistroFrutigo
            onBackToHome={() => {
              setActiveView("legal");
              window.history.pushState(null, "", "/");
            }}
            onGoToStore={() => {
              setActiveView("tienda");
              window.history.pushState(null, "", "/tienda");
            }}
            onViewTerms={() => {
              setActiveView("legal");
              setCurrentSection("terminos");
              window.history.pushState(null, "", "/terminos");
            }}
          />
        </main>
      </div>
    );
  }

  if (activeView === "tienda") {
    return (
      <>
        <OnlineStore
          products={products}
          cart={cart}
          openpayConfig={openpayConfig}
          pdfConfig={pdfConfig}
          openpaySuccessOrder={openpaySuccessOrder}
          currentLang={currentLang}
          onChangeLang={setCurrentLang}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
          onReturnToLegal={() => setActiveView("legal")}
          onOpenAdmin={() => setIsAdminPanelOpen(true)}
          onDismissSuccessOrder={() => setOpenpaySuccessOrder(null)}
          showAdminButton={isControlRoute || isAdmin}
          onRefreshProducts={fetchServerProducts}
          onGoToRegistro={() => {
            setActiveView("registro");
            window.history.pushState(null, "", "/registrofrutigo");
          }}
        />
        {isAdminPanelOpen && (
          <AdminPanel
            currentBanner={topBanner}
            products={products}
            customLogo={customLogo}
            openpayConfig={openpayConfig}
            pdfConfig={pdfConfig}
            orders={orders}
            onSaveBanner={handleSaveBanner}
            onSaveProducts={handleSaveProducts}
            onSaveLogo={handleSaveLogoFromAdmin}
            onSaveOpenPay={handleSaveOpenPay}
            onSavePdfConfig={handleSavePdfConfig}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onCloseAdmin={() => setIsAdminPanelOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0F12] text-[#F8FAFC] font-sans selection:bg-brand-yellow selection:text-black bg-mesh">
      {/* Header */}
      <header className="border-b border-[#2A2E39] bg-[#13161C]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2.5 sm:py-0 sm:h-20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FrutiGoLogo customUrl={customLogo} className="w-10 h-10 sm:w-11 sm:h-11" />
              <div>
                <h1 className="text-lg sm:text-xl font-black italic tracking-tighter text-[#FFD200] select-none">
                  Fruti Go
                </h1>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#8E959E] font-medium">
                  {currentSection === "desarrollador" || currentSection === "nosotros" ? "Infraestructura & Plataforma Tecnológica" : UI_TRANSLATIONS[currentLang].headerSubtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full flex-nowrap scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Botón Tienda Mayorista B2B (/cliente) */}
            <a
              href="/cliente"
              onClick={(e) => {
                e.preventDefault();
                setActiveView("tienda");
                window.history.pushState(null, "", "/cliente");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-brand-green hover:bg-emerald-800 text-white rounded-2xl border border-brand-yellow/30 font-bold text-xs shadow-xs hover:shadow-md transition-all transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
              title="Acceso a Tienda Mayorista y Clientes B2B"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
              <span className="tracking-tight">Tienda Mayorista (B2B)</span>
            </a>

            {/* Botón Ir a la Tienda en Línea */}
            <button
              onClick={() => {
                setActiveView("tienda");
                window.history.pushState(null, "", "/tienda");
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl border font-bold text-xs shadow-xs hover:shadow-md transition-all transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0",
                activeView === "tienda"
                  ? "bg-emerald-900 text-brand-yellow border-brand-yellow/40"
                  : "bg-brand-green hover:bg-emerald-800 text-white border-brand-yellow/30"
              )}
              title="Ir a la Tienda Online de Fruti Go"
            >
              <Store className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
              <span className="tracking-tight">Ir a la Tienda</span>
            </button>

            {/* Botón Descarga la App */}
            <a
              href="https://play.google.com/store/apps/details?id=com.frutigo.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-brand-green hover:bg-emerald-800 text-white rounded-2xl border border-brand-yellow/30 font-bold text-xs shadow-xs hover:shadow-md transition-all transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
              title="Descarga la app oficial de Fruti Go en Google Play Store"
            >
              <Download className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
              <span className="tracking-tight">Descarga la app</span>
            </a>

            {/* Global Registration Button with Official Logo */}
            <button
              onClick={() => {
                setActiveView("registro");
                window.history.pushState(null, "", "/registrofrutigo");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-brand-yellow hover:bg-yellow-400 text-brand-black rounded-2xl border border-brand-yellow/40 font-black text-xs shadow-xs hover:shadow-md transition-all transform active:scale-95 whitespace-nowrap cursor-pointer shrink-0"
              title="Regístrate en Fruti Go - App Oficial"
            >
              <img
                src="/logo.svg"
                alt="Logo Fruti Go Driver 3D"
                className="w-4 h-4 object-contain rounded-md shrink-0"
              />
              <span className="tracking-tight">Regístrate en Fruti Go</span>
            </button>

            {/* Share Section Button in Header */}
            {!isAdmin && (
              <button
                onClick={handleShareSection}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-2xl border transition text-xs font-bold shadow-2xs whitespace-nowrap cursor-pointer active:scale-95 shrink-0",
                  copiedLink 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" 
                    : "bg-emerald-50 hover:bg-emerald-100/80 text-brand-green border-brand-green/20"
                )}
                title="Copiar enlace directo de esta sección"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span className="font-extrabold text-white">{UI_TRANSLATIONS[currentLang].linkCopied}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-brand-green" />
                    <span className="font-extrabold">{UI_TRANSLATIONS[currentLang].shareSection}</span>
                  </>
                )}
              </button>
            )}

            {/* Language Selector Dropdown for Clients */}
            {!isAdmin && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100/90 hover:bg-zinc-200/90 active:scale-95 rounded-2xl border border-zinc-200/80 transition text-xs font-bold text-zinc-800 shadow-sm whitespace-nowrap cursor-pointer"
                  title="Cambiar idioma / Switch language"
                >
                  <span className="text-base leading-none">
                    {LANGUAGES.find(l => l.code === currentLang)?.flag}
                  </span>
                  <span className="font-black text-zinc-700">{LANGUAGES.find(l => l.code === currentLang)?.name}</span>
                  <Globe className="w-3.5 h-3.5 text-zinc-400 ml-0.5" />
                </button>

                {langDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setLangDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-1 text-[10px] uppercase font-black tracking-wider text-zinc-400 border-b border-zinc-100 mb-1">
                        {UI_TRANSLATIONS[currentLang].selectLanguageTitle}
                      </div>
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLang(lang.code);
                            setLangDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-3 px-3.5 py-2 text-xs font-extrabold transition text-left hover:bg-zinc-50",
                            currentLang === lang.code ? "text-zinc-900 bg-zinc-100 font-black" : "text-zinc-600"
                          )}
                        >
                          <span className="text-xl leading-none">{lang.flag}</span>
                          <span>{lang.name}</span>
                          {currentLang === lang.code && <CheckCircle2 className="w-4 h-4 ml-auto text-zinc-900" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {(isControlRoute || isAdmin) && (
              <button 
                onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
                className="flex-shrink-0 p-2 hover:bg-zinc-100 rounded-full group transition cursor-pointer"
                title={UI_TRANSLATIONS[currentLang].adminTooltip}
              >
                {isAdmin ? <ArrowLeft className="w-5 h-5" /> : <Settings className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900" />}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-1.5 sm:px-6 py-2.5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12">
          
          {/* Navigation Rail - Responsive Mobile Horizontal Scroll & Desktop Sticky Sidebar */}
          {!isAdmin && (
            <>
              {/* Mobile Horizontal Navigation Bar */}
              <aside className="lg:hidden col-span-1 mb-1">
                <nav className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 px-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {/* Tienda Mayorista Mobile Pill */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("tienda");
                      window.history.pushState(null, "", "/cliente");
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer border shadow-2xs bg-brand-green text-white border-brand-yellow/30 active:scale-95"
                    title="Tienda Mayorista y Clientes B2B"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                    <span>Tienda Mayorista (B2B)</span>
                  </button>

                  {/* Ir a la Tienda Mobile Pill */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("tienda");
                      window.history.pushState(null, "", "/tienda");
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer border shadow-2xs bg-brand-green text-brand-yellow border-brand-yellow/30 active:scale-95"
                    title="Ir a la Tienda Online de Fruti Go"
                  >
                    <Store className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                    <span>Ir a la Tienda</span>
                  </button>

                  {(Object.keys(SECTION_LABELS) as Section[]).map((key) => {
                    const Icon = SECTION_ICONS[key];
                    const active = currentSection === key;
                    const href = key === "desarrollador" ? "/desarrollador" : key === "medios" ? "/medios" : key === "cuenta" ? "/cuenta" : `/#${key}`;
                    return (
                      <a
                        key={key}
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (key === "cuenta") {
                            window.history.pushState(null, "", "/cuenta");
                          } else if (key === "desarrollador") {
                            window.history.pushState(null, "", "/desarrollador");
                          } else if (key === "medios") {
                            window.history.pushState(null, "", "/medios");
                          } else {
                            window.history.pushState(null, "", "/");
                            window.location.hash = key;
                          }
                          setCurrentSection(key);
                        }}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-xl font-extrabold text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer border shadow-2xs",
                          active 
                            ? "bg-brand-green text-brand-yellow border-brand-green shadow-sm" 
                            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{UI_TRANSLATIONS[currentLang].sections[key]}</span>
                      </a>
                    );
                  })}

                  {/* Share button pill in mobile bar */}
                  <button
                    onClick={handleShareSection}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl font-extrabold text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer border shadow-2xs ml-1 active:scale-95",
                      copiedLink
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-emerald-50 text-brand-green border-brand-green/20 hover:bg-emerald-100/80"
                    )}
                    title="Copiar enlace directo"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-brand-green" />}
                    <span>{copiedLink ? UI_TRANSLATIONS[currentLang].linkCopied : UI_TRANSLATIONS[currentLang].shareSection}</span>
                  </button>
                </nav>
              </aside>

              {/* Desktop Vertical Sidebar */}
              <aside className="hidden lg:block lg:col-span-3">
                <nav className="space-y-3 sticky top-32">
                  {/* Tienda Mayorista Direct Sidebar Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("tienda");
                      window.history.pushState(null, "", "/cliente");
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl group relative overflow-hidden transition-all cursor-pointer bg-brand-green hover:bg-emerald-800 text-white shadow-xs hover:shadow-md border border-brand-yellow/30 active:scale-98"
                    title="Acceso a Tienda Mayorista y Clientes B2B"
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-brand-yellow border border-brand-yellow/20">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-sm tracking-tight text-white block">
                          Tienda Mayorista (B2B)
                        </span>
                        <span className="text-[10px] text-zinc-300 font-medium block">
                          Precios Mayoreo & Pedidos
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 z-10 text-brand-yellow/80 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Ir a la Tienda Direct Sidebar Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView("tienda");
                      window.history.pushState(null, "", "/tienda");
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl group relative overflow-hidden transition-all cursor-pointer bg-brand-green hover:bg-emerald-800 text-white shadow-xs hover:shadow-md border border-brand-yellow/30 active:scale-98"
                    title="Ir a la Tienda Online de Fruti Go"
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-brand-yellow border border-brand-yellow/20">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-sm tracking-tight text-white block">
                          Ir a la Tienda
                        </span>
                        <span className="text-[10px] text-zinc-300 font-medium block">
                          Catálogo de Frutas y Abarrotes
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 z-10 text-brand-yellow/80 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {(Object.keys(SECTION_LABELS) as Section[]).map((key) => {
                    const Icon = SECTION_ICONS[key];
                    const active = currentSection === key;
                    const href = key === "desarrollador" ? "/desarrollador" : key === "medios" ? "/medios" : key === "cuenta" ? "/cuenta" : `/#${key}`;
                    return (
                      <a
                        key={key}
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (key === "cuenta") {
                            window.history.pushState(null, "", "/cuenta");
                          } else if (key === "desarrollador") {
                            window.history.pushState(null, "", "/desarrollador");
                          } else if (key === "medios") {
                            window.history.pushState(null, "", "/medios");
                          } else {
                            window.history.pushState(null, "", "/");
                            window.location.hash = key;
                          }
                          setCurrentSection(key);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-4 rounded-2xl group relative overflow-hidden transition-all cursor-pointer",
                          active 
                            ? "bg-[#FFD200] text-[#0D0F12] shadow-lg shadow-yellow-500/20 border border-[#FFD200] font-black" 
                            : "bg-[#1A1D24] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#242933] border border-[#2A2E39]"
                        )}
                      >
                        <div className="flex items-center gap-4 relative z-10">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            active ? "bg-[#0D0F12]/15 text-[#0D0F12]" : "bg-[#0D0F12] text-[#8E959E] group-hover:text-[#FFD200]"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-bold tracking-tight">
                            {UI_TRANSLATIONS[currentLang].sections[key]}
                          </span>
                        </div>
                        <ChevronRight className={cn("w-4 h-4 z-10 transition-opacity", active ? "opacity-100 text-[#0D0F12]" : "opacity-0 group-hover:opacity-100 text-[#8E959E]")} />
                        
                        {active && (
                          <div className="absolute inset-0 bg-[#FFD200] z-0" />
                        )}
                      </a>
                    );
                  })}

                  {/* Desktop Sidebar Share Button */}
                  <div className="pt-2 border-t border-[#2A2E39]">
                    <button
                      onClick={handleShareSection}
                      className={cn(
                        "w-full flex items-center justify-between p-3.5 rounded-2xl transition-all cursor-pointer border shadow-2xs active:scale-[0.98]",
                        copiedLink
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-[#1A1D24] hover:bg-[#242933] text-[#CBD5E1] hover:text-[#FFD200] border-[#2A2E39]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                          copiedLink ? "bg-white/20" : "bg-[#0D0F12] text-[#FFD200]"
                        )}>
                          {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-[#FFD200]" />}
                        </div>
                        <span className="font-extrabold text-xs">
                          {copiedLink ? UI_TRANSLATIONS[currentLang].linkCopied : `${UI_TRANSLATIONS[currentLang].shareSection} esta sección`}
                        </span>
                      </div>
                      <Copy className={cn("w-4 h-4 transition-opacity", copiedLink ? "text-white" : "text-[#8E959E]")} />
                    </button>
                  </div>
                </nav>
              </aside>
            </>
          )}

          {/* Content Area */}
          <section className={cn("lg:col-span-9", isAdmin && "lg:col-span-12")}>
            <AnimatePresence mode="wait">
              {!isAdmin ? (
                <motion.div
                  key={`${currentSection}-${currentLang}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.1,
                    ease: "linear"
                  }}
                  className="bg-[#1A1D24] rounded-2xl sm:rounded-[40px] p-2.5 sm:p-8 md:p-14 min-h-[500px] sm:min-h-[700px] relative overflow-hidden border border-[#2A2E39] shadow-2xl"
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#166534]/10 rounded-full blur-3xl -ml-32 -mb-32" />
                  
                  {/* Watermark Background */}
                  <div className="absolute top-[-50px] right-[-50px] opacity-[0.03] pointer-events-none text-[#FFD200]">
                    <span className="text-[400px] font-black italic select-none">FG</span>
                  </div>

                  {/* Document Header Brand Block */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 mb-4 sm:mb-8 border-b border-[#2A2E39] relative z-10">
                    <div className="flex items-center gap-3">
                      <FrutiGoLogo customUrl={customLogo} className="w-10 h-10 sm:w-14 sm:h-14" />
                      <div>
                        <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#FFD200] font-bold">
                          {UI_TRANSLATIONS[currentLang].officialDocTag}
                        </div>
                        <h2 className="text-base sm:text-lg font-black italic tracking-tighter text-[#FFD200]">
                          FRUTI GO
                        </h2>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="text-left sm:text-right flex flex-col font-mono text-[9px] sm:text-[10px] text-[#8E959E]">
                        <span>FOLIO: FG-LEG-{currentSection.toUpperCase()}</span>
                        <span>{UI_TRANSLATIONS[currentLang].statusLabel}</span>
                        <span>{UI_TRANSLATIONS[currentLang].lastUpdated}</span>
                      </div>
                      <button
                        onClick={handleShareSection}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition cursor-pointer active:scale-95 shadow-2xs",
                          copiedLink 
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" 
                            : "bg-[#0D0F12] text-[#F8FAFC] border-[#2A2E39] hover:bg-[#242933] hover:text-[#FFD200]"
                        )}
                        title="Copiar enlace directo de esta sección"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>{UI_TRANSLATIONS[currentLang].linkCopied}</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-zinc-700" />
                            <span>{UI_TRANSLATIONS[currentLang].shareSection}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {currentSection === "cuenta" ? (
                    <AccountDeletionForm lang={currentLang} />
                  ) : currentSection === "desarrollador" || currentSection === "nosotros" || currentSection === "fundador" ? (
                    <CorporateAboutUs />
                  ) : currentSection === "medios" ? (
                    <FundadorGaleriaPublica />
                  ) : (
                    <>
                      <div 
                        className="markdown-body prose prose-zinc prose-brand-yellow max-w-none relative z-10"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightBrandName(
                            currentLang === "es" 
                              ? ((policies as any)?.[currentSection] || DEFAULT_POLICIES_BY_LANG.es[currentSection as keyof Policies] || "")
                              : (DEFAULT_POLICIES_BY_LANG[currentLang][currentSection as keyof Policies] || "")
                          ) 
                        }}
                      />
                      {currentSection === "soporte" && (
                        <FaqSection className="mt-8" />
                      )}
                    </>
                  )}
                  
                  {currentSection !== "cuenta" && currentSection !== "desarrollador" && currentSection !== "medios" && currentSection !== "fundador" && policies?.[currentSection] === "" && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-300 space-y-4">
                      <FileText className="w-16 h-16 opacity-20" />
                      <p>Contenido no disponible</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border border-brand-yellow/30 p-8 shadow-xl"
                >
                  {/* Admin Board Header & Nav Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-zinc-200 gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-brand-green uppercase tracking-tight">Panel de Administración</h2>
                      <p className="text-sm text-zinc-500">Plataforma de Control Legal y de Privacidad de <StyledFrutiGo /></p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <button 
                        onClick={() => setAdminTab("edit")}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                          adminTab === "edit" ? "bg-brand-green text-brand-yellow" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        )}
                      >
                        Editar Políticas
                      </button>
                      <button 
                        onClick={() => {
                          setAdminTab("logo");
                        }}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                          adminTab === "logo" ? "bg-brand-green text-brand-yellow" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        )}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Gestión de Logo
                      </button>
                      <button 
                        onClick={() => {
                          setAdminTab("requests");
                          fetchDeletionRequests();
                        }}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative",
                          adminTab === "requests" ? "bg-brand-green text-brand-yellow" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                        )}
                      >
                        Solicitudes de Baja
                        {deletionRequests.filter(r => r.status === "Pendiente").length > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                            {deletionRequests.filter(r => r.status === "Pendiente").length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {adminTab === "edit" ? (
                    <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50 p-4 rounded-2xl border border-zinc-100 gap-4">
                        <span className="text-sm font-bold text-zinc-500">Modifica el texto legal de Fruti Go (se soporta HTML enriquecido)</span>
                        <div className="flex items-center gap-3">
                          {successMsg && (
                            <span className="text-green-600 flex items-center gap-1.5 text-xs font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
                            </span>
                          )}
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-brand-green text-brand-yellow px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-brand-black disabled:opacity-50"
                          >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar Cambios
                          </button>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {(Object.keys(SECTION_LABELS) as Section[]).filter(key => key !== "cuenta").map((key) => (
                          <div key={key} className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-2">
                              {SECTION_LABELS[key]} (HTML soportado)
                            </label>
                            <textarea
                              value={editData?.[key] || ""}
                              onChange={(e) => setEditData(prev => prev ? { ...prev, [key]: e.target.value } : null)}
                              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-6 h-64 focus:border-brand-green outline-none font-mono text-sm leading-relaxed text-zinc-800"
                              placeholder={`Introduce el HTML para ${SECTION_LABELS[key]}...`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : adminTab === "logo" ? (
                    <div className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50 p-6 rounded-3xl border border-zinc-100 gap-4">
                        <div>
                          <h3 className="text-lg font-black text-brand-green uppercase tracking-tight flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-brand-yellow" />
                            Gestión del Logo Institucional
                          </h3>
                          <p className="text-xs text-zinc-500 font-medium mt-1">
                            Sube una nueva imagen desde tu galería o archivos para actualizar la identidad visual de Fruti Go en toda la plataforma.
                          </p>
                        </div>

                        {logoSuccessMsg && (
                          <span className="text-green-600 flex items-center gap-1.5 text-xs font-bold bg-green-50 px-4 py-2 rounded-full border border-green-200">
                            <CheckCircle2 className="w-4 h-4" /> {logoSuccessMsg}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Current Active Logo */}
                        <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                            Logo Actual en Uso
                          </span>
                          <div className="p-6 bg-white rounded-3xl border border-zinc-200 shadow-md flex items-center justify-center">
                            <FrutiGoLogo customUrl={customLogo} className="w-28 h-28" />
                          </div>
                          <div className="space-y-1">
                            <span className={cn(
                              "inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                              customLogo ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-200 text-zinc-600"
                            )}>
                              {customLogo ? "Logo Personalizado Activo" : "Logo Vectorial por Defecto"}
                            </span>
                            <p className="text-[11px] text-zinc-400">
                              {customLogo ? "Imagen cargada dinámicamente desde galería." : "Diseño SVG vectorial por defecto."}
                            </p>
                          </div>

                          {customLogo && (
                            <button
                              onClick={handleResetLogo}
                              disabled={logoSaving}
                              className="mt-2 text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition border border-red-200 disabled:opacity-50"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Restablecer Logo por Defecto
                            </button>
                          )}
                        </div>

                        {/* Upload New Logo */}
                        <div className="p-6 bg-white border-2 border-dashed border-zinc-200 hover:border-brand-green/40 rounded-3xl flex flex-col items-center justify-center text-center gap-5 transition duration-200">
                          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                            Subir Nuevo Logo
                          </span>

                          {newLogoPreview ? (
                            <div className="space-y-4 w-full flex flex-col items-center">
                              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 shadow-inner flex items-center justify-center">
                                <img src={newLogoPreview} alt="Vista previa del nuevo logo" className="w-28 h-28 object-contain rounded-2xl shadow" />
                              </div>
                              <span className="text-xs text-zinc-500 font-bold">Vista previa de la imagen seleccionada</span>
                              <div className="flex gap-3 w-full justify-center">
                                <button
                                  onClick={handleSaveLogo}
                                  disabled={logoSaving}
                                  className="bg-brand-green text-brand-yellow px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:bg-brand-black shadow-lg shadow-brand-green/10 disabled:opacity-50 transition"
                                >
                                  {logoSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  Guardar y Aplicar Logo
                                </button>
                                <button
                                  onClick={() => setNewLogoPreview(null)}
                                  disabled={logoSaving}
                                  className="bg-zinc-100 text-zinc-600 px-4 py-3 rounded-2xl text-xs font-bold hover:bg-zinc-200 transition"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="cursor-pointer w-full flex flex-col items-center justify-center py-6 px-4 hover:bg-zinc-50 rounded-2xl transition group">
                              <div className="w-16 h-16 bg-brand-green/10 text-brand-green group-hover:bg-brand-green group-hover:text-brand-yellow rounded-2xl flex items-center justify-center transition-colors mb-3">
                                <Upload className="w-8 h-8" />
                              </div>
                              <span className="text-sm font-black text-brand-black group-hover:text-brand-green">
                                Seleccionar imagen desde mi galería
                              </span>
                              <span className="text-xs text-zinc-400 mt-1">
                                Formatos soportados: PNG, JPG, WEBP, SVG
                              </span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange} 
                                className="hidden" 
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                        <span className="text-sm font-bold text-zinc-500">Solicitudes de usuarios para darse de baja de la plataforma</span>
                        <button
                          onClick={fetchDeletionRequests}
                          disabled={requestsLoading}
                          className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {requestsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                          Actualizar Lista
                        </button>
                      </div>

                      {requestsLoading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-3">
                          <Loader2 className="w-10 h-10 animate-spin text-brand-green" />
                          <span className="text-sm font-medium">Cargando solicitudes...</span>
                        </div>
                      ) : deletionRequests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200 text-zinc-400 gap-3">
                          <UserX className="w-12 h-12 text-zinc-300" />
                          <span className="text-sm font-bold">No se encontraron solicitudes de eliminación.</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {deletionRequests.map((req) => (
                            <div key={req.id} className="p-6 bg-white border border-zinc-100 rounded-3xl shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row justify-between gap-6">
                              <div className="space-y-3 flex-1">
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <span className="text-base font-black text-brand-black">{req.name}</span>
                                  <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                    req.status === "Resuelta" 
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                      : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
                                  )}>
                                    {req.status}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 font-mono">
                                    {new Date(req.timestamp).toLocaleString("es-MX")}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-zinc-600">
                                  <div className="flex items-center gap-2">
                                    <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Correo:</span>
                                    <a href={`mailto:${req.email}`} className="text-zinc-700 underline">{req.email}</a>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Teléfono:</span>
                                    <a href={`tel:${req.phone}`} className="text-zinc-700 underline">{req.phone}</a>
                                  </div>
                                </div>

                                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 space-y-1">
                                  <div className="text-[10px] text-zinc-405 uppercase tracking-widest font-extrabold flex items-center gap-1">
                                    <span className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">Motivo:</span>
                                    <span className="text-zinc-700 font-bold">{req.reason}</span>
                                  </div>
                                  <p className="text-xs text-zinc-650 leading-relaxed font-semibold">
                                    "{req.comments}"
                                  </p>
                                </div>
                              </div>

                              <div className="flex md:flex-col justify-end gap-3 flex-shrink-0">
                                {req.status === "Pendiente" && (
                                  <button
                                    onClick={() => handleResolveRequest(req.id, "resolve")}
                                    className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase px-4 h-10 rounded-xl hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all flex items-center justify-center gap-1"
                                  >
                                    Resolver
                                  </button>
                                )}
                                <button
                                  onClick={() => handleResolveRequest(req.id, "delete")}
                                  className="bg-red-50 text-red-700 border border-red-200 text-xs font-black uppercase px-4 h-10 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-1"
                                >
                                  Borrar Registro
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </main>

      {/* Footer Responsivo y Optimizado para SEO */}
      <footer className="border-t border-zinc-200 py-10 mt-20 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 text-center md:text-left">
              <FrutiGoLogo customUrl={customLogo} className="w-14 h-14" />
              <div>
                <h3 className="text-xl font-black text-brand-green italic tracking-tighter mb-0.5">Fruti Go</h3>
                <p className="text-xs text-zinc-400">San Rafael 2790, Guadalajara, Jal. • México</p>
                <p className="text-[10px] text-zinc-400 mt-1 font-mono uppercase tracking-wider">© 2026 <StyledFrutiGo legal />. Todos los derechos reservados.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <GooglePlayBadge lang={currentLang} />
              <nav aria-label="Enlaces institucionales y legales" className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs font-bold text-zinc-500">
                <a 
                  href="/cliente" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setActiveView("tienda"); 
                    window.history.pushState(null, "", "/cliente"); 
                  }} 
                  className="hover:text-amber-700 transition-colors font-black text-amber-600 flex items-center gap-1"
                  title="Acceso a Tienda Mayorista y Clientes B2B"
                >
                  <span>💼 Tienda Mayorista</span>
                </a>
                <a 
                  href="/tienda" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setActiveView("tienda"); 
                    window.history.pushState(null, "", "/tienda"); 
                  }} 
                  className="hover:text-emerald-700 transition-colors font-black text-brand-green flex items-center gap-1"
                  title="Ir a la Tienda Online de Fruti Go"
                >
                  <span>Ir a la Tienda</span>
                </a>
                <a 
                  href="/nosotros" 
                  onClick={(e) => { e.preventDefault(); window.location.hash = "nosotros"; setCurrentSection("nosotros"); }} 
                  className="hover:text-emerald-700 transition-colors font-black text-brand-green"
                  title="Acerca de Nosotros e Infraestructura Tecnológica - FrutiGo Technologies"
                >
                  Acerca de Nosotros
                </a>
                <a 
                  href="/medios" 
                  onClick={(e) => { e.preventDefault(); window.location.hash = "medios"; setCurrentSection("medios"); }} 
                  className="hover:text-emerald-700 transition-colors text-zinc-700 font-semibold"
                  title="Galería y Medios Oficiales"
                >
                  Medios y Galería
                </a>
                <a 
                  href="/soporte" 
                  onClick={(e) => { e.preventDefault(); window.location.hash = "soporte"; setCurrentSection("soporte"); }} 
                  className="hover:text-emerald-700 transition-colors text-zinc-700 font-semibold"
                  title="Soporte y Contacto"
                >
                  Soporte
                </a>
                <a 
                  href="/terminos" 
                  onClick={(e) => { e.preventDefault(); window.location.hash = "terminos"; setCurrentSection("terminos"); }} 
                  className="hover:text-emerald-700 transition-colors text-zinc-700 font-semibold"
                  title="Términos y Condiciones de Uso"
                >
                  Términos y Cond.
                </a>
                <a 
                  href="/privacidad" 
                  onClick={(e) => { e.preventDefault(); window.location.hash = "privacidad"; setCurrentSection("privacidad"); }} 
                  className="hover:text-emerald-700 transition-colors text-zinc-700 font-semibold"
                  title="Aviso de Privacidad"
                >
                  Aviso de Privacidad
                </a>
                {isControlRoute && (
                  <button 
                    type="button"
                    onClick={() => setIsAdminPanelOpen(true)} 
                    className="text-left hover:text-emerald-700 transition-colors font-bold text-brand-green flex items-center gap-1 cursor-pointer"
                    title="Acceso al Panel de Control y Administración"
                  >
                    <span>⚙️ Panel Admin</span>
                  </button>
                )}
              </nav>
            </div>
          </div>

          {/* Barra de Redes Sociales y Enlaces Oficiales Compactos */}
          <SocialFooterLinks />
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogin(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="bg-white border border-zinc-200 p-10 rounded-[32px] w-full max-w-md relative shadow-2xl"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-yellow/30 shadow-lg shadow-brand-green/20">
                  <Lock className="text-brand-yellow w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-brand-green">Control de Acceso</h2>
                <p className="text-zinc-500">Introduce la contraseña de <StyledFrutiGo legal /></p>
              </div>
              
              <div className="space-y-4">
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (password === "fruti05") {
                        setIsAdmin(true);
                        setShowLogin(false);
                        fetchDeletionRequests();
                      } else {
                        alert("Contraseña Incorrecta");
                      }
                    }
                  }}
                  className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl p-4 text-center text-xl font-bold focus:border-brand-green outline-none transition-all placeholder:text-zinc-200"
                  placeholder="••••••"
                />
                <button
                  onClick={() => {
                    if (password === "fruti05") {
                      setIsAdmin(true);
                      setShowLogin(false);
                      fetchDeletionRequests();
                    } else {
                      alert("Contraseña Incorrecta");
                    }
                  }}
                  className="w-full bg-brand-green hover:bg-emerald-800 text-brand-yellow py-4 rounded-2xl font-black text-base transition-colors shadow-lg shadow-brand-green/20 border border-brand-yellow/30 cursor-pointer"
                >
                  ACCEDER AL PANEL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cookie Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed bottom-6 left-6 right-6 z-[90] bg-white border border-brand-green/20 shadow-2xl rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0 border border-brand-yellow/30 shadow-md">
                <ShieldCheck className="text-brand-yellow w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-brand-green">Cookies</h4>
                <p className="text-sm text-zinc-600">
                  {UI_TRANSLATIONS[currentLang].cookieMessage}{" "}
                  <button onClick={() => { window.location.hash = "privacidad"; setCurrentSection("privacidad"); setShowCookieBanner(false); }} className="text-brand-green font-bold hover:underline decoration-brand-yellow decoration-2 underline-offset-4">
                    {UI_TRANSLATIONS[currentLang].sections.privacidad}
                  </button>
                </p>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={acceptCookies}
                className="bg-brand-green hover:bg-emerald-800 text-brand-yellow border border-brand-yellow/30 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider w-full md:w-auto transition shadow-md shadow-brand-green/20 cursor-pointer"
              >
                {UI_TRANSLATIONS[currentLang].acceptCookies}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      {isAdminPanelOpen && (
        <AdminPanel
          currentBanner={topBanner}
          products={products}
          customLogo={customLogo}
          openpayConfig={openpayConfig}
          orders={orders}
          onSaveBanner={handleSaveBanner}
          onSaveProducts={handleSaveProducts}
          onSaveLogo={handleSaveLogoFromAdmin}
          onSaveOpenPay={handleSaveOpenPay}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onCloseAdmin={() => setIsAdminPanelOpen(false)}
        />
      )}

      {/* Floating Google Play App Install Banner for Mobile */}
      <MobileInstallFloatBanner />
    </div>
  );
}
