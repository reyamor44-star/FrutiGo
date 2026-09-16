import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Search, 
  ExternalLink, 
  Copy, 
  Check, 
  Save, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  AlertCircle,
  CheckCircle2,
  Phone
} from "lucide-react";
import { LandingPageContent } from "../types";
import { DEFAULT_LANDING_PAGES } from "../data/defaultLandingPages";

interface AdminLandingPagesProps {
  adminPassword: string;
}

export default function AdminLandingPages({ adminPassword }: AdminLandingPagesProps) {
  const [selectedPageId, setSelectedPageId] = useState<string>("taxis");
  const [pagesData, setPagesData] = useState<Record<string, LandingPageContent>>(DEFAULT_LANDING_PAGES);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load from API / local fallback on mount
  useEffect(() => {
    fetch("/api/admin/landing-pages")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("HTTP " + res.status);
      })
      .then((data) => {
        if (data && typeof data === "object" && Object.keys(data).length > 0) {
          setPagesData((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((err) => {
        console.log("Cargando páginas por defecto o desde localStorage:", err.message);
        try {
          const localSaved = localStorage.getItem("fg_landing_pages_content");
          if (localSaved) {
            setPagesData((prev) => ({ ...prev, ...JSON.parse(localSaved) }));
          }
        } catch (e) {}
      });
  }, []);

  const currentPage = pagesData[selectedPageId] || DEFAULT_LANDING_PAGES[selectedPageId] || DEFAULT_LANDING_PAGES.taxis;

  const handleFieldChange = (field: keyof LandingPageContent, value: string) => {
    setPagesData((prev) => ({
      ...prev,
      [selectedPageId]: {
        ...prev[selectedPageId],
        [field]: value
      }
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleResetToDefault = () => {
    if (window.confirm("¿Deseas restaurar los textos originales optimizados para esta página?")) {
      const defaultData = DEFAULT_LANDING_PAGES[selectedPageId];
      if (defaultData) {
        setPagesData((prev) => ({
          ...prev,
          [selectedPageId]: { ...defaultData }
        }));
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    setSaveError(null);

    // Save locally
    try {
      localStorage.setItem("fg_landing_pages_content", JSON.stringify(pagesData));
    } catch (e) {}

    try {
      const res = await fetch("/api/admin/landing-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: adminPassword || "1234",
          pages: pagesData
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSaveStatus("¡Textos guardados y publicados con éxito en " + currentPage.url + "!");
        setTimeout(() => setSaveStatus(null), 5000);
      } else {
        setSaveError(json.error || "No se pudo actualizar en el servidor, se guardó localmente.");
      }
    } catch (e: any) {
      setSaveStatus("Guardado localmente. La sincronización se aplicará al recargar.");
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const pageTabs = [
    { id: "taxis", name: "1. Taxis ZMG", icon: "🚖", url: "https://frutigo.com.mx/taxis" },
    { id: "ciudad-a-ciudad", name: "2. Ciudad a Ciudad", icon: "🚗", url: "https://frutigo.com.mx/ciudad-a-ciudad" },
    { id: "fletes-y-carga", name: "3. Fletes y Carga", icon: "📦", url: "https://frutigo.com.mx/fletes-y-carga" },
    { id: "taxi-pet", name: "4. Taxi Pet", icon: "🐾", url: "https://frutigo.com.mx/taxi-pet" }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Notice with the 4 Exact URLs */}
      <div className="bg-gradient-to-r from-emerald-900 via-zinc-900 to-zinc-900 border border-emerald-500/30 rounded-2xl p-5 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-bold mb-2">
              <Search className="w-3.5 h-3.5" />
              <span>Indexación Google Search Console & Editor de Textos</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              Las 4 URLs Oficiales para Indexar en Search Console
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-3xl">
              Copia cada una de estas 4 URLs para introducirlas en la herramienta de <strong>Inspección de URLs</strong> de Google Search Console y solicitar su indexación. Puedes editar los textos de cada una justo abajo para que las personas lean exactamente tu propuesta de valor al entrar desde Google.
            </p>
          </div>

          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Search Console</span>
          </a>
        </div>

        {/* 4 URLs Quick Copy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-zinc-700/60">
          {pageTabs.map((p) => {
            const isCopied = copiedUrl === p.url;
            return (
              <div 
                key={p.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  selectedPageId === p.id 
                    ? "bg-emerald-950/60 border-emerald-400/50 shadow-sm" 
                    : "bg-zinc-800/60 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.icon}</span>
                    <span className="text-xs font-bold text-zinc-200">{p.name}</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 truncate mt-0.5">
                    {p.url}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCopy(p.url)}
                    className="p-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-zinc-200 hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                    title="Copiar URL para Search Console"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400">Copiada</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copiar</span>
                      </>
                    )}
                  </button>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-zinc-200 hover:text-white transition-all"
                    title="Abrir página en vivo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Page Selector Tabs */}
      <div className="flex border-b border-zinc-200 bg-zinc-50 p-2 gap-2 overflow-x-auto rounded-2xl">
        {pageTabs.map((tab) => {
          const isActive = selectedPageId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedPageId(tab.id)}
              className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                isActive
                  ? "bg-brand-green text-white shadow-md scale-[1.01]"
                  : "bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Google SERP Snippet Preview */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-600">
              Vista previa en Google Search (Lo que el usuario lee en el buscador)
            </h4>
          </div>
          <span className="text-[11px] text-zinc-600 font-mono">
            {currentPage.url}
          </span>
        </div>

        <div className="bg-[#f8f9fa] border border-zinc-200 rounded-xl p-4 max-w-2xl font-sans">
          <div className="text-[12px] text-[#202124] flex items-center gap-1.5 mb-1">
            <span className="font-medium text-[#202124]">Fruti Go Driver</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-600 truncate">{currentPage.url}</span>
          </div>
          <div className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer font-medium line-clamp-1 leading-snug">
            {currentPage.title}
          </div>
          <div className="text-[13px] text-[#4d5156] mt-1 leading-relaxed line-clamp-2">
            {currentPage.metaDescription}
          </div>
        </div>
      </div>

      {/* Editor Forms */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
          <div>
            <h3 className="text-lg font-black text-zinc-900 flex items-center gap-2">
              <span>{currentPage.icon}</span>
              <span>Editando textos de: {currentPage.name}</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              URL pública: <code className="text-brand-green font-bold">{currentPage.url}</code>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all"
              title="Restaurar textos iniciales recomendados"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar recomendados</span>
            </button>

            <a
              href={currentPage.path}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver página</span>
            </a>
          </div>
        </div>

        {/* Notifications */}
        {saveStatus && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveStatus}</span>
          </div>
        )}

        {saveError && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* SECCIÓN 1: METADATOS GOOGLE SEARCH */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
            <Globe className="w-3.5 h-3.5" />
            <span>1. Textos para Google Search (SEO & Búsqueda)</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-zinc-700">
                Título SEO (&lt;title&gt;)
              </label>
              <span className={`text-[10px] font-mono ${currentPage.title.length > 60 ? "text-amber-600 font-bold" : "text-zinc-600"}`}>
                {currentPage.title.length} / 60 caracteres recomendados
              </span>
            </div>
            <input
              type="text"
              value={currentPage.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              placeholder="Ej. Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-zinc-700">
                Meta Descripción SEO (&lt;meta name="description"&gt;) — Lo que el usuario lee en el buscador
              </label>
              <span className={`text-[10px] font-mono ${currentPage.metaDescription.length > 160 ? "text-amber-600 font-bold" : "text-zinc-600"}`}>
                {currentPage.metaDescription.length} / 160 caracteres recomendados
              </span>
            </div>
            <textarea
              rows={2}
              value={currentPage.metaDescription}
              onChange={(e) => handleFieldChange("metaDescription", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
              placeholder="Resumen atractivo que convence al usuario a hacer clic en tu resultado de búsqueda..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Palabras Clave (&lt;meta name="keywords"&gt;)
            </label>
            <input
              type="text"
              value={currentPage.keywords}
              onChange={(e) => handleFieldChange("keywords", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-green"
              placeholder="Separadas por comas"
            />
          </div>
        </div>

        {/* SECCIÓN 2: TEXTO PRINCIPAL QUE LEE LA GENTE AL ENTRAR */}
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
            <FileText className="w-3.5 h-3.5" />
            <span>2. Textos Visibles en la Página Web (Lo que lee la gente al dar clic)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Cintillo Superior de Anuncio (Top Bar)
              </label>
              <input
                type="text"
                value={currentPage.topBarText}
                onChange={(e) => handleFieldChange("topBarText", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Insignia / Badge sobre el Título H1
              </label>
              <input
                type="text"
                value={currentPage.badgeText}
                onChange={(e) => handleFieldChange("badgeText", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Título Principal H1 (Prefijo)
              </label>
              <input
                type="text"
                value={currentPage.heroH1Prefix}
                onChange={(e) => handleFieldChange("heroH1Prefix", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Texto Resaltado en H1 (Color Amarillo)
              </label>
              <input
                type="text"
                value={currentPage.heroH1Highlight}
                onChange={(e) => handleFieldChange("heroH1Highlight", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green text-amber-600 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              📝 Párrafo Principal Descriptivo (Lo que la gente lee inmediatamente al entrar)
            </label>
            <textarea
              rows={4}
              value={currentPage.heroDesc}
              onChange={(e) => handleFieldChange("heroDesc", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green leading-relaxed"
              placeholder="Explica detalladamente las ventajas, cómo funciona, y por qué el conductor debe afiliarse..."
            />
          </div>

          {/* 4 Beneficios en viñetas */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-2">
              4 Puntos Clave de Beneficio (Viñetas con Palomita Verde/Amarilla)
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={currentPage.benefit1}
                onChange={(e) => handleFieldChange("benefit1", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-green"
                placeholder="Beneficio 1"
              />
              <input
                type="text"
                value={currentPage.benefit2}
                onChange={(e) => handleFieldChange("benefit2", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-green"
                placeholder="Beneficio 2"
              />
              <input
                type="text"
                value={currentPage.benefit3}
                onChange={(e) => handleFieldChange("benefit3", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-green"
                placeholder="Beneficio 3"
              />
              <input
                type="text"
                value={currentPage.benefit4}
                onChange={(e) => handleFieldChange("benefit4", e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-green"
                placeholder="Beneficio 4"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: LLAMADO A LA ACCIÓN & WHATSAPP */}
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg w-fit">
            <Phone className="w-3.5 h-3.5" />
            <span>3. Contacto por WhatsApp & Tarjeta Lateral</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Teléfono de WhatsApp de Atención
              </label>
              <input
                type="text"
                value={currentPage.whatsappPhone}
                onChange={(e) => handleFieldChange("whatsappPhone", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Mensaje de WhatsApp Preconfigurado al Dar Clic
              </label>
              <input
                type="text"
                value={currentPage.whatsappPretext}
                onChange={(e) => handleFieldChange("whatsappPretext", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Título de la Tarjeta Lateral
              </label>
              <input
                type="text"
                value={currentPage.cardTitle}
                onChange={(e) => handleFieldChange("cardTitle", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Cifra / Estadística Destacada (Ej. 0% o +$1,200)
              </label>
              <input
                type="text"
                value={currentPage.cardStatNumber}
                onChange={(e) => handleFieldChange("cardStatNumber", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-black text-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Título del Banner Final (Cierre de Página)
              </label>
              <input
                type="text"
                value={currentPage.ctaBannerTitle}
                onChange={(e) => handleFieldChange("ctaBannerTitle", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                Subtítulo del Banner Final
              </label>
              <input
                type="text"
                value={currentPage.ctaBannerDesc}
                onChange={(e) => handleFieldChange("ctaBannerDesc", e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: PREGUNTAS FRECUENTES (FAQ) */}
        <div className="space-y-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg w-fit">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>4. Preguntas Frecuentes (FAQ para Resolver Dudas Rápidamente)</span>
          </div>

          <div className="space-y-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Pregunta 1</label>
              <input
                type="text"
                value={currentPage.faq1Question}
                onChange={(e) => handleFieldChange("faq1Question", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold mb-1"
              />
              <textarea
                rows={2}
                value={currentPage.faq1Answer}
                onChange={(e) => handleFieldChange("faq1Answer", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 border-t border-zinc-200">
              <label className="block text-xs font-bold text-zinc-700 mb-1">Pregunta 2</label>
              <input
                type="text"
                value={currentPage.faq2Question}
                onChange={(e) => handleFieldChange("faq2Question", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold mb-1"
              />
              <textarea
                rows={2}
                value={currentPage.faq2Answer}
                onChange={(e) => handleFieldChange("faq2Answer", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
              />
            </div>

            <div className="pt-2 border-t border-zinc-200">
              <label className="block text-xs font-bold text-zinc-700 mb-1">Pregunta 3</label>
              <input
                type="text"
                value={currentPage.faq3Question}
                onChange={(e) => handleFieldChange("faq3Question", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold mb-1"
              />
              <textarea
                rows={2}
                value={currentPage.faq3Answer}
                onChange={(e) => handleFieldChange("faq3Answer", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action Button */}
        <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            Al guardar, los cambios se aplican automáticamente en la página web pública y en las etiquetas de Google.
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-green hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Guardando y Publicando..." : "Guardar y Publicar en Web"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
