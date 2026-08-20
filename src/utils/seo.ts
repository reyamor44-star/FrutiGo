export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogType?: "website" | "profile" | "article";
  image?: string;
  imageAlt?: string;
}

const DEFAULT_FOUNDER_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/frutigo3.firebasestorage.app/o/founder-photos%2F1786483956397_vlk1om.jpg?alt=media&token=e622e4ce-4b10-486d-a296-45690f0f4ccd";
const DEFAULT_BRAND_IMAGE = "https://frutigo.com.mx/logo.png";

export const SEO_SECTION_DATA: Record<string, SeoConfig> = {
  tienda: {
    title: "Fruti Go | Tienda en Línea de Frutas Frescas y Delivery Exprés",
    description:
      "Fruti Go es la tienda oficial en línea de frutas y productos frescos con entrega a domicilio exprés en Guadalajara y México. Descubre nuestro catálogo, precios directos y calidad garantizada.",
    keywords:
      "Fruti Go, frutas a domicilio, verduras frescas Guadalajara, tienda en linea Fruti Go, delivery de frutas exprés, comprar fruta online, frutas frescas México, pedidos frutigo, frutigo delivery",
    canonicalUrl: "https://frutigo.com.mx/tienda",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Fruti Go - Tienda en Línea y Delivery Exprés",
  },
  desarrollador: {
    title: "Alberto Reyes Sandoval | Fundador y Desarrollador de FrutiGo",
    description:
      "Conoce a Alberto Reyes Sandoval, fundador y desarrollador de FrutiGo en Guadalajara, México. Conoce su historia, visión técnica, arquitectura de software y trayectoria profesional.",
    keywords:
      "Alberto Reyes Sandoval, Alberto Reyes Sandoval FrutiGo, Fundador y Desarrollador de FrutiGo, Creador FrutiGo, Desarrollador FrutiGo, Alberto Reyes Sandoval Guadalajara, Alberto Reyes Sandoval México, FrutiGo",
    canonicalUrl: "https://frutigo.com.mx/desarrollador",
    ogType: "profile",
    image: DEFAULT_FOUNDER_IMAGE,
    imageAlt: "Alberto Reyes Sandoval desarrollador de FrutiGo",
  },
  fundador: {
    title: "Alberto Reyes Sandoval | Fundador y Desarrollador de FrutiGo",
    description:
      "Conoce a Alberto Reyes Sandoval, fundador y desarrollador de FrutiGo en Guadalajara, México. Conoce su historia, visión técnica, arquitectura de software y trayectoria profesional.",
    keywords:
      "Alberto Reyes Sandoval, Alberto Reyes Sandoval FrutiGo, Fundador y Desarrollador de FrutiGo, Creador FrutiGo, Desarrollador FrutiGo, Alberto Reyes Sandoval Guadalajara, Alberto Reyes Sandoval México, FrutiGo",
    canonicalUrl: "https://frutigo.com.mx/desarrollador",
    ogType: "profile",
    image: DEFAULT_FOUNDER_IMAGE,
    imageAlt: "Alberto Reyes Sandoval desarrollador de FrutiGo",
  },
  politicas: {
    title: "Fruti Go | Políticas de Envío, Entrega y Garantía de Frescura",
    description:
      "Políticas oficiales de operación, cobertura geográfica, tiempos de entrega rápida, estándares de inocuidad y garantías de devolución en Fruti Go México.",
    keywords:
      "Políticas Fruti Go, envíos Fruti Go, cobertura delivery frutas, entregas a domicilio, devoluciones Fruti Go, garantía de frescura",
    canonicalUrl: "https://frutigo.com.mx/politicas",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Fruti Go - Políticas Operativas y de Envío",
  },
  terminos: {
    title: "Fruti Go | Términos y Condiciones de Servicio y Compra",
    description:
      "Consulta los Términos y Condiciones oficiales de la plataforma y tienda en línea Fruti Go. Información sobre pedidos, pagos electrónicos y uso de la plataforma.",
    keywords:
      "Términos y condiciones Fruti Go, contrato de servicio delivery, términos de compra frutas frescas, legal Fruti Go",
    canonicalUrl: "https://frutigo.com.mx/terminos",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Fruti Go - Términos y Condiciones",
  },
  privacidad: {
    title: "Fruti Go | Aviso de Privacidad y Protección de Datos Personales",
    description:
      "Aviso de Privacidad integral de Fruti Go. Conoce cómo protegemos, tratamos y salvaguardamos tus datos personales y transacciones según la legislación mexicana.",
    keywords:
      "Aviso de privacidad Fruti Go, protección de datos personales, privacidad compras online, derechos ARCO Fruti Go",
    canonicalUrl: "https://frutigo.com.mx/privacidad",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Fruti Go - Aviso de Privacidad",
  },
  nosotros: {
    title: "Fruti Go | Sobre Nosotros - Misión, Frescura y Tecnología",
    description:
      "Descubre la historia y misión de Fruti Go: conectamos a productores del campo con hogares y negocios mediante tecnología mexicana y logística de entrega rápida.",
    keywords:
      "Sobre nosotros Fruti Go, historia Fruti Go, empresa frutas Guadalajara, tecnología delivery México, misión Fruti Go",
    canonicalUrl: "https://frutigo.com.mx/sobre-nosotros",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Fruti Go - Sobre Nosotros",
  },
  soporte: {
    title: "Fruti Go | Centro de Ayuda, Soporte al Cliente y Facturación",
    description:
      "Atención al cliente y centro de soporte oficial de Fruti Go. Resuelve dudas sobre tus pedidos, estatus de envío, facturación CFDI o asistencia técnica.",
    keywords:
      "Soporte Fruti Go, ayuda pedidos frutas, facturación Fruti Go, contacto Fruti Go, atención a clientes Guadalajara",
    canonicalUrl: "https://frutigo.com.mx/soporte",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Fruti Go - Centro de Ayuda y Soporte",
  },
  cuenta: {
    title: "Fruti Go | Solicitud de Eliminación de Cuenta y Datos",
    description:
      "Formulario oficial y procedimiento transparente para solicitar la eliminación de tu cuenta de usuario y borrado definitivo de datos personales en Fruti Go.",
    keywords:
      "Eliminar cuenta Fruti Go, borrar datos personales, baja de usuario Fruti Go, desregistro",
    canonicalUrl: "https://frutigo.com.mx/cuenta",
    ogType: "website",
    image: DEFAULT_BRAND_IMAGE,
    imageAlt: "Fruti Go - Eliminación de Cuenta",
  },
  medios: {
    title: "Medios y Prensa | Alberto Reyes Sandoval - FrutiGo",
    description:
      "Sala de prensa, archivo multimedia oficial, galería fotográfica y videos de YouTube de Alberto Reyes Sandoval, Fundador y Desarrollador de FrutiGo en México.",
    keywords:
      "Medios y Prensa Alberto Reyes Sandoval, Alberto Reyes Sandoval Medios, Prensa FrutiGo, Galería Alberto Reyes Sandoval, Videos Alberto Reyes Sandoval FrutiGo, FrutiGo México",
    canonicalUrl: "https://frutigo.com.mx/medios",
    ogType: "profile",
    image: DEFAULT_FOUNDER_IMAGE,
    imageAlt: "Medios y Prensa | Alberto Reyes Sandoval - FrutiGo",
  },
  articulos: {
    title: "Artículos y Publicaciones Técnicas | Alberto Reyes Sandoval - FrutiGo",
    description:
      "Artículos oficiales, publicaciones técnicas y ensayos sobre arquitectura de software, logística B2B y tecnología en FrutiGo por Alberto Reyes Sandoval.",
    keywords:
      "articulos FrutiGo, publicaciones Alberto Reyes Sandoval, blog Alberto Reyes Sandoval, arquitectura software FrutiGo, ensayos tecnologia Alberto Reyes Sandoval, Alberto Reyes Sandoval",
    canonicalUrl: "https://frutigo.com.mx/articulos",
    ogType: "website",
    image: DEFAULT_FOUNDER_IMAGE,
    imageAlt: "Artículos y Publicaciones Técnicas - Alberto Reyes Sandoval FrutiGo",
  },
  galeria: {
    title: "Medios y Prensa | Alberto Reyes Sandoval - FrutiGo",
    description:
      "Sala de prensa, archivo multimedia oficial, galería fotográfica y videos de YouTube de Alberto Reyes Sandoval, Fundador y Desarrollador de FrutiGo en México.",
    keywords:
      "Medios y Prensa Alberto Reyes Sandoval, Alberto Reyes Sandoval Medios, Prensa FrutiGo, Galería Alberto Reyes Sandoval, Videos Alberto Reyes Sandoval FrutiGo, FrutiGo México",
    canonicalUrl: "https://frutigo.com.mx/medios",
    ogType: "profile",
    image: DEFAULT_FOUNDER_IMAGE,
    imageAlt: "Medios y Prensa | Alberto Reyes Sandoval - FrutiGo",
  },
  registro: {
    title: "Registro Fruti Go | Crea tu Cuenta Oficial en la App Fruti Go",
    description:
      "Regístrate en la app oficial de Fruti Go (frutigo.com.mx). Crea tu cuenta con tu nombre, correo y teléfono para ordenar frutas frescas, paquetería urbana y taxi pet. Descarga la app en Google Play Store.",
    keywords:
      "Registro Fruti Go, crear cuenta Fruti Go, app Fruti Go, registro app delivery, descargar Fruti Go, frutas a domicilio, registrofrutigo, frutigo.com.mx registro",
    canonicalUrl: "https://frutigo.com.mx/registrofrutigo",
    ogType: "website",
    image: "https://frutigo.com.mx/frutigo-logo-oficial-amarillo.svg",
    imageAlt: "Fruti Go - Formulario de Registro Oficial",
  },
  registrofrutigo: {
    title: "Registro Fruti Go | Crea tu Cuenta Oficial en la App Fruti Go",
    description:
      "Regístrate en la app oficial de Fruti Go (frutigo.com.mx). Crea tu cuenta con tu nombre, correo y teléfono para ordenar frutas frescas, paquetería urbana y taxi pet. Descarga la app en Google Play Store.",
    keywords:
      "Registro Fruti Go, crear cuenta Fruti Go, app Fruti Go, registro app delivery, descargar Fruti Go, frutas a domicilio, registrofrutigo, frutigo.com.mx registro",
    canonicalUrl: "https://frutigo.com.mx/registrofrutigo",
    ogType: "website",
    image: "https://frutigo.com.mx/frutigo-logo-oficial-amarillo.svg",
    imageAlt: "Fruti Go - Formulario de Registro Oficial",
  },
};

/**
 * Updates DOM head meta tags dynamically for SEO and Social Sharing
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

  // Standard Meta Tags
  setMeta("name", "description", config.description);
  if (config.keywords) {
    setMeta("name", "keywords", config.keywords);
  }
  setLink("canonical", config.canonicalUrl);

  // Dublin Core
  setMeta("name", "DC.title", config.title);
  setMeta("name", "DC.description", config.description);

  // Open Graph
  setMeta("property", "og:title", config.title);
  setMeta("property", "og:description", config.description);
  setMeta("property", "og:url", config.canonicalUrl);
  setMeta("property", "og:type", ogType);
  setMeta("property", "og:image", image);
  setMeta("property", "og:image:url", image);
  setMeta("property", "og:image:secure_url", image);
  setMeta("property", "og:image:alt", imageAlt);
  setMeta("property", "og:image:type", "image/jpeg");
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "1600");

  // Google Thumbnail & Image Link Indexing
  setMeta("name", "thumbnail", image);
  setMeta("name", "image", image);
  setMeta("name", "googlebot", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  setLink("image_src", image);

  // Twitter Cards
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", config.title);
  setMeta("name", "twitter:description", config.description);
  setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:image:alt", imageAlt);
}
