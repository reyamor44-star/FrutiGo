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
  Smartphone,
  X,
  ZoomIn,
  Calendar,
  MapPin,
  Home,
  GraduationCap,
  Heart
} from "lucide-react";
import { sortArticlesNewestFirst } from "../utils/articleUtils";
import ExpandableImage from "./ExpandableImage";

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
  birthDate?: string;
  birthPlace?: string;
  residence?: string;
  education?: string;
  articles?: any[];
  bioP1: string;
  bioP2: string;
  bioP3?: string;
  bio1?: string;
  bio2?: string;
  bio?: string;
  quote: string;
  linkedin: string;
  youtube?: string;
  email: string;
}

export const DEFAULT_FOUNDER_PHOTO = "https://firebasestorage.googleapis.com/v0/b/frutigo3.firebasestorage.app/o/founder-photos%2F1786483956397_vlk1om.jpg?alt=media&token=e622e4ce-4b10-486d-a296-45690f0f4ccd";

export const DEFAULT_FOUNDER_DATA: FounderData = {
  name: "Alberto Reyes Sandoval",
  role: "Creador, Desarrollador Principal y Fundador de Fruti Go",
  birthDate: "29 de julio de 1973",
  birthPlace: "Zamora, Michoacán, México",
  residence: "Guadalajara, Jalisco, México",
  education: "Diplomado en Desarrollo de Software (ITESO)",
  photo: DEFAULT_FOUNDER_PHOTO,
  photoUrl: DEFAULT_FOUNDER_PHOTO,
  photos: [
    {
      url: DEFAULT_FOUNDER_PHOTO,
      caption: "Alberto Reyes Sandoval - Creador, Desarrollador Principal y Fundador de Fruti Go",
      description: "Fotografía oficial de Alberto Reyes Sandoval, Creador, Desarrollador Principal y Fundador de Fruti Go."
    }
  ],
  bioP1: "Alberto Reyes Sandoval nació en Zamora, Michoacán, el 29 de julio de 1973, hijo de María de Jesús Sandoval Mejía y Alberto Reyes Ibarra (q. e. p. d.), y hermano de María de los Ángeles Reyes Sandoval y Alfonso Reyes Sandoval (q. e. p. d.). Formó su familia junto a su esposa María Alejandra García Morales, sus hijas Valeria y Alejandra Reyes García, y su nieto Valentín Chaires Reyes. Actualmente radica en Guadalajara, Jalisco.",
  bioP2: "Como arquitecto y desarrollador integral de Fruti Go (frutigo.com.mx), diseñó y construyó la arquitectura técnica y operativa de la plataforma desde sus cimientos. La visión nació de la oportunidad de digitalizar la cadena de distribución agrícola y la logística urbana, uniendo tecnología moderna con una experiencia de usuario sumamente accesible. Su trayectoria en el sector comenzó desde muy joven, identificando de primera mano los desafíos históricos de la distribución: desde el maltrato de la mercancía hasta las ineficiencias en las entregas.",
  bioP3: "Con la evolución del mercado, detectó problemáticas actuales como productos en mal estado, tiempos de espera prolongados y comisiones excesivas impuestas por las plataformas tradicionales, las cuales merman los ingresos de los repartidores y elevan los costos para comercios y consumidores. Impulsado por su experiencia práctica y tras consolidar su formación técnica con un diplomado en desarrollo de software en el ITESO, unió su dominio tecnológico con su conocimiento de la industria para crear Fruti Go: un ecosistema justo y colaborativo en Guadalajara que garantiza ingresos competitivos para los repartidores, tarifas sostenibles para los negocios afiliados y un servicio eficiente y accesible para los clientes finales.",
  bio1: "Alberto Reyes Sandoval nació en Zamora, Michoacán, el 29 de julio de 1973, hijo de María de Jesús Sandoval Mejía y Alberto Reyes Ibarra (q. e. p. d.), y hermano de María de los Ángeles Reyes Sandoval y Alfonso Reyes Sandoval (q. e. p. d.). Formó su familia junto a su esposa María Alejandra García Morales, sus hijas Valeria y Alejandra Reyes García, y su nieto Valentín Chaires Reyes. Actualmente radica en Guadalajara, Jalisco.\n\nComo arquitecto y desarrollador integral de Fruti Go (frutigo.com.mx), diseñó y construyó la arquitectura técnica y operativa de la plataforma desde sus cimientos. La visión nació de la oportunidad de digitalizar la cadena de distribución agrícola y la logística urbana, uniendo tecnología moderna con una experiencia de usuario sumamente accesible. Su trayectoria en el sector comenzó desde muy joven, identificando de primera mano los desafíos históricos de la distribución: desde el maltrato de la mercancía hasta las ineficiencias en las entregas.",
  bio2: "Con la evolución del mercado, detectó problemáticas actuales como productos en mal estado, tiempos de espera prolongados y comisiones excesivas impuestas por las plataformas tradicionales, las cuales merman los ingresos de los repartidores y elevan los costos para comercios y consumidores. Impulsado por su experiencia práctica y tras consolidar su formación técnica con un diplomado en desarrollo de software en el ITESO, unió su dominio tecnológico con su conocimiento de la industria para crear Fruti Go: un ecosistema justo y colaborativo en Guadalajara que garantiza ingresos competitivos para los repartidores, tarifas sostenibles para los negocios afiliados y un servicio eficiente y accesible para los clientes finales.",
  bio: "Alberto Reyes Sandoval nació en Zamora, Michoacán, el 29 de julio de 1973, hijo de María de Jesús Sandoval Mejía y Alberto Reyes Ibarra (q. e. p. d.), y hermano de María de los Ángeles Reyes Sandoval y Alfonso Reyes Sandoval (q. e. p. d.). Formó su familia junto a su esposa María Alejandra García Morales, sus hijas Valeria y Alejandra Reyes García, y su nieto Valentín Chaires Reyes. Actualmente radica en Guadalajara, Jalisco.\n\nComo arquitecto y desarrollador integral de Fruti Go (frutigo.com.mx), diseñó y construyó la arquitectura técnica y operativa de la plataforma desde sus cimientos. La visión nació de la oportunidad de digitalizar la cadena de distribución agrícola y la logística urbana, uniendo tecnología moderna con una experiencia de usuario sumamente accesible. Su trayectoria en el sector comenzó desde muy joven, identificando de primera mano los desafíos históricos de la distribución: desde el maltrato de la mercancía hasta las ineficiencias en las entregas.\n\nCon la evolución del mercado, detectó problemáticas actuales como productos en mal estado, tiempos de espera prolongados y comisiones excesivas impuestas por las plataformas tradicionales, las cuales merman los ingresos de los repartidores y elevan los costos para comercios y consumidores. Impulsado por su experiencia práctica y tras consolidar su formación técnica con un diplomado en desarrollo de software en el ITESO, unió su dominio tecnológico con su conocimiento de la industria para crear Fruti Go: un ecosistema justo y colaborativo en Guadalajara que garantiza ingresos competitivos para los repartidores, tarifas sostenibles para los negocios afiliados y un servicio eficiente y accesible para los clientes finales.",
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

            const mergedArticles = sortArticlesNewestFirst(Array.from(mergedArticlesMap.values()));
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
      "url": DEFAULT_FOUNDER_PHOTO,
      "name": "Alberto Reyes Sandoval - Fundador y CEO Fruti Go",
      "caption": "Alberto Reyes Sandoval, Fundador, Creador y CEO de Fruti Go.",
      "description": "Fotografía oficial de Alberto Reyes Sandoval, Creador y CEO de Fruti Go."
    });
  }

  return (
    <section className={`relative z-10 ${className}`}>
      {/* Clean White Card Container matching the rest of the application */}
      <div
        className="bg-white text-zinc-900 rounded-2xl sm:rounded-[32px] p-2.5 sm:p-8 md:p-10 shadow-lg border border-emerald-100/80 relative overflow-hidden group"
        itemScope
        itemType="https://schema.org/Person"
      >
        <meta itemProp="name" content={founderData.name} />
        <meta itemProp="jobTitle" content={founderData.role} />
        <meta itemProp="url" content="https://frutigo.com.mx/sobre-el-desarrollador" />
        <link itemProp="image" href={photoUrl} />
        
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
              {/* Photo Frame Container - Linked to In-Place Expandable Image */}
              <div className="relative group/photo w-full max-w-xs flex flex-col items-center">
                <div
                  className="w-56 sm:w-64 min-h-[260px] max-h-[380px] rounded-2xl sm:rounded-3xl bg-transparent border-2 sm:border-4 border-emerald-200 shadow-md p-1 sm:p-2 relative overflow-hidden flex items-center justify-center group/link hover:border-emerald-500 transition-all"
                >
                  {hasPhoto ? (
                    <ExpandableImage
                      src={photoUrl}
                      alt="Alberto Reyes Sandoval - Fotografía Oficial"
                      caption="Alberto Reyes Sandoval - Fundador, Creador y Desarrollador de Fruti Go"
                      width={1200}
                      height={1600}
                      title="Toca para ampliar la foto oficial"
                      itemProp="image"
                      loading="eager"
                      decoding="async"
                      onError={() => setImageError(true)}
                      className="w-full h-full rounded-xl sm:rounded-2xl object-contain"
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
                </div>

                {/* Verified Badge Icon on Corner */}
                <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-white flex items-center justify-center" title="Desarrollador y Creador Oficial">
                  <ShieldCheck className="w-5 h-5 font-black" />
                </div>
              </div>
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

            {/* Ficha Biográfica Estructurada con Fecha de Nacimiento destacada */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-zinc-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">Fecha de Nacimiento</span>
                  <span className="font-bold text-zinc-900" itemProp="birthDate">29 de julio de 1973</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">Lugar de Nacimiento</span>
                  <span className="font-bold text-zinc-900" itemProp="birthPlace">Zamora, Michoacán</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">Residencia Actual</span>
                  <span className="font-bold text-zinc-900" itemProp="homeLocation">Guadalajara, Jalisco</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-zinc-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-800 block">Formación Profesional</span>
                  <span className="font-bold text-zinc-900" itemProp="alumniOf">Diplomado en Desarrollo de Software (ITESO)</span>
                </div>
              </div>
            </div>



            {/* Bio Narrative with Interspersed Support Photo Thumbnails */}
            {(() => {
              const bioParagraphs: string[] = [];
              if (founderData.bioP1) bioParagraphs.push(founderData.bioP1);
              if (founderData.bioP2) bioParagraphs.push(founderData.bioP2);
              if (founderData.bioP3) bioParagraphs.push(founderData.bioP3);

              if (bioParagraphs.length === 0 && founderData.bio) {
                founderData.bio.split(/\n\s*\n/).forEach((p) => {
                  const trimmed = p.trim();
                  if (trimmed) bioParagraphs.push(trimmed);
                });
              }

              if (bioParagraphs.length === 0 && founderData.bio1) {
                bioParagraphs.push(founderData.bio1);
                if (founderData.bio2) bioParagraphs.push(founderData.bio2);
              }

              // Support photos (photos at index >= 1 with valid URLs)
              const supportPhotos = photosList.slice(1).filter((p) => p && typeof p.url === "string" && Boolean(p.url));

              return (
                <div className="space-y-4 text-zinc-700 text-sm sm:text-base leading-relaxed font-normal" itemProp="description">
                  {/* Metaetiquetas explícitas de autoría y perfil */}
                  <meta itemProp="author" content={founderData.name} />
                  <meta itemProp="creator" content={founderData.name} />
                  <meta itemProp="jobTitle" content={founderData.role} />

                  {bioParagraphs.map((para, pIdx) => {
                    const associatedPhoto = supportPhotos[pIdx];
                    return (
                      <React.Fragment key={pIdx}>
                        <p className="whitespace-pre-line leading-relaxed text-zinc-700 text-sm sm:text-base font-normal">
                          {para}
                        </p>

                        {/* Embedded Support Photo - Expandable on tap */}
                        {associatedPhoto && (
                          <div className="my-3 flex justify-center">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-950 border border-emerald-300/70 p-1 shadow-xs flex items-center justify-center shrink-0">
                              <ExpandableImage
                                src={associatedPhoto.url}
                                alt={associatedPhoto.caption || `Alberto Reyes Sandoval - Foto ${pIdx + 2}`}
                                caption={associatedPhoto.caption || "Alberto Reyes Sandoval"}
                                className="w-full h-full object-contain rounded-lg"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {/* Remaining support photos if more photos than paragraphs */}
                  {supportPhotos.length > bioParagraphs.length && (
                    <div className="flex flex-wrap gap-3 justify-center pt-2">
                      {supportPhotos.slice(bioParagraphs.length).map((photo, extraIdx) => (
                        <div key={extraIdx} className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-950 border border-emerald-300/70 p-1 shadow-xs flex items-center justify-center shrink-0">
                          <ExpandableImage
                            src={photo.url}
                            alt={photo.caption || "Alberto Reyes Sandoval - Foto"}
                            caption={photo.caption || "Alberto Reyes Sandoval"}
                            className="w-full h-full object-contain rounded-lg"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

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

        {/* Pie de Página: Botones Oficiales y de Contacto Movidos al Pie */}
        <div className="mt-8 pt-6 border-t-2 border-emerald-100 flex flex-col gap-2.5 relative z-10">
          <div className="text-[11px] font-black uppercase tracking-wider text-emerald-900 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Enlaces Oficiales y Canales de Contacto</span>
          </div>

          {/* Google Play Store Download Button - Paquetería y Taxi Pet */}
          <a
            href="https://play.google.com/store/apps/details?id=com.frutigo.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950 hover:from-black hover:to-emerald-900 text-white font-extrabold p-3.5 sm:p-4 rounded-2xl border-2 border-emerald-500/80 shadow-md hover:shadow-xl transition-all active:scale-98 flex items-center justify-between gap-3 group/play cursor-pointer"
            title="Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet en Google Play Store"
            aria-label="Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet en Google Play Store"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0 p-2 group-hover/play:border-emerald-400 group-hover/play:scale-105 transition-all shadow-inner">
                <svg className="w-full h-full" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M325.8 243.7L88.1 6.1C82.5 0.5 74.3 -1.4 66.8 1.1 59.3 3.6 54.1 10.1 54.1 18.1V493.9c0 8 5.2 14.5 12.7 17 7.5 2.5 15.7 0.6 21.3-5L325.8 268.3c6.8-6.8 6.8-17.8 0-24.6z" fill="#00D2FF" />
                  <path d="M325.8 243.7L411.4 158.1 120.3 6.1l205.5 237.6z" fill="#00F076" />
                  <path d="M325.8 268.3L120.3 505.9 411.4 353.9 325.8 268.3z" fill="#FF3A44" />
                  <path d="M411.4 158.1l43.2 24.9c18.5 10.7 18.5 37.9 0 48.6l-43.2 24.9-38.3-38.3 38.3-40.1z" fill="#FFE000" />
                </svg>
              </div>
              <div className="text-left leading-tight min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-black block">
                  DISPONIBLE EN GOOGLE PLAY • FRUTI GO
                </span>
                <span className="text-xs sm:text-sm font-black text-white group-hover/play:text-amber-300 transition-colors block">
                  Descarga nuestra app y empieza a utilizar nuestro servicio de paquetería y taxi pet
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-green text-white px-3.5 py-2 rounded-xl text-xs font-black shrink-0 group-hover/play:bg-emerald-500 transition-colors shadow-xs">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Descargar</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </div>
          </a>

          {/* YouTube Button */}
          {founderData.youtube && (
            <a
              href={founderData.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-extrabold py-3 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-sm transition-all active:scale-98 group/yt"
              title="Canal Oficial de YouTube - Alberto Reyes Sandoval y Fruti Go"
            >
              <div className="flex items-center gap-3">
                <Youtube className="w-5 h-5 text-white group-hover/yt:scale-110 transition-transform shrink-0" />
                <span>Canal Oficial de YouTube</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80 shrink-0" />
            </a>
          )}

          {/* LinkedIn Button */}
          {founderData.linkedin && (
            <a
              href={founderData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold py-3 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-sm transition-all active:scale-98 group/link"
              title="Perfil Oficial de LinkedIn - Alberto Reyes Sandoval"
            >
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-white group-hover/link:scale-110 transition-transform shrink-0" />
                <span>Perfil LinkedIn</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-80 shrink-0" />
            </a>
          )}

          {/* Email Contact Button */}
          <a
            href={`mailto:${displayEmail}?subject=Consulta%20B2B%20/%20Plataforma%20Fruti%20Go`}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-sm transition-all active:scale-98 group/email"
            title="Correo de Contacto Oficial"
          >
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-300 group-hover/email:scale-110 transition-transform shrink-0" />
              <span>{displayEmail}</span>
            </div>
            <ExternalLink className="w-4 h-4 opacity-80 shrink-0 text-amber-300" />
          </a>

          {/* Direct Link to Media & Gallery Module */}
          <a
            href="#modulo-medios"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("modulo-medios");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                window.history.pushState(null, "", "/medios");
              }
            }}
            className="w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold py-3 px-5 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-xs transition-all active:scale-98 border border-emerald-300/80 group/medios cursor-pointer"
            title="Ver Galería de Fotos, Videos y Archivo Multimedia Oficial"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-700 group-hover/medios:scale-110 transition-transform shrink-0" />
              <span>Galería y Archivo Multimedia Oficial</span>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
              /medios
            </span>
          </a>
        </div>

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
                    "@id": `${DEFAULT_FOUNDER_PHOTO}#primaryimage`,
                    "url": DEFAULT_FOUNDER_PHOTO,
                    "contentUrl": DEFAULT_FOUNDER_PHOTO,
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
                    "image": DEFAULT_FOUNDER_PHOTO,
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
