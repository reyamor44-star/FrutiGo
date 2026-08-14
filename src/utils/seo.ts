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
    title: "Alberto Reyes Sandoval | Creador, Desarrollador Principal y Fundador de Fruti Go",
    description:
      "Alberto Reyes Sandoval nació el 29 de julio de 1973 en Zamora, Michoacán. Creador, Desarrollador Principal y Fundador de Fruti Go (https://frutigo.com.mx). Trayectoria en ingeniería de software e ITESO.",
    keywords:
      "Alberto Reyes Sandoval, Fundador Fruti Go, Creador Fruti Go, Desarrollador Fruti Go, Alberto Reyes Sandoval perfil, Fruti Go México",
    canonicalUrl: "https://frutigo.com.mx/sobre-el-desarrollador",
    ogType: "profile",
    image: DEFAULT_FOUNDER_IMAGE,
    imageAlt: "Alberto Reyes Sandoval - Creador, Desarrollador Principal y Fundador de Fruti Go",
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
    title: "Galería y Medios Oficiales | Alberto Reyes Sandoval - Fruti Go",
    description:
      "Archivo multimedia oficial, galería fotográfica, videos y presentaciones de infraestructura de Alberto Reyes Sandoval, Creador, Desarrollador Principal y Fundador de Fruti Go.",
    keywords:
      "medios Fruti Go, galeria Alberto Reyes Sandoval, fotos Alberto Reyes Sandoval, videos Fruti Go, multimedia Alberto Reyes Sandoval, prensa Fruti Go, Alberto Reyes Sandoval",
    canonicalUrl: "https://frutigo.com.mx/medios",
    ogType: "profile",
    image: DEFAULT_FOUNDER_IMAGE,
    imageAlt: "Galería y Medios Oficiales de Alberto Reyes Sandoval - Fruti Go",
  },
  galeria: {
    title: "Galería y Medios Oficiales | Alberto Reyes Sandoval - Fruti Go",
    description:
      "Archivo multimedia oficial, galería fotográfica, videos y presentaciones de infraestructura de Alberto Reyes Sandoval, Creador, Desarrollador Principal y Fundador de Fruti Go.",
    keywords:
      "galeria Fruti Go, fotos Alberto Reyes Sandoval, videos Fruti Go, multimedia Alberto Reyes Sandoval, prensa Fruti Go",
    canonicalUrl: "https://frutigo.com.mx/medios",
    ogType: "profile",
    image: DEFAULT_FOUNDER_IMAGE,
    imageAlt: "Galería y Medios Oficiales de Alberto Reyes Sandoval - Fruti Go",
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
      element.setAttribute("rel", rel);
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

  // Twitter Cards
  setMeta("name", "twitter:title", config.title);
  setMeta("name", "twitter:description", config.description);
  setMeta("name", "twitter:image", image);
  setMeta("name", "twitter:image:alt", imageAlt);
}
