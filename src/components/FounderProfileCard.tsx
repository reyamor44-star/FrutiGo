import React, { useState, useEffect } from "react";
import {
  Code2,
  Linkedin,
  Youtube,
  Mail,
  Quote,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Truck,
  Globe,
  Award,
  UserCheck,
  Download,
  Smartphone
} from "lucide-react";

export interface FounderPhotoItem {
  url: string;
  caption?: string;
  description?: string;
}

export interface FounderData {
  name: string;
  role: string;
  photo: string;
  photoUrl?: string;
  photos?: FounderPhotoItem[];
  articles?: any[];
  bioP1: string;
  bioP2: string;
  bioP3?: string;
  bio?: string;
  quote: string;
  linkedin: string;
  youtube?: string;
  email: string;
}

export const DEFAULT_FOUNDER_PHOTO = "https://firebasestorage.googleapis.com/v0/b/frutigo3.firebasestorage.app/o/founder-photos%2F1786118638635_ixj6r0.jpg?alt=media&token=bbf352c0-e9f8-4f59-bfb1-33a24c27aec9";

export const DEFAULT_FOUNDER_DATA: FounderData = {
  name: "Alberto Reyes Sandoval",
  role: "Creador, Desarrollador Principal y Fundador de Fruti Go",
  photo: "https://firebasestorage.googleapis.com/v0/b/frutigo3.firebasestorage.app/o/founder-photos%2F1786118638635_ixj6r0.jpg?alt=media&token=bbf352c0-e9f8-4f59-bfb1-33a24c27aec9",
  photoUrl: "https://firebasestorage.googleapis.com/v0/b/frutigo3.firebasestorage.app/o/founder-photos%2F1786118638635_ixj6r0.jpg?alt=media&token=bbf352c0-e9f8-4f59-bfb1-33a24c27aec9",
  photos: [
    {
      url: "https://firebasestorage.googleapis.com/v0/b/frutigo3.firebasestorage.app/o/founder-photos%2F1786118638635_ixj6r0.jpg?alt=media&token=bbf352c0-e9f8-4f59-bfb1-33a24c27aec9",
      caption: "Alberto Reyes Sandoval - Fundador y CEO",
      description: "Fotografía oficial de Alberto Reyes Sandoval, Creador, Desarrollador Principal y CEO de Fruti Go."
    }
  ],
  bioP1: "Alberto Reyes Sandoval nació en Zamora, Michoacán, el 29 de julio de 1973, hijo de María de Jesús Sandoval Mejía y Alberto Reyes Ibarra (q. e. p. d.), y hermano de María de los Ángeles Reyes Sandoval y Alfonso Reyes Sandoval (q. e. p. d.). Formó su familia junto a su esposa María Alejandra García Morales, sus hijas Valeria y Alejandra Reyes García, y su nieto Valentín Chaires Reyes. Actualmente radica en Guadalajara, Jalisco.",
  bioP2: "Como arquitecto y desarrollador integral de Fruti Go (frutigo.com.mx), diseñó y construyó la arquitectura técnica y operativa de la plataforma desde sus cimientos. La visión nació de la oportunidad de digitalizar la cadena de distribución agrícola y la logística urbana, uniendo tecnología moderna con una experiencia de usuario sumamente accesible. Su trayectoria en el sector comenzó desde muy joven, identificando de primera mano los desafíos históricos de la distribución: desde el maltrato de la mercancía hasta las ineficiencias en las entregas.",
  bioP3: "Con la evolución del mercado, detectó problemáticas actuales como productos en mal estado, tiempos de espera prolongados y comisiones excesivas impuestas por las plataformas tradicionales, las cuales merman los ingresos de los repartidores y elevan los costos para comercios y consumidores. Impulsado por su experiencia práctica y tras consolidar su formación técnica con un diplomado en desarrollo de software en el ITESO, unió su dominio tecnológico con su conocimiento de la industria para crear Fruti Go: un ecosistema justo y colaborativo en Guadalajara que garantiza ingresos competitivos para los repartidores, tarifas sostenibles para los negocios afiliados y un servicio eficiente y accesible para los clientes finales.",
  bio: "Alberto Reyes Sandoval nació en Zamora, Michoacán, el 29 de julio de 1973, hijo de María de Jesús Sandoval Mejía y Alberto Reyes Ibarra (q. e. p. d.), y hermano de María de los Ángeles Reyes Sandoval y Alfonso Reyes Sandoval (q. e. p. d.). Formó su familia junto a su esposa María Alejandra García Morales, sus hijas Valeria y Alejandra Reyes García, y su nieto Valentín Chaires Reyes. Actualmente radica en Guadalajara, Jalisco.\n\nComo arquitecto y desarrollador integral de Fruti Go (frutigo.com.mx), diseñó y construyó la arquitectura técnica y operativa de la plataforma desde sus cimientos. La visión nació de la oportunidad de digitalizar la cadena de distribución agrícola y la logística urbana, uniendo tecnología moderna con una experiencia de usuario sumamente accesible. Su trayectoria en el sector comenzó desde muy joven, identificando de primera mano los desafíos históricos de la distribución: desde el maltrato de la mercancía hasta las ineficiencias en las entregas.\n\nCon la evolución del mercado, detectó problemáticas actuales como productos en mal estado, tiempos de espera prolongados y comisiones excessiveas impuestas por las plataformas tradicionales, las cuales merman los ingresos de los repartidores y elevan los costos para comercios y consumidores. Impulsado por su experiencia práctica y tras consolidar su formación técnica con un diplomado en desarrollo de software en el ITESO, unió su dominio tecnológico con su conocimiento de la industria para crear Fruti Go: un ecosistema justo y colaborativo en Guadalajara que garantiza ingresos competitivos para los repartidores, tarifas sostenibles para los negocios afiliados y un servicio eficiente y accesible para los clientes finales.",
  quote: "Nuestra misión en Fruti Go es llevar la máxima frescura y eficiencia logística directamente a cada hogar y negocio, apoyándonos en tecnología ágil, transparente e ingeniería inteligente que simplifique las compras y envíos diarios.",
  linkedin: "https://www.linkedin.com/in/alberto-reyes-sandoval",
  youtube: "https://youtube.com/@albertoreyesfrutigo?si=T2Ba5HGKGn_3DYYt",
  email: "frutigo33@gmail.com"
};

interface FounderProfileCardProps {
  className?: string;
  data?: FounderData;
}

export const FounderProfileCard: React.FC<FounderProfileCardProps> = ({ className = "", data: propData }) => {
  const [founderData, setFounderData] = useState<FounderData>(() => {
    if (propData) return propData;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fg_founder_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.bioP1 && parsed.bioP1.includes("Como arquitecto y desarrollador integral de Fruti Go, diseñé y construí")) {
            delete parsed.bioP1;
            delete parsed.bioP2;
            delete parsed.bioP3;
            delete parsed.bio;
          }
          return { ...DEFAULT_FOUNDER_DATA, ...parsed };
        }
      } catch (e) {}
    }
    return DEFAULT_FOUNDER_DATA;
  });

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (propData) {
      setFounderData(propData);
      setImageError(false);
      return;
    }

    // Load from backend server API
    fetch("/api/founder/profile")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Error HTTP " + res.status);
      })
      .then((data) => {
        if (data && typeof data === "object") {
          setFounderData((prev) => {
            const mergedArticlesMap = new Map<string, any>();
            if (Array.isArray(data.articles)) {
              data.articles.forEach((art: any) => { if (art && art.id) mergedArticlesMap.set(art.id, art); });
            }
            if (Array.isArray(prev.articles)) {
              prev.articles.forEach((art: any) => { if (art && art.id) mergedArticlesMap.set(art.id, art); });
            }

            const mergedArticles = Array.from(mergedArticlesMap.values());
            const mergedPhotos = Array.isArray(data.photos) && data.photos.length > 0 ? data.photos : (Array.isArray(prev.photos) ? prev.photos : []);

            const combined = {
              ...prev,
              ...data,
              articles: mergedArticles,
              photos: mergedPhotos,
              photo: data.photo || prev.photo,
              photoBase64: data.photoBase64 || prev.photoBase64
            };

            setImageError(false);
            if (typeof window !== "undefined") {
              try { localStorage.setItem("fg_founder_profile", JSON.stringify(combined)); } catch (e) {}
            }
            return combined;
          });
        }
      })
      .catch((err) => {
        console.warn("No se pudo cargar perfil del servidor, usando datos locales:", err);
      });

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("fg_founder_profile");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.bioP1 && parsed.bioP1.includes("Como arquitecto y desarrollador integral de Fruti Go, diseñé y construí")) {
            delete parsed.bioP1;
            delete parsed.bioP2;
            delete parsed.bioP3;
            delete parsed.bio;
          }
          setFounderData({ ...DEFAULT_FOUNDER_DATA, ...parsed });
          setImageError(false);
        }
      } catch (e) {}
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("fg_founder_profile_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("fg_founder_profile_updated", handleStorageChange);
    };
  }, [propData]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setImageError(false);
  }, [founderData.photo, selectedImageIndex]);

  // Normalize photos array up to 5 items safely
  const rawPhotosArr = Array.isArray(founderData.photos) && founderData.photos.length > 0
    ? founderData.photos
    : [{ url: founderData.photo || "", caption: "Alberto Reyes Sandoval - Foto Principal", description: "Fotografía oficial de Alberto Reyes Sandoval." }];

  const photosList = rawPhotosArr.map((p, idx) => {
    if (typeof p === "string") {
      return { url: p, caption: idx === 0 ? "Alberto Reyes Sandoval - Foto Principal" : `Foto ${idx + 1}`, description: "" };
    }
    return {
      url: typeof p?.url === "string" ? p.url : "",
      caption: typeof p?.caption === "string" ? p.caption : (idx === 0 ? "Alberto Reyes Sandoval - Foto Principal" : `Foto ${idx + 1}`),
      description: typeof p?.description === "string" ? p.description : ""
    };
  });

  // Selected photo for preview box (slot 0 is main photo)
  const resolvedPhoto = founderData.photoUrl || founderData.photo || "";
  const activePhotoItem = photosList[selectedImageIndex] || photosList[0] || { url: resolvedPhoto };
  const photoUrl = activePhotoItem?.url || resolvedPhoto;
  const hasPhoto = Boolean(photoUrl) && photoUrl !== "/logo.svg" && photoUrl !== "/alberto-reyes-sandoval-desarrollador.svg" && !imageError;
  const displayEmail = founderData.email || "frutigo33@gmail.com";

  // Build secondary photos list
  const validPhotosList = photosList.filter((p) => p && typeof p.url === "string" && Boolean(p.url));

  // Dynamic Schema.org ImageObjects for Google Indexing
  const schemaImageObjects = validPhotosList.map((p, idx) => {
    const urlStr = p.url || "";
    return {
      "@type": "ImageObject",
      "url": urlStr.startsWith("/") ? `https://frutigo.com.mx${urlStr}` : urlStr,
      "name": p.caption || (idx === 0 ? `${founderData.name} - Foto Principal de Perfil` : `${founderData.name} - Foto de Respaldo ${idx + 1}`),
      "caption": p.caption || (idx === 0 ? `${founderData.name}, ${founderData.role}` : `${founderData.name} - Imagen de Respaldo`),
      "description": p.description || (idx === 0 ? `Fotografía oficial de ${founderData.name}, Creador y Desarrollador de Fruti Go.` : `Fotografía de respaldo y complemento ${idx + 1} de ${founderData.name}.`)
    };
  });

  if (schemaImageObjects.length === 0) {
    schemaImageObjects.push({
      "@type": "ImageObject",
      "url": "https://frutigo.com.mx/alberto-reyes-sandoval-ceo-oficina.jpg",
      "name": "Alberto Reyes Sandoval - Fundador y CEO en Oficina Fruti Go",
      "caption": "Alberto Reyes Sandoval, Fundador, Creador y CEO de Fruti Go.",
      "description": "Fotografía oficial de Alberto Reyes Sandoval, Creador y CEO de Fruti Go."
    });
  }

  return (
    <section className={`relative z-10 ${className}`}>
      {/* Clean White Card Container matching the rest of the application */}
      <div className="bg-white text-zinc-900 rounded-2xl sm:rounded-[32px] p-2.5 sm:p-8 md:p-10 shadow-lg border border-emerald-100/80 relative overflow-hidden group">
        
        {/* Subtle Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-50/60 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Top Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8 pb-3 sm:pb-6 border-b border-zinc-200/80 relative z-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="p-1.5 sm:p-2.5 bg-emerald-100 text-brand-green rounded-xl sm:rounded-2xl border border-emerald-200 shadow-xs">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div>
              <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                Liderazgo e Ingeniería
              </span>
              <h3 className="text-base sm:text-2xl font-black tracking-tight text-zinc-900">
                Sobre el Desarrollador y Fundador
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-amber-100/80 text-amber-900 border border-amber-300 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Perfil Verificado
          </span>
        </div>

        {/* Main Content Layout: Grid with Photo Section + Developer Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 md:gap-10 items-start relative z-10">
          
          {/* Photo & Contact Box (Left Col - 5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4 sm:space-y-6 bg-zinc-50/80 border border-zinc-200/70 p-2.5 sm:p-6 rounded-2xl sm:rounded-3xl">
            
            {/* Dedicated Photo Section */}
            <div className="w-full flex flex-col items-center space-y-3">
              {/* Photo Frame Container - Linked to Official Photo URL */}
              <div className="relative group/photo w-full max-w-xs flex flex-col items-center">
                <a
                  href="https://n9.cl/p8dxzb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-56 sm:w-64 min-h-[260px] max-h-[380px] rounded-2xl sm:rounded-3xl bg-transparent border-2 sm:border-4 border-emerald-200 shadow-md p-1 sm:p-2 relative overflow-hidden flex items-center justify-center cursor-pointer group/link hover:border-emerald-500 transition-all"
                  title="Haga clic para abrir la Fotografía Oficial de Alberto Reyes Sandoval en Alta Resolución (https://n9.cl/p8dxzb)"
                >
                  {hasPhoto ? (
                    <img
                      src={photoUrl}
                      alt="Alberto Reyes Sandoval - Fotografía Oficial"
                      width={1200}
                      height={1600}
                      title="Alberto Reyes Sandoval - Foto oficial de perfil de desarrollador y fundador (https://n9.cl/p8dxzb)"
                      itemProp="image"
                      loading="eager"
                      decoding="async"
                      onError={() => setImageError(true)}
                      className="w-full h-full rounded-xl sm:rounded-2xl object-contain transition duration-300 group-hover/photo:scale-105"
                    />
                  ) : (
                    <div className="w-full h-64 rounded-xl sm:rounded-2xl bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
                        <UserCheck className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-bold text-zinc-700">Fotografía de Perfil</p>
                      <p className="text-[11px] text-zinc-500">Espacio reservado para foto del desarrollador</p>
                    </div>
                  )}
                </a>

                {/* Verified Badge Icon on Corner */}
                <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-white flex items-center justify-center" title="Desarrollador y Creador Oficial">
                  <ShieldCheck className="w-5 h-5 font-black" />
                </div>
              </div>

              {/* Direct Link to Official Photo for Indexing & Instant Access */}
              <a
                href="https://n9.cl/p8dxzb"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-brand-green text-white rounded-xl text-xs font-extrabold transition-all shadow-xs active:scale-95 border border-emerald-700 cursor-pointer"
                title="Abrir Fotografía Oficial en Alta Resolución (https://n9.cl/p8dxzb)"
              >
                <ExternalLink className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                <span>Ver Fotografía Oficial (Alta Resolución)</span>
              </a>
            </div>

            {/* Direct Contact & App Download Buttons */}
            <div className="w-full pt-1 flex flex-col gap-2.5">
              {/* Google Play Store Download Button */}
              <a
                href="https://play.google.com/store/apps/details?id=com.frutigo.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950 hover:from-black hover:to-emerald-900 text-white font-extrabold p-3 sm:p-3.5 rounded-2xl border-2 border-emerald-500/80 shadow-md hover:shadow-xl transition-all active:scale-98 flex items-center justify-between gap-3 group/play cursor-pointer"
                title="Descargar Fruti Go en Google Play Store"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Google Play Multicolor Logo Icon */}
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 p-2 group-hover/play:border-emerald-400 group-hover/play:scale-105 transition-all shadow-inner">
                    <svg className="w-full h-full" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M325.8 243.7L88.1 6.1C82.5 0.5 74.3 -1.4 66.8 1.1 59.3 3.6 54.1 10.1 54.1 18.1V493.9c0 8 5.2 14.5 12.7 17 7.5 2.5 15.7 0.6 21.3-5L325.8 268.3c6.8-6.8 6.8-17.8 0-24.6z" fill="#00D2FF" />
                      <path d="M325.8 243.7L411.4 158.1 120.3 6.1l205.5 237.6z" fill="#00F076" />
                      <path d="M325.8 268.3L120.3 505.9 411.4 353.9 325.8 268.3z" fill="#FF3A44" />
                      <path d="M411.4 158.1l43.2 24.9c18.5 10.7 18.5 37.9 0 48.6l-43.2 24.9-38.3-38.3 38.3-40.1z" fill="#FFE000" />
                    </svg>
                  </div>
                  <div className="text-left leading-tight min-w-0">
                    <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-black block truncate">
                      DISPONIBLE EN GOOGLE PLAY
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white group-hover/play:text-amber-300 transition-colors block truncate">
                      Descargar App Fruti Go
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-brand-green text-white px-3 py-1.5 rounded-xl text-xs font-black shrink-0 group-hover/play:bg-emerald-500 transition-colors shadow-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Obtener</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </div>
              </a>

              {founderData.youtube && (
                <a
                  href={founderData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-extrabold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 group/yt"
                  title="Canal Oficial de YouTube - Alberto Reyes Sandoval y Fruti Go"
                >
                  <Youtube className="w-4.5 h-4.5 text-white group-hover/yt:scale-110 transition-transform shrink-0" />
                  <span>Canal Oficial de YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-auto shrink-0" />
                </a>
              )}

              {founderData.linkedin && (
                <a
                  href={founderData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 group/link"
                  title="Perfil Oficial de LinkedIn - Alberto Reyes Sandoval"
                >
                  <Linkedin className="w-4 h-4 text-white group-hover/link:scale-110 transition-transform" />
                  <span>Perfil LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80 ml-auto" />
                </a>
              )}

              <a
                href={`mailto:${displayEmail}?subject=Consulta%20B2B%20/%20Plataforma%20Fruti%20Go`}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 group/email"
              >
                <Mail className="w-4 h-4 text-amber-300 group-hover/email:scale-110 transition-transform" />
                <span>{displayEmail}</span>
              </a>
            </div>

          </div>

          {/* Bio & Vision Content (Right Col - 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Name & Role Headline */}
            <div>
              <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 flex items-center gap-2">
                {founderData.name}
              </h4>
              <p className="text-brand-green font-bold text-sm sm:text-base mt-1 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-600" />
                {founderData.role}
              </p>
            </div>

            {/* Badges / Skill Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-700" />
                Arquitectura Cloud & Web
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-700" />
                Desarrollo Full-Stack
              </span>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-black flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                Paquetería Express & Pet Taxi
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-black flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                Modelo B2B & Alianzas
              </span>
            </div>

            {/* Play Store Download Callout Banner */}
            <div className="p-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-zinc-900 rounded-2xl text-white border border-emerald-500/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-700 p-2 shrink-0 shadow-sm flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M325.8 243.7L88.1 6.1C82.5 0.5 74.3 -1.4 66.8 1.1 59.3 3.6 54.1 10.1 54.1 18.1V493.9c0 8 5.2 14.5 12.7 17 7.5 2.5 15.7 0.6 21.3-5L325.8 268.3c6.8-6.8 6.8-17.8 0-24.6z" fill="#00D2FF" />
                    <path d="M325.8 243.7L411.4 158.1 120.3 6.1l205.5 237.6z" fill="#00F076" />
                    <path d="M325.8 268.3L120.3 505.9 411.4 353.9 325.8 268.3z" fill="#FF3A44" />
                    <path d="M411.4 158.1l43.2 24.9c18.5 10.7 18.5 37.9 0 48.6l-43.2 24.9-38.3-38.3 38.3-40.1z" fill="#FFE000" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-700">
                      App Android Oficial
                    </span>
                    <span className="text-[10px] text-amber-300 font-bold">Google Play Store</span>
                  </div>
                  <h5 className="text-sm font-black text-white mt-0.5">
                    Aplicación Móvil Fruti Go
                  </h5>
                  <p className="text-xs text-emerald-100/90 line-clamp-1">
                    Disponible directamente para dispositivos Android en la tienda oficial.
                  </p>
                </div>
              </div>

              <a
                href="https://play.google.com/store/apps/details?id=com.frutigo.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 bg-brand-yellow hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
              >
                <Download className="w-4 h-4 text-zinc-900" />
                <span>Descargar App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Bio Narrative */}
            <div className="space-y-4 text-zinc-700 text-sm sm:text-base leading-relaxed font-normal">
              {founderData.bioP1 && <p>{founderData.bioP1}</p>}
              {founderData.bioP2 && <p>{founderData.bioP2}</p>}
              {founderData.bioP3 && <p>{founderData.bioP3}</p>}
            </div>

            {/* Founder Quote Card */}
            {founderData.quote && (
              <div className="p-5 sm:p-6 bg-emerald-50/80 rounded-2xl border-l-4 border-brand-green border-t border-r border-b border-emerald-200/80 relative space-y-2">
                <Quote className="w-8 h-8 text-emerald-300 absolute top-3 right-3 pointer-events-none opacity-40" />
                <p className="text-xs sm:text-sm text-zinc-900 italic font-semibold leading-relaxed relative z-10">
                  "{founderData.quote}"
                </p>
                <span className="block text-[11px] font-black uppercase tracking-widest text-emerald-800 pt-1">
                  — {founderData.name}, Fundador
                </span>
              </div>
            )}

          </div>

        </div>

        {/* Galería de Fotos y Trayectoria del Desarrollador (Hasta 5 Fotos) */}
        {validPhotosList.length > 1 && (
          <div className="mt-8 pt-6 border-t border-zinc-200/80 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                Galería de Fotografías de Trayectoria (Indexadas en Google / Schema.org)
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {photosList.map((item, idx) => {
                if (!item || !item.url) return null;
                const isSelected = selectedImageIndex === idx;
                const isMain = idx === 0;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`group/thumb text-left p-2 rounded-2xl border transition-all text-xs cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-sm"
                        : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200"
                    }`}
                  >
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-zinc-950 border border-zinc-200 mb-2 relative flex items-center justify-center p-1">
                      <img
                        src={item.url}
                        alt={item.caption || `Foto ${idx + 1}`}
                        className="w-full h-full object-contain group-hover/thumb:scale-105 transition-transform rounded-lg"
                      />
                    </div>
                    <p className="font-bold text-zinc-900 line-clamp-1 text-[11px]">
                      {item.caption || (isMain ? "Foto Principal" : `Foto ${idx + 1}`)}
                    </p>
                    {item.description && (
                      <p className="text-[10px] text-zinc-500 line-clamp-2 mt-0.5 font-normal">
                        {item.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Metadatos Estructurados Schema.org para Indexación de Wikidata, Autoridad de Marca e Imágenes */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "ProfilePage",
                  "@id": "https://frutigo.com.mx/sobre-el-desarrollador#profilepage",
                  "url": "https://frutigo.com.mx/sobre-el-desarrollador",
                  "name": "Alberto Reyes Sandoval | Creador y Desarrollador de Fruti Go",
                  "description": "Perfil oficial de Alberto Reyes Sandoval, Creador, Desarrollador Principal y Fundador de Fruti Go (https://frutigo.com.mx).",
                  "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "@id": "https://frutigo.com.mx/alberto-reyes-sandoval-ceo-oficina.jpg#primaryimage",
                    "url": "https://frutigo.com.mx/alberto-reyes-sandoval-ceo-oficina.jpg",
                    "contentUrl": "https://frutigo.com.mx/alberto-reyes-sandoval-ceo-oficina.jpg",
                    "width": "1200",
                    "height": "1600",
                    "caption": "Alberto Reyes Sandoval - Creador y Desarrollador de Fruti Go",
                    "representativeOfPage": true
                  },
                  "mainEntity": {
                    "@type": "Person",
                    "@id": "https://frutigo.com.mx/#founder",
                    "name": "Alberto Reyes Sandoval",
                    "jobTitle": "Creador y Desarrollador de Fruti Go",
                    "image": "https://frutigo.com.mx/alberto-reyes-sandoval-ceo-oficina.jpg",
                    "worksFor": {
                      "@type": "Organization",
                      "@id": "https://frutigo.com.mx/#organization",
                      "name": "Fruti Go",
                      "url": "https://frutigo.com.mx"
                    },
                    "sameAs": [
                      "https://play.google.com/store/apps/details?id=com.frutigo.app",
                      founderData.youtube || "https://youtube.com/@albertoreyesfrutigo?si=T2Ba5HGKGn_3DYYt",
                      "https://www.wikidata.org/wiki/Q140880376",
                      founderData.linkedin || "https://www.linkedin.com/in/alberto-reyes-sandoval",
                      "https://github.com/reyamor44-star"
                    ]
                  }
                },
                {
                  "@type": "Person",
                  "@id": "https://frutigo.com.mx/#founder",
                  "name": "Alberto Reyes Sandoval",
                  "jobTitle": "Fundador, Creador, Desarrollador Principal & CEO",
                  "url": "https://frutigo.com.mx/sobre-el-desarrollador",
                  "email": `mailto:${displayEmail}`,
                  "sameAs": [
                    "https://play.google.com/store/apps/details?id=com.frutigo.app",
                    founderData.youtube || "https://youtube.com/@albertoreyesfrutigo?si=T2Ba5HGKGn_3DYYt",
                    "https://www.wikidata.org/wiki/Q140880376",
                    founderData.linkedin || "https://www.linkedin.com/in/alberto-reyes-sandoval",
                    "https://github.com/reyamor44-star",
                    "https://frutigo.com.mx/desarrollador",
                    "https://frutigo.com.mx/sobre-el-desarrollador"
                  ],
                  "image": schemaImageObjects
                },
                {
                  "@type": "Organization",
                  "@id": "https://frutigo.com.mx/#organization",
                  "name": "Fruti Go",
                  "legalName": "Alberto Reyes Sandoval",
                  "alternateName": [
                    "Fruti Go México",
                    "Fruti Go Delivery",
                    "Fruti Go App",
                    "Fruti Go por Alberto Reyes Sandoval"
                  ],
                  "duns": "951807888",
                  "url": "https://frutigo.com.mx",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://frutigo.com.mx/logo.png",
                    "width": "1200",
                    "height": "630",
                    "caption": "Fruti Go - Plataforma oficial desarrollada por Alberto Reyes Sandoval"
                  },
                  "image": {
                    "@type": "ImageObject",
                    "url": "https://frutigo.com.mx/logo.png",
                    "width": "1200",
                    "height": "630",
                    "caption": "Fruti Go - Plataforma oficial desarrollada por Alberto Reyes Sandoval"
                  },
                  "description": "Fruti Go es la plataforma oficial de delivery exprés de productos frescos y frutas en México (https://frutigo.com.mx), fundada, creada y operada de manera exclusiva e independiente por Alberto Reyes Sandoval. Sin relación alguna con entidades o negocios homónimos ajenos.",
                  "founder": {
                    "@type": "Person",
                    "@id": "https://frutigo.com.mx/#founder",
                    "name": "Alberto Reyes Sandoval",
                    "jobTitle": "Fundador y Creador"
                  },
                  "sameAs": [
                    "https://play.google.com/store/apps/details?id=com.frutigo.app",
                    founderData.youtube || "https://youtube.com/@albertoreyesfrutigo?si=T2Ba5HGKGn_3DYYt",
                    "https://www.wikidata.org/wiki/Q140880376",
                    founderData.linkedin || "https://www.linkedin.com/in/alberto-reyes-sandoval",
                    "https://github.com/reyamor44-star"
                  ]
                },
                {
                  "@type": "Brand",
                  "@id": "https://frutigo.com.mx/#brand",
                  "name": "Fruti Go",
                  "legalName": "Alberto Reyes Sandoval",
                  "url": "https://frutigo.com.mx",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://frutigo.com.mx/logo.png",
                    "width": "1200",
                    "height": "630",
                    "caption": "Fruti Go - Marca oficial desarrollada por Alberto Reyes Sandoval"
                  },
                  "image": {
                    "@type": "ImageObject",
                    "url": "https://frutigo.com.mx/logo.png",
                    "width": "1200",
                    "height": "630",
                    "caption": "Fruti Go - Marca oficial desarrollada por Alberto Reyes Sandoval"
                  },
                  "slogan": "Plataforma Oficial de Delivery Exprés por Alberto Reyes Sandoval",
                  "description": "Marca registrada y propiedad exclusiva de Alberto Reyes Sandoval para la plataforma tecnológica Fruti Go (frutigo.com.mx). No guarda relación con empresas con guión o variaciones ortográficas externas.",
                  "sameAs": [
                    "https://play.google.com/store/apps/details?id=com.frutigo.app",
                    founderData.youtube || "https://youtube.com/@albertoreyesfrutigo?si=T2Ba5HGKGn_3DYYt",
                    "https://www.wikidata.org/wiki/Q140880376",
                    founderData.linkedin || "https://www.linkedin.com/in/alberto-reyes-sandoval",
                    "https://github.com/reyamor44-star"
                  ]
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://frutigo.com.mx/#app",
                  "name": "Fruti Go",
                  "legalName": "Alberto Reyes Sandoval",
                  "operatingSystem": "Android",
                  "applicationCategory": "ShoppingApplication",
                  "downloadUrl": "https://play.google.com/store/apps/details?id=com.frutigo.app",
                  "installUrl": "https://play.google.com/store/apps/details?id=com.frutigo.app",
                  "image": {
                    "@type": "ImageObject",
                    "url": "https://frutigo.com.mx/logo.png",
                    "width": "1200",
                    "height": "630",
                    "caption": "Fruti Go - Plataforma oficial desarrollada por Alberto Reyes Sandoval"
                  },
                  "sameAs": [
                    "https://play.google.com/store/apps/details?id=com.frutigo.app",
                    founderData.youtube || "https://youtube.com/@albertoreyesfrutigo?si=T2Ba5HGKGn_3DYYt",
                    "https://www.wikidata.org/wiki/Q140880376",
                    founderData.linkedin || "https://www.linkedin.com/in/alberto-reyes-sandoval",
                    "https://github.com/reyamor44-star"
                  ],
                  "publisher": {
                    "@type": "Organization",
                    "@id": "https://frutigo.com.mx/#organization",
                    "name": "Fruti Go",
                    "legalName": "Alberto Reyes Sandoval",
                    "duns": "951807888",
                    "url": "https://frutigo.com.mx",
                    "logo": {
                      "@type": "ImageObject",
                      "url": "https://frutigo.com.mx/logo.png",
                      "width": "1200",
                      "height": "630"
                    },
                    "founder": {
                      "@type": "Person",
                      "@id": "https://frutigo.com.mx/#founder",
                      "name": "Alberto Reyes Sandoval",
                      "jobTitle": "Fundador y Creador"
                    },
                    "sameAs": [
                      "https://play.google.com/store/apps/details?id=com.frutigo.app",
                      founderData.youtube || "https://youtube.com/@albertoreyesfrutigo?si=T2Ba5HGKGn_3DYYt",
                      "https://www.wikidata.org/wiki/Q140880376",
                      founderData.linkedin || "https://www.linkedin.com/in/alberto-reyes-sandoval",
                      "https://github.com/reyamor44-star"
                    ]
                  },
                  "author": {
                    "@type": "Person",
                    "name": "Alberto Reyes Sandoval",
                    "@id": "https://frutigo.com.mx/#founder"
                  }
                }
              ]
            })
          }}
        />

      </div>
    </section>
  );
};
