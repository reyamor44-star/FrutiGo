export type ProductCategory = "Frutas" | "Verduras" | "Hierbas y Aromáticas" | "Secos y Especias" | "Otros";

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: ProductCategory;
  description: string;
  image: string;
  presentation?: string;
  status?: "incompleto" | "completo";

  // Campos Fiscales SAT CFDI 4.0
  clave_sat?: string; // ClaveProdServ (ej. "50111500")
  unidad_sat?: string; // ClaveUnidad (ej. "KGM", "H87")
  objeto_imp?: string; // "01" | "02" | "03" (Default "02")
  impuesto_tipo?: string; // "002" | "003" | "EXENTO" (Default "002")
  tasa_ocuota?: number; // ej. 0.160000, 0.000000, 0.080000
  precio_incluye_iva?: boolean; // Default true
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface TopBannerData {
  bannerUrl: string | null;
  bannerUrlEs?: string | null;
  bannerUrlEn?: string | null;
  title: string;
  subtitle: string;
  ctaText?: string;
}

export interface OpenPayConfig {
  openpayUrl: string;
  merchantId: string;
  publicKey?: string;
  privateKey?: string;
  sandboxMode?: boolean;
}

export interface SatEmisorConfig {
  emisorRfc: string;
  emisorRazonSocial: string;
  emisorRegimenFiscal: string;
  emisorZipCode: string;
  sfApiToken: string;
  sfEnvironment: "sandbox" | "production";
  csdCertPem?: string;
  csdKeyPem?: string;
  csdPassword?: string;
  updatedAt?: string;
}

export interface BillingInfo {
  requiresInvoice: boolean;
  rfc?: string;
  razonSocial?: string;
  zipCode?: string;
  regimenFiscal?: string;
  usoCFDI?: string;
  email?: string;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  municipalityZip: string;
  municipality?: string;
  references: string;
  deliveryDate?: string;
  deliveryTimeWindow?: string;
  billingInfo?: BillingInfo;
}

export interface OrderSummary {
  orderId: string;
  date: string;
  deliveryDate?: string;
  deliveryTimeWindow?: string;
  items: CartItem[];
  total: number;
  status: "completed" | "pending" | "paid";
  paymentMethod?: "card" | "transfer" | "whatsapp" | "openpay";
  paymentStatus?: "paid" | "pending_whatsapp" | "pending";
  invoiceAllowedByAdmin?: boolean;
  customer?: ShippingInfo;
  billingInfo?: BillingInfo;
  invoiceStatus?: "issued" | "requested" | "timbrada" | "none";
  invoiceDetails?: any;
  openpayDetails?: {
    authorization?: string;
    transactionId?: string;
    status?: string;
    merchantId?: string;
    cardBrand?: string;
    cardNumber?: string;
  };
}

export interface PdfConfig {
  pdfLogoUrl: string | null;
  pdfQrUrl: string | null;
  playStoreAppUrl?: string;
  appNoticeText?: string;
}

export type ActiveView = "legal" | "tienda" | "admin" | "registro";

export interface AppRegistrationData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: "cliente" | "repartidor" | "negocio";
  termsAccepted: boolean;
  createdAt: string;
  source?: string;
}

export interface ClientProfile {
  id?: string;
  rfc: string;
  razonSocial: string;
  zipCode: string;
  regimenFiscal?: string;
  usoCFDI?: string;
  email?: string;
  telefono?: string;
  phone?: string;
  direccion?: string;
  address?: string;
}

export interface LandingPageContent {
  id: "taxis" | "ciudad-a-ciudad" | "fletes-y-carga" | "taxi-pet";
  path: string;
  url: string;
  filename: string;
  name: string;
  icon: string;
  themeColor: string;

  // SEO Google tags
  title: string;
  metaDescription: string;
  keywords: string;

  // Visual text on page
  topBarText: string;
  badgeText: string;
  heroH1Prefix: string;
  heroH1Highlight: string;
  heroDesc: string;

  // Key benefits bullets
  benefit1: string;
  benefit2: string;
  benefit3: string;
  benefit4: string;

  // Card
  cardTitle: string;
  cardDesc: string;
  cardStatNumber: string;
  cardStatText: string;

  // Features Section
  sectionTag: string;
  sectionTitle: string;
  sectionSubtitle: string;

  // WhatsApp
  whatsappPhone: string;
  whatsappPretext: string;

  // Banner CTA
  ctaBannerTitle: string;
  ctaBannerDesc: string;

  // FAQ
  faq1Question: string;
  faq1Answer: string;
  faq2Question: string;
  faq2Answer: string;
  faq3Question: string;
  faq3Answer: string;
}
