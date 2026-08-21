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
  const [playingItems, setPlayingItems] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItems(mediaService.getFounderMedia());
    const unsubscribe = mediaService.subscribe(() => {
      setItems(mediaService.getFounderMedia());
    });
    return () => unsubscribe();
  }, []);

  const togglePlayItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
        const scrollToFilters = () => {
          const el = document.getElementById("modulo-medios-filtros") || document.getElementById("modulo-medios");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        };
        // Trigger scroll once content mounts and after image layout settles
        setTimeout(scrollToFilters, 100);
        setTimeout(scrollToFilters, 350);
        setTimeout(scrollToFilters, 600);
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

  const filteredItems = items
    .filter((item) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "image") return item.type === "image";
      if (activeFilter === "video") return item.type === "video" || item.type === "youtube";
      return item.type === activeFilter;
    })
    .sort((a, b) => {
      if (activeFilter === "all") {
        // Los videos (YouTube y video nativo) siempre encabezan la lista en 'Todos'
        const isVideoA = a.type === "video" || a.type === "youtube" ? 1 : 0;
        const isVideoB = b.type === "video" || b.type === "youtube" ? 1 : 0;
        if (isVideoA !== isVideoB) {
          return isVideoB - isVideoA;
        }
      }
      // Orden cronológico (más reciente primero)
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return timeB - timeA;
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
          <div 
            id="modulo-medios-filtros" 
            className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 self-start md:self-auto shrink-0 overflow-x-auto max-w-full scroll-mt-3 sm:scroll-mt-6"
          >
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredItems.map((item) => {
              const isPlaying = !!playingItems[item.id];

              return (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
                >
                  {/* Media Container */}
                  <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-950 flex items-center justify-center rounded-t-2xl">
                    {item.type === "image" && (
                      <ExpandableImage
                        src={item.url}
                        alt={item.altText || "Alberto Reyes Sandoval - Fundador de Fruti Go"}
                        caption={item.title}
                        title="Toca para expandir imagen aquí mismo"
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                        loading="lazy"
                      />
                    )}

                    {item.type === "video" && (
                      isPlaying ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <video
                            src={item.url}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => togglePlayItem(item.id, e)}
                          className="relative w-full h-full flex items-center justify-center bg-zinc-900 group/btn cursor-pointer"
                          title="Reproducir video aquí mismo"
                        >
                          <video src={item.url} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/btn:bg-black/10 transition">
                            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl group-hover/btn:scale-110 transition">
                              <Play className="w-7 h-7 fill-current ml-0.5" />
                            </div>
                          </div>
                        </button>
                      )
                    )}

                    {item.type === "youtube" && (
                      isPlaying ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <iframe
                            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
                            title={item.title || "Video de YouTube de Alberto Reyes Sandoval - FrutiGo"}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => togglePlayItem(item.id, e)}
                          className="relative w-full h-full flex items-center justify-center bg-zinc-950 group/btn cursor-pointer"
                          title="Reproducir video de YouTube aquí mismo"
                        >
                          <img
                            src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                            alt={item.altText || "Alberto Reyes Sandoval - Video de YouTube Fruti Go"}
                            title={item.title}
                            className="w-full h-full object-cover opacity-90 group-hover/btn:scale-105 transition duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover/btn:bg-black/10 transition flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover/btn:scale-110 transition">
                              <Youtube className="w-8 h-8 fill-current" />
                            </div>
                          </div>
                        </button>
                      )
                    )}

                    {/* Type Overlay Badge (Hidden when actively playing video to keep controls 100% visible) */}
                    {!isPlaying && item.type !== "image" && (
                      <div className="absolute top-3 left-3 z-10 pointer-events-none">
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
                  </div>

                  {/* Info Footer */}
                  <div className="p-3.5 sm:p-4 bg-white border-t border-zinc-100 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-zinc-900 text-base line-clamp-2 group-hover:text-emerald-700 transition">
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
                      {item.type === "image" ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          Fotografía Oficial
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => togglePlayItem(item.id, e)}
                          className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {isPlaying ? "Detener" : "Reproducir video"} <Play className="w-3 h-3 fill-current" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Strategic Cross-linking Callout: Connects Medios to Sobre el Desarrollador */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs mt-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">Liderazgo y Biografía Oficial</span>
              <h3 className="text-sm sm:text-base font-black text-zinc-900">
                Sobre el Desarrollador | Alberto Reyes Sandoval - Fundador de FrutiGo
              </h3>
              <p className="text-xs text-zinc-600 font-medium mt-0.5">
                Conoce la visión, trayectoria universitaria en ITESO y el desarrollo tecnológico detrás de FrutiGo.
              </p>
            </div>
          </div>
          <a
            href="https://frutigo.com.mx/desarrollador"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.pushState(null, "", "/desarrollador");
              window.dispatchEvent(new Event("popstate"));
            }}
            className="w-full sm:w-auto px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 cursor-pointer"
            title="Conoce la trayectoria completa de Alberto Reyes Sandoval"
          >
            <span>Ver Perfil del Desarrollador</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Artículos y Publicaciones del Desarrollador (Aparece justo después de la galería de fotos y videos) */}
      <FundadorArticulosPublicos />
    </div>
  );
}
