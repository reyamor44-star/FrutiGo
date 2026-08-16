import React, { useState, useEffect, useRef } from "react";
import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Youtube, 
  X, 
  Maximize2, 
  Play, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  UserCheck, 
  ExternalLink,
  Code2,
  Rocket,
  Filter,
  Link as LinkIcon,
  Check
} from "lucide-react";
import { mediaService, FounderMediaItem } from "../services/mediaService";
import { FounderProfileCard } from "./FounderProfileCard";
import FundadorArticulosPublicos from "./FundadorArticulosPublicos";
import ExpandableImage from "./ExpandableImage";

export default function FundadorGaleriaPublica() {
  const [items, setItems] = useState<FounderMediaItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "image" | "video" | "youtube">("all");
  const [lightboxItem, setLightboxItem] = useState<FounderMediaItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(mediaService.getFounderMedia());
    const unsubscribe = mediaService.subscribe(() => {
      setItems(mediaService.getFounderMedia());
    });
    return () => unsubscribe();
  }, []);

  // Auto-scroll into view if navigation targeted media/galeria direct URL
  useEffect(() => {
    if (typeof window !== "undefined") {
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

      if (isMediaTarget) {
        setTimeout(() => {
          const el = document.getElementById("modulo-medios") || galleryRef.current;
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    }
  }, []);

  const handleCopyDirectUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    const directUrl = "https://frutigo.com.mx/medios";
    navigator.clipboard.writeText(directUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }).catch(() => {
      // fallback
      try {
        const input = document.createElement("input");
        input.value = directUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch (err) {}
    });
  };

  const filteredItems = items.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "image") return item.type === "image";
    if (activeFilter === "video") return item.type === "video" || item.type === "youtube";
    return item.type === activeFilter;
  });

  return (
    <div className="space-y-6 sm:space-y-12 max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-2 sm:py-8">
      {/* Top Banner / Founder Official Card */}
      <FounderProfileCard />

      {/* Main Gallery Section with direct ID anchors */}
      <section 
        id="modulo-medios"
        ref={galleryRef}
        className="bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-8 border border-zinc-200/80 shadow-xs sm:shadow-sm space-y-4 sm:space-y-8 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-zinc-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Archivo Multimedia Oficial
              </div>
              <button
                type="button"
                onClick={handleCopyDirectUrl}
                title="Copiar URL directa al módulo de medios"
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  copiedLink
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-zinc-100 text-zinc-700 hover:text-emerald-700 hover:bg-emerald-50 border-zinc-200"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                    <span>frutigo.com.mx/medios</span>
                  </>
                )}
              </button>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Galería y Medios / <span className="text-emerald-700">Alberto Reyes Sandoval</span>
            </h2>
            <p className="text-zinc-700 text-base sm:text-base font-semibold sm:font-normal mt-2 max-w-3xl leading-relaxed">
              Explora las fotos, videos, presentaciones de infraestructura y material gráfico del Fundador, Desarrollador Principal y CEO de Fruti Go.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 self-start md:self-auto shrink-0 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-brand-green text-white shadow-md shadow-brand-green/20"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Todos ({items.length})
            </button>
            <button
              onClick={() => setActiveFilter("image")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeFilter === "image"
                  ? "bg-brand-green text-white shadow-md shadow-brand-green/20"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Fotos ({items.filter(i => i.type === "image").length})
            </button>
            <button
              onClick={() => setActiveFilter("video")}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeFilter === "video"
                  ? "bg-brand-green text-white shadow-md shadow-brand-green/20"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60"
              }`}
            >
              <VideoIcon className="w-3.5 h-3.5" />
              Videos ({items.filter(i => i.type === "video" || i.type === "youtube").length})
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
            <ImageIcon className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
            <p className="font-extrabold text-base text-zinc-800">No hay contenido en esta categoría por ahora.</p>
            <p className="text-xs text-zinc-500 mt-1">Vuelve a consultar pronto para ver más actualizaciones multimedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.type !== "image") {
                    setLightboxItem(item);
                  }
                }}
                className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-transparent flex items-center justify-center p-1 rounded-t-2xl">
                  {item.type === "image" && (
                    <ExpandableImage
                      src={item.url}
                      alt={item.altText || "Alberto Reyes Sandoval - Fundador de Fruti Go"}
                      caption={item.title}
                      title="Toca para expandir imagen aquí mismo"
                      className="w-full h-full object-cover rounded-xl"
                      containerClassName="w-full h-full"
                      loading="lazy"
                    />
                  )}

                  {item.type === "video" && (
                    <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-transparent">
                      <video src={item.url} className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
                        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === "youtube" && (
                    <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 rounded-xl overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                        alt={item.altText || "Alberto Reyes Sandoval - Video de YouTube Fruti Go"}
                        title={item.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                          <Youtube className="w-7 h-7 fill-current" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type Overlay Badge (Only for Videos and YouTube, photos display clean without 'Foto' badge) */}
                  {item.type !== "image" && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md text-white shadow-md ${
                        item.type === "video" ? "bg-blue-950/80 border border-blue-500/30" :
                        "bg-red-950/80 border border-red-500/30"
                      }`}>
                        {item.type === "video" && <VideoIcon className="w-3 h-3 text-blue-400" />}
                        {item.type === "youtube" && <Youtube className="w-3 h-3 text-red-400" />}
                        {item.type === "youtube" ? "YouTube" : "Video"}
                      </span>
                    </div>
                  )}

                  {/* Expand icon on hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="p-2 rounded-xl bg-black/70 text-white backdrop-blur-md flex items-center justify-center">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-3.5 sm:p-4 bg-white border-t border-zinc-100 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-zinc-900 text-base line-clamp-1 group-hover:text-emerald-700 transition">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-zinc-700 text-xs sm:text-xs font-medium mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-semibold">
                    <span>Alberto Reyes Sandoval</span>
                    <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-1">
                      Ver detalle <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Artículos y Publicaciones del Desarrollador (Aparece justo después de la galería de fotos y videos) */}
      <FundadorArticulosPublicos />

      {/* Lightbox Modal without excess black frame */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl p-2 sm:p-4 flex flex-col items-center justify-center animate-fadeIn"
        >
          {/* Floating Close Button */}
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 shadow-2xl transition cursor-pointer active:scale-95"
            title="Cerrar vista previa"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Media Container - dynamically adapts strictly to image/video dimensions without extra black frames or bars */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[96vw] sm:max-w-[88vw] max-h-[88vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200 bg-transparent p-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            {lightboxItem.type === "image" && (
              <img
                src={lightboxItem.url}
                alt={lightboxItem.altText || "Alberto Reyes Sandoval - Fundador de Fruti Go"}
                title={lightboxItem.title}
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-2xl bg-transparent border-0 block"
              />
            )}

            {lightboxItem.type === "video" && (
              <video
                src={lightboxItem.url}
                controls
                autoPlay
                className="max-h-[82vh] w-auto max-w-full object-contain rounded-2xl bg-transparent border-0 block"
              />
            )}

            {lightboxItem.type === "youtube" && (
              <div className="w-[94vw] sm:w-[88vw] max-w-4xl aspect-video rounded-2xl overflow-hidden bg-transparent border-0">
                <iframe
                  src={`https://www.youtube.com/embed/${lightboxItem.youtubeId}?autoplay=1`}
                  title={lightboxItem.title}
                  className="w-full h-full border-0 bg-transparent"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {lightboxItem.title && (
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white pointer-events-none">
                <p className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 drop-shadow-md">{lightboxItem.title}</p>
                {lightboxItem.description && (
                  <p className="text-[11px] sm:text-xs text-zinc-200 line-clamp-2 mt-0.5 font-medium drop-shadow-xs">{lightboxItem.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
