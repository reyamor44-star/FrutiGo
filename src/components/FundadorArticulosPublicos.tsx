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
  ChevronRight,
  ArrowRight
} from "lucide-react";

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
}

export default function FundadorArticulosPublicos({ className = "" }: FundadorArticulosPublicosProps) {
  const [articles, setArticles] = useState<FounderArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; caption?: string; title?: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("todos");

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

      const mergedArticles = Array.from(articleMap.values());

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

  const handleShare = (article: FounderArticle) => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/sobre-el-desarrollador#articulo-${article.id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 3000);
    }
  };

  // Get categories
  const categories = Array.from(
    new Set(articles.map((a) => a.category).filter(Boolean))
  ) as string[];

  const filteredArticles = activeCategory === "todos" 
    ? articles 
    : articles.filter((a) => a.category === activeCategory);

  if (loading && articles.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
        <p className="text-xs font-bold">Cargando artículos y publicaciones del desarrollador...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-8 relative z-10 ${className}`}>
      {/* Header Section */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-2.5 sm:p-8 border border-zinc-200/80 shadow-xs sm:shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-zinc-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-100 text-emerald-950 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2 sm:mb-3">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              Publicaciones & Artículos Técnicos
            </div>
            <h2 className="text-xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Artículos y Ensayos / <span className="text-emerald-700">Alberto Reyes Sandoval</span>
            </h2>
            <p className="text-zinc-700 text-xs sm:text-base font-medium mt-1.5 sm:mt-2 max-w-3xl leading-relaxed">
              Lecturas oficiales sobre la arquitectura de software, innovación en logística B2B, seguridad de datos y la visión tecnológica que impulsa la plataforma de <strong className="text-zinc-900">Fruti Go</strong>.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 self-start md:self-auto shrink-0 overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveCategory("todos")}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeCategory === "todos"
                    ? "bg-brand-green text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
                }`}
              >
                Todos ({articles.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-brand-green text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
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

            return (
              <article
                key={article.id || index}
                id={`articulo-${article.id}`}
                className="bg-zinc-50/80 hover:bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-8 border border-zinc-200/90 shadow-2xs sm:shadow-sm transition-all duration-300 space-y-4 sm:space-y-6 relative overflow-hidden group"
              >
                {/* Article Header Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs border-b border-zinc-200/70 pb-3 sm:pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {article.category && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-black uppercase text-[10px] tracking-wider border border-emerald-300/60">
                        <Tag className="w-3 h-3 text-emerald-700" />
                        {article.category}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-zinc-500 font-bold text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {article.date || "2026"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center gap-1.5 text-zinc-800 font-extrabold text-[10px] sm:text-[11px] bg-white px-2.5 py-1 rounded-full border border-zinc-200 shadow-2xs">
                      <UserCheck className="w-3.5 h-3.5 text-brand-green" />
                      Autor: {article.authorName || "Alberto Reyes Sandoval"}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-emerald-900 font-extrabold text-[10px] sm:text-[11px] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      Firmado por: {article.signedBy || article.authorName || "Alberto Reyes Sandoval"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleShare(article)}
                      className="p-1.5 text-zinc-500 hover:text-brand-green hover:bg-emerald-50 rounded-lg transition ml-auto"
                      title="Copiar enlace del artículo"
                    >
                      {copiedId === article.id ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                          <Check className="w-3.5 h-3.5" /> ¡Copiado!
                        </span>
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Article Title */}
                <h3 className="text-lg sm:text-3xl font-black text-zinc-900 tracking-tight leading-snug">
                  {article.title}
                </h3>

                {/* Article Summary Box */}
                {article.summary && (
                  <div className="p-3 sm:p-5 bg-emerald-50/90 rounded-xl sm:rounded-2xl border-l-4 border-brand-green border-t border-r border-b border-emerald-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900 block">
                      Síntesis Ejecutiva
                    </span>
                    <p className="text-xs sm:text-base text-zinc-900 font-semibold sm:font-medium italic leading-relaxed break-words">
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
                  <div className="pt-4 border-t border-zinc-200/80 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
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
                          onClick={() => setSelectedImage({ url: img.url, caption: img.caption, title: article.title })}
                          className="group/img relative rounded-2xl overflow-hidden border border-zinc-200/90 bg-white cursor-pointer shadow-xs hover:shadow-md transition duration-300 p-2.5 flex flex-col items-center justify-center space-y-2"
                        >
                          <div className="w-full h-auto min-h-[140px] flex items-center justify-center relative overflow-hidden rounded-xl bg-zinc-50 border border-zinc-100 p-1.5">
                            <img
                              src={img.url}
                              alt={img.caption || `Imagen ${imgIdx + 1} de ${article.title}`}
                              className="w-auto max-w-full h-auto max-h-[580px] object-contain group-hover/img:scale-[1.02] transition duration-300 rounded-lg"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover/img:bg-black/0 transition rounded-xl pointer-events-none" />
                            <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 text-white backdrop-blur-xs opacity-0 group-hover/img:opacity-100 transition">
                              <Maximize2 className="w-3.5 h-3.5" />
                            </div>
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
                <div className="pt-4 border-t border-zinc-200/80 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-green text-white flex items-center justify-center font-black shadow-xs shrink-0 text-sm">
                      ✍️
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950 block">
                        Firma Digital & Autoría
                      </span>
                      <p className="text-xs font-black text-zinc-900">
                        Autor: <span className="text-brand-green font-extrabold">{article.authorName || "Alberto Reyes Sandoval"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-950 rounded-xl font-extrabold text-xs shadow-2xs">
                    <UserCheck className="w-3.5 h-3.5 text-brand-green" />
                    <span>Firmado por:</span>
                    <strong className="text-brand-green font-black">{article.signedBy || article.authorName || "Alberto Reyes Sandoval"}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Image Lightbox Modal without excess black frame */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl p-2 sm:p-4 flex flex-col items-center justify-center animate-fadeIn"
        >
          {/* Floating Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 shadow-2xl transition cursor-pointer active:scale-95"
            title="Cerrar vista previa"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Media Container - dynamically adapts strictly to image dimensions without extra black frames or bars */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[96vw] sm:max-w-[88vw] max-h-[88vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200 bg-transparent p-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.caption || "Imagen ampliada del artículo"}
              className="max-h-[82vh] w-auto max-w-full object-contain rounded-2xl bg-transparent border-0 block"
            />

            {selectedImage.caption && (
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white pointer-events-none">
                <p className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 drop-shadow-md">{selectedImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
