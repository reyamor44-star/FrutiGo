export interface SeoConfig {
  title: string;
  ogTitle?: string;
  twitterTitle?: string;
  description: string;
  ogDescription?: string;
  twitterDescription?: string;
  keywords?: string;
  canonicalUrl: string;
  ogType?: "website" | "profile" | "article";
  image?: string;
  imageAlt?: string;
  schemaJsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_BRAND_IMAGE = "https://frutigo.com.mx/logo.png";

// Standard brand keywords and service coverage across all canonical sections
const CORE_BRAND_KEYWORDS =
  "FrutiGo, Fruti Go, frutigo, fruti go, FrutiGo Technologies, FrutiGo Logistics, FrutiGo App, reparto a domicilio, envíos última milla, delivery Los Cabos, repartidores San José del Cabo, Cabo San Lucas, frutas y verduras mayoreo Zapopan, abastecimiento restaurantes, logística local";

export const SEO_SECTION_DATA: Record<string, SeoConfig> = {
  inicio: {
    title: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    ogTitle: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    twitterTitle: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    description:
      "Los taxistas pueden registrarse para negociar viajes en línea con 0% de comisión en la ZMG. Ganancias 100% en efectivo al instante, sin comisiones abusivas y trato directo con el pasajero en Fruti Go Driver.",
    ogDescription:
      "Los taxistas pueden registrarse para negociar viajes en línea con 0% de comisión en la ZMG. Ganancias 100% en efectivo al instante, sin comisiones abusivas y trato directo con el pasajero en Fruti Go Driver.",
    keywords: `${CORE_BRAND_KEYWORDS}, Registro de Taxis Guadalajara, Fruti Go Driver, taxistas ZMG, 0% comisión taxi, viajes en línea taxi Guadalajara, negociar viajes taxi`,
    canonicalUrl: "https://frutigo.com.mx/",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    schemaJsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Fruti Go Driver",
      "alternateName": ["Fruti Go", "frutigo", "FrutiGo Technologies", "FrutiGo Logistics"],
      "url": "https://frutigo.com.mx",
      "logo": "https://frutigo.com.mx/logo.png",
      "sameAs": [
        "https://play.google.com/store/apps/details?id=com.frutigo.app"
      ],
      "description": "Los taxistas pueden registrarse para negociar viajes en línea con 0% de comisión en la ZMG."
    }
  },
  tienda: {
    title: "Tienda y Catálogo Mayorista | FrutiGo Logistics & Technologies",
    ogTitle: "Tienda y Catálogo Mayorista | FrutiGo Logistics",
    twitterTitle: "Tienda y Catálogo Mayorista | FrutiGo Logistics",
    description:
      "Catálogo oficial y tienda en línea de FrutiGo. Frutas y verduras al mayoreo en Zapopan, Guadalajara y Los Cabos, abastecimiento de restaurantes, reparto a domicilio y comercio B2B/B2C.",
    ogDescription:
      "Catálogo mayorista y tienda oficial de FrutiGo. Distribución agroalimentaria, abastecimiento a restaurantes y entregas express de frutas y verduras frescas.",
    keywords: `${CORE_BRAND_KEYWORDS}, tienda FrutiGo, frutas a domicilio, verduras frescas Guadalajara, frutas por caja Zapopan, catálogo mayorista`,
    canonicalUrl: "https://frutigo.com.mx/tienda",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Tienda y Catálogo Mayorista FrutiGo",
    schemaJsonLd: {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": "FrutiGo Tienda y Mayoreo",
      "alternateName": ["FrutiGo Store", "Fruti Go Tienda", "FrutiGo Mayoreo"],
      "url": "https://frutigo.com.mx/tienda",
      "image": "https://frutigo.com.mx/logo.png",
      "description": "Tienda en línea y catálogo de frutas, verduras y abarrotes con distribución mayorista y reparto a domicilio en Zapopan, Guadalajara y Los Cabos.",
      "parentOrganization": {
        "@type": "Organization",
        "name": "FrutiGo",
        "url": "https://frutigo.com.mx"
      },
      "areaServed": [
        { "@type": "City", "name": "Zapopan" },
        { "@type": "City", "name": "Guadalajara" },
        { "@type": "City", "name": "San José del Cabo" },
        { "@type": "City", "name": "Cabo San Lucas" }
      ],
      "paymentAccepted": "Cash, Credit Card, Debit Card, Openpay",
      "priceRange": "$$"
    }
  },
  cliente: {
    title: "Portal de Acceso Mayorista B2B | FrutiGo Logistics",
    ogTitle: "Portal de Acceso Mayorista B2B | FrutiGo Logistics",
    twitterTitle: "Portal de Acceso Mayorista B2B | FrutiGo Logistics",
    description:
      "Acceso mayorista B2B de FrutiGo Logistics. Abastecimiento agroalimentario institucional directo del campo para empresas, restaurantes y comercios con precios preferenciales en Zapopan y Los Cabos.",
    keywords: `${CORE_BRAND_KEYWORDS}, FrutiGo B2B, FrutiGo Mayorista, distribución agroalimentaria B2B, abastecimiento restaurantes Zapopan, compras mayoreo FrutiGo`,
    canonicalUrl: "https://frutigo.com.mx/cliente",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "FrutiGo Logistics - Portal Mayorista B2B",
  },
  desarrollador: {
    title: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    ogTitle: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    twitterTitle: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    description:
      "Conoce la plataforma tecnológica detrás de FrutiGo: logística de última milla, envíos express, despacho inteligente y abastecimiento B2B/B2C en México.",
    ogDescription:
      "Conoce la plataforma tecnológica detrás de FrutiGo: logística de última milla, abastecimiento B2B y despacho inteligente.",
    keywords: `${CORE_BRAND_KEYWORDS}, sobre el desarrollador FrutiGo, arquitectura logística, ruteo inteligente, ingeniería de software FrutiGo`,
    canonicalUrl: "https://frutigo.com.mx/nosotros",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Acerca de FrutiGo Technologies",
    schemaJsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "Acerca de FrutiGo Technologies",
      "url": "https://frutigo.com.mx/nosotros",
      "description": "Infraestructura tecnológica, logística de última milla y visión corporativa de FrutiGo Technologies en México.",
      "mainEntity": {
        "@type": "Organization",
        "name": "FrutiGo",
        "alternateName": ["Fruti Go", "frutigo", "FrutiGo Technologies", "FrutiGo Logistics"],
        "url": "https://frutigo.com.mx",
        "logo": "https://frutigo.com.mx/logo.png"
      }
    }
  },
  nosotros: {
    title: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    ogTitle: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    twitterTitle: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    description:
      "Conoce la plataforma tecnológica detrás de FrutiGo: logística de última milla, envíos express, despacho inteligente y abastecimiento B2B/B2C en México.",
    ogDescription:
      "Conoce la plataforma tecnológica detrás de FrutiGo: logística de última milla, abastecimiento B2B y despacho inteligente.",
    keywords: `${CORE_BRAND_KEYWORDS}, sobre nosotros FrutiGo, infraestructura logística, comercio digital, ruteo inteligente, despacho inteligente`,
    canonicalUrl: "https://frutigo.com.mx/nosotros",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Acerca de FrutiGo Technologies",
    schemaJsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "Acerca de FrutiGo Technologies",
      "url": "https://frutigo.com.mx/nosotros",
      "description": "Infraestructura tecnológica, logística de última milla y visión corporativa de FrutiGo Technologies en México.",
      "mainEntity": {
        "@type": "Organization",
        "name": "FrutiGo",
        "alternateName": ["Fruti Go", "frutigo", "FrutiGo Technologies", "FrutiGo Logistics"],
        "url": "https://frutigo.com.mx",
        "logo": "https://frutigo.com.mx/logo.png"
      }
    }
  },
  fundador: {
    title: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    ogTitle: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    twitterTitle: "Acerca de Nosotros e Infraestructura Tecnológica | FrutiGo Technologies",
    description:
      "Conoce la plataforma tecnológica detrás de FrutiGo: logística de última milla, envíos express, despacho inteligente y abastecimiento B2B/B2C en México.",
    ogDescription:
      "Conoce la plataforma tecnológica detrás de FrutiGo: logística de última milla, abastecimiento B2B y despacho inteligente.",
    keywords: `${CORE_BRAND_KEYWORDS}, FrutiGo Technologies, infraestructura logística, comercio digital`,
    canonicalUrl: "https://frutigo.com.mx/nosotros",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Acerca de FrutiGo Technologies",
  },
  medios: {
    title: "Sala de Prensa y Medios Oficiales | FrutiGo Technologies",
    ogTitle: "Sala de Prensa Oficial | FrutiGo Technologies",
    twitterTitle: "Sala de Prensa Oficial | FrutiGo Technologies",
    description:
      "Sala de prensa y comunicación institucional, publicaciones corporativas, comunicados oficiales y galería de medios de FrutiGo Technologies y FrutiGo Logistics.",
    ogDescription:
      "Sala de prensa y comunicación institucional, publicaciones corporativas y comunicados oficiales de FrutiGo Technologies.",
    keywords: `${CORE_BRAND_KEYWORDS}, medios FrutiGo, sala de prensa FrutiGo, comunicados oficiales FrutiGo, galería multimedia FrutiGo Technologies`,
    canonicalUrl: "https://frutigo.com.mx/medios",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Sala de Prensa Oficial | FrutiGo Technologies",
    schemaJsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Sala de Prensa y Medios Oficiales FrutiGo",
      "url": "https://frutigo.com.mx/medios",
      "description": "Sala de prensa institucional y archivo multimedia de comunicados de FrutiGo Technologies.",
      "publisher": {
        "@type": "Organization",
        "name": "FrutiGo",
        "url": "https://frutigo.com.mx",
        "logo": "https://frutigo.com.mx/logo.png"
      }
    }
  },
  galeria: {
    title: "Sala de Prensa y Medios Oficiales | FrutiGo Technologies",
    ogTitle: "Sala de Prensa Oficial | FrutiGo Technologies",
    twitterTitle: "Sala de Prensa Oficial | FrutiGo Technologies",
    description:
      "Sala de prensa y comunicación institucional, publicaciones corporativas, comunicados oficiales y galería de medios de FrutiGo Technologies y FrutiGo Logistics.",
    ogDescription:
      "Sala de prensa y comunicación institucional, publicaciones corporativas y comunicados oficiales de FrutiGo Technologies.",
    keywords: `${CORE_BRAND_KEYWORDS}, medios FrutiGo, sala de prensa FrutiGo, comunicados oficiales FrutiGo`,
    canonicalUrl: "https://frutigo.com.mx/medios",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Sala de Prensa Oficial | FrutiGo Technologies",
  },
  politicas: {
    title: "FrutiGo Technologies & Logistics | Políticas de Operación y Calidad",
    ogTitle: "FrutiGo Technologies & Logistics | Políticas de Operación y Calidad",
    twitterTitle: "FrutiGo Technologies & Logistics | Políticas de Operación y Calidad",
    description:
      "Políticas institucionales de operación logística, cobertura de distribución, estándares de calidad e inocuidad y garantías de servicio en FrutiGo Logistics.",
    keywords: `${CORE_BRAND_KEYWORDS}, Políticas FrutiGo, cobertura logística, estándares de calidad, garantías FrutiGo Technologies`,
    canonicalUrl: "https://frutigo.com.mx/politicas",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "FrutiGo Logistics - Políticas Operativas",
  },
  terminos: {
    title: "FrutiGo Technologies | Términos y Condiciones de Servicio",
    ogTitle: "FrutiGo Technologies | Términos y Condiciones de Servicio",
    twitterTitle: "FrutiGo Technologies | Términos y Condiciones de Servicio",
    description:
      "Términos y condiciones contractuales y de uso de la plataforma digital, pasarelas de pago y servicios ofrecidos por FrutiGo Technologies.",
    keywords: `${CORE_BRAND_KEYWORDS}, Términos y condiciones FrutiGo, contrato de servicio, términos de plataforma, legal FrutiGo Technologies`,
    canonicalUrl: "https://frutigo.com.mx/terminos",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "FrutiGo Technologies - Términos y Condiciones",
  },
  privacidad: {
    title: "FrutiGo Technologies | Aviso de Privacidad y Protección de Datos",
    ogTitle: "FrutiGo Technologies | Aviso de Privacidad y Protección de Datos",
    twitterTitle: "FrutiGo Technologies | Aviso de Privacidad y Protección de Datos",
    description:
      "Aviso de Privacidad integral de FrutiGo Technologies y FrutiGo Logistics conforme a la legislación de protección de datos personales en posesión de particulares.",
    keywords: `${CORE_BRAND_KEYWORDS}, Aviso de privacidad FrutiGo, protección de datos personales, seguridad informática FrutiGo Technologies, derechos ARCO`,
    canonicalUrl: "https://frutigo.com.mx/privacidad",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "FrutiGo Technologies - Aviso de Privacidad",
  },
  soporte: {
    title: "FrutiGo Technologies | Centro de Asistencia y Soporte Institucional",
    ogTitle: "FrutiGo Technologies | Centro de Asistencia y Soporte Institucional",
    twitterTitle: "FrutiGo Technologies | Centro de Asistencia y Soporte Institucional",
    description:
      "Centro de soporte técnico, facturación electrónica CFDI y atención a clientes y empresas afiliadas en FrutiGo Technologies.",
    keywords: `${CORE_BRAND_KEYWORDS}, Soporte FrutiGo, facturación CFDI FrutiGo, atención institucional FrutiGo Technologies`,
    canonicalUrl: "https://frutigo.com.mx/soporte",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "FrutiGo Technologies - Centro de Soporte",
  },
  cuenta: {
    title: "FrutiGo Technologies | Gestión y Eliminación de Cuentas",
    ogTitle: "FrutiGo Technologies | Gestión y Eliminación de Cuentas",
    twitterTitle: "FrutiGo Technologies | Gestión y Eliminación de Cuentas",
    description:
      "Portal institucional de gestión de derechos de privacidad y solicitud formal de revocación o eliminación de cuenta de usuario en FrutiGo Technologies.",
    keywords: `${CORE_BRAND_KEYWORDS}, Eliminar cuenta FrutiGo, baja de usuario FrutiGo Technologies, derechos de datos`,
    canonicalUrl: "https://frutigo.com.mx/cuenta",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "FrutiGo Technologies - Gestión de Cuenta",
  },
  articulos: {
    title: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    ogTitle: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    twitterTitle: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    description:
      "Los taxistas pueden registrarse para negociar viajes en línea con 0% de comisión en la ZMG. Ganancias 100% en efectivo al instante, sin comisiones abusivas y trato directo con el pasajero en Fruti Go Driver.",
    keywords: `${CORE_BRAND_KEYWORDS}, Registro de Taxis Guadalajara, Fruti Go Driver, taxistas ZMG, 0% comisión taxi, viajes en línea taxi Guadalajara, negociar viajes taxi, artículos FrutiGo`,
    canonicalUrl: "https://frutigo.com.mx/articulos",
    ogType: "article",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
  },
  registro: {
    title: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    ogTitle: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    twitterTitle: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    description:
      "Los taxistas pueden registrarse para negociar viajes en línea con 0% de comisión en la ZMG. Ganancias 100% en efectivo al instante, sin comisiones abusivas y trato directo con el pasajero en Fruti Go Driver.",
    keywords: `${CORE_BRAND_KEYWORDS}, Registro de Taxis Guadalajara, Fruti Go Driver, taxistas ZMG, 0% comisión taxi, registrar taxi Guadalajara, FrutiGo Driver`,
    canonicalUrl: "https://frutigo.com.mx/registrofrutigo",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
  },
  registrofrutigo: {
    title: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    ogTitle: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    twitterTitle: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
    description:
      "Los taxistas pueden registrarse para negociar viajes en línea con 0% de comisión en la ZMG. Ganancias 100% en efectivo al instante, sin comisiones abusivas y trato directo con el pasajero en Fruti Go Driver.",
    keywords: `${CORE_BRAND_KEYWORDS}, Registro de Taxis Guadalajara, Fruti Go Driver, taxistas ZMG, 0% comisión taxi, registrar taxi Guadalajara, FrutiGo Driver`,
    canonicalUrl: "https://frutigo.com.mx/registrofrutigo",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Registro de Taxis en Fruti Go Driver | 0% Comisión en Guadalajara",
  },
};

/**
 * Updates DOM head meta tags and Schema.org JSON-LD dynamically for SEO and Social Sharing
 */
export function updateDynamicMetadata(config: SeoConfig) {
  if (typeof document === "undefined") return;

  // 1. Document Title
  document.title = config.title;

  // Helper to update or create meta tag
  const setMeta = (attribute: "name" | "property", attrValue: string, content: string) => {
    let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  // Helper to update or create link tag
  const setLink = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement("link");
      element.setAttribute(rel, rel);
      document.head.appendChild(element);
    }
    element.setAttribute("href", href);
  };

  const image = config.image || DEFAULT_BRAND_IMAGE;
  const imageAlt = config.imageAlt || config.title;
  const ogType = config.ogType || "website";
  const ogTitle = config.ogTitle || config.title;
  const twitterTitle = config.twitterTitle || config.title;
  const ogDesc = config.ogDescription || config.description;
  const twitterDesc = config.twitterDescription || config.description;

  // Standard Meta Tags
  setMeta("name", "description", config.description);
  setMeta("name", "author", "FrutiGo Technologies");
  setMeta("name", "publisher", "FrutiGo Technologies");
  if (config.keywords) {
    setMeta("name", "keywords", config.keywords);
  }
  setLink("canonical", config.canonicalUrl);

  // Dublin Core
  setMeta("name", "DC.title", config.title);
  setMeta("name", "DC.description", config.description);

  // Open Graph
  setMeta("property", "og:title", ogTitle);
  setMeta("property", "og:description", ogDesc);
  setMeta("property", "og:url", config.canonicalUrl);
  setMeta("property", "og:type", ogType);
  setMeta("property", "og:image", image);
  setMeta("property", "og:image:url", image);
  setMeta("property", "og:image:secure_url", image);
  setMeta("property", "og:image:alt", imageAlt);
  setMeta("property", "og:image:type", "image/png");
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "630");

  // Google Thumbnail & Image Link Indexing
  setMeta("name", "thumbnail", image);
  setMeta("name", "image", image);
  setMeta("name", "googlebot", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  setLink("image_src", image);

  // Twitter Cards
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", twitterTitle);
  setMeta("name", "twitter:description", twitterDesc);
  setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:image:alt", imageAlt);

  // Dynamic Schema.org JSON-LD injection for the specific page
  let schemaScript = document.getElementById("dynamic-route-schema-jsonld") as HTMLScriptElement | null;
  if (config.schemaJsonLd) {
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "dynamic-route-schema-jsonld";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(config.schemaJsonLd, null, 2);
  } else if (schemaScript) {
    schemaScript.remove();
  }
}
