import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Calendar, 
  UserCheck, 
  Tag, 
  Sparkles, 
  Maximize2, 
  X, 
  Share2, 
  Check, 
  FileText,
  Copy,
  MessageCircle,
  ExternalLink,
  Send,
  Bookmark,
  Link as LinkIcon,
  Download
} from "lucide-react";
import { sortArticlesNewestFirst } from "../utils/articleUtils";
import ExpandableImage from "./ExpandableImage";

export interface ArticleImage {
  url: string;
  caption?: string;
}

export interface FounderArticle {
  id: string;
  title: string;
  date: string;
  category?: string;
  summary?: string;
  content: string;
  images?: ArticleImage[];
  authorName?: string;
  signedBy?: string;
  createdAt?: number;
}

interface FundadorArticulosPublicosProps {
  className?: string;
  autoFocusLatest?: boolean;
}

export default function FundadorArticulosPublicos({ 
  className = "",
  autoFocusLatest = false 
}: FundadorArticulosPublicosProps) {
  const [articles, setArticles] = useState<FounderArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [activeShareModal, setActiveShareModal] = useState<FounderArticle | null>(null);
  const [copiedSectionLink, setCopiedSectionLink] = useState(false);

  const handleCopySectionLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://frutigo.com.mx/articulos");
      setCopiedSectionLink(true);
      setTimeout(() => setCopiedSectionLink(false), 3000);
    }
  };

  const loadArticles = async () => {
    try {
      let serverArticles: FounderArticle[] = [];

      // 1. Fetch directly from public REST API endpoint
      try {
        const res = await fetch("/api/founder/articles");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            serverArticles = data;
          }
        }
      } catch (e) {}

      // 2. Secondary fallback: fetch entire profile API if empty
      if (serverArticles.length === 0) {
        try {
          const profRes = await fetch("/api/founder/profile");
          if (profRes.ok) {
            const data = await profRes.json();
            if (Array.isArray(data.articles)) {
              serverArticles = data.articles;
            }
          }
        } catch (e) {}
      }

      // 3. Read local cache
      let localArticles: FounderArticle[] = [];
      let parsedProfile: any = {};
      if (typeof window !== "undefined") {
        try {
          const local = localStorage.getItem("fg_founder_profile");
          if (local) {
            parsedProfile = JSON.parse(local);
            if (Array.isArray(parsedProfile.articles)) {
              localArticles = parsedProfile.articles;
            }
          }
        } catch (e) {}
      }

      // 4. Smart Merge: combine localArticles and serverArticles (server takes precedence)
      const articleMap = new Map<string, FounderArticle>();
      // First populate with local cache articles
      localArticles.forEach((art) => {
        if (art && art.id) articleMap.set(art.id, art);
      });
      // Then overwrite with fresh server articles so server updates always win
      const missingOnServer: FounderArticle[] = [];
      serverArticles.forEach((art) => {
        if (art && art.id) {
          articleMap.set(art.id, art);
        }
      });

      // Find any local articles that aren't on server yet and sync them up
      localArticles.forEach((art) => {
        if (art && art.id && !serverArticles.some((s) => s.id === art.id)) {
          missingOnServer.push(art);
        }
      });

      const mergedArticles = sortArticlesNewestFirst(Array.from(articleMap.values()));

      if (mergedArticles.length > 0) {
        setArticles(mergedArticles);
        if (typeof window !== "undefined") {
          try {
            parsedProfile.articles = mergedArticles;
            localStorage.setItem("fg_founder_profile", JSON.stringify(parsedProfile));
          } catch (e) {}
        }
      }

      // 5. Auto-resync to server if local articles were missing on server (container reboot recovery)
      if (missingOnServer.length > 0) {
        missingOnServer.forEach((art) => {
          fetch("/api/founder/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(art)
          }).catch(() => {});
        });
      }
    } catch (err) {
      console.error("Error al cargar artículos del fundador:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();

    const handleUpdate = () => {
      loadArticles();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("fg_founder_profile_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("fg_founder_profile_updated", handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      }
    };
  }, []);

  // Deep Link Auto-Scroll & Highlighting
  useEffect(() => {
    if (loading || articles.length === 0) return;

    const handleDeepLink = () => {
      if (typeof window === "undefined") return;

      const rawHash = window.location.hash.replace(/^#/, "");
      const searchParams = new URLSearchParams(window.location.search);
      const queryArt = searchParams.get("articulo") || searchParams.get("art") || searchParams.get("id");
      const path = window.location.pathname;

      let targetId: string | null = null;

      if (rawHash.startsWith("articulo-")) {
        targetId = rawHash.replace("articulo-", "");
      } else if (rawHash.startsWith("art-")) {
        targetId = rawHash;
      } else if (rawHash === "latest" || rawHash === "ultimo" || rawHash === "reciente") {
        targetId = "latest";
      } else if (queryArt) {
        targetId = queryArt;
      } else if (path.includes("/articulo/")) {
        targetId = path.split("/articulo/")[1]?.replace(/\/$/, "");
      } else if (
        autoFocusLatest || 
        path === "/articulos" || 
        path.endsWith("/articulos") || 
        searchParams.get("art") === "latest" ||
        searchParams.get("articulo") === "latest" ||
        searchParams.get("ultimo") === "true"
      ) {
        targetId = "latest";
      }

      // If targeting latest article, resolve to articles[0]
      if (targetId === "latest" || targetId === "ultimo" || targetId === "reciente") {
        const newest = articles[0];
        if (newest && newest.id) {
          targetId = newest.id;
        }
      }

      if (targetId) {
        const found = articles.find(
          (a) => String(a.id) === String(targetId) || `art-${a.id}` === targetId
        );
        if (found) {
          if (activeCategory !== "todos" && found.category && found.category !== activeCategory) {
            setActiveCategory("todos");
          }
          setHighlightedId(found.id);

          setTimeout(() => {
            const el = document.getElementById(`articulo-${found.id}`) || document.getElementById(found.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 350);

          setTimeout(() => {
            setHighlightedId((prev) => (prev === found.id ? null : prev));
          }, 8000);
          return;
        }
      }

      // If generic #articulos anchor
      if (
        rawHash === "articulos" || 
        rawHash === "seccion-articulos" || 
        rawHash === "publicaciones" ||
        path.endsWith("/articulos") || 
        searchParams.get("seccion") === "articulos"
      ) {
        setTimeout(() => {
          const el = document.getElementById("articulos") || document.getElementById("seccion-articulos");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 300);
      }
    };

    handleDeepLink();
    window.addEventListener("hashchange", handleDeepLink);
    window.addEventListener("popstate", handleDeepLink);

    return () => {
      window.removeEventListener("hashchange", handleDeepLink);
      window.removeEventListener("popstate", handleDeepLink);
    };
  }, [loading, articles, activeCategory]);

  const getArticleCanonicalUrl = (article: FounderArticle) => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const base = (hostname.includes("frutigo.com.mx") || hostname.includes("frutgo.com.mx"))
        ? "https://frutigo.com.mx"
        : window.location.origin;
      return `${base}/articulos#articulo-${article.id}`;
    }
    return `https://frutigo.com.mx/articulos#articulo-${article.id}`;
  };

  const handleCopyLink = async (article: FounderArticle) => {
    const url = getArticleCanonicalUrl(article);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 3500);
    } catch (e) {
      console.error("Error al copiar enlace:", e);
    }
  };

  const handleShare = async (article: FounderArticle) => {
    const url = getArticleCanonicalUrl(article);
    const title = article.title;
    const summary = article.summary || article.content.substring(0, 140);
    const text = `Lee "${title}" por FrutiGo Technologies — Dirección de Arquitectura e Infraestructura (frutigo.com.mx):\n\n${summary}`;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
        setCopiedId(article.id);
        setTimeout(() => setCopiedId(null), 3000);
        return;
      } catch (err) {
        // Fallback to copy link
      }
    }

    // Default copy
    await handleCopyLink(article);
  };

  const getWhatsAppShareUrl = (article: FounderArticle) => {
    const url = getArticleCanonicalUrl(article);
    const text = `*${article.title}*\n_Publicado por: FrutiGo Technologies_\n\n${article.summary ? article.summary + "\n\n" : ""}👉 *Lee el artículo completo aquí:*\n${url}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  const getFacebookShareUrl = (article: FounderArticle) => {
    const url = getArticleCanonicalUrl(article);
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  };

  const getTwitterShareUrl = (article: FounderArticle) => {
    const url = getArticleCanonicalUrl(article);
    const text = `Lee "${article.title}" en @FrutiGo:`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  };

  // Sort all articles newest first
  const sortedArticles = sortArticlesNewestFirst(articles);

  // Get categories
  const categories = Array.from(
    new Set(sortedArticles.map((a) => a.category).filter(Boolean))
  ) as string[];

  const filteredArticles = activeCategory === "todos" 
    ? sortedArticles 
    : sortedArticles.filter((a) => a.category === activeCategory);

  if (loading && articles.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-zinc-700 mb-2" />
        <p className="text-xs font-bold">Cargando artículos y publicaciones técnicas de ingeniería...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="articulos" className={`space-y-8 relative z-10 scroll-mt-24 ${className}`}>
      <div id="seccion-articulos" />
      {/* Header Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-8 border border-zinc-200 shadow-xs sm:shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-zinc-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-zinc-100 text-zinc-900 text-[10px] sm:text-xs font-black uppercase tracking-wider border border-zinc-200">
                <BookOpen className="w-3.5 h-3.5 text-zinc-700" />
                Publicaciones & Artículos Técnicos
              </div>
              <button
                type="button"
                onClick={handleCopySectionLink}
                title="Copiar enlace directo https://frutigo.com.mx/articulos para indexar en Search Console o compartir"
                className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all border cursor-pointer ${
                  copiedSectionLink
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                    : "bg-zinc-100 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200 border-zinc-200"
                }`}
              >
                {copiedSectionLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                    <span>frutigo.com.mx/articulos</span>
                  </>
                )}
              </button>
            </div>
            <h2 className="text-xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Artículos y Publicaciones Técnicas / <span className="text-zinc-600">FrutiGo Technologies</span>
            </h2>
            <p className="text-zinc-700 text-xs sm:text-base font-medium mt-1.5 sm:mt-2 max-w-3xl leading-relaxed">
              Lecturas y publicaciones oficiales sobre arquitectura de sistemas de alta disponibilidad, logística B2B, seguridad transaccional e infraestructura desarrollada por la Dirección de Tecnología de <strong className="text-zinc-900">FrutiGo Technologies & FrutiGo Logistics</strong>.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 bg-emerald-50/60 p-1.5 rounded-2xl border border-brand-green/20 self-start md:self-auto shrink-0 overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveCategory("todos")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === "todos"
                    ? "bg-brand-green text-brand-yellow shadow-xs border border-brand-yellow/30"
                    : "text-zinc-700 hover:text-brand-green hover:bg-emerald-100/60"
                }`}
              >
                Todos ({articles.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                    activeCategory === cat
                      ? "bg-brand-green text-brand-yellow shadow-xs border border-brand-yellow/30"
                      : "text-zinc-700 hover:text-brand-green hover:bg-emerald-100/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Articles List */}
        <div className="space-y-6 sm:space-y-10">
          {filteredArticles.map((article, index) => {
            const validImages = Array.isArray(article.images)
              ? article.images.filter((img) => Boolean(img && img.url))
              : [];
            const isHighlighted = highlightedId === article.id;
            const canonicalUrl = getArticleCanonicalUrl(article);

            return (
              <article
                key={article.id || index}
                id={`articulo-${article.id}`}
                className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 border transition-all duration-500 space-y-4 sm:space-y-6 relative overflow-hidden group scroll-mt-28 ${
                  isHighlighted
                    ? "bg-white border-brand-green ring-2 ring-brand-green/20 shadow-xl"
                    : "bg-emerald-50/20 hover:bg-white border-brand-green/15 shadow-2xs sm:shadow-sm"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {/* Latest badge if index 0 */}
                  {index === 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-zinc-900 rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-amber-500/40">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
                      Último Artículo Publicado
                    </div>
                  )}

                  {/* Highlight Badge if navigated via deep link */}
                  {isHighlighted && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green text-brand-yellow rounded-full text-xs font-black uppercase tracking-wider shadow-sm border border-brand-yellow/30">
                      <Bookmark className="w-3.5 h-3.5 text-brand-yellow" />
                      Artículo Seleccionado
                    </div>
                  )}
                </div>

                {/* Taxi Driver 0% Commission Registration Banner for Article */}
                {(article.id === "art-1788985997905" || article.title.toLowerCase().includes("comisión") || article.title.toLowerCase().includes("libertad") || article.title.toLowerCase().includes("conductor")) && (
                  <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 via-brand-green to-emerald-900 rounded-2xl text-white shadow-md border border-brand-yellow/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-brand-yellow text-brand-black text-[10px] font-black uppercase tracking-wider">
                          0% Comisión en Guadalajara
                        </span>
                        <span className="text-xs text-emerald-200 font-bold">Fruti Go Driver</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-white">
                        ¿Eres taxista o conductor independiente en la ZMG?
                      </h4>
                      <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                        Regístrate hoy mismo, aprovecha 2 meses sin comisión, cobra el 100% de tus viajes en efectivo al instante y negocia tu tarifa directamente con el pasajero.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <a
                        href="/registrofrutigo"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/registrofrutigo");
                          window.dispatchEvent(new PopStateEvent("popstate"));
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-yellow hover:bg-yellow-400 text-brand-black font-black text-xs shadow-md transition-transform active:scale-95 cursor-pointer border border-brand-yellow/50"
                      >
                        <span>Registrarme con 0% Comisión</span>
                        <ExternalLink className="w-3.5 h-3.5 text-brand-black" />
                      </a>

                      <a
                        href="https://play.google.com/store/apps/details?id=com.frutigo.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-brand-yellow" />
                        <span>Google Play</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Article Header Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs border-b border-zinc-200 pb-3 sm:pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {article.category && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-50 text-brand-green font-bold uppercase text-[10px] tracking-wider border border-brand-green/20">
                        <Tag className="w-3 h-3 text-brand-green" />
                        {article.category}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-zinc-500 font-bold text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {article.date || "2026"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center gap-1.5 text-zinc-800 font-bold text-[10px] sm:text-[11px] bg-white px-2.5 py-1 rounded-full border border-zinc-200 shadow-2xs">
                      <UserCheck className="w-3.5 h-3.5 text-brand-green" />
                      Autor: {article.authorName || "FrutiGo Technologies"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-brand-green font-bold text-[10px] sm:text-[11px] bg-emerald-50 px-2.5 py-1 rounded-full border border-brand-green/20 shadow-2xs">
                      <FileText className="w-3.5 h-3.5 text-brand-green" />
                      Firmado por: {article.signedBy || article.authorName || "FrutiGo Technologies"}
                    </span>

                    {/* Quick Share Header Button */}
                    <button
                      type="button"
                      onClick={() => handleShare(article)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-brand-green text-zinc-800 hover:text-brand-yellow border border-zinc-300 hover:border-brand-green transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 ml-auto"
                      title="Compartir este artículo"
                    >
                      {copiedId === article.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-brand-green group-hover:text-brand-yellow" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-brand-green" />
                          <span>Compartir</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-lg sm:text-3xl font-black text-brand-green tracking-tight leading-snug">
                  {article.title}
                </h3>

                {/* Article Summary Box */}
                {article.summary && (
                  <div className="p-3 sm:p-5 bg-emerald-50/50 rounded-xl sm:rounded-2xl border-l-4 border-brand-green border-t border-r border-b border-brand-green/20 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-green block">
                      Síntesis Ejecutiva
                    </span>
                    <p className="text-xs sm:text-base text-zinc-800 font-medium italic leading-relaxed break-words">
                      "{article.summary}"
                    </p>
                  </div>
                )}

                {/* Article Content Body - Perfectly legible typography */}
                <div className="text-xs sm:text-lg text-zinc-800 font-sans leading-relaxed sm:leading-loose space-y-3 sm:space-y-4 pt-1 sm:pt-2 break-words">
                  {article.content.split("\n\n").map((p, pIdx) => (
                    <p key={pIdx} className="whitespace-pre-line">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Embedded Article Images Gallery (Up to 3 Images) */}
                {validImages.length > 0 && (
                  <div className="pt-4 border-t border-zinc-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-yellow" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-brand-green">
                        Imágenes Ilustrativas de la Publicación ({validImages.length} de 3)
                      </h4>
                    </div>

                    <div
                      className={`grid gap-4 ${
                        validImages.length === 1
                          ? "grid-cols-1"
                          : validImages.length === 2
                          ? "grid-cols-1 md:grid-cols-2"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {validImages.slice(0, 3).map((img, imgIdx) => (
                        <div
                          key={imgIdx}
                          className="group/img relative rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-xs hover:shadow-md transition duration-300 p-2.5 flex flex-col items-center justify-center space-y-2"
                        >
                          <div className="w-full h-auto min-h-[140px] flex items-center justify-center relative overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 p-1.5">
                            <ExpandableImage
                              src={img.url}
                              alt={img.caption || `Imagen ${imgIdx + 1} de ${article.title}`}
                              caption={img.caption || article.title}
                              title="Toca para expandir imagen aquí mismo"
                              className="w-auto max-w-full h-auto max-h-[580px] object-contain rounded-lg"
                              loading="lazy"
                            />
                          </div>
                          {img.caption && (
                            <div className="p-2 w-full text-center bg-white">
                              <p className="text-xs text-zinc-700 font-semibold leading-relaxed">
                                {img.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer de Firma y Autoría Oficial */}
                <div className="pt-4 border-t border-brand-green/20 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/40 p-4 rounded-2xl border border-brand-green/15">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-green text-brand-yellow flex items-center justify-center font-black shadow-xs shrink-0 text-sm border border-brand-yellow/30">
                      ✍️
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-green block">
                        Firma Digital & Autoría
                      </span>
                      <p className="text-xs font-black text-brand-green">
                        Autor: <span className="text-zinc-800 font-bold">{article.authorName || "FrutiGo Technologies"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brand-green/20 text-brand-green rounded-xl font-bold text-xs shadow-2xs">
                    <UserCheck className="w-3.5 h-3.5 text-brand-green" />
                    <span>Firmado por:</span>
                    <strong className="text-zinc-950 font-black">{article.signedBy || article.authorName || "FrutiGo Technologies"}</strong>
                  </div>
                </div>

                {/* Dedicated Article Sharing Action Bar */}
                <div className="bg-emerald-50/40 rounded-2xl p-3 sm:p-4 border border-brand-green/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-brand-green flex items-center justify-center font-black shrink-0 text-xs border border-brand-green/20">
                      <Share2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black text-brand-green block leading-tight">
                        Compartir este artículo directamente:
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono select-all truncate block max-w-xs sm:max-w-md">
                        {canonicalUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto shrink-0">
                    {/* Copy URL Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(article)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-2xs active:scale-95 ${
                        copiedId === article.id
                          ? "bg-brand-green text-brand-yellow border border-brand-yellow/30"
                          : "bg-white text-brand-green hover:bg-emerald-50 border border-brand-green/30"
                      }`}
                    >
                      {copiedId === article.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-brand-yellow" />
                          <span>¡Enlace Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-brand-green" />
                          <span>Copiar Enlace</span>
                        </>
                      )}
                    </button>

                    {/* WhatsApp Direct Share Button */}
                    <a
                      href={getWhatsAppShareUrl(article)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-brand-green hover:bg-emerald-800 text-brand-yellow border border-brand-yellow/30 transition shadow-2xs active:scale-95"
                      title="Compartir por WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </a>

                    {/* More Share Options / Native Share */}
                    <button
                      type="button"
                      onClick={() => setActiveShareModal(article)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition cursor-pointer active:scale-95 border border-zinc-200"
                      title="Más opciones de compartir"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Más</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Share Modal Dialog */}
      {activeShareModal && (
        <div 
          onClick={() => setActiveShareModal(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs p-4 flex items-center justify-center animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">Compartir Artículo</h3>
                  <p className="text-xs text-zinc-500">Enlace directo e indexable de Fruti Go</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveShareModal(null)}
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Título</span>
              <p className="text-sm font-black text-zinc-900 line-clamp-2">{activeShareModal.title}</p>
              <p className="text-xs text-zinc-600 font-medium">FrutiGo Technologies — Dirección de Infraestructura y Sistemas</p>
            </div>

            {/* Direct URL Box */}
            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-700">Enlace directo a esta sección del artículo:</label>
              <div className="flex items-center gap-2 p-2 bg-emerald-50/50 rounded-xl border border-brand-green/20">
                <input 
                  type="text" 
                  readOnly 
                  value={getArticleCanonicalUrl(activeShareModal)}
                  className="bg-transparent border-0 text-xs font-mono text-zinc-700 w-full focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(activeShareModal)}
                  className="px-3.5 py-1.5 bg-brand-green hover:bg-emerald-800 text-brand-yellow rounded-lg text-xs font-black shrink-0 transition border border-brand-yellow/30 cursor-pointer"
                >
                  {copiedId === activeShareModal.id ? "¡Copiado!" : "Copiar"}
                </button>
              </div>
            </div>

            {/* Social Share Buttons Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <a
                href={getWhatsAppShareUrl(activeShareModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 transition text-center space-y-1.5"
              >
                <MessageCircle className="w-5 h-5 text-zinc-700 fill-current" />
                <span className="text-xs font-bold">WhatsApp</span>
              </a>

              <a
                href={getFacebookShareUrl(activeShareModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 transition text-center space-y-1.5"
              >
                <Send className="w-5 h-5 text-zinc-700" />
                <span className="text-xs font-bold">Facebook</span>
              </a>

              <a
                href={getTwitterShareUrl(activeShareModal)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 transition text-center space-y-1.5"
              >
                <ExternalLink className="w-5 h-5 text-zinc-700" />
                <span className="text-xs font-bold">X (Twitter)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
