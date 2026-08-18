import React, { useState, useEffect, ChangeEvent } from "react";
import { 
  Lock, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  CheckCircle2, 
  X,
  Store,
  Layers,
  Sparkles,
  CreditCard,
  ExternalLink,
  ShieldCheck,
  PackageCheck,
  MessageCircle,
  PhoneCall,
  MapPin,
  User,
  Clock,
  RefreshCw,
  Search,
  Calendar,
  Truck,
  Phone,
  AlertCircle,
  FileText,
  FileCode,
  Download,
  QrCode,
  Users,
  Package,
  FileSpreadsheet,
  UploadCloud,
  UserCheck,
  BookOpen,
  Tag
} from "lucide-react";
import { Product, TopBannerData, OpenPayConfig, OrderSummary, PdfConfig, ClientProfile } from "../types";
import { DEFAULT_PRODUCTS } from "../data/defaultStoreData";
import { DEFAULT_CLIENTS } from "../data/defaultClients";
import { sortArticlesNewestFirst } from "../utils/articleUtils";
import { generateOrderPDF, generateCFDIPDF, downloadCFDIXML, generatePriceListPDF } from "../utils/pdfGenerator";
import { SAT_PRODUCT_CODES, SAT_UNITS, SAT_TAX_OPTIONS, SAT_OBJETO_IMP_OPTIONS } from "../data/satProductCodes";
import { getProductWhiteBgImage } from "../utils/productImages";
import { FounderProfileCard, FounderData, DEFAULT_FOUNDER_DATA } from "./FounderProfileCard";
import AdminFundadorMedia from "./AdminFundadorMedia";
import AdminUsuariosFirestore from "./AdminUsuariosFirestore";
import { compressImageFile } from "../utils/imageCompressor";

interface AdminPanelProps {
  currentBanner: TopBannerData;
  products: Product[];
  customLogo: string | null;
  openpayConfig: OpenPayConfig;
  pdfConfig?: PdfConfig;
  orders?: OrderSummary[];
  onSaveBanner: (newBanner: TopBannerData, pass: string) => Promise<boolean>;
  onSaveProducts: (newProducts: Product[], pass: string) => Promise<boolean>;
  onSaveLogo: (logoUrl: string | null, pass: string) => Promise<boolean>;
  onSaveOpenPay: (config: OpenPayConfig, pass: string) => Promise<boolean>;
  onSavePdfConfig?: (config: PdfConfig, pass: string) => Promise<boolean>;
  onUpdateOrderStatus?: (orderId: string, status: "pending" | "completed" | "paid", pass: string) => Promise<boolean>;
  onCloseAdmin: () => void;
}

export default function AdminPanel({
  currentBanner,
  products,
  customLogo,
  openpayConfig,
  pdfConfig,
  orders,
  onSaveBanner,
  onSaveProducts,
  onSaveLogo,
  onSaveOpenPay,
  onSavePdfConfig,
  onUpdateOrderStatus,
  onCloseAdmin
}: AdminPanelProps) {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("fg_admin_auth") === "true";
      } catch (e) {}
    }
    return false;
  });
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("1234");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Navigation Tabs inside Admin
  const [activeTab, setActiveTab] = useState<"banner" | "products" | "bulk-upload" | "logo" | "openpay" | "pdf" | "orders" | "sat" | "clients" | "usuarios-firestore" | "desarrollador" | "fundador-media">((): any => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fg_admin_tab");
        if (saved) return saved;
      } catch (e) {}
    }
    return "banner";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fg_admin_tab", activeTab);
      } catch (e) {}
    }
  }, [activeTab]);

  // Founder Profile Admin State
  const [founderForm, setFounderForm] = useState<FounderData>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fg_founder_profile");
        if (saved) {
          return { ...DEFAULT_FOUNDER_DATA, ...JSON.parse(saved) };
        }
      } catch (e) {}
    }
    return DEFAULT_FOUNDER_DATA;
  });

  useEffect(() => {
    fetch("/api/founder/profile")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("HTTP " + res.status);
      })
      .then((data) => {
        if (data && typeof data === "object") {
          setFounderForm((prev) => {
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

            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("fg_founder_profile", JSON.stringify(combined));
                window.dispatchEvent(new Event("fg_founder_profile_updated"));
              } catch (e) {}
            }

            // Sync back to server in background
            fetch("/api/founder/profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(combined)
            }).catch(() => {});

            return combined;
          });
        }
      })
      .catch((err) => {
        console.warn("No se pudo obtener el perfil del desarrollador desde el servidor:", err);
      });
  }, []);

  const [savingFounder, setSavingFounder] = useState(false);

  // Founder Article Management State in Admin
  const [editingArticle, setEditingArticle] = useState<{
    id?: string;
    title: string;
    date: string;
    category: string;
    summary: string;
    content: string;
    authorName?: string;
    signedBy?: string;
    images: { url: string; caption: string }[];
  } | null>(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [savingArticle, setSavingArticle] = useState(false);

  // Bulk Product Upload State (Subida Masiva de Productos)
  const [bulkInputText, setBulkInputText] = useState("");
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkSummary, setBulkSummary] = useState<{
    addedCount: number;
    skippedBatchDupes: number;
    skippedDbDupes: number;
    totalOmitted: number;
    totalProcessed: number;
    message: string;
    addedProducts: Product[];
  } | null>(null);

  // Clients Management & B2B Invoicing State
  const [clientList, setClientList] = useState<ClientProfile[]>(DEFAULT_CLIENTS);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(DEFAULT_CLIENTS[0]);
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [clientsLoading, setClientsLoading] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  // New/Edit Client Form Fields
  const [newClientRfc, setNewClientRfc] = useState("");
  const [newClientRazonSocial, setNewClientRazonSocial] = useState("");
  const [newClientRegimen, setNewClientRegimen] = useState("601 - General de Ley Personas Morales");
  const [newClientZip, setNewClientZip] = useState("44100");
  const [newClientUso, setNewClientUso] = useState("G01 - Adquisición de mercancías");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");

  // Invoices List State
  const [invoicesList, setInvoicesList] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // Generate Invoice Modal State for Selected Client
  const [isGenerateInvoiceModalOpen, setIsGenerateInvoiceModalOpen] = useState(false);
  const [invoiceConcepts, setInvoiceConcepts] = useState<
    { productId?: string; description: string; quantity: number; unitPrice: number; claveSat: string; unidadSat: string }[]
  >([
    { description: "Caja Insumos Fruti Go Mayoreo", quantity: 1, unitPrice: 1200, claveSat: "50111500", unidadSat: "KGM" }
  ]);
  const [invoiceFormaPago, setInvoiceFormaPago] = useState("03"); // 03 Transferencia
  const [invoiceMetodoPago, setInvoiceMetodoPago] = useState("PUE"); // PUE
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);

  // SAT Emisor Configuration State
  const [satRfc, setSatRfc] = useState("FRG240815B2B");
  const [satRazonSocial, setSatRazonSocial] = useState("FRUTI GO DISTRIBUIDORA B2B S.A. DE C.V.");
  const [satRegimenFiscal, setSatRegimenFiscal] = useState("601 - General de Ley Personas Morales");
  const [satZipCode, setSatZipCode] = useState("44100");
  const [satToken, setSatToken] = useState("");
  const [satEnv, setSatEnv] = useState<"sandbox" | "production">("production");
  const [satCertPem, setSatCertPem] = useState("");
  const [satKeyPem, setSatKeyPem] = useState("");
  const [satPassword, setSatPassword] = useState("");
  const [satSaving, setSatSaving] = useState(false);
  const [certFileName, setCertFileName] = useState<string | null>(null);
  const [keyFileName, setKeyFileName] = useState<string | null>(null);

  // States for sealing & confirmation of SAT emisor data and certificates
  const [isSatSealed, setIsSatSealed] = useState(true);
  const [satConfirmModal, setSatConfirmModal] = useState<{
    type: "unlock" | "seal";
    title: string;
    message: string;
    actionLabel: string;
    onConfirm: () => void;
  } | null>(null);

  const handleCertFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCertFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setSatCertPem(result);
        showToast(`Certificado (${file.name}) cargado desde computadora`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleKeyFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setKeyFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setSatKeyPem(result);
        showToast(`Llave privada (${file.name}) cargada desde computadora`);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetch("/api/admin/sat-emisor-config")
      .then((res) => res.json())
      .then((data) => {
        let localData: any = {};
        try {
          const saved = localStorage.getItem("fg_sat_emisor_config");
          if (saved) localData = JSON.parse(saved);
        } catch {}

        const pickNonEmpty = (...vals: (string | undefined)[]) => {
          for (const v of vals) {
            if (v && typeof v === "string" && v.trim()) return v.trim();
          }
          return "";
        };

        const pickBestVal = (serverVal?: string, localVal?: string, defaultVal?: string) => {
          if (serverVal && serverVal.trim() && serverVal.trim() !== defaultVal) return serverVal.trim();
          if (localVal && localVal.trim() && localVal.trim() !== defaultVal) return localVal.trim();
          if (serverVal && serverVal.trim()) return serverVal.trim();
          if (localVal && localVal.trim()) return localVal.trim();
          return defaultVal || "";
        };

        const merged = {
          emisorRfc: pickBestVal(data.emisorRfc, localData.emisorRfc, "FRG240815B2B"),
          emisorRazonSocial: pickBestVal(data.emisorRazonSocial, localData.emisorRazonSocial, "FRUTI GO DISTRIBUIDORA B2B S.A. DE C.V."),
          emisorRegimenFiscal: pickBestVal(data.emisorRegimenFiscal, localData.emisorRegimenFiscal, "601 - General de Ley Personas Morales"),
          emisorZipCode: pickBestVal(data.emisorZipCode, localData.emisorZipCode, "44100"),
          sfApiToken: pickNonEmpty(data.sfApiToken, localData.sfApiToken),
          sfEnvironment: pickNonEmpty(data.sfEnvironment, localData.sfEnvironment) || "production",
          csdCertPem: pickNonEmpty(data.csdCertPem, localData.csdCertPem),
          csdKeyPem: pickNonEmpty(data.csdKeyPem, localData.csdKeyPem),
          csdPassword: pickNonEmpty(data.csdPassword, localData.csdPassword)
        };

        if (merged.emisorRfc) setSatRfc(merged.emisorRfc);
        if (merged.emisorRazonSocial) setSatRazonSocial(merged.emisorRazonSocial);
        if (merged.emisorRegimenFiscal) setSatRegimenFiscal(merged.emisorRegimenFiscal);
        if (merged.emisorZipCode) setSatZipCode(merged.emisorZipCode);
        if (merged.sfApiToken) setSatToken(merged.sfApiToken);
        if (merged.sfEnvironment) setSatEnv(merged.sfEnvironment as "sandbox" | "production");
        if (merged.csdCertPem) setSatCertPem(merged.csdCertPem);
        if (merged.csdKeyPem) setSatKeyPem(merged.csdKeyPem);
        if (merged.csdPassword) setSatPassword(merged.csdPassword);

        // Save back merged copy to localStorage
        try {
          localStorage.setItem("fg_sat_emisor_config", JSON.stringify(merged));
        } catch {}

        if (merged.csdCertPem || merged.csdKeyPem || (merged.emisorRfc && merged.emisorRfc !== "FRG240815B2B")) {
          setIsSatSealed(true);
        } else {
          setIsSatSealed(false);
        }

        // Sync back to server if localData had custom values missing on server
        if (localData && (localData.emisorRfc || localData.csdCertPem) && (!data.emisorRfc || data.emisorRfc === "FRG240815B2B")) {
          fetch("/api/admin/sat-emisor-config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: "1234", satConfig: merged })
          }).catch(() => {});
        }
      })
      .catch(() => {
        try {
          const saved = localStorage.getItem("fg_sat_emisor_config");
          if (saved) {
            const data = JSON.parse(saved);
            if (data.emisorRfc) setSatRfc(data.emisorRfc);
            if (data.emisorRazonSocial) setSatRazonSocial(data.emisorRazonSocial);
            if (data.emisorRegimenFiscal) setSatRegimenFiscal(data.emisorRegimenFiscal);
            if (data.emisorZipCode) setSatZipCode(data.emisorZipCode);
            if (data.sfApiToken) setSatToken(data.sfApiToken);
            if (data.sfEnvironment) setSatEnv(data.sfEnvironment);
            if (data.csdCertPem) setSatCertPem(data.csdCertPem);
            if (data.csdKeyPem) setSatKeyPem(data.csdKeyPem);
            if (data.csdPassword) setSatPassword(data.csdPassword);
            setIsSatSealed(true);
          }
        } catch {}
      });
  }, []);

  const handleSaveSatConfig = async () => {
    setSatSaving(true);
    try {
      const satData = {
        emisorRfc: satRfc,
        emisorRazonSocial: satRazonSocial,
        emisorRegimenFiscal: satRegimenFiscal,
        emisorZipCode: satZipCode,
        sfApiToken: satToken,
        sfEnvironment: satEnv,
        csdCertPem: satCertPem,
        csdKeyPem: satKeyPem,
        csdPassword: satPassword
      };

      const res = await fetch("/api/admin/sat-emisor-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          satConfig: satData
        })
      });

      if (res.ok) {
        const json = await res.json();
        const savedConfig = json.satConfig || satData;
        try {
          localStorage.setItem("fg_sat_emisor_config", JSON.stringify(savedConfig));
        } catch {}
        setIsSatSealed(true);
        showToast("¡Datos y Firmas del Emisor SAT guardados y sellados con éxito!");
      } else {
        showToast("Error al guardar la configuración del Emisor SAT.");
      }
    } catch {
      showToast("Error de conexión al guardar configuración SAT.");
    } finally {
      setSatSaving(false);
    }
  };

  // Orders Management State
  const [orderList, setOrderList] = useState<OrderSummary[]>(() => {
    if (orders && orders.length > 0) return orders;
    try {
      const saved = localStorage.getItem("fg_orders");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [orderStatusFilter, setOrderStatusFilter] = useState<"todos" | "pending" | "completed">("todos");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Banner Editing State
  const [bannerTitle, setBannerTitle] = useState(currentBanner.title);
  const [bannerSubtitle, setBannerSubtitle] = useState(currentBanner.subtitle);
  const [bannerUrl, setBannerUrl] = useState<string>(currentBanner.bannerUrl || "");
  const [bannerUrlEs, setBannerUrlEs] = useState<string>(currentBanner.bannerUrlEs || currentBanner.bannerUrl || "");
  const [bannerUrlEn, setBannerUrlEn] = useState<string>(currentBanner.bannerUrlEn || "");
  const [previewLang, setPreviewLang] = useState<"es" | "en">("es");
  const [bannerSaving, setBannerSaving] = useState(false);

  // Product Management State
  const [productList, setProductList] = useState<Product[]>(products);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    if (products && Array.isArray(products) && products.length > 0) {
      setProductList(products);
    }
  }, [products]);
  
  // New/Edit Product Form Fields
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState<number>(0);
  const [prodUnit, setProdUnit] = useState("kg");
  const [prodCategory, setProdCategory] = useState<Product["category"]>("Frutas");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");

  // Product SAT Fiscal Fields
  const [prodClaveSat, setProdClaveSat] = useState("50111500");
  const [prodUnidadSat, setProdUnidadSat] = useState("KGM");
  const [prodObjetoImp, setProdObjetoImp] = useState("02");
  const [prodImpuestoTipo, setProdImpuestoTipo] = useState("002");
  const [prodTasaOCuota, setProdTasaOCuota] = useState<number>(0.000000);
  const [prodPrecioIncluyeIva, setProdPrecioIncluyeIva] = useState(true);
  const [satSearchQuery, setSatSearchQuery] = useState("");
  const [satSearchOpen, setSatSearchOpen] = useState(false);

  // Logo Editing State
  const [logoInput, setLogoInput] = useState<string>(customLogo || "");

  // OpenPay Config State
  const [opUrl, setOpUrl] = useState<string>(openpayConfig.openpayUrl || "");
  const [opMerchantId, setOpMerchantId] = useState<string>(openpayConfig.merchantId || "mhary0zwpt8y6jwt6fju");
  const [opPublicKey, setOpPublicKey] = useState<string>(openpayConfig.publicKey || "pk_ecd829b752774461b8cbc9383f4a414c");
  const [opPrivateKey, setOpPrivateKey] = useState<string>(openpayConfig.privateKey || "sk_cc06c6561cf34230ba69f1751da1596d");
  const [opSandbox, setOpSandbox] = useState<boolean>(openpayConfig.sandboxMode !== undefined ? openpayConfig.sandboxMode : true);
  const [opSaving, setOpSaving] = useState(false);

  // PDF Config State
  const [pdfLogoInput, setPdfLogoInput] = useState<string>(pdfConfig?.pdfLogoUrl || customLogo || "");
  const [pdfQrInput, setPdfQrInput] = useState<string>(pdfConfig?.pdfQrUrl || "");
  const [pdfSaving, setPdfSaving] = useState(false);

  useEffect(() => {
    if (pdfConfig) {
      if (pdfConfig.pdfLogoUrl !== undefined) setPdfLogoInput(pdfConfig.pdfLogoUrl || customLogo || "");
      if (pdfConfig.pdfQrUrl !== undefined) setPdfQrInput(pdfConfig.pdfQrUrl || "");
    }
  }, [pdfConfig, customLogo]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        path.includes("subida-productos") ||
        hash.includes("subida-productos") ||
        search.includes("subida-productos")
      ) {
        setActiveTab("bulk-upload");
      }
    }
  }, []);

  // Notification Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === "admin" || username === "fruti") && (password === "1234" || password === "fruti05")) {
      setIsAuthenticated(true);
      setLoginError(null);
      try {
        localStorage.setItem("fg_admin_auth", "true");
      } catch (e) {}
    } else {
      setLoginError("Usuario o contraseña incorrectos. Usa 'admin' y '1234'.");
    }
  };

  // FileReader helper for local image file uploads
  const handleLocalImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen excede los 5MB. Elige un archivo más pequeño.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Top Banner
  const handleSaveBanner = async () => {
    setBannerSaving(true);
    const primaryUrl = bannerUrlEs.trim() || bannerUrl.trim() || null;
    const updated: TopBannerData = {
      bannerUrl: primaryUrl,
      bannerUrlEs: bannerUrlEs.trim() || primaryUrl,
      bannerUrlEn: bannerUrlEn.trim() || null,
      title: bannerTitle,
      subtitle: bannerSubtitle,
      ctaText: "VER TIENDA Y PEDIR AHORA 🛒"
    };
    const success = await onSaveBanner(updated, password);
    setBannerSaving(false);
    if (success) {
      showToast("¡Banners para Español e Inglés guardados y publicados correctamente!");
    } else {
      showToast("Error al guardar banners en servidor. Se guardó localmente.");
    }
  };

  // Product CRUD
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName("");
    setProdPrice(0);
    setProdUnit("kg");
    setProdCategory("Frutas");
    setProdDesc("");
    setProdImage("");
    setProdClaveSat("50111500");
    setProdUnidadSat("KGM");
    setProdObjetoImp("02");
    setProdImpuestoTipo("002");
    setProdTasaOCuota(0.000000);
    setProdPrecioIncluyeIva(true);
    setSatSearchQuery("50111500 - Frutas frescas y hortalizas");
    setSatSearchOpen(false);
    setIsAddingProduct(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdPrice(prod.price);
    setProdUnit(prod.unit);
    setProdCategory(prod.category);
    setProdDesc(prod.description);
    setProdImage(prod.image);
    const cSat = prod.clave_sat || "50111500";
    setProdClaveSat(cSat);
    setProdUnidadSat(prod.unidad_sat || "KGM");
    setProdObjetoImp(prod.objeto_imp || "02");
    setProdImpuestoTipo(prod.impuesto_tipo || "002");
    setProdTasaOCuota(prod.tasa_ocuota !== undefined ? prod.tasa_ocuota : 0.000000);
    setProdPrecioIncluyeIva(prod.precio_incluye_iva !== false);

    const matchedSat = SAT_PRODUCT_CODES.find((s) => s.code === cSat);
    setSatSearchQuery(matchedSat ? `${matchedSat.code} - ${matchedSat.description}` : cSat);
    setSatSearchOpen(false);
    setIsAddingProduct(true);
  };

  const handleSaveProductForm = async () => {
    if (!prodName.trim() || prodPrice <= 0) {
      alert("Por favor ingresa un nombre válido y un precio mayor a 0.");
      return;
    }

    let updatedList: Product[];
    if (editingProduct) {
      updatedList = productList.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              id: prodName.trim(),
              name: prodName.trim(),
              price: Number(prodPrice),
              unit: prodUnit,
              category: prodCategory,
              description: prodDesc,
              image: prodImage || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
              clave_sat: prodClaveSat,
              unidad_sat: prodUnidadSat,
              objeto_imp: prodObjetoImp,
              impuesto_tipo: prodImpuestoTipo,
              tasa_ocuota: Number(prodTasaOCuota),
              precio_incluye_iva: prodPrecioIncluyeIva
            }
          : p
      );
    } else {
      const newProd: Product = {
        id: prodName.trim(),
        name: prodName.trim(),
        price: Number(prodPrice),
        unit: prodUnit,
        category: prodCategory,
        description: prodDesc,
        image: prodImage || "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80",
        clave_sat: prodClaveSat,
        unidad_sat: prodUnidadSat,
        objeto_imp: prodObjetoImp,
        impuesto_tipo: prodImpuestoTipo,
        tasa_ocuota: Number(prodTasaOCuota),
        precio_incluye_iva: prodPrecioIncluyeIva
      };
      updatedList = [newProd, ...productList];
    }

    setProductList(updatedList);
    setIsAddingProduct(false);
    await onSaveProducts(updatedList, password);
    showToast("¡Lista de productos actualizada!");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto de la tienda?")) return;
    const updatedList = productList.filter((p) => p.id !== id);
    setProductList(updatedList);
    await onSaveProducts(updatedList, password);
    showToast("Producto eliminado.");
  };

  // Subida Masiva de Productos Logic (Servidor + Fallback Local)
  const handleBulkUpload = async () => {
    if (!bulkInputText.trim()) {
      showToast("Por favor pega la lista de productos antes de continuar.");
      return;
    }

    setBulkProcessing(true);
    setBulkSummary(null);

    try {
      const res = await fetch("/api/admin/bulk-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: password || "1234",
          rawText: bulkInputText
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBulkSummary({
          addedCount: data.addedCount || 0,
          skippedBatchDupes: data.skippedBatchDupes || 0,
          skippedDbDupes: data.skippedDbDupes || 0,
          totalOmitted: data.totalOmitted || 0,
          totalProcessed: data.totalProcessed || 0,
          message: data.message || "Proceso de subida masiva terminado.",
          addedProducts: data.addedProducts || []
        });

        if (data.allProducts && Array.isArray(data.allProducts)) {
          setProductList(data.allProducts);
          onSaveProducts(data.allProducts, password);
        }

        showToast(data.message || "¡Productos procesados con éxito!");
      } else {
        processBulkLocally(bulkInputText);
      }
    } catch (err) {
      processBulkLocally(bulkInputText);
    } finally {
      setBulkProcessing(false);
    }
  };

  const processBulkLocally = (rawText: string) => {
    const existingNamesSet = new Set(productList.map(p => (p.name || "").trim().toLowerCase()));
    const batchNamesSet = new Set<string>();

    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    let addedCount = 0;
    let skippedBatchDupes = 0;
    let skippedDbDupes = 0;
    const newProductsList: Product[] = [];

    for (const line of lines) {
      const parts = line.split("/").map(p => p.trim());
      if (parts.length < 2) continue;

      const rawName = parts[0];
      const rawPrice = parseFloat(parts[1].replace(/[^0-9.]/g, ""));
      const rawCategory = parts[2] || "Frutas";

      if (!rawName) continue;
      const normalizedName = rawName.toLowerCase();

      // 1. Omitir duplicados dentro de la misma lista
      if (batchNamesSet.has(normalizedName)) {
        skippedBatchDupes++;
        continue;
      }
      batchNamesSet.add(normalizedName);

      // 2. Omitir duplicados en la base de datos
      if (existingNamesSet.has(normalizedName)) {
        skippedDbDupes++;
        continue;
      }

      let categoryVal: Product["category"] = "Frutas";
      const catLower = rawCategory.toLowerCase();
      if (catLower.includes("verdura")) {
        categoryVal = "Verduras";
      } else if (catLower.includes("hierba") || catLower.includes("aromati")) {
        categoryVal = "Hierbas y Aromáticas";
      } else if (catLower.includes("seco") || catLower.includes("especia")) {
        categoryVal = "Secos y Especias";
      } else if (catLower.includes("fruta")) {
        categoryVal = "Frutas";
      } else {
        categoryVal = "Otros";
      }

      const newProd: Product = {
        id: `prod-bulk-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: rawName,
        price: isNaN(rawPrice) ? 0 : rawPrice,
        unit: "1 Kg",
        presentation: "1 Kg (Desde 1 Kg)",
        category: categoryVal,
        description: `Producto ${rawName} cargado mediante Subida Masiva. Pendiente de imagen y detalles.`,
        image: getProductWhiteBgImage(rawName, categoryVal),
        status: "incompleto",
        clave_sat: "50111500",
        unidad_sat: "KGM",
        objeto_imp: "02",
        impuesto_tipo: "002",
        tasa_ocuota: 0,
        precio_incluye_iva: true
      };

      newProductsList.push(newProd);
      existingNamesSet.add(normalizedName);
      addedCount++;
    }

    const updatedAll = [...productList, ...newProductsList];
    setProductList(updatedAll);
    onSaveProducts(updatedAll, password);

    const totalOmitted = skippedBatchDupes + skippedDbDupes;
    let summaryMsg = `¡Proceso terminado! ${addedCount} producto${addedCount === 1 ? '' : 's'} agregado${addedCount === 1 ? '' : 's'} con éxito.`;
    if (totalOmitted > 0) {
      summaryMsg += ` ${totalOmitted} producto${totalOmitted === 1 ? '' : 's'} omitido${totalOmitted === 1 ? '' : 's'} por estar repetido${totalOmitted === 1 ? '' : 's'}.`;
    }

    setBulkSummary({
      addedCount,
      skippedBatchDupes,
      skippedDbDupes,
      totalOmitted,
      totalProcessed: lines.length,
      message: summaryMsg,
      addedProducts: newProductsList
    });

    showToast(summaryMsg);
  };

  const [isSyncingSfProducts, setIsSyncingSfProducts] = useState(false);
  const [isSyncingSfClients, setIsSyncingSfClients] = useState(false);
  const [isSyncingSfAll, setIsSyncingSfAll] = useState(false);

  const handleSyncSolucionFacturaProducts = async () => {
    setIsSyncingSfProducts(true);
    try {
      const res = await fetch("/api/solucionfactura/sync-productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.products) {
        setProductList(data.products);
        showToast(data.message || "¡Catálogo de productos sincronizado con Solución Factura v2!");
      } else {
        showToast("Catálogo sincronizado con los valores fiscales SAT locales.");
      }
    } catch (e) {
      console.error("Error sincronizando catálogo:", e);
      showToast("Error de conexión al sincronizar con Solución Factura v2.");
    } finally {
      setIsSyncingSfProducts(false);
    }
  };

  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const res = await fetch("/api/solucionfactura/clientes");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setClientList(data);
          if (!selectedClient) {
            setSelectedClient(data[0]);
          }
        }
      }
    } catch (e) {
      console.error("Error al obtener clientes:", e);
    } finally {
      setClientsLoading(false);
    }
  };

  const fetchInvoices = async () => {
    setInvoicesLoading(true);
    try {
      const res = await fetch("/api/admin/invoices");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInvoicesList(data);
        }
      }
    } catch (e) {
      console.error("Error obteniendo facturas:", e);
    } finally {
      setInvoicesLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, []);

  const handleSyncSolucionFacturaClients = async () => {
    setIsSyncingSfClients(true);
    try {
      const res = await fetch("/api/solucionfactura/sync-clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "¡Clientes sincronizados desde Solución Factura v2!");
        fetchClients();
      } else {
        showToast("Error al sincronizar clientes de Solución Factura.");
      }
    } catch (e) {
      console.error("Error sincronizando clientes:", e);
      showToast("Error de conexión al sincronizar clientes.");
    } finally {
      setIsSyncingSfClients(false);
    }
  };

  const handleSaveClientToCatalog = async () => {
    if (!newClientRfc || !newClientRazonSocial) {
      showToast("Por favor ingresa el RFC y la Razón Social del cliente.");
      return;
    }
    try {
      const payload = {
        rfc: newClientRfc.toUpperCase().trim(),
        razonSocial: newClientRazonSocial.trim(),
        regimenFiscal: newClientRegimen,
        zipCode: newClientZip.trim() || "44100",
        usoCFDI: newClientUso,
        email: newClientEmail.trim(),
        phone: newClientPhone.trim(),
        address: newClientAddress.trim()
      };
      const res = await fetch("/api/solucionfactura/add-cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        showToast("¡Cliente guardado exitosamente en el catálogo!");
        setIsAddClientModalOpen(false);
        fetchClients();
        if (json.client) setSelectedClient(json.client);
      } else {
        showToast("Error al guardar cliente en el servidor.");
      }
    } catch (e) {
      showToast("Error de red al guardar cliente.");
    }
  };

  const handleGenerateInvoiceSubmit = async () => {
    if (!selectedClient) return;
    if (invoiceConcepts.length === 0) {
      showToast("Agrega al menos un concepto a la factura.");
      return;
    }
    setIsSubmittingInvoice(true);

    const itemsPayload = invoiceConcepts.map((c) => ({
      quantity: Number(c.quantity) || 1,
      product: {
        id: c.productId || "custom-concept-" + Date.now(),
        name: c.description,
        price: Number(c.unitPrice) || 0,
        unit: c.unidadSat || "KGM",
        clave_sat: c.claveSat || "50111500",
        unidad_sat: c.unidadSat || "KGM",
        objeto_imp: "02",
        impuesto_tipo: "002",
        tasa_ocuota: 0.000000,
        precio_incluye_iva: true
      }
    }));

    const totalInvoice = invoiceConcepts.reduce(
      (acc, curr) => acc + (Number(curr.quantity) || 1) * (Number(curr.unitPrice) || 0),
      0
    );

    const billingInfoPayload = {
      requiresInvoice: true,
      rfc: selectedClient.rfc,
      razonSocial: selectedClient.razonSocial,
      regimenFiscal: selectedClient.regimenFiscal,
      zipCode: selectedClient.zipCode || "44100",
      usoCFDI: selectedClient.usoCFDI || "G01 - Adquisición de mercancías",
      email: selectedClient.email,
      formaPago: invoiceFormaPago,
      metodoPago: invoiceMetodoPago
    };

    const customerPayload = {
      fullName: selectedClient.razonSocial,
      phone: selectedClient.phone || "",
      address: selectedClient.address || "",
      municipalityZip: selectedClient.zipCode || "44100",
      references: "Facturación Directa Panel Admin"
    };

    try {
      const res = await fetch("/api/facturacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: "FAC-B2B-" + Math.floor(100000 + Math.random() * 900000),
          total: totalInvoice,
          items: itemsPayload,
          customer: customerPayload,
          billingInfo: billingInfoPayload
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast("✅ Factura timbrada exitosamente mediante Solución Factura v2");
        setIsGenerateInvoiceModalOpen(false);
        fetchInvoices();
      } else {
        showToast(json.message || "Error al generar la factura.");
      }
    } catch (e) {
      showToast("Error de conexión al generar factura.");
    } finally {
      setIsSubmittingInvoice(false);
    }
  };

  const handleSyncAllSolucionFactura = async () => {
    setIsSyncingSfAll(true);
    try {
      const res = await fetch("/api/solucionfactura/sync-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh products catalog after master sync
        handleSyncSolucionFacturaProducts();
        showToast("¡Sincronización total (Clientes y Productos) ejecutada con éxito!");
      } else {
        showToast("Sincronización finalizada.");
      }
    } catch (e) {
      console.error("Error en sincronización master Solución Factura:", e);
      showToast("Error al conectar con Solución Factura v2.");
    } finally {
      setIsSyncingSfAll(false);
    }
  };

  // Save Custom Logo
  const handleSaveLogo = async () => {
    const success = await onSaveLogo(logoInput.trim() || null, password);
    if (success) {
      showToast("¡Logo actualizado permanentemente!");
    } else {
      showToast("Logo guardado en almacenamiento local.");
    }
  };

  // Save OpenPay Config
  const handleSaveOpenPayConfig = async () => {
    setOpSaving(true);
    const updated: OpenPayConfig = {
      openpayUrl: opUrl.trim(),
      merchantId: opMerchantId.trim(),
      publicKey: opPublicKey.trim(),
      privateKey: opPrivateKey.trim(),
      sandboxMode: opSandbox
    };
    const success = await onSaveOpenPay(updated, password);
    setOpSaving(false);
    if (success) {
      showToast("¡Configuración de OpenPay guardada con éxito!");
    } else {
      showToast("Configuración de OpenPay guardada en almacenamiento local.");
    }
  };

  // Save PDF Config (Logo & QR)
  const handleSavePdf = async () => {
    setPdfSaving(true);
    const updated: PdfConfig = {
      pdfLogoUrl: pdfLogoInput.trim() || null,
      pdfQrUrl: pdfQrInput.trim() || null
    };
    localStorage.setItem("fg_pdf_config", JSON.stringify(updated));
    if (onSavePdfConfig) {
      await onSavePdfConfig(updated, password);
    }
    setPdfSaving(false);
    showToast("¡Configuración de Nota PDF (Logo y Código QR) guardada con éxito!");
  };

  // Generate Test PDF Note
  const handleDownloadTestPdf = async () => {
    const mockOrder: OrderSummary = {
      orderId: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      total: 1850.00,
      status: "completed",
      customer: {
        fullName: "Restaurante La Central GDL",
        phone: "+52 33 2614 0390",
        address: "Av. Adolfo López Mateos Sur 2340, Col. Ciudad del Sol",
        municipalityZip: "Zapopan, Jal. C.P. 45050",
        references: "Entregar en puerta trasera de cocina (Andén de carga)"
      },
      items: [
        { product: { id: "p1", name: "Manzana Red Delicious", price: 45, unit: "kg", category: "Frutas", description: "Fresca", image: "" }, quantity: 10 },
        { product: { id: "p2", name: "Jitomate Saladette Seleccionado", price: 28, unit: "kg", category: "Verduras", description: "Fresco", image: "" }, quantity: 20 },
        { product: { id: "p3", name: "Aguacate Hass Calidad Exportación", price: 78, unit: "kg", category: "Frutas", description: "Fresco", image: "" }, quantity: 5 }
      ],
      openpayDetails: {
        authorization: "848291",
        transactionId: "tr_op_94821039",
        cardBrand: "Visa",
        cardNumber: "**** 4242"
      }
    };

    await generateOrderPDF(mockOrder, {
      pdfLogoUrl: pdfLogoInput.trim() || customLogo || undefined,
      pdfQrUrl: pdfQrInput.trim() || undefined
    });
  };

  // Fetch / Refresh Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    let freshOrders: OrderSummary[] = [];

    // First load from localStorage
    try {
      const saved = localStorage.getItem("fg_orders");
      if (saved) freshOrders = JSON.parse(saved);
    } catch {}

    // Then try fetching server orders
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const apiData = await res.json();
        if (Array.isArray(apiData) && apiData.length > 0) {
          // Merge API orders with local orders by orderId
          const map = new Map<string, OrderSummary>();
          apiData.forEach((o) => map.set(o.orderId, o));
          freshOrders.forEach((o) => {
            if (!map.has(o.orderId)) map.set(o.orderId, o);
          });
          freshOrders = Array.from(map.values());
        }
      }
    } catch {}

    setOrderList(freshOrders);
    localStorage.setItem("fg_orders", JSON.stringify(freshOrders));
    setOrdersLoading(false);
  };

  // Toggle Order Status
  const handleToggleOrderStatus = async (orderId: string, currentStatus: string) => {
    const newStatus = (currentStatus === "completed" || currentStatus === "paid") ? "pending" : "completed";
    const updated = orderList.map((o) => (o.orderId === orderId ? { ...o, status: newStatus as any } : o));
    setOrderList(updated);
    localStorage.setItem("fg_orders", JSON.stringify(updated));

    if (onUpdateOrderStatus) {
      await onUpdateOrderStatus(orderId, newStatus as any, password);
    } else {
      try {
        await fetch("/api/admin/orders/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, orderId, status: newStatus })
        });
      } catch {}
    }

    showToast(`Estado del pedido ${orderId} actualizado a: ${newStatus === "completed" ? "Pagado / Completado" : "Pendiente"}`);
  };

  // Toggle Admin Invoice Authorization for WhatsApp / Pending Orders
  const handleToggleInvoiceAuthorization = async (orderId: string, currentAllowed: boolean) => {
    const newAllowed = !currentAllowed;
    const updated = orderList.map((o) => {
      if (o.orderId === orderId) {
        return {
          ...o,
          invoiceAllowedByAdmin: newAllowed,
          paymentStatus: newAllowed ? ("paid" as const) : o.paymentStatus
        };
      }
      return o;
    });

    setOrderList(updated);
    localStorage.setItem("fg_orders", JSON.stringify(updated));

    try {
      await fetch("/api/admin/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, orderId, invoiceAllowedByAdmin: newAllowed })
      });
    } catch (e) {
      console.error("Error al autorizar facturación:", e);
    }

    showToast(`Pedido #${orderId}: ${newAllowed ? "Marcado POSITIVO para facturar por el administrador ✅" : "Facturación bloqueada por administración 🔒"}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative">
          <button
            onClick={onCloseAdmin}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-brand-green mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-zinc-900">Panel Administrativo</h2>
            <p className="text-xs text-zinc-500 mt-1">Gestión de Banner, Productos y Logo Fruti Go</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              Ingresar al Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/90 backdrop-blur-md overflow-y-auto p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 my-4 sm:my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-zinc-900 via-zinc-800 to-emerald-950 text-white flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow">
              Control Center
            </span>
            <h2 className="text-xl sm:text-2xl font-black italic">Panel de Administración Fruti Go</h2>
          </div>
          <button
            onClick={onCloseAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Salir</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200 bg-zinc-50 p-2 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("banner")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "banner"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Banner Superior</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === "products"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Productos de Tienda</span>
          </button>

          <button
            onClick={() => setActiveTab("bulk-upload")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "bulk-upload"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <UploadCloud className="w-4 h-4 text-brand-yellow" />
            <span>Subida Masiva</span>
          </button>

          <button
            onClick={() => setActiveTab("logo")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "logo"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Logo App</span>
          </button>

          <button
            onClick={() => setActiveTab("openpay")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "openpay"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <CreditCard className="w-4 h-4 text-brand-yellow" />
            <span>Pasarela OpenPay</span>
          </button>

          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "pdf"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <FileText className="w-4 h-4 text-brand-yellow" />
            <span>Config Nota PDF</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("orders");
              fetchOrders();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <PackageCheck className="w-4 h-4 text-brand-yellow" />
            <span>Gestión de Pedidos ({orderList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("sat")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "sat"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-brand-yellow" />
            <span>Emisor SAT CFDI 4.0</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("clients");
              fetchClients();
              fetchInvoices();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "clients"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <Users className="w-4 h-4 text-brand-yellow" />
            <span>Clientes & Facturación ({clientList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("usuarios-firestore")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "usuarios-firestore"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <Users className="w-4 h-4 text-[#FABF08]" />
            <span className="flex items-center gap-1.5">
              <span>Usuarios App (users)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab("desarrollador")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "desarrollador"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <UserCheck className="w-4 h-4 text-brand-yellow" />
            <span>Sobre el Desarrollador</span>
          </button>

          <button
            onClick={() => setActiveTab("fundador-media")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
              activeTab === "fundador-media"
                ? "bg-brand-green text-white shadow-md"
                : "text-zinc-600 hover:bg-zinc-200/60"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-brand-yellow" />
            <span>Galería Media Fundador (/admin/fundador-media)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: BANNER MANAGEMENT */}
          {activeTab === "banner" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900">Gestión del Banner Superior (Multi-idioma)</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Sube dos banners distintos: uno para el idioma español y otro para el idioma inglés. Se mostrarán automáticamente según el idioma seleccionado por el usuario.
                </p>
              </div>

              {/* Banner Live Preview with Language Switcher */}
              <div className="p-4 bg-zinc-100 rounded-2xl border border-zinc-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">
                    Previsualización del Banner en Vivo
                  </span>
                  <div className="flex items-center gap-1.5 bg-zinc-200/80 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewLang("es")}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                        previewLang === "es"
                          ? "bg-white text-zinc-950 shadow-sm"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      <span>🇪🇸 Español</span>
                      {(bannerUrlEs || bannerUrl) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLang("en")}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                        previewLang === "en"
                          ? "bg-white text-zinc-950 shadow-sm"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      <span>🇬🇧 English</span>
                      {bannerUrlEn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    </button>
                  </div>
                </div>

                <div className={`relative rounded-2xl overflow-hidden shadow-md p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  (previewLang === "en" ? (bannerUrlEn || bannerUrlEs || bannerUrl) : (bannerUrlEs || bannerUrl))
                    ? "bg-zinc-950"
                    : "bg-gradient-to-r from-emerald-800 to-green-950"
                }`}>
                  {(previewLang === "en" ? (bannerUrlEn || bannerUrlEs || bannerUrl) : (bannerUrlEs || bannerUrl)) && (
                    <>
                      <img
                        src={previewLang === "en" ? (bannerUrlEn || bannerUrlEs || bannerUrl) : (bannerUrlEs || bannerUrl)}
                        alt="Banner Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 pointer-events-none" />
                    </>
                  )}
                  <div className="relative z-10 space-y-1 text-center sm:text-left">
                    <span className="inline-block px-2.5 py-0.5 bg-brand-yellow text-zinc-950 font-black text-[10px] rounded-full uppercase">
                      {previewLang === "en" ? "NEW! ONLINE STORE" : "🍉 ¡MERCADO EN LÍNEA!"}
                    </span>
                    <h4 className="text-base sm:text-lg font-black">{bannerTitle || "Título del Banner"}</h4>
                    <p className="text-xs text-emerald-100 max-w-lg">{bannerSubtitle || "Subtítulo de la tienda"}</p>
                  </div>
                  <div className="relative z-10 px-4 py-2 bg-brand-yellow text-zinc-950 font-extrabold text-xs rounded-xl shadow-lg whitespace-nowrap">
                    {previewLang === "en" ? "SHOP NOW 🛒" : "VER TIENDA 🛒"}
                  </div>
                </div>
              </div>

              {/* Banner Controls: Dual Upload (Español & Inglés) */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wider">
                  1. Imágenes del Banner por Idioma
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Banner Español */}
                  <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border-2 border-emerald-500/20 shadow-xs relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇪🇸</span>
                        <h5 className="text-xs font-black text-zinc-800 uppercase tracking-tight">
                          Banner para Idioma Español
                        </h5>
                      </div>
                      {(bannerUrlEs || bannerUrl) && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                          Cargado ✓
                        </span>
                      )}
                    </div>

                    {/* Option A: Local File Upload */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                        Cargar desde Dispositivo (Español)
                      </label>
                      <label className="flex items-center justify-center gap-2 p-3 bg-white border border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-brand-green text-xs font-bold text-zinc-700 transition-colors">
                        <Upload className="w-4 h-4 text-brand-green" />
                        <span>Subir Banner Español</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleLocalImageUpload(e, (url) => {
                              setBannerUrlEs(url);
                              setBannerUrl(url);
                            })
                          }
                        />
                      </label>
                    </div>

                    {/* Option B: External URL */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                        O URL de Imagen Externa (Español)
                      </label>
                      <input
                        type="text"
                        placeholder="https://ejemplo.com/banner-espanol.jpg"
                        value={bannerUrlEs}
                        onChange={(e) => {
                          setBannerUrlEs(e.target.value);
                          setBannerUrl(e.target.value);
                        }}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800"
                      />
                    </div>

                    {/* Preview Thumbnail for Spanish */}
                    {bannerUrlEs && (
                      <div className="relative rounded-xl overflow-hidden h-20 border border-zinc-200 mt-2">
                        <img src={bannerUrlEs} alt="Spanish Banner" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setBannerUrlEs("");
                            setBannerUrl("");
                          }}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
                          title="Quitar banner español"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Banner Inglés */}
                  <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border-2 border-blue-500/20 shadow-xs relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇬🇧</span>
                        <h5 className="text-xs font-black text-zinc-800 uppercase tracking-tight">
                          Banner para Idioma Inglés
                        </h5>
                      </div>
                      {bannerUrlEn && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full">
                          Cargado ✓
                        </span>
                      )}
                    </div>

                    {/* Option A: Local File Upload */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                        Cargar desde Dispositivo (Inglés)
                      </label>
                      <label className="flex items-center justify-center gap-2 p-3 bg-white border border-dashed border-zinc-300 rounded-xl cursor-pointer hover:border-blue-600 text-xs font-bold text-zinc-700 transition-colors">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>Subir Banner Inglés</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLocalImageUpload(e, setBannerUrlEn)}
                        />
                      </label>
                    </div>

                    {/* Option B: External URL */}
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-600 mb-1">
                        O URL de Imagen Externa (Inglés)
                      </label>
                      <input
                        type="text"
                        placeholder="https://ejemplo.com/banner-english.jpg"
                        value={bannerUrlEn}
                        onChange={(e) => setBannerUrlEn(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800"
                      />
                    </div>

                    {/* Preview Thumbnail for English */}
                    {bannerUrlEn && (
                      <div className="relative rounded-xl overflow-hidden h-20 border border-zinc-200 mt-2">
                        <img src={bannerUrlEn} alt="English Banner" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setBannerUrlEn("")}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors"
                          title="Quitar banner inglés"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Text Customization */}
              <div className="space-y-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <h4 className="text-xs font-black uppercase text-zinc-700 tracking-wider">2. Textos del Banner</h4>
                
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">Título Llamativo</label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">Subtítulo / Mensaje de Acción</label>
                  <textarea
                    rows={2}
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveBanner}
                disabled={bannerSaving}
                className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{bannerSaving ? "Guardando..." : "Guardar y Publicar Banners"}</span>
              </button>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-zinc-900">Catálogo de Productos de la Tienda</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Agrega, edita o elimina frutas y verduras del menú en tiempo real.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={async () => {
                      if (window.confirm("¿Deseas restablecer todos los productos con el precio oficial por kilo (desde 1 Kg)?")) {
                        setProductList(DEFAULT_PRODUCTS);
                        await onSaveProducts(DEFAULT_PRODUCTS, password);
                        alert("Catálogo restablecido con éxito a precios por kilo (desde 1 Kg).");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl border border-zinc-300 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Restablecer Catálogo (Kilos desde 1)</span>
                  </button>

                  <button
                    onClick={handleSyncSolucionFacturaProducts}
                    disabled={isSyncingSfProducts}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-extrabold text-xs rounded-xl border border-emerald-300 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                    title="Importar y actualizar catálogo fiscal desde Solución Factura v2 API"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-brand-green ${isSyncingSfProducts ? "animate-spin" : ""}`} />
                    <span>{isSyncingSfProducts ? "Sincronizando..." : "Sincronizar Solución Factura v2"}</span>
                  </button>

                  <button
                    onClick={async () => {
                      showToast("📄 Generando Lista de Precios en PDF...");
                      try {
                        await generatePriceListPDF(productList, {
                          pdfLogoUrl: pdfLogoInput || customLogo || undefined,
                          pdfQrUrl: pdfQrInput || undefined,
                          lang: "es"
                        });
                        showToast("✅ ¡Lista de Precios descargada con éxito!");
                      } catch (err) {
                        console.error("Error al generar Lista de Precios PDF:", err);
                        showToast("Error al descargar la Lista de Precios PDF.");
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-brand-green text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer border border-emerald-700"
                    title="Descargar Lista de Precios en PDF agrupada por categorías y precio menor primero"
                  >
                    <FileText className="w-4 h-4 text-brand-yellow" />
                    <span>Lista de Precios (PDF)</span>
                  </button>

                  <button
                    onClick={handleOpenAddProduct}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Producto</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("bulk-upload")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-amber-950" />
                    <span>Subida Masiva</span>
                  </button>
                </div>
              </div>

              {/* Add/Edit Product Modal/Form */}
              {isAddingProduct && (
                <div className="p-5 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                    <h4 className="font-black text-sm text-emerald-900">
                      {editingProduct ? "Editar Producto" : "Agregar Nuevo Producto"}
                    </h4>
                    <button
                      onClick={() => setIsAddingProduct(false)}
                      className="p-1 text-emerald-700 hover:text-emerald-950"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Nombre del Producto</label>
                      <input
                        type="text"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="Ej. Manzana Red Delicious"
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">Precio ($ MXN)</label>
                        <input
                          type="number"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 mb-1">Unidad</label>
                        <input
                          type="text"
                          value={prodUnit}
                          onChange={(e) => setProdUnit(e.target.value)}
                          placeholder="kg, domo, pieza"
                          className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Categoría</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as Product["category"])}
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold"
                      >
                        <option value="Frutas">Frutas</option>
                        <option value="Verduras">Verduras</option>
                        <option value="Hierbas y Aromáticas">Hierbas y Aromáticas</option>
                        <option value="Secos y Especias">Secos y Especias</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Imagen del Producto</label>
                      <div className="space-y-2">
                        <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 cursor-pointer hover:bg-zinc-50">
                          <Upload className="w-3.5 h-3.5 text-brand-green" />
                          <span>Subir desde dispositivo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleLocalImageUpload(e, setProdImage)}
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="O pega URL de imagen..."
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-zinc-700 mb-1">Descripción</label>
                      <input
                        type="text"
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Cosechado fresco..."
                        className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                      />
                    </div>

                    {/* Sección Configuración Fiscal SAT CFDI 4.0 */}
                    <div className="sm:col-span-2 pt-3 border-t border-emerald-200 mt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-brand-green" />
                          <span>Configuración Fiscal SAT (CFDI 4.0)</span>
                        </h5>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md">
                          Timbrado SAT
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Autocompletado Dinámico Clave SAT (ClaveProdServ) */}
                        <div className="relative">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-black text-zinc-800">
                              Buscador Clave SAT (ClaveProdServ 8 dígitos)
                            </label>
                            {prodName.trim() && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSatSearchQuery(prodName.trim());
                                  setSatSearchOpen(true);
                                }}
                                className="text-[10px] text-brand-green font-bold hover:underline flex items-center gap-1"
                              >
                                <span>Buscar "{prodName.trim()}"</span>
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type="text"
                              value={satSearchQuery}
                              onChange={(e) => {
                                setSatSearchQuery(e.target.value);
                                setSatSearchOpen(true);
                                const rawVal = e.target.value.trim();
                                if (rawVal.length === 8 && /^\d+$/.test(rawVal)) {
                                  setProdClaveSat(rawVal);
                                }
                              }}
                              onFocus={() => setSatSearchOpen(true)}
                              placeholder="Ejemplo: Pepino, Papaya, Mango, 50121905..."
                              className="w-full pl-8 pr-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-brand-green"
                            />
                            <Search className="w-4 h-4 text-zinc-400 absolute left-2.5 top-2.5" />
                          </div>

                          {/* Dropdown de autocompletado */}
                          {satSearchOpen && (
                            <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-2xl space-y-0.5 p-1">
                              {(() => {
                                const normalizeStr = (str: string) =>
                                  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                const q = normalizeStr(satSearchQuery.trim());

                                const filtered = SAT_PRODUCT_CODES.filter((item) => {
                                  if (!q) return true;
                                  const codeMatch = item.code.includes(q);
                                  const descMatch = normalizeStr(item.description).includes(q);
                                  const catMatch = normalizeStr(item.category).includes(q);
                                  const kwMatch = item.keywords.some((k) => normalizeStr(k).includes(q));
                                  return codeMatch || descMatch || catMatch || kwMatch;
                                });

                                if (filtered.length === 0) {
                                  return (
                                    <div className="p-3 text-center text-xs text-zinc-500 font-medium">
                                      No se encontraron claves SAT exactas para "{satSearchQuery}".
                                      <br />
                                      <span className="text-[10px] text-zinc-400">
                                        Prueba con "Verduras", "Frutas", "General" o ingresa directamente los 8 dígitos del SAT.
                                      </span>
                                    </div>
                                  );
                                }

                                return filtered.map((item) => (
                                  <button
                                    key={item.code}
                                    type="button"
                                    onClick={() => {
                                      setProdClaveSat(item.code);
                                      setSatSearchQuery(`${item.code} - ${item.description}`);
                                      setSatSearchOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-between group"
                                  >
                                    <div>
                                      <span className="font-mono font-black text-brand-green mr-2">[{item.code}]</span>
                                      <span className="font-bold text-zinc-800 group-hover:text-emerald-900">{item.description}</span>
                                    </div>
                                    <span className="text-[9px] text-zinc-400 bg-zinc-100 group-hover:bg-emerald-100 group-hover:text-emerald-800 px-1.5 py-0.5 rounded font-medium ml-2 flex-shrink-0">
                                      {item.category}
                                    </span>
                                  </button>
                                ));
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Seleccionar Unidad SAT */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-800 mb-1">
                            Unidad SAT (ClaveUnidad)
                          </label>
                          <select
                            value={prodUnidadSat}
                            onChange={(e) => setProdUnidadSat(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-zinc-900"
                          >
                            {SAT_UNITS.map((u) => (
                              <option key={u.code} value={u.code}>
                                {u.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Seleccionar Tipo de Impuesto / Tasa */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-800 mb-1">
                            Tipo de Impuesto / Tasa IVA / IEPS
                          </label>
                          <select
                            value={`${prodImpuestoTipo}_${prodTasaOCuota}`}
                            onChange={(e) => {
                              const val = e.target.value;
                              const selected = SAT_TAX_OPTIONS.find((t) => `${t.impuesto_tipo}_${t.tasa_ocuota}` === val);
                              if (selected) {
                                setProdImpuestoTipo(selected.impuesto_tipo);
                                setProdTasaOCuota(selected.tasa_ocuota);
                              }
                            }}
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-zinc-900"
                          >
                            {SAT_TAX_OPTIONS.map((tax) => (
                              <option key={tax.id} value={`${tax.impuesto_tipo}_${tax.tasa_ocuota}`}>
                                {tax.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Seleccionar Objeto de Impuesto */}
                        <div>
                          <label className="block text-[11px] font-black text-zinc-800 mb-1">
                            Objeto de Impuesto SAT
                          </label>
                          <select
                            value={prodObjetoImp}
                            onChange={(e) => setProdObjetoImp(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-zinc-900"
                          >
                            {SAT_OBJETO_IMP_OPTIONS.map((obj) => (
                              <option key={obj.code} value={obj.code}>
                                {obj.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Checkbox Precio Incluye IVA */}
                        <div className="sm:col-span-2 pt-1 flex items-center justify-between bg-white p-2.5 rounded-xl border border-emerald-200">
                          <div>
                            <span className="text-xs font-black text-zinc-900 block">El Precio del Producto Ya Incluye IVA/IEPS</span>
                            <span className="text-[10px] text-zinc-500">
                              Si está activo, el sistema desglosará el impuesto del precio. Si no, se calculará sobre el subtotal.
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={prodPrecioIncluyeIva}
                            onChange={(e) => setProdPrecioIncluyeIva(e.target.checked)}
                            className="w-4 h-4 text-brand-green accent-brand-green rounded cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveProductForm}
                      className="px-5 py-2 bg-brand-green text-white rounded-xl text-xs font-black shadow-md"
                    >
                      Guardar Producto
                    </button>
                  </div>
                </div>
              )}

              {/* Product List */}
              <div className="space-y-3">
                {productList.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl flex items-center justify-between gap-4 hover:bg-zinc-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 object-cover rounded-xl bg-white border border-zinc-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-xs sm:text-sm text-zinc-900 truncate">{prod.name}</h4>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-md">
                            {prod.category}
                          </span>
                          <span className="px-1.5 py-0.5 bg-zinc-200/80 text-zinc-700 font-mono text-[9px] font-bold rounded">
                            SAT: {prod.clave_sat || "50111500"} | {prod.unidad_sat || "KGM"}
                          </span>
                        </div>
                        <p className="text-xs font-black text-brand-green mt-0.5">
                          ${prod.price} MXN <span className="text-[10px] text-zinc-400 font-normal">/ {prod.unit}</span>
                          <span className="ml-2 text-[10px] text-zinc-500 font-medium">
                            ({prod.impuesto_tipo === "EXENTO" ? "Exento" : `Tasa ${((prod.tasa_ocuota || 0) * 100).toFixed(0)}%`})
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-2 text-zinc-600 hover:text-brand-green hover:bg-white rounded-xl border border-transparent hover:border-zinc-200 transition-all"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SUBIDA MASIVA DE PRODUCTOS */}
          {activeTab === "bulk-upload" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-brand-green/10 text-brand-green text-[10px] font-black rounded-full uppercase tracking-wider border border-brand-green/20">
                      Ruta: /admin/subida-productos
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mt-1 flex items-center gap-2">
                    <UploadCloud className="w-6 h-6 text-brand-green" />
                    <span>Subida Masiva de Productos</span>
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Carga lotes enteros de productos separados por diagonales (<code>Nombre / Precio / Categoría</code>).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBulkInputText(`plátano Tabasco/24/frutas\nfresa congelada/75/frutas\npapa blanca limpia/46/verduras\nplátano Tabasco/24/frutas`);
                    showToast("Ejemplo cargado en el cuadro de texto.");
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl border border-zinc-300 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-brand-green" />
                  <span>Cargar Ejemplo de Prueba</span>
                </button>
              </div>

              {/* Format Instructions & Duplication Rules Card */}
              <div className="p-4 bg-emerald-50/90 rounded-2xl border border-emerald-200/80 space-y-2.5 shadow-2xs">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Formato de Entrada (Separado por Diagonales '/'):
                </h4>
                <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs font-mono text-zinc-800 space-y-1 shadow-xs">
                  <div className="text-zinc-400 text-[10px] font-sans font-bold uppercase mb-1">Estructura por línea: Nombre / Precio / Categoría</div>
                  <div className="text-emerald-900 font-semibold">plátano Tabasco/24/frutas</div>
                  <div className="text-emerald-900 font-semibold">fresa congelada/75/frutas</div>
                  <div className="text-emerald-900 font-semibold">papa blanca limpia/46/verduras</div>
                  <div className="text-emerald-900 font-semibold">plátano Tabasco/24/frutas</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-bold text-emerald-900 pt-1">
                  <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-lg border border-emerald-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>Omite duplicados en la lista pegada</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-lg border border-emerald-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>Omite duplicados en la Base de Datos</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/70 p-2 rounded-lg border border-emerald-200/60">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span>Inserta con status = 'incompleto'</span>
                  </div>
                </div>
              </div>

              {/* Textarea Entry Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-zinc-800 flex items-center gap-2">
                    <span>Lista de Productos a Procesar:</span>
                  </label>
                  <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
                    {bulkInputText ? `${bulkInputText.split(/\r?\n/).filter(l => l.trim()).length} líneas ingresadas` : "0 líneas"}
                  </span>
                </div>

                <textarea
                  rows={10}
                  value={bulkInputText}
                  onChange={(e) => setBulkInputText(e.target.value)}
                  placeholder={`Pega aquí la lista de productos...\nEjemplo:\nplátano Tabasco/24/frutas\nfresa congelada/75/frutas\npapa blanca limpia/46/verduras\nplátano Tabasco/24/frutas`}
                  className="w-full p-4 bg-white border-2 border-zinc-200 focus:border-brand-green rounded-2xl text-xs font-mono text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner placeholder:text-zinc-400"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  {bulkInputText ? (
                    <button
                      type="button"
                      onClick={() => {
                        setBulkInputText("");
                        setBulkSummary(null);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-zinc-200"
                    >
                      Limpiar Cuadro de Texto
                    </button>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={handleBulkUpload}
                    disabled={bulkProcessing || !bulkInputText.trim()}
                    className={`w-full sm:w-auto px-6 py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                      bulkProcessing || !bulkInputText.trim() ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {bulkProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Verificando y Cargando Productos...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Cargar Productos al Catálogo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Summary Response Box */}
              {bulkSummary && (
                <div className="p-5 bg-zinc-900 text-white rounded-2xl border border-zinc-800 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">¡Proceso de Carga Finalizado!</h4>
                        <p className="text-xs font-bold text-emerald-400 mt-0.5">{bulkSummary.message}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBulkSummary(null)}
                      className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700/60">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Líneas Procesadas</span>
                      <span className="text-lg font-black text-white">{bulkSummary.totalProcessed}</span>
                    </div>
                    <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/40">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block font-mono">Agregados</span>
                      <span className="text-lg font-black text-emerald-300">{bulkSummary.addedCount}</span>
                    </div>
                    <div className="p-3 bg-amber-950/60 rounded-xl border border-amber-500/40">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block font-mono">Duplicados Texto</span>
                      <span className="text-lg font-black text-amber-300">{bulkSummary.skippedBatchDupes}</span>
                    </div>
                    <div className="p-3 bg-red-950/60 rounded-xl border border-red-500/40">
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block font-mono">Duplicados en BD</span>
                      <span className="text-lg font-black text-red-300">{bulkSummary.skippedDbDupes}</span>
                    </div>
                  </div>

                  {bulkSummary.addedProducts && bulkSummary.addedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <h5 className="text-xs font-extrabold text-zinc-300">Detalle de Productos Nuevos Agregados:</h5>
                      <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                        {bulkSummary.addedProducts.map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 bg-zinc-800/90 rounded-xl border border-zinc-700/60 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-md uppercase">
                                {p.category}
                              </span>
                              <span className="font-extrabold text-white">{p.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-emerald-400">${p.price} MXN</span>
                              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-md border border-amber-500/30">
                                {p.status || "incompleto"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOGO MANAGEMENT */}
          {activeTab === "logo" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-zinc-900">Gestión del Logo Personalizado</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Sube la imagen de tu logo corporativo para mantenerlo de forma permanente en la app.</p>
              </div>

              <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
                {/* File upload or URL */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-2">1. Subir desde dispositivo local</label>
                  <label className="flex items-center justify-center gap-2 p-4 bg-white border border-dashed border-zinc-300 rounded-2xl cursor-pointer hover:border-brand-green text-xs font-bold text-zinc-700 transition-colors">
                    <Upload className="w-4 h-4 text-brand-green" />
                    <span>Seleccionar archivo de imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleLocalImageUpload(e, setLogoInput)}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">2. O ingresar URL directa</label>
                  <input
                    type="text"
                    value={logoInput}
                    onChange={(e) => setLogoInput(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs"
                  />
                </div>

                {logoInput && (
                  <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center gap-3">
                    <img src={logoInput} alt="Logo Preview" className="w-12 h-12 object-contain rounded-lg border border-zinc-100" />
                    <span className="text-xs font-bold text-zinc-700">Vista previa del nuevo logo</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveLogo}
                className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98"
              >
                Guardar Logo Permanentemente
              </button>
            </div>
          )}

          {/* TAB 4: OPENPAY CONFIGURATION */}
          {activeTab === "openpay" && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-900 text-white rounded-2xl flex items-start gap-3 shadow-md">
                <ShieldCheck className="w-6 h-6 text-brand-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-black italic">Configuración de Pasarela de Pago OpenPay</h3>
                  <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                    Configura la URL de Checkout / Link de Pago de tu cuenta OpenPay para procesar tarjetas de crédito, débito y pagos en efectivo.
                  </p>
                </div>
              </div>

              <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                {/* 1. OpenPay Checkout / Link de Pago */}
                <div>
                  <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1">
                    1. URL de Checkout / Link de Pago de OpenPay <span className="text-zinc-400 font-normal text-[11px] lowercase">(Opcional)</span>
                  </label>
                  <p className="text-[11px] text-zinc-500 mb-2">
                    Copia y pega la URL de la liga de pago generada desde tu Dashboard de OpenPay (ej. <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-800">https://checkout.openpay.mx/...</code>). Si se deja vacía o se ingresa una URL de API (ej. <code className="bg-zinc-200 px-1 py-0.5 rounded text-zinc-800">sandbox-api.openpay.mx</code>), el sistema procesará los pedidos localmente.
                  </p>
                  <input
                    type="url"
                    value={opUrl}
                    onChange={(e) => setOpUrl(e.target.value)}
                    placeholder="https://checkout.openpay.mx/pay/..."
                    className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:ring-2 focus:ring-brand-green focus:outline-none"
                  />
                </div>

                {/* 2. Credentials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1">
                      2. Merchant ID
                    </label>
                    <input
                      type="text"
                      value={opMerchantId}
                      onChange={(e) => setOpMerchantId(e.target.value)}
                      placeholder="mhary0zwpt8y6jwt6fju"
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1">
                      3. Llave Pública (Public Key)
                    </label>
                    <input
                      type="text"
                      value={opPublicKey}
                      onChange={(e) => setOpPublicKey(e.target.value)}
                      placeholder="pk_ecd829b752774461b8cbc9383f4a414c"
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-800 uppercase tracking-wider mb-1">
                      4. Llave Privada (Private Key)
                    </label>
                    <input
                      type="password"
                      value={opPrivateKey}
                      onChange={(e) => setOpPrivateKey(e.target.value)}
                      placeholder="sk_ecd829b752774461b8cbc9383f4a414c"
                      className="w-full px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-800"
                    />
                  </div>
                </div>

                {/* Sandbox Toggle */}
                <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-zinc-800 block">Modo Sandbox / Pruebas</span>
                    <span className="text-[11px] text-zinc-500">
                      Activa esta opción para realizar pruebas sin cargos reales en tu cuenta de OpenPay.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={opSandbox}
                      onChange={(e) => setOpSandbox(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                  </label>
                </div>
              </div>

              {/* Status info box */}
              {(() => {
                const clean = opUrl.trim().toLowerCase();
                const isApi = clean.includes("api.openpay.mx") || clean.includes("sandbox-api.openpay.mx");
                
                if (isApi) {
                  return (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 font-medium flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-amber-950 block">URL de API Detectada ({opUrl})</span>
                        <span>Las URLs de API no son páginas de pago para clientes. La tienda utilizará la confirmación de pedido local en pantalla sin redirigir a una pantalla en blanco.</span>
                      </div>
                    </div>
                  );
                } else if (clean) {
                  return (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Link de Checkout OpenPay activo: {opUrl.slice(0, 50)}...</span>
                    </div>
                  );
                } else {
                  return (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span><strong>Modo Local Activo:</strong> Sin URL de checkout configurada, los clientes confirmarán su pedido en pantalla y el administrador lo recibirá en "Gestión de Pedidos".</span>
                    </div>
                  );
                }
              })()}

              <button
                onClick={handleSaveOpenPayConfig}
                disabled={opSaving}
                className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{opSaving ? "Guardando..." : "Guardar Configuración OpenPay"}</span>
              </button>
            </div>
          )}

          {/* TAB 5: CONFIGURACIÓN NOTA PDF */}
          {activeTab === "pdf" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-green" />
                  <span>Configuración de Nota en PDF para Repartidor</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Personaliza el diseño del PDF que se genera automáticamente al confirmar cada pedido. Incluye datos de Fruti Go, datos del cliente, desglose total, logo superior y código QR con invitación a Google Play Store.
                </p>
              </div>

              {/* Logo Superior Config */}
              <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-brand-green" />
                    <span>Logo Superior de la Nota (Encabezado)</span>
                  </label>
                  <span className="text-[10px] bg-brand-yellow/30 text-zinc-800 px-2 py-0.5 rounded font-extrabold">
                    Parte Superior
                  </span>
                </div>

                <p className="text-[11px] text-zinc-500">
                  Sube una imagen o pega la URL del logo de Fruti Go para aparecer centrado en el encabezado superior de cada comprobante PDF.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={pdfLogoInput}
                    onChange={(e) => setPdfLogoInput(e.target.value)}
                    placeholder="Pega la URL del logo o usa el cargador de archivos..."
                    className="flex-1 px-3.5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-800 w-full"
                  />
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all whitespace-nowrap w-full sm:w-auto">
                    <Upload className="w-4 h-4 text-brand-yellow" />
                    <span>Subir Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setPdfLogoInput(ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {pdfLogoInput && (
                  <div className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={pdfLogoInput} alt="Logo PDF" className="h-10 object-contain max-w-[120px] rounded" />
                      <span className="text-xs text-zinc-600 font-medium">Vista previa de logo superior</span>
                    </div>
                    <button
                      onClick={() => setPdfLogoInput("")}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              {/* Información sobre Código QR Dinámico SAT CFDI 4.0 */}
              <div className="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-brand-green" />
                    <span>Código QR de Verificación Fiscal SAT (Generación Automática)</span>
                  </label>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold">
                    CFDI 4.0 Timbrado
                  </span>
                </div>

                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  El código QR manual ha sido removido del panel de administración. Ahora, en el documento PDF descargado se implementa directamente el <strong>Código QR oficial timbrado del SAT</strong> (con la cadena original, RFC emisor/receptor, total y sello digital) para validación en el portal del SAT.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleSavePdf}
                  disabled={pdfSaving}
                  className="flex-1 py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4 text-brand-yellow" />
                  <span>{pdfSaving ? "Guardando..." : "Guardar Configuración Nota PDF"}</span>
                </button>

                <button
                  onClick={handleDownloadTestPdf}
                  className="py-3.5 px-5 bg-zinc-900 hover:bg-black text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 border border-zinc-700"
                >
                  <Download className="w-4 h-4 text-brand-yellow" />
                  <span>Descargar Nota de Prueba (PDF)</span>
                </button>

                <button
                  onClick={async () => {
                    showToast("📄 Generando Lista de Precios en PDF...");
                    try {
                      await generatePriceListPDF(productList, {
                        pdfLogoUrl: pdfLogoInput || customLogo || undefined,
                        pdfQrUrl: pdfQrInput || undefined,
                        lang: "es"
                      });
                      showToast("✅ ¡Lista de Precios descargada con éxito!");
                    } catch (err) {
                      console.error("Error al generar Lista de Precios PDF:", err);
                      showToast("Error al descargar la Lista de Precios PDF.");
                    }
                  }}
                  className="py-3.5 px-5 bg-emerald-800 hover:bg-brand-green text-white font-extrabold text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 border border-emerald-700"
                >
                  <FileText className="w-4 h-4 text-brand-yellow" />
                  <span>Descargar Lista de Precios (PDF)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: GESTIÓN DE PEDIDOS */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="p-4 bg-emerald-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <PackageCheck className="w-7 h-7 text-brand-yellow flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-black italic">Gestión de Pedidos Recibidos</h3>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      Consulta los pedidos realizados, datos de cliente, dirección de entrega y estado de pago.
                    </p>
                  </div>
                </div>

                <button
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? "animate-spin" : ""}`} />
                  <span>Actualizar Lista</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200">
                {/* Status Pills */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={() => setOrderStatusFilter("todos")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      orderStatusFilter === "todos"
                        ? "bg-brand-green text-white shadow-sm"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Todos ({orderList.length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter("pending")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      orderStatusFilter === "pending"
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Pendientes ({orderList.filter((o) => o.status === "pending").length})
                  </button>
                  <button
                    onClick={() => setOrderStatusFilter("completed")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      orderStatusFilter === "completed"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    }`}
                  >
                    Pagados ({orderList.filter((o) => o.status === "completed" || o.status === "paid").length})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Buscar por ID, cliente o tel..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              {/* Order Cards List */}
              {(() => {
                const filtered = orderList.filter((order) => {
                  const matchesStatus =
                    orderStatusFilter === "todos" ||
                    (orderStatusFilter === "pending" && order.status === "pending") ||
                    (orderStatusFilter === "completed" && (order.status === "completed" || order.status === "paid"));

                  const query = orderSearchQuery.toLowerCase();
                  const matchesSearch =
                    order.orderId.toLowerCase().includes(query) ||
                    (order.customer?.fullName || "").toLowerCase().includes(query) ||
                    (order.customer?.phone || "").toLowerCase().includes(query) ||
                    (order.customer?.address || "").toLowerCase().includes(query);

                  return matchesStatus && matchesSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 px-4 bg-zinc-50 rounded-2xl border border-zinc-200 text-zinc-500 space-y-2">
                      <PackageCheck className="w-10 h-10 mx-auto text-zinc-300 stroke-1" />
                      <p className="text-sm font-bold text-zinc-700">No se encontraron pedidos</p>
                      <p className="text-xs text-zinc-400">
                        Los pedidos realizados desde el carrito de la tienda aparecerán aquí automáticamente.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filtered.map((order) => {
                      const isPaid = order.status === "completed" || order.status === "paid";
                      const isWhatsApp = order.paymentMethod === "whatsapp" || order.paymentStatus === "pending_whatsapp";
                      const isInvoiceAllowed = order.invoiceAllowedByAdmin === true;

                      const cleanPhone = (order.customer?.phone || "").replace(/\D/g, "");
                      const waLink = cleanPhone
                        ? `https://wa.me/52${cleanPhone}?text=${encodeURIComponent(
                            `Hola ${order.customer?.fullName || ""}, te contactamos de Fruti Go respecto a tu pedido ${order.orderId}.`
                          )}`
                        : null;

                      const fullAddrStr = `${order.customer?.address || ""}, ${order.customer?.municipalityZip || ""}`;
                      const mapsLink = fullAddrStr.trim().length > 3
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddrStr)}`
                        : null;

                      return (
                        <div
                          key={order.orderId}
                          className="bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                        >
                          {/* Order Card Header */}
                          <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-black text-xs text-zinc-900 bg-zinc-200 px-2.5 py-1 rounded-lg">
                                {order.orderId}
                              </span>
                              <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                <span>{order.date}</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {isWhatsApp && (
                                <button
                                  onClick={() => handleToggleInvoiceAuthorization(order.orderId, isInvoiceAllowed)}
                                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border ${
                                    isInvoiceAllowed
                                      ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500"
                                      : "bg-amber-500 hover:bg-amber-600 text-white border-amber-400"
                                  }`}
                                  title="Marcar o desmarcar si este pedido enviado por WhatsApp tiene autorización positiva del administrador para ser facturado por el cliente"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-brand-yellow" />
                                  <span>{isInvoiceAllowed ? "🟢 FACTURA: AUTORIZADA (POSITIVO)" : "🔴 FACTURA: PENDIENTE (AUTORIZAR AHORA)"}</span>
                                </button>
                              )}

                              <span
                                className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                  isPaid
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-amber-100 text-amber-800 border border-amber-300"
                                }`}
                              >
                                {isPaid ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Pagado</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    <span>Pendiente de Pago</span>
                                  </>
                                )}
                              </span>

                              <button
                                onClick={() => handleToggleOrderStatus(order.orderId, order.status)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-700 rounded-lg shadow-2xs transition-all active:scale-95"
                              >
                                {isPaid ? "Marcar Pendiente" : "Marcar Pagado"}
                              </button>

                              <button
                                onClick={() => generateOrderPDF(order, {
                                  pdfLogoUrl: pdfLogoInput.trim() || customLogo || undefined,
                                  pdfQrUrl: pdfQrInput.trim() || undefined
                                })}
                                className="px-2.5 py-1 text-[11px] font-bold bg-brand-green hover:bg-emerald-800 text-white rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                title="Descargar nota de pedido en PDF para el repartidor"
                              >
                                <Download className="w-3 h-3 text-brand-yellow" />
                                <span>Nota PDF</span>
                              </button>

                              {(order.invoiceDetails || order.billingInfo?.requiresInvoice) && (
                                <>
                                  <button
                                    onClick={() => generateCFDIPDF(order, {
                                      pdfLogoUrl: pdfLogoInput.trim() || customLogo || undefined,
                                      invoiceDetails: order.invoiceDetails
                                    })}
                                    className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                    title="Descargar factura fiscal CFDI 4.0 SAT (PDF)"
                                  >
                                    <FileText className="w-3 h-3 text-amber-300" />
                                    <span>Factura PDF</span>
                                  </button>

                                  <button
                                    onClick={() => downloadCFDIXML(order, order.invoiceDetails)}
                                    className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1"
                                    title="Descargar archivo XML timbrado oficial SAT"
                                  >
                                    <FileCode className="w-3 h-3 text-blue-200" />
                                    <span>XML</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Customer & Delivery Details */}
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs border-b border-zinc-100">
                            {/* Column 1: Customer Info */}
                            <div className="space-y-2 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100">
                              <div className="font-extrabold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                                <User className="w-3.5 h-3.5 text-brand-green" />
                                <span>Datos del Cliente</span>
                              </div>

                              <div className="space-y-1 text-zinc-800">
                                <div>
                                  <span className="text-zinc-400 font-medium">Nombre: </span>
                                  <span className="font-bold">{order.customer?.fullName || "No especificado"}</span>
                                </div>
                                <div>
                                  <span className="text-zinc-400 font-medium">Teléfono: </span>
                                  <span className="font-bold font-mono">{order.customer?.phone || "Sin teléfono"}</span>
                                </div>
                              </div>

                              {waLink && (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg shadow-sm transition-all mt-1"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>Contactar por WhatsApp</span>
                                </a>
                              )}
                            </div>

                            {/* Column 2: Shipping Address */}
                            <div className="space-y-2 bg-zinc-50 p-3.5 rounded-xl border border-zinc-200">
                              <div className="font-extrabold text-zinc-900 uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
                                <MapPin className="w-3.5 h-3.5 text-brand-green" />
                                <span>Dirección de Entrega</span>
                              </div>

                              <div className="space-y-1 text-zinc-800">
                                <div>
                                  <span className="text-zinc-400 font-medium">Calle/Colonia: </span>
                                  <span className="font-bold">{order.customer?.address || "Sin dirección"}</span>
                                </div>
                                <div>
                                  <span className="text-zinc-400 font-medium">Municipio / C.P.: </span>
                                  <span className="font-bold">{order.customer?.municipalityZip || "N/A"}</span>
                                </div>
                                {order.customer?.references && (
                                  <div>
                                    <span className="text-zinc-400 font-medium">Referencias: </span>
                                    <span className="italic text-zinc-700">{order.customer.references}</span>
                                  </div>
                                )}
                              </div>

                              {mapsLink && (
                                <a
                                  href={mapsLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-900 text-white font-extrabold text-[11px] rounded-lg shadow-sm transition-all mt-1"
                                >
                                  <ExternalLink className="w-3.5 h-3.5 text-brand-yellow" />
                                  <span>Ver en Mapa (Google Maps)</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Items Purchased & Total */}
                          <div className="p-4 bg-zinc-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div className="flex-1">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">
                                Productos Solicitados:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {order.items && order.items.length > 0 ? (
                                  order.items.map((it, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-white border border-zinc-200 px-2 py-0.5 rounded-md font-semibold text-zinc-800 text-[11px]"
                                    >
                                      {it.quantity}x {it.product.name} (${it.product.price * it.quantity})
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-zinc-400 italic">Detalle no disponible</span>
                                )}
                              </div>
                            </div>

                            <div className="text-right border-t sm:border-t-0 sm:border-l border-zinc-200 pt-2 sm:pt-0 sm:pl-4 flex-shrink-0">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase block">Total Pedido:</span>
                              <span className="text-base font-black text-brand-green">${order.total} MXN</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 7: SAT EMISOR CONFIGURATION (DATOS Y FIRMAS DEL EMISOR) */}
          {activeTab === "sat" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2 text-brand-green font-black text-xs uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-5 h-5 text-brand-green" />
                  <span>Configuración de Emisor SAT & Solución Factura v2 (CFDI 4.0)</span>
                </div>
                <h3 className="text-xl font-black text-zinc-900 italic">Datos del Emisor y Certificados de Sello Digital (CSD)</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Ingresa la información fiscal y las claves/firmas del emisor que timbrará las facturas de los clientes. Todos los clientes que soliciten factura o facturen desde su historial se enlazarán automáticamente con estos datos del emisor.
                </p>
              </div>

              {/* Status Banner */}
              <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1 text-emerald-950">
                  <p className="font-extrabold">Enlace con Solución Factura API v2 Activado</p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Las facturas generadas por tus clientes se timbran con la versión **CFDI 4.0**, agregando régimen fiscal, domicilio de expedición y sellos digitales.
                  </p>
                </div>
              </div>

              {/* Status Banner for Sealed / Unsealed Config */}
              <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
                isSatSealed 
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950' 
                  : 'bg-amber-50/90 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isSatSealed ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                    {isSatSealed ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                      <span>{isSatSealed ? "🔒 Configuración y Certificados del Emisor Sellados" : "🔓 Modo Edición Habilitado (Desbloqueado)"}</span>
                      {isSatSealed && <span className="bg-emerald-200 text-emerald-900 text-[10px] px-2 py-0.5 rounded-md font-black border border-emerald-300">SELLADO</span>}
                    </h4>
                    <p className="text-[11px] font-medium opacity-85 mt-0.5">
                      {isSatSealed 
                        ? "Los datos fiscales y certificados CSD (.cer y .key) están sellados y protegidos contra cambios. Requiere confirmación para modificarlos."
                        : "Los datos están desbloqueados para edición. Modifica o sube tus archivos y presiona 'Guardar y Sellar' para protegerlos."}
                    </p>
                  </div>
                </div>

                {isSatSealed ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSatConfirmModal({
                        type: "unlock",
                        title: "🔓 Confirmar Desbloqueo de Datos y Firmas del Emisor",
                        message: "¿Estás seguro de que deseas desbloquear para modificar los datos y certificados CSD del Emisor SAT? Al finalizar deberás confirmar y sellarlos de nuevo.",
                        actionLabel: "Sí, Desbloquear para Cambiar",
                        onConfirm: () => {
                          setIsSatSealed(false);
                          showToast("Edición desbloqueada. Recuerda guardar y sellar los cambios.");
                        }
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Desbloquear y Cambiar Datos</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSatConfirmModal({
                        type: "seal",
                        title: "🔒 Sellar y Proteger Configuración",
                        message: "¿Deseas volver a sellar la configuración sin realizar modificaciones?",
                        actionLabel: "Sí, Sellar Datos",
                        onConfirm: () => {
                          setIsSatSealed(true);
                          showToast("Configuración sellada y protegida.");
                        }
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Volver a Sellar</span>
                  </button>
                )}
              </div>

              {/* Form Grid */}
              <div className={`bg-white p-5 rounded-2xl border border-zinc-200 space-y-4 shadow-xs ${isSatSealed ? 'opacity-90' : ''}`}>
                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-2 flex items-center justify-between">
                  <span>1. Datos Fiscales del Emisor (RFC y Razón Social)</span>
                  {isSatSealed && <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><Lock className="w-3 h-3"/> Campo Sellado</span>}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-zinc-700 mb-1">RFC del Emisor *</label>
                    <input
                      type="text"
                      disabled={isSatSealed}
                      value={satRfc}
                      onChange={(e) => setSatRfc(e.target.value.toUpperCase())}
                      placeholder="Ej. FRG240815B2B"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-extrabold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green disabled:bg-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-700 mb-1">C.P. de Expedición (Bodega Central) *</label>
                    <input
                      type="text"
                      disabled={isSatSealed}
                      maxLength={5}
                      value={satZipCode}
                      onChange={(e) => setSatZipCode(e.target.value)}
                      placeholder="Ej. 44100"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-extrabold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green disabled:bg-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-zinc-700 mb-1">Razón Social / Nombre Fiscal del Emisor *</label>
                    <input
                      type="text"
                      disabled={isSatSealed}
                      value={satRazonSocial}
                      onChange={(e) => setSatRazonSocial(e.target.value)}
                      placeholder="Ej. FRUTI GO DISTRIBUIDORA B2B S.A. DE C.V."
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-extrabold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green disabled:bg-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-zinc-700 mb-1">Régimen Fiscal Emisor (SAT) *</label>
                    <select
                      disabled={isSatSealed}
                      value={satRegimenFiscal}
                      onChange={(e) => setSatRegimenFiscal(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green disabled:bg-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed"
                    >
                      <option value="601 - General de Ley Personas Morales">601 - General de Ley Personas Morales</option>
                      <option value="612 - Personas Físicas con Actividades Empresariales y Profesionales">612 - Personas Físicas con Actividades Empresariales</option>
                      <option value="626 - Régimen Simplificado de Confianza (RESICO)">626 - Régimen Simplificado de Confianza (RESICO)</option>
                      <option value="603 - Personas Morales con Fines no Lucrativos">603 - Personas Morales con Fines no Lucrativos</option>
                    </select>
                  </div>
                </div>

                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-2 pt-4 flex items-center justify-between">
                  <span>2. Credenciales Solución Factura API v2</span>
                  {isSatSealed && <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><Lock className="w-3 h-3"/> Campo Sellado</span>}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black text-zinc-700 mb-1">API Bearer Token (Solución Factura v2) *</label>
                    <input
                      type="password"
                      disabled={isSatSealed}
                      value={satToken}
                      onChange={(e) => setSatToken(e.target.value)}
                      placeholder="Token configurado (Ingresa uno nuevo solo si deseas cambiarlo)"
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green disabled:bg-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed"
                    />
                    <p className="text-[11px] text-emerald-800 font-semibold mt-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                      <span>Token resguardado en el servidor. Si dejas este campo en blanco o sin modificar, se conserva tu token activo original al guardar.</span>
                    </p>
                  </div>

                  <div className="sm:col-span-2 bg-emerald-50/90 border border-emerald-300 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-1.5">
                        <RefreshCw className="w-4 h-4 text-brand-green" />
                        <span>Sincronización Total con Solución Factura v2</span>
                      </h5>
                      <span className="text-[10px] font-bold bg-brand-green text-white px-2 py-0.5 rounded-full uppercase">
                        Token Activo Producción
                      </span>
                    </div>

                    <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                      Conecta directo con tu cuenta oficial de Solución Factura v2 para importar y sincronizar tu catálogo de clientes receptores y el catálogo fiscal de productos/insumos.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleSyncAllSolucionFactura}
                        disabled={isSyncingSfAll || isSyncingSfClients || isSyncingSfProducts}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncingSfAll ? "animate-spin" : ""}`} />
                        <span>{isSyncingSfAll ? "Sincronizando Todo..." : "⚡ Sincronizar Todo (Clientes + Productos)"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSyncSolucionFacturaClients}
                        disabled={isSyncingSfAll || isSyncingSfClients}
                        className="px-3.5 py-2.5 bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <Users className="w-3.5 h-3.5 text-brand-green" />
                        <span>{isSyncingSfClients ? "Sincronizando..." : "👥 Sincronizar Clientes"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSyncSolucionFacturaProducts}
                        disabled={isSyncingSfAll || isSyncingSfProducts}
                        className="px-3.5 py-2.5 bg-white hover:bg-emerald-100/60 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <Package className="w-3.5 h-3.5 text-brand-green" />
                        <span>{isSyncingSfProducts ? "Sincronizando..." : "📦 Sincronizar Productos"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wide border-b border-zinc-100 pb-2 pt-4 flex items-center justify-between">
                  <span>3. Certificados de Sello Digital CSD (Firmas del Emisor)</span>
                  {isSatSealed && <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1"><Lock className="w-3 h-3"/> Firmas Selladas</span>}
                </h4>

                <div className="space-y-4">
                  {/* Archivo Certificado .cer */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-zinc-800">
                        1. Archivo de Certificado CSD (.cer)
                      </label>
                      {satCertPem ? (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                          <span>Certificado cargado y sellado {certFileName ? `(${certFileName})` : ''}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-400">Sin archivo seleccionado</span>
                      )}
                    </div>

                    {!isSatSealed ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <label className="w-full sm:w-auto px-4 py-2.5 bg-white border border-zinc-300 hover:border-brand-green hover:bg-emerald-50/50 text-zinc-900 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95">
                          <Upload className="w-4 h-4 text-brand-green" />
                          <span>Subir archivo .cer desde mi computadora</span>
                          <input
                            type="file"
                            accept=".cer,.pem,.txt"
                            onChange={handleCertFileUpload}
                            className="hidden"
                          />
                        </label>
                        {satCertPem && (
                          <button
                            type="button"
                            onClick={() => {
                              setSatCertPem("");
                              setCertFileName(null);
                              showToast("Certificado .cer eliminado");
                            }}
                            className="w-full sm:w-auto px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
                            title="Eliminar certificado .cer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>Eliminar .cer</span>
                          </button>
                        )}
                        <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">o pega la cadena Base64/PEM directamente</span>
                      </div>
                    ) : (
                      <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-200 text-[11px] font-bold text-emerald-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Archivo .cer resguardado y sellado contra ediciones. Desbloquea para reemplazar.</span>
                      </div>
                    )}

                    <textarea
                      rows={2}
                      disabled={isSatSealed}
                      value={satCertPem}
                      onChange={(e) => setSatCertPem(e.target.value)}
                      placeholder="Cadena Base64/PEM del certificado .cer (se completa automáticamente al subir el archivo)..."
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-mono text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-green disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Archivo Llave Privada .key */}
                  <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-zinc-800">
                        2. Archivo de Llave Privada CSD (.key)
                      </label>
                      {satKeyPem ? (
                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                          <span>Llave cargada y sellada {keyFileName ? `(${keyFileName})` : ''}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-zinc-400">Sin archivo seleccionado</span>
                      )}
                    </div>

                    {!isSatSealed ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <label className="w-full sm:w-auto px-4 py-2.5 bg-white border border-zinc-300 hover:border-brand-green hover:bg-emerald-50/50 text-zinc-900 font-extrabold text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95">
                          <Upload className="w-4 h-4 text-brand-green" />
                          <span>Subir archivo .key desde mi computadora</span>
                          <input
                            type="file"
                            accept=".key,.pem,.txt"
                            onChange={handleKeyFileUpload}
                            className="hidden"
                          />
                        </label>
                        {satKeyPem && (
                          <button
                            type="button"
                            onClick={() => {
                              setSatKeyPem("");
                              setKeyFileName(null);
                              showToast("Llave privada .key eliminada");
                            }}
                            className="w-full sm:w-auto px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
                            title="Eliminar llave privada .key"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                            <span>Eliminar .key</span>
                          </button>
                        )}
                        <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">o pega la cadena Base64/PEM directamente</span>
                      </div>
                    ) : (
                      <div className="p-2 bg-emerald-50/50 rounded-xl border border-emerald-200 text-[11px] font-bold text-emerald-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Archivo .key resguardado y sellado contra ediciones. Desbloquea para reemplazar.</span>
                      </div>
                    )}

                    <textarea
                      rows={2}
                      disabled={isSatSealed}
                      value={satKeyPem}
                      onChange={(e) => setSatKeyPem(e.target.value)}
                      placeholder="Cadena Base64/PEM de la llave privada .key (se completa automáticamente al subir el archivo)..."
                      className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[10px] font-mono text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-green disabled:bg-zinc-100 disabled:text-zinc-500 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-zinc-700 mb-1">Contraseña de la Llave Privada CSD</label>
                    <input
                      type="password"
                      disabled={isSatSealed}
                      value={satPassword}
                      onChange={(e) => setSatPassword(e.target.value)}
                      placeholder="Ingresa la contraseña de tu clave privada .key..."
                      className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green disabled:bg-zinc-100 disabled:text-zinc-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  {!isSatSealed ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSatConfirmModal({
                          type: "seal",
                          title: "🔒 Confirmar Guardado y Sellado de Datos del Emisor",
                          message: "¿Deseas guardar permanentemente y sellar los datos fiscales y certificados CSD (.cer y .key) del Emisor SAT?",
                          actionLabel: "Sí, Guardar y Sellar Certificados",
                          onConfirm: handleSaveSatConfig
                        });
                      }}
                      disabled={satSaving}
                      className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{satSaving ? "Guardando..." : "🔒 Guardar y Sellar Datos y Firmas del Emisor SAT"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSatConfirmModal({
                          type: "unlock",
                          title: "🔓 Desbloquear Datos y Certificados del Emisor",
                          message: "¿Confirmas que deseas desbloquear para editar los certificados y datos del Emisor SAT?",
                          actionLabel: "Sí, Desbloquear para Cambiar",
                          onConfirm: () => {
                            setIsSatSealed(false);
                            showToast("Modo edición desbloqueado.");
                          }
                        });
                      }}
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      <span>🔓 Desbloquear y Cambiar Datos del Emisor (Requiere Confirmación)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: CLIENTS CATALOG & B2B INVOICING */}
          {activeTab === "clients" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-black text-[10px] rounded-full uppercase border border-amber-300">
                      PANEL DE ADMINISTRACIÓN B2B
                    </span>
                    <span className="text-xs text-zinc-400 font-bold">• {clientList.length} Clientes Registrados</span>
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mt-1">Catálogo Total de Clientes y Historial de Facturación</h3>
                  <p className="text-xs text-zinc-500 mt-0.5 max-w-2xl">
                    Selecciona cualquier cliente de la lista para consultar sus datos de facturación, ver su historial completo de facturas timbradas o emitirle una nueva factura CFDI 4.0 directamente.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleSyncSolucionFacturaClients}
                    disabled={isSyncingSfClients}
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSfClients ? "animate-spin" : ""}`} />
                    <span>{isSyncingSfClients ? "Sincronizando..." : "⚡ Sincronizar Clientes v2"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewClientRfc("");
                      setNewClientRazonSocial("");
                      setNewClientRegimen("601 - General de Ley Personas Morales");
                      setNewClientZip("44100");
                      setNewClientUso("G01 - Adquisición de mercancías");
                      setNewClientEmail("");
                      setNewClientPhone("");
                      setNewClientAddress("");
                      setIsAddClientModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-brand-yellow" />
                    <span>➕ Registrar Nuevo Cliente</span>
                  </button>
                </div>
              </div>

              {/* CLIENT SELECTOR & DROPDOWN MENU */}
              <div className="bg-gradient-to-r from-emerald-900 via-zinc-900 to-zinc-900 p-5 rounded-2xl text-white shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase text-brand-yellow tracking-wider">
                    📋 Desplegable / Menú de Selección de Clientes ({clientList.length})
                  </label>
                  <span className="text-[10px] text-zinc-300 font-semibold">Selecciona un cliente para gestionar</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <select
                      value={selectedClient?.rfc || ""}
                      onChange={(e) => {
                        const found = clientList.find((c) => c.rfc === e.target.value);
                        if (found) setSelectedClient(found);
                      }}
                      className="w-full px-4 py-3 bg-white text-zinc-900 font-extrabold text-sm rounded-xl border-2 border-brand-yellow shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                    >
                      {clientList
                        .filter((c) => {
                          if (!clientSearchQuery.trim()) return true;
                          const q = clientSearchQuery.toLowerCase().trim();
                          return (
                            c.razonSocial?.toLowerCase().includes(q) ||
                            c.rfc?.toLowerCase().includes(q) ||
                            c.id?.toLowerCase().includes(q)
                          );
                        })
                        .map((c) => (
                          <option key={c.id || c.rfc} value={c.rfc}>
                            [{c.rfc}] {c.razonSocial} {c.email ? `(${c.email})` : ""}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        value={clientSearchQuery}
                        onChange={(e) => setClientSearchQuery(e.target.value)}
                        placeholder="Buscar cliente por RFC o Razón Social..."
                        className="w-full pl-9 pr-3.5 py-3 bg-zinc-800 text-white placeholder-zinc-400 font-bold text-xs rounded-xl border border-zinc-700 focus:outline-none focus:border-brand-yellow"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SELECTED CLIENT DETAILS & INVOICES */}
              {selectedClient ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Selected Client Card */}
                  <div className="bg-zinc-50 border-2 border-emerald-500/40 p-5 rounded-2xl shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300">
                          <Users className="w-6 h-6 text-brand-green" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-extrabold uppercase text-emerald-800 block">
                            ID Cliente: {selectedClient.id || selectedClient.rfc}
                          </span>
                          <h4 className="text-base font-black text-zinc-900">{selectedClient.razonSocial}</h4>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setInvoiceConcepts([
                            { description: "Insumos Fruti Go Mayoreo - Pedido B2B", quantity: 1, unitPrice: 1500, claveSat: "50111500", unidadSat: "KGM" }
                          ]);
                          setIsGenerateInvoiceModalOpen(true);
                        }}
                        className="w-full sm:w-auto px-5 py-3 bg-brand-green hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-brand-yellow" />
                        <span>📄 Generar Factura a este Cliente 🧾</span>
                      </button>
                    </div>

                    {/* Fiscal Data Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-black text-zinc-400 uppercase block mb-0.5">RFC Fiscal</span>
                        <span className="font-mono font-black text-zinc-900 text-sm">{selectedClient.rfc}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-black text-zinc-400 uppercase block mb-0.5">Régimen Fiscal</span>
                        <span className="font-bold text-zinc-800">{selectedClient.regimenFiscal || "601 - General de Ley Personas Morales"}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-black text-zinc-400 uppercase block mb-0.5">Código Postal Fiscal</span>
                        <span className="font-mono font-black text-zinc-900">{selectedClient.zipCode || "44100"}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-black text-zinc-400 uppercase block mb-0.5">Uso de CFDI</span>
                        <span className="font-bold text-zinc-800">{selectedClient.usoCFDI || "G01 - Adquisición de mercancías"}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-black text-zinc-400 uppercase block mb-0.5">Correo para Facturas XML/PDF</span>
                        <span className="font-bold text-emerald-900">{selectedClient.email || "No especificado"}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-zinc-200">
                        <span className="text-[10px] font-black text-zinc-400 uppercase block mb-0.5">Teléfono / Domicilio</span>
                        <span className="font-bold text-zinc-700">{selectedClient.phone || selectedClient.address || "Guadalajara, Jalisco"}</span>
                      </div>
                    </div>
                  </div>

                  {/* INVOICE HISTORY FOR SELECTED CLIENT */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-brand-green" />
                        <h4 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                          Historial de Facturas Emitidas a {selectedClient.razonSocial}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={fetchInvoices}
                        className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Actualizar historial</span>
                      </button>
                    </div>

                    {(() => {
                      const clientRfcUpper = (selectedClient.rfc || "").toUpperCase().trim();
                      const clientInvoices = invoicesList.filter((inv) => {
                        const invRfc = (inv.billingInfo?.rfc || inv.customer?.billingInfo?.rfc || inv.receptor?.rfc || "").toUpperCase().trim();
                        const invName = (inv.billingInfo?.razonSocial || inv.customer?.fullName || "").toLowerCase();
                        return invRfc === clientRfcUpper || (clientRfcUpper !== "XAXX010101000" && invName.includes(selectedClient.razonSocial.toLowerCase().substring(0, 8)));
                      });

                      if (clientInvoices.length === 0) {
                        return (
                          <div className="p-8 text-center bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-2xl space-y-2">
                            <FileText className="w-10 h-10 text-zinc-300 mx-auto" />
                            <h5 className="text-sm font-bold text-zinc-700">Sin facturas emitidas para {selectedClient.razonSocial}</h5>
                            <p className="text-xs text-zinc-500 max-w-md mx-auto">
                              Aún no hay comprobantes fiscales CFDI 4.0 registrados para este cliente en el sistema. Puedes hacer clic en el botón superior para generarle una factura en este momento.
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          {clientInvoices.map((inv, idx) => (
                            <div
                              key={inv.invoiceId || inv.uuid || idx}
                              className="p-4 bg-white border border-zinc-200 rounded-2xl space-y-3 shadow-xs hover:border-emerald-300 transition-all"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                                <div>
                                  <span className="text-[10px] font-mono font-black text-brand-green block uppercase">
                                    Folio: #{inv.invoiceId || inv.orderId}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-zinc-500">
                                    UUID: {inv.uuid || "TIMBRE-SF-CFDI-40"}
                                  </span>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-zinc-400 uppercase block">Monto Total</span>
                                  <span className="text-base font-black text-emerald-900">${Number(inv.total || 0).toFixed(2)} MXN</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
                                <div>
                                  <span className="text-zinc-400 font-bold">Fecha Timbrado: </span>
                                  <span className="font-semibold">{inv.date || inv.fechaTimbrado || "Reciente"}</span>
                                </div>
                                <div>
                                  <span className="text-zinc-400 font-bold">Estatus SAT: </span>
                                  <span className="inline-flex items-center gap-1 font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] uppercase border border-emerald-300">
                                    <CheckCircle2 className="w-3 h-3 text-brand-green" />
                                    <span>TIMBRADA CFDI 4.0</span>
                                  </span>
                                </div>
                              </div>

                              {/* Download Actions */}
                              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-dashed border-zinc-200">
                                <button
                                  type="button"
                                  onClick={() => generateCFDIPDF(inv, { invoiceDetails: inv })}
                                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                                >
                                  <FileText className="w-3.5 h-3.5 text-brand-yellow" />
                                  <span>Descargar Factura PDF 📄</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => downloadCFDIXML(inv, inv)}
                                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                                >
                                  <FileCode className="w-3.5 h-3.5 text-blue-200" />
                                  <span>Descargar XML (CFDI 4.0) 📦</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 p-6">
                  <Users className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-600">Selecciona un cliente del desplegable superior.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: DESARROLLADOR Y FUNDADOR */}
          {activeTab === "desarrollador" && (
            <div className="space-y-8">
              {/* Header */}
              <div className="border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-brand-green font-black text-[10px] rounded-full uppercase border border-emerald-300">
                    PERFIL VERIFICADO B2B & INGENIERÍA
                  </span>
                </div>
                <h3 className="text-xl font-black text-zinc-900">Configuración del Perfil del Desarrollador y Fundador</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-3xl">
                  Administra la información oficial del Desarrollador Principal y Creador de Fruti Go. Todos los cambios guardados aquí se actualizarán instantáneamente en la sección pública "Sobre el Desarrollador".
                </p>
              </div>

              {/* Grid: Form Editor on Left, Live Preview Card on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Form Editor (7 cols) */}
                <div className="lg:col-span-7 bg-zinc-50 border border-zinc-200 rounded-3xl p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                    <h4 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-brand-green" />
                      <span>Editar Datos del Perfil</span>
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-bold">Campos Oficiales</span>
                  </div>

                  <div className="space-y-6">
                    {/* Multi-Photo Gallery Management Section in Admin (Up to 5 Photos) */}
                    <div className="p-5 bg-white border border-zinc-200 rounded-3xl space-y-4 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <UploadCloud className="w-5 h-5 text-brand-green" />
                          <h4 className="text-sm font-black text-zinc-900">
                            Galería de Fotos del Desarrollador / CEO (Hasta 5 Fotos para SEO e Indexación)
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          La <strong className="text-brand-green">Foto #1</strong> se utilizará siempre como la fotografía principal de "Sobre el Desarrollador". Las fotos <strong className="text-emerald-700">#2 a #5</strong> actuarán como respaldo y fotos complementarias. Todas las fotos con sus descripciones personalizadas serán automáticamente indexadas por Google (Schema.org / JSON-LD).
                        </p>
                      </div>

                      <div className="space-y-4">
                        {[0, 1, 2, 3, 4].map((slotIdx) => {
                          const photosArr = Array.isArray(founderForm.photos) ? founderForm.photos : [];
                          const item = photosArr[slotIdx] || {
                            url: slotIdx === 0 ? (founderForm.photo || "") : "",
                            caption: slotIdx === 0 ? "Alberto Reyes Sandoval - Foto Principal de Perfil" : `Alberto Reyes Sandoval - Foto Complementaria ${slotIdx + 1}`,
                            description: slotIdx === 0 ? "Fotografía oficial de Alberto Reyes Sandoval, Creador, Desarrollador Principal y CEO de Fruti Go." : `Fotografía de respaldo y complemento ${slotIdx + 1} de Alberto Reyes Sandoval.`
                          };

                          const isMain = slotIdx === 0;

                          const updateSlot = (key: "url" | "caption" | "description", val: string) => {
                            setFounderForm((prev) => {
                              const newPhotos = Array.isArray(prev.photos) ? [...prev.photos] : [];
                              while (newPhotos.length <= slotIdx) {
                                newPhotos.push({
                                  url: "",
                                  caption: `Alberto Reyes Sandoval - Foto ${newPhotos.length + 1}`,
                                  description: `Fotografía oficial de Alberto Reyes Sandoval.`
                                });
                              }
                              newPhotos[slotIdx] = {
                                ...newPhotos[slotIdx],
                                [key]: val
                              };
                              const mainPhoto = newPhotos[0]?.url || prev.photo || "";
                              const updated = {
                                ...prev,
                                photo: mainPhoto,
                                photos: newPhotos
                              };
                              if (typeof window !== "undefined") {
                                localStorage.setItem("fg_founder_profile", JSON.stringify(updated));
                                window.dispatchEvent(new Event("storage"));
                                window.dispatchEvent(new Event("fg_founder_profile_updated"));
                              }

                              // Auto-persist profile data to server in background
                              fetch("/api/founder/profile", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(updated)
                              }).catch(() => {});

                              return updated;
                            });
                          };

                          return (
                            <div
                              key={slotIdx}
                              className={`p-4 rounded-2xl border transition-all ${
                                isMain
                                  ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200"
                                  : "bg-zinc-50 border-zinc-200"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-zinc-900">
                                  {isMain ? (
                                    <span className="px-2.5 py-0.5 bg-brand-green text-white rounded-md text-[10px] font-black">
                                      Foto #1 - Principal (Sobre el Desarrollador)
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-0.5 bg-zinc-800 text-amber-300 rounded-md text-[10px] font-black">
                                      Foto #{slotIdx + 1} - Respaldo y Complemento
                                    </span>
                                  )}
                                </span>
                                {item.url && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateSlot("url", "");
                                      showToast(`Foto #${slotIdx + 1} removida.`);
                                    }}
                                    className="text-[10px] text-red-600 hover:underline font-bold"
                                  >
                                    Eliminar foto #{slotIdx + 1}
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                {/* Thumbnail */}
                                <div className="md:col-span-3 flex flex-col items-center justify-center">
                                  <div className="w-24 h-28 rounded-2xl bg-zinc-950 border-2 border-emerald-300 flex items-center justify-center overflow-hidden shrink-0 shadow-xs p-1 relative">
                                    {item.url ? (
                                      <img
                                        src={item.url}
                                        alt={item.caption || `Foto ${slotIdx + 1}`}
                                        className="w-full h-full object-cover rounded-xl"
                                      />
                                    ) : (
                                      <div className="text-center p-2 text-zinc-500 space-y-1">
                                        <UserCheck className="w-6 h-6 text-zinc-600 mx-auto" />
                                        <span className="text-[9px] block">Sin Foto #{slotIdx + 1}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Form Controls */}
                                <div className="md:col-span-9 space-y-2">
                                  <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <label className="cursor-pointer bg-white hover:bg-emerald-50 text-brand-green border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs">
                                      <UploadCloud className="w-4 h-4 text-brand-green" />
                                      <span>Subir archivo foto #{slotIdx + 1}...</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            try {
                                              showToast(`Optimizando foto #${slotIdx + 1}...`);
                                              const compressedBase64 = await compressImageFile(file, 1200, 0.8);
                                              showToast(`Subiendo foto #${slotIdx + 1}...`);
                                              const res = await fetch("/api/founder/upload-photo", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ imageBase64: compressedBase64, slotIndex: slotIdx })
                                              });
                                              const data = await res.json();
                                              if (data.success && data.photoUrl) {
                                                updateSlot("url", data.photoUrl);
                                                showToast(`¡Fotografía #${slotIdx + 1} guardada exitosamente!`);
                                              } else {
                                                updateSlot("url", compressedBase64);
                                                showToast(`¡Foto #${slotIdx + 1} cargada!`);
                                              }
                                            } catch (err) {
                                              console.error("Error al subir foto:", err);
                                              showToast("Error al procesar la foto.");
                                            }
                                          }
                                        }}
                                        className="hidden"
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      value={item.url || ""}
                                      onChange={(e) => updateSlot("url", e.target.value)}
                                      placeholder="O pega una URL de imagen (https://...)"
                                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[11px] font-mono text-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-green"
                                    />
                                  </div>

                                  <div>
                                    <input
                                      type="text"
                                      value={item.caption || ""}
                                      onChange={(e) => updateSlot("caption", e.target.value)}
                                      placeholder={`Título / Pie de foto #${slotIdx + 1} (ej. Alberto Reyes Sandoval - CEO en Oficina)`}
                                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-green"
                                    />
                                  </div>

                                  <div>
                                    <textarea
                                      rows={2}
                                      value={item.description || ""}
                                      onChange={(e) => updateSlot("description", e.target.value)}
                                      placeholder={`Descripción SEO / Google Indexación para Foto #${slotIdx + 1}...`}
                                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-[11px] text-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-green resize-none"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-zinc-700 mb-1">Nombre Completo del Desarrollador</label>
                      <input
                        type="text"
                        value={founderForm.name}
                        onChange={(e) => setFounderForm({ ...founderForm, name: e.target.value })}
                        placeholder="Ej. Alberto Reyes Sandoval"
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-zinc-700 mb-1">Rol / Cargo Oficial</label>
                      <input
                        type="text"
                        value={founderForm.role}
                        onChange={(e) => setFounderForm({ ...founderForm, role: e.target.value })}
                        placeholder="Ej. Creador, Desarrollador Principal y Fundador"
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-zinc-700 mb-1">Correo Electrónico Directo</label>
                        <input
                          type="email"
                          value={founderForm.email}
                          onChange={(e) => setFounderForm({ ...founderForm, email: e.target.value })}
                          placeholder="contacto@ejemplo.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-zinc-700 mb-1">Enlace Perfil LinkedIn</label>
                        <input
                          type="url"
                          value={founderForm.linkedin || ""}
                          onChange={(e) => setFounderForm({ ...founderForm, linkedin: e.target.value })}
                          placeholder="https://www.linkedin.com/in/perfil"
                          className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black text-zinc-700 mb-1">Canal de YouTube Oficial</label>
                        <input
                          type="url"
                          value={founderForm.youtube || ""}
                          onChange={(e) => setFounderForm({ ...founderForm, youtube: e.target.value })}
                          placeholder="https://youtube.com/@albertoreyesfrutigo?si=T2Ba5HGKGn_3DYYt"
                          className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-zinc-700 mb-1">Cita / Declaración de Visión (Quote)</label>
                      <textarea
                        rows={2}
                        value={founderForm.quote}
                        onChange={(e) => setFounderForm({ ...founderForm, quote: e.target.value })}
                        placeholder="Declaración o frase destacada..."
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-medium text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-zinc-700 mb-1">Biografía - Párrafo 1 (Orígenes, Familia & Zamora)</label>
                      <textarea
                        rows={3}
                        value={founderForm.bioP1 || ""}
                        onChange={(e) => setFounderForm({ ...founderForm, bioP1: e.target.value })}
                        placeholder="Biografía Párrafo 1..."
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-medium text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-zinc-700 mb-1">Biografía - Párrafo 2 (Arquitectura & Trayectoria Fruti Go)</label>
                      <textarea
                        rows={3}
                        value={founderForm.bioP2 || ""}
                        onChange={(e) => setFounderForm({ ...founderForm, bioP2: e.target.value })}
                        placeholder="Biografía Párrafo 2..."
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-medium text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-zinc-700 mb-1">Biografía - Párrafo 3 (Problemáticas del Mercado, ITESO & Visión)</label>
                      <textarea
                        rows={3}
                        value={founderForm.bioP3 || ""}
                        onChange={(e) => setFounderForm({ ...founderForm, bioP3: e.target.value })}
                        placeholder="Biografía Párrafo 3..."
                        className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl font-medium text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                      />
                    </div>

                    {/* Sección de Publicación de Artículos del Desarrollador */}
                    <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200/80 pb-2.5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-brand-green" />
                            <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                              Artículos y Publicaciones del Desarrollador
                            </h4>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Publica artículos explicativos. Aparecerán en la pantalla "Sobre el Desarrollador" después de la galería de fotos y videos.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const todayStr = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });
                            setEditingArticle({
                              id: "",
                              title: "",
                              date: todayStr,
                              category: "Ingeniería & Software",
                              summary: "",
                              content: "",
                              authorName: founderForm.name || "Alberto Reyes Sandoval",
                              signedBy: `${founderForm.name || "Alberto Reyes Sandoval"} (${founderForm.role || "Desarrollador Principal & Fundador"})`,
                              images: [
                                { url: "", caption: "" },
                                { url: "", caption: "" },
                                { url: "", caption: "" }
                              ]
                            });
                            setShowArticleModal(true);
                          }}
                          className="px-3 py-1.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-brand-yellow" />
                          <span>✍️ Publicar Artículo</span>
                        </button>
                      </div>

                      {/* Lista de artículos publicados en Admin */}
                      {(!founderForm.articles || founderForm.articles.length === 0) ? (
                        <div className="p-3 text-center text-zinc-400 bg-white rounded-xl border border-dashed border-zinc-200">
                          <FileText className="w-6 h-6 mx-auto text-zinc-300 mb-1" />
                          <p className="text-xs font-bold text-zinc-600">No hay artículos publicados aún.</p>
                          <p className="text-[10px] text-zinc-400">Haz clic en "Publicar Artículo" para redactar tu primera publicación con imágenes.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {founderForm.articles.map((art: any, idx: number) => {
                            const imgCount = Array.isArray(art.images) ? art.images.filter((i: any) => Boolean(i && i.url)).length : 0;
                            return (
                              <div
                                key={art.id || idx}
                                className="p-3 bg-white border border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-emerald-300 transition shadow-2xs"
                              >
                                <div className="space-y-0.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-black uppercase">
                                      {art.category || "General"}
                                    </span>
                                    <span className="text-[10px] font-bold text-zinc-400">{art.date}</span>
                                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                                      👤 Autor: {art.authorName || founderForm.name || "Alberto Reyes Sandoval"}
                                    </span>
                                    <span className="text-[9px] font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded-md border border-zinc-200">
                                      ✍️ Firmado por: {art.signedBy || art.authorName || "Alberto Reyes Sandoval"}
                                    </span>
                                    {imgCount > 0 && (
                                      <span className="text-[9px] font-bold text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded-full">
                                        📷 {imgCount} imagen{imgCount > 1 ? "es" : ""}
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="text-xs font-black text-zinc-900 line-clamp-1">
                                    {art.title}
                                  </h5>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const imgs = Array.isArray(art.images) ? [...art.images] : [];
                                      while (imgs.length < 3) {
                                        imgs.push({ url: "", caption: "" });
                                      }
                                      setEditingArticle({
                                        id: art.id,
                                        title: art.title || "",
                                        date: art.date || "",
                                        category: art.category || "Ingeniería & Software",
                                        summary: art.summary || "",
                                        content: art.content || "",
                                        authorName: art.authorName || founderForm.name || "Alberto Reyes Sandoval",
                                        signedBy: art.signedBy || `${art.authorName || founderForm.name || "Alberto Reyes Sandoval"} (${founderForm.role || "Desarrollador Principal"})`,
                                        images: imgs.slice(0, 3)
                                      });
                                      setShowArticleModal(true);
                                    }}
                                    className="px-2 py-1 bg-zinc-50 hover:bg-emerald-50 text-zinc-700 border border-zinc-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3 text-brand-green" />
                                    <span>Editar</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (confirm(`¿Deseas eliminar el artículo "${art.title}"?`)) {
                                        const newArticles = founderForm.articles?.filter((a: any) => a.id !== art.id) || [];
                                        const updated = { ...founderForm, articles: newArticles };
                                        setFounderForm(updated);
                                        if (typeof window !== "undefined") {
                                          localStorage.setItem("fg_founder_profile", JSON.stringify(updated));
                                          window.dispatchEvent(new Event("storage"));
                                          window.dispatchEvent(new Event("fg_founder_profile_updated"));
                                        }
                                        try {
                                          await fetch("/api/founder/profile", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(updated)
                                          });
                                        } catch (e) {}
                                        showToast("Artículo eliminado.");
                                      }
                                    }}
                                    className="px-2 py-1 bg-zinc-50 hover:bg-red-50 text-red-600 border border-zinc-200 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Eliminar</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={savingFounder}
                        onClick={async () => {
                          setSavingFounder(true);
                          // Sync local state and events immediately
                          if (typeof window !== "undefined") {
                            localStorage.setItem("fg_founder_profile", JSON.stringify(founderForm));
                            window.dispatchEvent(new Event("storage"));
                            window.dispatchEvent(new Event("fg_founder_profile_updated"));
                          }

                          try {
                            const payloadWithBios = {
                              ...founderForm,
                              bio1: founderForm.bio1 || [founderForm.bioP1, founderForm.bioP2].filter(Boolean).join("\n\n"),
                              bio2: founderForm.bio2 || founderForm.bioP3 || "",
                              bioP1: founderForm.bioP1 || "",
                              bioP2: founderForm.bioP2 || "",
                              bioP3: founderForm.bioP3 || "",
                              bio: [founderForm.bioP1, founderForm.bioP2, founderForm.bioP3].filter(Boolean).join("\n\n"),
                              photoUrl: founderForm.photoUrl || founderForm.photo || ""
                            };

                            const res = await fetch("/api/founder/profile", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(payloadWithBios)
                            });
                            const data = await res.json();
                            const profileToSave = (data && data.profile) ? data.profile : payloadWithBios;
                            setFounderForm(profileToSave);
                            if (typeof window !== "undefined") {
                              localStorage.setItem("fg_founder_profile", JSON.stringify(profileToSave));
                              window.dispatchEvent(new Event("storage"));
                              window.dispatchEvent(new Event("fg_founder_profile_updated"));
                            }

                            // Save directly to Firebase Firestore from client as well
                            try {
                              const { saveFounderProfileToFirestore } = await import("../lib/firebaseService");
                              await saveFounderProfileToFirestore(profileToSave);
                            } catch (e) {
                              console.warn("Client Firestore direct save notice:", e);
                            }

                            showToast("¡Perfil del Desarrollador guardado exitosamente en el servidor y Firebase Firestore!");
                          } catch (err) {
                            console.error("Error al guardar perfil en servidor:", err);
                            showToast("¡Perfil del Desarrollador guardado en la memoria local!");
                          } finally {
                            setSavingFounder(false);
                          }
                        }}
                        className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 disabled:opacity-75 disabled:cursor-wait text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {savingFounder ? (
                          <>
                            <RefreshCw className="w-5 h-5 text-brand-yellow animate-spin" />
                            <span>Guardando Perfil del Desarrollador...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5 text-brand-yellow" />
                            <span>💾 Guardar Perfil del Desarrollador</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Preview Card (5 cols) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-green" />
                      Vista Previa en Tiempo Real
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      Página Pública
                    </span>
                  </div>

                  <FounderProfileCard data={founderForm} />
                </div>

              </div>
            </div>
          )}

          {/* TAB 11: GALERÍA MULTIMEDIA FUNDADOR */}
          {activeTab === "fundador-media" && (
            <AdminFundadorMedia />
          )}

          {/* TAB 12: USUARIOS FIRESTORE (DEFAULT) EN TIEMPO REAL */}
          {activeTab === "usuarios-firestore" && (
            <AdminUsuariosFirestore onNotify={showToast} />
          )}
        </div>
      </div>

      {/* MODAL 1: REGISTRAR NUEVO CLIENTE AL CATÁLOGO */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-zinc-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-brand-green" />
                <h3 className="text-lg font-black text-zinc-900">Registrar Nuevo Cliente en Catálogo SAT</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddClientModalOpen(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-black text-zinc-700 mb-1">Razón Social / Nombre Fiscal *</label>
                <input
                  type="text"
                  value={newClientRazonSocial}
                  onChange={(e) => setNewClientRazonSocial(e.target.value)}
                  placeholder="Ej. OPERADORA RESTAURANTERA DA LUIGIS S.A. DE C.V."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-zinc-700 mb-1">RFC Fiscal *</label>
                  <input
                    type="text"
                    value={newClientRfc}
                    onChange={(e) => setNewClientRfc(e.target.value.toUpperCase())}
                    placeholder="Ej. DLU1209045M2"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono font-black text-zinc-900 uppercase focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block font-black text-zinc-700 mb-1">Código Postal Domicilio Fiscal *</label>
                  <input
                    type="text"
                    value={newClientZip}
                    onChange={(e) => setNewClientZip(e.target.value)}
                    placeholder="Ej. 44100"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-zinc-700 mb-1">Régimen Fiscal SAT *</label>
                <select
                  value={newClientRegimen}
                  onChange={(e) => setNewClientRegimen(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="601 - General de Ley Personas Morales">601 - General de Ley Personas Morales</option>
                  <option value="612 - Personas Físicas con Actividades Empresariales y Profesionales">612 - Personas Físicas con Actividades Empresariales</option>
                  <option value="626 - Régimen Simplificado de Confianza (RESICO)">626 - Régimen Simplificado de Confianza (RESICO)</option>
                  <option value="603 - Personas Morales con Fines no Lucrativos">603 - Personas Morales con Fines no Lucrativos</option>
                  <option value="616 - Sin obligaciones fiscales">616 - Sin obligaciones fiscales</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-zinc-700 mb-1">Uso de CFDI por Defecto</label>
                <select
                  value={newClientUso}
                  onChange={(e) => setNewClientUso(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <option value="G01 - Adquisición de mercancías">G01 - Adquisición de mercancías</option>
                  <option value="G03 - Gastos en general">G03 - Gastos en general</option>
                  <option value="P01 - Por definir">P01 - Por definir</option>
                  <option value="S01 - Sin efectos fiscales">S01 - Sin efectos fiscales</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-zinc-700 mb-1">Correo Electrónico para Facturas</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="facturacion@empresa.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block font-black text-zinc-700 mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="33 1234 5678"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-zinc-700 mb-1">Dirección / Referencias</label>
                <input
                  type="text"
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                  placeholder="Av. Vallarta #1234, Col. Americana, Guadalajara"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setIsAddClientModalOpen(false)}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveClientToCatalog}
                className="px-5 py-2.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                💾 Guardar Cliente en Catálogo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: GENERAR FACTURA A CLIENTE SELECCIONADO */}
      {isGenerateInvoiceModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-zinc-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-green" />
                <div>
                  <h3 className="text-lg font-black text-zinc-900">Generar Factura CFDI 4.0</h3>
                  <span className="text-xs font-bold text-emerald-800">Cliente: {selectedClient.razonSocial} ({selectedClient.rfc})</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGenerateInvoiceModalOpen(false)}
                className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receptor Summary Box */}
            <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-zinc-400 font-bold block">Receptor RFC:</span>
                <span className="font-mono font-black text-zinc-900">{selectedClient.rfc}</span>
              </div>
              <div>
                <span className="text-zinc-400 font-bold block">C.P. Domicilio:</span>
                <span className="font-mono font-bold text-zinc-900">{selectedClient.zipCode || "44100"}</span>
              </div>
              <div>
                <span className="text-zinc-400 font-bold block">Régimen:</span>
                <span className="font-bold text-zinc-800 truncate block">{selectedClient.regimenFiscal}</span>
              </div>
            </div>

            {/* Concepts Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-zinc-900 uppercase tracking-wide">Conceptos / Insumos a Facturar</h4>
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceConcepts([
                      ...invoiceConcepts,
                      { description: "Insumo Adicional Fruti Go", quantity: 1, unitPrice: 500, claveSat: "50111500", unidadSat: "KGM" }
                    ]);
                  }}
                  className="px-2.5 py-1 bg-emerald-100 text-emerald-900 hover:bg-emerald-200 font-extrabold text-[11px] rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Agregar Concepto</span>
                </button>
              </div>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {invoiceConcepts.map((concept, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-black text-emerald-800 text-[10px]">Línea #{idx + 1}</span>
                      {invoiceConcepts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setInvoiceConcepts(invoiceConcepts.filter((_, i) => i !== idx));
                          }}
                          className="text-red-500 hover:text-red-700 text-[10px] font-bold cursor-pointer"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-6">
                        <label className="block text-[10px] font-bold text-zinc-500 mb-0.5">Descripción del Insumo / Producto</label>
                        <input
                          type="text"
                          value={concept.description}
                          onChange={(e) => {
                            const updated = [...invoiceConcepts];
                            updated[idx].description = e.target.value;
                            setInvoiceConcepts(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg font-bold text-zinc-900"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-zinc-500 mb-0.5">Cant.</label>
                        <input
                          type="number"
                          min="1"
                          value={concept.quantity}
                          onChange={(e) => {
                            const updated = [...invoiceConcepts];
                            updated[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
                            setInvoiceConcepts(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg font-black text-center text-zinc-900"
                        />
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[10px] font-bold text-zinc-500 mb-0.5">Precio Unitario ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={concept.unitPrice}
                          onChange={(e) => {
                            const updated = [...invoiceConcepts];
                            updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                            setInvoiceConcepts(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg font-mono font-black text-zinc-900"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Invoice Total */}
              <div className="p-3.5 bg-emerald-950 text-white rounded-2xl flex items-center justify-between">
                <span className="text-xs font-black uppercase text-brand-yellow">Total a Facturar (IVA Incluido):</span>
                <span className="text-lg font-black font-mono">
                  ${invoiceConcepts.reduce((sum, c) => sum + (c.quantity * c.unitPrice), 0).toFixed(2)} MXN
                </span>
              </div>

              {/* Payment Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block font-black text-zinc-700 mb-1">Forma de Pago SAT</label>
                  <select
                    value={invoiceFormaPago}
                    onChange={(e) => setInvoiceFormaPago(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900"
                  >
                    <option value="03">03 - Transferencia electrónica de fondos</option>
                    <option value="01">01 - Efectivo</option>
                    <option value="04">04 - Tarjeta de crédito</option>
                    <option value="28">28 - Tarjeta de débito</option>
                    <option value="99">99 - Por definir</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-zinc-700 mb-1">Método de Pago SAT</label>
                  <select
                    value={invoiceMetodoPago}
                    onChange={(e) => setInvoiceMetodoPago(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-zinc-900"
                  >
                    <option value="PUE">PUE - Pago en una sola exhibición</option>
                    <option value="PPD">PPD - Pago en parcialidades o diferido</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setIsGenerateInvoiceModalOpen(false)}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGenerateInvoiceSubmit}
                disabled={isSubmittingInvoice}
                className="px-6 py-3 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmittingInvoice ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-yellow" />
                    <span>Timbrando con Solución Factura v2...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-brand-yellow" />
                    <span>⚡ Emitir y Timbrar Factura CFDI 4.0 Ahora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Unsealing / Sealing SAT Emisor Config */}
      {satConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-zinc-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${satConfirmModal.type === 'unlock' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {satConfirmModal.type === 'unlock' ? <Lock className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-base font-black text-zinc-900">{satConfirmModal.title}</h3>
                <p className="text-xs text-zinc-500 font-medium">Seguridad de Certificados y Firmas SAT</p>
              </div>
            </div>

            <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded-2xl border border-zinc-200 font-medium">
              {satConfirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSatConfirmModal(null)}
                className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = satConfirmModal.onConfirm;
                  setSatConfirmModal(null);
                  action();
                }}
                className={`px-5 py-2.5 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer ${
                  satConfirmModal.type === 'unlock'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-700 hover:bg-emerald-800'
                }`}
              >
                {satConfirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editor de Artículos */}
      {showArticleModal && editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs p-4 sm:p-6 flex items-center justify-center animate-fadeIn">
          <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-900 text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-yellow" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {editingArticle.id ? "Editar Artículo del Desarrollador" : "Publicar Nuevo Artículo del Desarrollador"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowArticleModal(false)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-black text-zinc-800 mb-1">Título del Artículo *</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="Ej. Arquitectura Técnica y Escalabilidad en Tiempo Real de Fruti Go"
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-zinc-800 mb-1">Fecha de Publicación</label>
                  <input
                    type="text"
                    value={editingArticle.date}
                    onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                    placeholder="Ej. 5 de Agosto, 2026"
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-zinc-800 mb-1">Categoría / Tema</label>
                  <input
                    type="text"
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    placeholder="Ej. Ingeniería & Software, Logística B2B..."
                    className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              {/* Campos de Autor y Firma Digital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200/80">
                <div>
                  <label className="block text-xs font-black text-emerald-950 mb-1 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-brand-green" />
                    <span>Autor del Artículo *</span>
                  </label>
                  <input
                    type="text"
                    value={editingArticle.authorName || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, authorName: e.target.value })}
                    placeholder="Ej. Alberto Reyes Sandoval"
                    className="w-full px-3.5 py-2 bg-white border border-emerald-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-emerald-950 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-brand-green" />
                    <span>Firmado Por / Subido Por *</span>
                  </label>
                  <input
                    type="text"
                    value={editingArticle.signedBy || ""}
                    onChange={(e) => setEditingArticle({ ...editingArticle, signedBy: e.target.value })}
                    placeholder="Ej. Alberto Reyes Sandoval (Desarrollador Principal)"
                    className="w-full px-3.5 py-2 bg-white border border-emerald-200 rounded-xl font-bold text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-800 mb-1">Resumen / Síntesis Corta</label>
                <textarea
                  rows={2}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  placeholder="Breve introducción o copete que destaca la idea principal del artículo..."
                  className="w-full px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-green resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-zinc-800 mb-1">Contenido Completo del Artículo *</label>
                <textarea
                  rows={8}
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Escribe el texto completo de tu artículo... Separa párrafos con un salto de línea para una legibilidad perfecta."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-sans text-zinc-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-green resize-y"
                />
              </div>

              {/* Imágenes del artículo (hasta 3) */}
              <div className="pt-2 border-t border-zinc-100 space-y-3">
                <div className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-brand-green" />
                  <h4 className="text-xs font-black text-zinc-900">
                    Imágenes Ilustrativas para el Artículo (Hasta 3 imágenes)
                  </h4>
                </div>

                <div className="space-y-3">
                  {[0, 1, 2].map((imgIdx) => {
                    const imgItem = editingArticle.images?.[imgIdx] || { url: "", caption: "" };

                    const updateImg = (field: "url" | "caption", val: string) => {
                      const newImgs = [...(editingArticle.images || [])];
                      while (newImgs.length <= imgIdx) {
                        newImgs.push({ url: "", caption: "" });
                      }
                      newImgs[imgIdx] = { ...newImgs[imgIdx], [field]: val };
                      setEditingArticle({ ...editingArticle, images: newImgs });
                    };

                    return (
                      <div key={imgIdx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-zinc-800">
                            Imagen #{imgIdx + 1}
                          </span>
                          {imgItem.url && (
                            <button
                              type="button"
                              onClick={() => updateImg("url", "")}
                              className="text-[10px] text-red-600 hover:underline font-bold"
                            >
                              Remover imagen #{imgIdx + 1}
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <div className="sm:col-span-8 flex items-center gap-2">
                            <label className="cursor-pointer bg-white hover:bg-emerald-50 text-brand-green border border-emerald-300 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center gap-1 shrink-0">
                              <UploadCloud className="w-3.5 h-3.5 text-brand-green" />
                              <span>Subir archivo...</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      showToast(`Optimizando imagen #${imgIdx + 1}...`);
                                      const compressedBase64 = await compressImageFile(file, 1200, 0.8);
                                      showToast(`Subiendo imagen #${imgIdx + 1}...`);
                                      const res = await fetch("/api/founder/upload-article-image", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          imageBase64: compressedBase64,
                                          articleId: editingArticle.id || "nuevo",
                                          imageIndex: imgIdx
                                        })
                                      });
                                      const data = await res.json();
                                      if (data.success && data.imageUrl) {
                                        updateImg("url", data.imageUrl);
                                        showToast(`¡Imagen #${imgIdx + 1} subida y vinculada!`);
                                      } else {
                                        updateImg("url", compressedBase64);
                                        showToast(`¡Imagen #${imgIdx + 1} cargada!`);
                                      }
                                    } catch (err) {
                                      console.error("Error al subir imagen de artículo:", err);
                                      showToast("Error al procesar la imagen del artículo.");
                                    }
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              value={imgItem.url || ""}
                              onChange={(e) => updateImg("url", e.target.value)}
                              placeholder="O URL de imagen (https://...)"
                              className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-xl text-[11px] font-mono text-zinc-700 focus:outline-none focus:ring-1 focus:ring-brand-green"
                            />
                          </div>

                          <div className="sm:col-span-4">
                            <input
                              type="text"
                              value={imgItem.caption || ""}
                              onChange={(e) => updateImg("caption", e.target.value)}
                              placeholder="Pie de foto / Descripción..."
                              className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-xl text-[11px] text-zinc-800 focus:outline-none focus:ring-1 focus:ring-brand-green"
                            />
                          </div>
                        </div>

                        {imgItem.url && (
                          <div className="mt-2 p-2 bg-white border border-zinc-200 rounded-xl flex items-center justify-center max-h-[180px] overflow-hidden">
                            <img src={imgItem.url} alt="Vista previa de imagen" className="max-h-[160px] w-auto max-w-full object-contain rounded-lg" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowArticleModal(false)}
                className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!editingArticle.title.trim()) {
                    alert("Por favor ingresa un título para el artículo.");
                    return;
                  }
                  if (!editingArticle.content.trim()) {
                    alert("Por favor escribe el contenido del artículo.");
                    return;
                  }

                  const artId = editingArticle.id || ("art-" + Date.now());
                  const cleanImages = (editingArticle.images || []).filter((i) => Boolean(i && i.url));

                  const articleToSave = {
                    ...editingArticle,
                    id: artId,
                    images: cleanImages,
                    authorName: editingArticle.authorName?.trim() || founderForm.name || "Alberto Reyes Sandoval",
                    signedBy: editingArticle.signedBy?.trim() || editingArticle.authorName?.trim() || founderForm.name || "Alberto Reyes Sandoval",
                    createdAt: editingArticle.createdAt || Date.now(),
                    date: editingArticle.date || new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })
                  };

                  const existingArticles = Array.isArray(founderForm.articles) ? [...founderForm.articles] : [];
                  const matchIdx = existingArticles.findIndex((a: any) => a.id === artId);

                  if (matchIdx >= 0) {
                    existingArticles[matchIdx] = articleToSave;
                  } else {
                    existingArticles.unshift(articleToSave);
                  }

                  const sortedUpdatedArticles = sortArticlesNewestFirst(existingArticles);

                  const updatedForm = {
                    ...founderForm,
                    articles: sortedUpdatedArticles
                  };

                  setFounderForm(updatedForm);

                  if (typeof window !== "undefined") {
                    try {
                      localStorage.setItem("fg_founder_profile", JSON.stringify(updatedForm));
                      window.dispatchEvent(new Event("storage"));
                      window.dispatchEvent(new Event("fg_founder_profile_updated"));
                    } catch (e) {}
                  }

                  setSavingArticle(true);
                  try {
                    await fetch("/api/founder/articles", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(articleToSave)
                    });

                    await fetch("/api/founder/profile", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(updatedForm)
                    });
                    showToast("¡Artículo guardado y publicado exitosamente en Firebase!");
                  } catch (e) {
                    console.error("Error al guardar artículo en servidor:", e);
                    showToast("¡Artículo guardado en memoria local!");
                  } finally {
                    setSavingArticle(false);
                  }

                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("fg_founder_profile_updated"));
                  }

                  setShowArticleModal(false);
                }}
                disabled={savingArticle}
                className="px-5 py-2 bg-brand-green hover:bg-emerald-800 disabled:opacity-75 disabled:cursor-wait text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                {savingArticle ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-brand-yellow animate-spin" />
                    <span>Guardando en Firebase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-brand-yellow" />
                    <span>💾 Guardar y Publicar Artículo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-zinc-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
