import React, { useState, useEffect, useRef } from "react";
import { 
  ShoppingBag, 
  ShoppingCart, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Check, 
  Sparkles, 
  X,
  Store,
  ShieldCheck,
  Truck,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  PackageCheck,
  Loader2,
  User,
  Phone,
  MapPin,
  Home,
  FileText,
  AlertCircle,
  Calendar,
  Building2,
  Clock,
  Globe,
  Download,
  Lock,
  FileCode,
  FileCheck,
  Move,
  Menu,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Users,
  MessageCircle
} from "lucide-react";
import { Product, CartItem, OpenPayConfig, OrderSummary, ShippingInfo, ProductCategory, PdfConfig, BillingInfo } from "../types";
import { generateOrderPDF, generateCFDIPDF, downloadCFDIXML } from "../utils/pdfGenerator";
import { getProductWhiteBgImage } from "../utils/productImages";
import { 
  Language, 
  LANGUAGES, 
  STORE_TRANSLATIONS, 
  formatPrice, 
  getLocalizedProduct, 
  getLocalizedCategory, 
  getCurrencyCode 
} from "../translations";

interface OnlineStoreProps {
  products: Product[];
  cart: CartItem[];
  openpayConfig?: OpenPayConfig;
  pdfConfig?: PdfConfig;
  openpaySuccessOrder?: OrderSummary | null;
  currentLang?: Language;
  onChangeLang?: (lang: Language) => void;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onReturnToLegal: () => void;
  onOpenAdmin: () => void;
  onDismissSuccessOrder?: () => void;
  showAdminButton?: boolean;
  onRefreshProducts?: () => void;
}

export default function OnlineStore({
  products,
  cart,
  openpayConfig,
  pdfConfig,
  openpaySuccessOrder,
  currentLang = "es",
  onChangeLang,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onReturnToLegal,
  onOpenAdmin,
  onDismissSuccessOrder,
  showAdminButton = false,
  onRefreshProducts
}: OnlineStoreProps) {
  const lang: Language = currentLang || "es";
  const t = STORE_TRANSLATIONS[lang] || STORE_TRANSLATIONS["es"];

  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [openPayAlertMsg, setOpenPayAlertMsg] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [localOrderCompleted, setLocalOrderCompleted] = useState<OrderSummary | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for Checkout Modal and Card Info
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [cardHolder, setCardHolder] = useState("Juan Pérez");
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [cardExp, setCardExp] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Calculate 24h minimum delivery date (Bodega Central GDL)
  const getMinDeliveryDate = (): string => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const minDeliveryDate = getMinDeliveryDate();

  // ZMG Municipalities Geofence list
  const ZMG_MUNICIPALITIES = [
    "Guadalajara",
    "Zapopan",
    "San Pedro Tlaquepaque",
    "Tonalá",
    "Tlajomulco de Zúñiga"
  ];

  // Billing Info State (CFDI 4.0)
  const [billingInfo, setBillingInfo] = useState<BillingInfo>(() => {
    try {
      const saved = localStorage.getItem("fg_billing_info");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      requiresInvoice: false,
      rfc: "",
      razonSocial: "",
      zipCode: "",
      regimenFiscal: "601 - General de Ley Personas Morales",
      usoCFDI: "G01 - Adquisición de mercancías",
      email: ""
    };
  });

  const handleBillingChange = (field: keyof BillingInfo, value: any) => {
    setBillingInfo((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem("fg_billing_info", JSON.stringify(updated));
      } catch (err) {
        console.error("Error guardando datos fiscales:", err);
      }
      return updated;
    });
  };

  // Registered Client Profile & Authentication State (SAT / CFDI 4.0)
  const [registeredProfile, setRegisteredProfile] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("fg_registered_client");
      if (saved) return JSON.parse(saved);
      const savedBilling = localStorage.getItem("fg_billing_info");
      if (savedBilling) {
        const parsed = JSON.parse(savedBilling);
        if (parsed.rfc && parsed.rfc !== "XAXX010101000" && parsed.rfc !== "XEXX010101000") return parsed;
      }
    } catch {}
    return null;
  });

  const [isClientLoggedIn, setIsClientLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("fg_client_authenticated") === "true";
    } catch {}
    return false;
  });

  const [clientPasswordInput, setClientPasswordInput] = useState("");
  const [loginPasswordInput, setLoginPasswordInput] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalError, setAuthModalError] = useState<string | null>(null);

  // Authenticate existing client profile with password
  const handleAuthenticateProfile = (passwordAttempt: string) => {
    const cleanAttempt = passwordAttempt.trim();
    if (!cleanAttempt) {
      setAuthModalError("Por favor ingresa tu contraseña de perfil.");
      return;
    }

    if (!registeredProfile || !registeredProfile.password) {
      // If profile exists without password, assign this password
      const updated = { ...billingInfo, password: cleanAttempt };
      setRegisteredProfile(updated);
      setIsClientLoggedIn(true);
      try {
        localStorage.setItem("fg_registered_client", JSON.stringify(updated));
        localStorage.setItem("fg_client_authenticated", "true");
      } catch {}
      setIsAuthModalOpen(false);
      setAuthModalError(null);
      return;
    }

    if (registeredProfile.password === cleanAttempt) {
      setIsClientLoggedIn(true);
      try {
        localStorage.setItem("fg_client_authenticated", "true");
      } catch {}
      // Auto-fill billing info from saved profile
      setBillingInfo((prev) => ({
        ...prev,
        requiresInvoice: true,
        rfc: registeredProfile.rfc || prev.rfc,
        razonSocial: registeredProfile.razonSocial || prev.razonSocial,
        zipCode: registeredProfile.zipCode || prev.zipCode,
        email: registeredProfile.email || prev.email,
        regimenFiscal: registeredProfile.regimenFiscal || prev.regimenFiscal,
        usoCFDI: registeredProfile.usoCFDI || prev.usoCFDI
      }));
      setIsAuthModalOpen(false);
      setAuthModalError(null);
    } else {
      setAuthModalError("Contraseña incorrecta. Por favor ingresa la contraseña registrada para tu perfil de facturación.");
    }
  };

  // Logout client profile
  const handleLogoutClient = () => {
    setIsClientLoggedIn(false);
    try {
      localStorage.setItem("fg_client_authenticated", "false");
    } catch {}
  };

  // Solución Factura v2 Client Catalog state & autocomplete
  const [sfClients, setSfClients] = useState<any[]>([]);
  const [sfClientSearchQuery, setSfClientSearchQuery] = useState("");
  const [sfClientDropdownOpen, setSfClientDropdownOpen] = useState(false);
  const [postSfClientSearchQuery, setPostSfClientSearchQuery] = useState("");
  const [postSfClientDropdownOpen, setPostSfClientDropdownOpen] = useState(false);
  const [isSyncingClients, setIsSyncingClients] = useState(false);

  const fetchSfClients = async () => {
    setIsSyncingClients(true);
    try {
      const res = await fetch("/api/solucionfactura/clientes");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSfClients(data);
        console.log(`Catálogo de clientes actualizado (${data.length} receptores en Solución Factura v2)`);
      }
    } catch (e) {
      console.warn("Error consultando clientes de Solución Factura:", e);
    } finally {
      setIsSyncingClients(false);
    }
  };

  useEffect(() => {
    fetch("/api/solucionfactura/clientes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSfClients(data);
      })
      .catch((e) => console.warn("Error fetching Solución Factura clientes:", e));
  }, []);

  // User Profile & Order History State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [threeDSecureUrl, setThreeDSecureUrl] = useState<string | null>(null);

  // Draggable Floating Cart Total Bubble State
  const [bubblePos, setBubblePos] = useState<{ x: number; y: number } | null>(null);
  const bubbleDragRef = useRef<{ startX: number; startY: number; initX: number; initY: number; width: number; height: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    width: 180,
    height: 60,
    moved: false
  });

  const handleBubblePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const rect = e.currentTarget.getBoundingClientRect();
    const initX = bubblePos ? bubblePos.x : rect.left;
    const initY = bubblePos ? bubblePos.y : rect.top;

    bubbleDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX,
      initY,
      width: rect.width || 180,
      height: rect.height || 60,
      moved: false
    };
  };

  const handleBubblePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (bubbleDragRef.current.startX === 0 && bubbleDragRef.current.startY === 0) return;
    if (e.buttons === 0 && e.pointerType === 'mouse') return;

    const deltaX = e.clientX - bubbleDragRef.current.startX;
    const deltaY = e.clientY - bubbleDragRef.current.startY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      bubbleDragRef.current.moved = true;
    }

    let newX = bubbleDragRef.current.initX + deltaX;
    let newY = bubbleDragRef.current.initY + deltaY;

    const width = bubbleDragRef.current.width || 180;
    const height = bubbleDragRef.current.height || 60;
    const maxX = (typeof window !== "undefined" ? window.innerWidth : 360) - width - 8;
    const maxY = (typeof window !== "undefined" ? window.innerHeight : 600) - height - 8;
    newX = Math.max(8, Math.min(maxX, newX));
    newY = Math.max(8, Math.min(maxY, newY));

    setBubblePos({ x: newX, y: newY });
  };

  const handleBubblePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    bubbleDragRef.current.startX = 0;
    bubbleDragRef.current.startY = 0;
  };


  const [myOrders, setMyOrders] = useState<OrderSummary[]>(() => {
    try {
      const saved = localStorage.getItem("fg_orders");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [selectedOrderToInvoice, setSelectedOrderToInvoice] = useState<OrderSummary | null>(null);
  const [postInvoiceBilling, setPostInvoiceBilling] = useState<BillingInfo>(() => billingInfo);
  const [isPostInvoicing, setIsPostInvoicing] = useState(false);
  const [postInvoiceNotice, setPostInvoiceNotice] = useState<string | null>(null);

  // Sync postInvoiceBilling with billingInfo when billingInfo changes
  useEffect(() => {
    setPostInvoiceBilling((prev) => ({ ...billingInfo, ...prev }));
  }, [billingInfo]);

  const refreshMyOrders = async () => {
    let list: OrderSummary[] = [];
    try {
      const saved = localStorage.getItem("fg_orders");
      if (saved) list = JSON.parse(saved);
    } catch {}

    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const apiOrders = await res.json();
        if (Array.isArray(apiOrders) && apiOrders.length > 0) {
          const map = new Map<string, OrderSummary>();
          apiOrders.forEach((o: OrderSummary) => map.set(o.orderId, o));
          list.forEach((o: OrderSummary) => {
            if (!map.has(o.orderId)) map.set(o.orderId, o);
          });
          list = Array.from(map.values());
        }
      }
    } catch {}

    // Cross-reference with server invoices
    try {
      const invRes = await fetch("/api/invoices");
      if (invRes.ok) {
        const invoices = await invRes.json();
        if (Array.isArray(invoices)) {
          const invoicedMap = new Map<string, any>();
          invoices.forEach((inv: any) => {
            if (inv.orderId) invoicedMap.set(inv.orderId, inv);
          });

          list = list.map((ord) => {
            if (invoicedMap.has(ord.orderId)) {
              const inv = invoicedMap.get(ord.orderId);
              return {
                ...ord,
                invoiceStatus: "issued" as const,
                invoiceDetails: inv
              };
            }
            return ord;
          });
        }
      }
    } catch {}

    setMyOrders(list);
    try {
      localStorage.setItem("fg_orders", JSON.stringify(list));
    } catch {}
  };

  useEffect(() => {
    refreshMyOrders();
  }, []);

  const handleFacturarPedidoPosterior = async () => {
    if (!selectedOrderToInvoice) return;
    if (!postInvoiceBilling.rfc || postInvoiceBilling.rfc.trim().length < 12) {
      alert("Por favor ingresa un RFC válido de 12 o 13 caracteres.");
      return;
    }
    if (!postInvoiceBilling.razonSocial || postInvoiceBilling.razonSocial.trim().length < 3) {
      alert("Por favor ingresa la Razón Social o Nombre Fiscal.");
      return;
    }
    if (!postInvoiceBilling.zipCode || postInvoiceBilling.zipCode.trim().length !== 5) {
      alert("Por favor ingresa un Código Postal Fiscal de 5 dígitos.");
      return;
    }

    setIsPostInvoicing(true);
    setPostInvoiceNotice(null);

    const orderId = selectedOrderToInvoice.orderId;

    try {
      const response = await fetch("/api/facturacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId,
          total: selectedOrderToInvoice.total,
          items: selectedOrderToInvoice.items,
          customer: selectedOrderToInvoice.customer || shippingInfo,
          billingInfo: {
            ...postInvoiceBilling,
            requiresInvoice: true
          }
        })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        const updatedList = myOrders.map((ord) => {
          if (ord.orderId === orderId) {
            return {
              ...ord,
              billingInfo: postInvoiceBilling,
              invoiceStatus: "issued" as const,
              invoiceDetails: resData.invoice
            };
          }
          return ord;
        });

        setMyOrders(updatedList);
        localStorage.setItem("fg_orders", JSON.stringify(updatedList));

        if (localOrderCompleted && localOrderCompleted.orderId === orderId) {
          setLocalOrderCompleted({
            ...localOrderCompleted,
            invoiceStatus: "issued",
            invoiceDetails: resData.invoice
          });
        }

        setPostInvoiceNotice(`✅ Factura CFDI 4.0 timbrada con éxito para la orden #${orderId}. Se ha deshabilitado la opción de refacturar esta orden.`);
        setSelectedOrderToInvoice(null);
      } else if (resData.isAlreadyInvoiced) {
        const updatedList = myOrders.map((ord) => {
          if (ord.orderId === orderId) {
            return {
              ...ord,
              invoiceStatus: "issued" as const,
              invoiceDetails: resData.invoice
            };
          }
          return ord;
        });
        setMyOrders(updatedList);
        localStorage.setItem("fg_orders", JSON.stringify(updatedList));

        setPostInvoiceNotice(`⚠️ Esta orden ya cuenta con una factura timbrada previamente. Se ha deshabilitado la opción de facturar nuevamente.`);
        setSelectedOrderToInvoice(null);
      } else {
        alert(resData.message || "Error al solicitar la factura CFDI 4.0. Por favor revisa tus datos.");
      }
    } catch (err) {
      console.error("Error al facturar pedido posterior:", err);
      alert("Error de conexión al enviar la solicitud de facturación.");
    } finally {
      setIsPostInvoicing(false);
    }
  };

  // Shipping Info State
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(() => {
    try {
      const saved = localStorage.getItem("fg_shipping_info");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.deliveryDate || parsed.deliveryDate < minDeliveryDate) {
          parsed.deliveryDate = minDeliveryDate;
        }
        if (!parsed.deliveryTimeWindow) {
          parsed.deliveryTimeWindow = "08:00 AM - 12:00 PM (Turno Matutino)";
        }
        if (!parsed.municipality) {
          parsed.municipality = "Guadalajara";
        }
        return parsed;
      }
    } catch {}
    return { 
      fullName: "", 
      phone: "", 
      address: "", 
      municipalityZip: "", 
      municipality: "Guadalajara",
      references: "",
      deliveryDate: minDeliveryDate,
      deliveryTimeWindow: "08:00 AM - 12:00 PM (Turno Matutino)"
    };
  });

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem("fg_shipping_info", JSON.stringify(updated));
      } catch (err) {
        console.error("Error guardando datos de envío:", err);
      }
      return updated;
    });
  };

  // Check if location is inside ZMG
  const isZMGValidLocation = (): boolean => {
    const mun = shippingInfo.municipality || "";
    if (mun === "FUERA_DE_COBERTURA") return false;
    if (ZMG_MUNICIPALITIES.includes(mun)) return true;
    const lower = (shippingInfo.municipalityZip || "").toLowerCase();
    if (
      lower.includes("guadalajara") ||
      lower.includes("zapopan") ||
      lower.includes("tlaquepaque") ||
      lower.includes("tonala") ||
      lower.includes("tonalá") ||
      lower.includes("tlajomulco") ||
      lower.includes("gdl")
    ) {
      return true;
    }
    const zipMatch = lower.match(/\b4[45]\d{3}\b/);
    if (zipMatch) return true;
    return false;
  };

  const isLocationZMGValid = isZMGValidLocation();

  const isBillingValid = !billingInfo.requiresInvoice || (
    (billingInfo.rfc || "").trim().length >= 12 &&
    (billingInfo.razonSocial || "").trim().length >= 3 &&
    (billingInfo.zipCode || "").trim().length === 5 &&
    (billingInfo.email || "").includes("@")
  );

  const isShippingValid = 
    (shippingInfo.fullName || "").trim().length >= 3 &&
    (shippingInfo.phone || "").trim().length >= 8 &&
    (shippingInfo.address || "").trim().length >= 4 &&
    (shippingInfo.municipalityZip || "").trim().length >= 3 &&
    isLocationZMGValid &&
    Boolean(shippingInfo.deliveryDate && shippingInfo.deliveryDate >= minDeliveryDate) &&
    isBillingValid;

  // Auto-download PDF receipt when order is completed
  useEffect(() => {
    if (localOrderCompleted) {
      generateOrderPDF(localOrderCompleted, {
        pdfLogoUrl: pdfConfig?.pdfLogoUrl || undefined,
        pdfQrUrl: pdfConfig?.pdfQrUrl || undefined,
        lang: lang
      }).catch((err) => console.error("Error al descargar PDF:", err));
    }
  }, [localOrderCompleted]);

  useEffect(() => {
    if (openpaySuccessOrder) {
      generateOrderPDF(openpaySuccessOrder, {
        pdfLogoUrl: pdfConfig?.pdfLogoUrl || undefined,
        pdfQrUrl: pdfConfig?.pdfQrUrl || undefined,
        lang: lang
      }).catch((err) => console.error("Error al descargar PDF:", err));
    }
  }, [openpaySuccessOrder]);

  const handleFillTestCard = () => {
    setCardHolder("Juan Pérez");
    setCardNumber("4111 1111 1111 1111");
    setCardExp("12/28");
    setCardCvv("123");
  };

  const baseCategories = ["Todos", "Frutas", "Verduras", "Hierbas y Aromáticas", "Secos y Especias", "Otros"];
  const dynamicCategories = (products || []).map((p) => p?.category).filter(Boolean);
  const categories: string[] = Array.from(new Set([...baseCategories, ...dynamicCategories]));

  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;
    const locP = getLocalizedProduct(p, lang) || p;
    const pCatClean = ((p && p.category) || "Otros").trim().toLowerCase();
    const selCatClean = (selectedCategory || "Todos").trim().toLowerCase();

    let matchesCat = selCatClean === "todos" || (p && p.category === selectedCategory) || pCatClean === selCatClean;
    if (!matchesCat) {
      if (selCatClean.includes("fruta") && pCatClean.includes("fruta")) matchesCat = true;
      else if (selCatClean.includes("verdura") && pCatClean.includes("verdura")) matchesCat = true;
      else if (selCatClean.includes("hierba") && pCatClean.includes("hierba")) matchesCat = true;
      else if (selCatClean.includes("seco") && pCatClean.includes("seco")) matchesCat = true;
    }

    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return matchesCat;

    const nameStr = (locP && locP.name) ? String(locP.name).toLowerCase() : "";
    const origNameStr = (p && p.name) ? String(p.name).toLowerCase() : "";
    const descStr = (locP && locP.description) ? String(locP.description).toLowerCase() : "";
    const presStr = ((locP && (locP as any).presentation) || (p && p.presentation) || "").toString().toLowerCase();
    const catStr = ((p && p.category) || "").toString().toLowerCase();

    const matchesSearch = 
      nameStr.includes(q) ||
      origNameStr.includes(q) ||
      descStr.includes(q) ||
      presStr.includes(q) ||
      catStr.includes(q);

    return matchesCat && matchesSearch;
  });

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const getItemQuantityInCart = (productId: string): number => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  const handleDirectQuantityChange = (product: Product, valueStr: string) => {
    const cleanStr = valueStr.replace(/[^0-9]/g, "");
    const targetQty = cleanStr === "" ? 0 : parseInt(cleanStr, 10);
    const currentQty = getItemQuantityInCart(product.id);

    if (targetQty <= 0) {
      if (currentQty > 0) {
        onRemoveFromCart(product.id);
      }
      return;
    }

    if (currentQty === 0) {
      onAddToCart(product);
      if (targetQty > 1) {
        onUpdateQuantity(product.id, targetQty - 1);
      }
    } else {
      const delta = targetQty - currentQty;
      if (delta !== 0) {
        onUpdateQuantity(product.id, delta);
      }
    }
  };

  // Helper to validate non-API OpenPay checkout URL
  const isValidCheckoutUrl = (url?: string): boolean => {
    if (!url || !url.trim()) return false;
    const clean = url.trim().toLowerCase();
    if (clean.includes("api.openpay.mx") || clean.includes("sandbox-api.openpay.mx")) {
      return false;
    }
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      return false;
    }
    return true;
  };

  const handleProceedToCheckout = () => {
    try {
      if (cart.length === 0) return;
      setIsCheckoutModalOpen(true);
    } catch (error) {
      console.error("Error al iniciar checkout:", error);
      setIsCheckoutModalOpen(true);
    }
  };

  const handleProcessOpenPayPayment = async () => {
    setPaymentError(null);
    if (!isShippingValid) {
      setPaymentError(t.completeRequiredFields);
      return;
    }

    if (billingInfo.requiresInvoice) {
      if (registeredProfile && registeredProfile.password && !isClientLoggedIn) {
        setIsAuthModalOpen(true);
        setPaymentError("Para solicitar factura debes ingresar la contraseña de tu perfil registrado.");
        return;
      }

      if (!billingInfo.rfc || !billingInfo.razonSocial || !billingInfo.zipCode || !billingInfo.email) {
        setPaymentError("Debes registrar tus datos de facturación (RFC, Razón Social, C.P. y Correo) para solicitar factura CFDI 4.0.");
        return;
      }

      if (!registeredProfile || !registeredProfile.password) {
        if (!clientPasswordInput || clientPasswordInput.trim().length < 4) {
          setPaymentError("Por favor crea una contraseña de al menos 4 caracteres para registrar tu perfil de facturación.");
          return;
        }
        const newProfile = {
          ...billingInfo,
          password: clientPasswordInput.trim()
        };
        setRegisteredProfile(newProfile);
        setIsClientLoggedIn(true);
        try {
          localStorage.setItem("fg_registered_client", JSON.stringify(newProfile));
          localStorage.setItem("fg_billing_info", JSON.stringify(newProfile));
          localStorage.setItem("fg_client_authenticated", "true");
        } catch (e) {}
      } else {
        const updatedProfile = { ...registeredProfile, ...billingInfo };
        setRegisteredProfile(updatedProfile);
        try {
          localStorage.setItem("fg_registered_client", JSON.stringify(updatedProfile));
          localStorage.setItem("fg_billing_info", JSON.stringify(updatedProfile));
        } catch (e) {}
      }
    }
    const rawCard = cardNumber.trim() || "4111 1111 1111 1111";
    const cleanCard = rawCard.replace(/\s+/g, "");

    setIsProcessingPayment(true);

    try {
      const openPayObj = (window as any).OpenPay;
      const merchantId = openpayConfig?.merchantId || "mhary0zwpt8y6jwt6fju";
      const publicKey = openpayConfig?.publicKey || "pk_ecd829b752774461b8cbc9383f4a414c";
      const isSandbox = openpayConfig?.sandboxMode !== false;

      let deviceSessionId = "";

      if (openPayObj) {
        try {
          openPayObj.setId(merchantId);
          openPayObj.setApiKey(publicKey);
          openPayObj.setSandboxMode(isSandbox);
          if (openPayObj.deviceData) {
            deviceSessionId = openPayObj.deviceData.setup();
          }
        } catch (e) {
          console.warn("Error configurando OpenPay SDK:", e);
        }
      }

      if (!deviceSessionId) {
        deviceSessionId = "ds_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      }

      const expParts = cardExp.split("/");
      let expMonth = (expParts[0] || "12").trim().padStart(2, "0");
      let expYear = (expParts[1] || "28").trim();
      if (expYear.length === 4) expYear = expYear.slice(-2);

      const executeCharge = async (chargeBody: any) => {
        try {
          const res = await fetch("/api/openpay/charge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chargeBody)
          });

          const chargeData = await res.json().catch(() => null);

          if (!res.ok || !chargeData || chargeData.success === false) {
            const errorMsg = chargeData?.error || chargeData?.openpayError?.description || "Error al procesar el cobro con OpenPay.";
            setPaymentError(errorMsg);
            setIsProcessingPayment(false);
            return;
          }

          if (chargeData.payment_method && chargeData.payment_method.url) {
            console.log("3DS redirect URL recibida de OpenPay:", chargeData.payment_method.url);
          }

          const orderId = chargeBody.order_id || ("ORD-" + Math.floor(100000 + Math.random() * 900000));
          const now = new Date();
          const nowStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

          const openpayInfo = {
            authorization: chargeData.authorization || "848291",
            transactionId: chargeData.id || "tr_op_" + Math.random().toString(36).substring(2, 8),
            status: chargeData.status || "completed",
            merchantId: chargeData.merchantId || merchantId,
            cardBrand: chargeData.card?.brand || (cleanCard.startsWith("4") ? "Visa" : "Mastercard"),
            cardNumber: chargeData.card?.cardNumber || `**** **** **** ${cleanCard.slice(-4)}`
          };

          const orderData: OrderSummary = {
            orderId,
            date: nowStr,
            deliveryDate: shippingInfo.deliveryDate || minDeliveryDate,
            deliveryTimeWindow: shippingInfo.deliveryTimeWindow || "08:00 AM - 12:00 PM (Turno Matutino)",
            items: [...cart],
            total: cartTotalPrice,
            status: "paid",
            customer: { ...shippingInfo },
            billingInfo: billingInfo.requiresInvoice ? { ...billingInfo } : undefined,
            invoiceStatus: billingInfo.requiresInvoice ? "requested" : "none",
            openpayDetails: openpayInfo
          };

          if (billingInfo.requiresInvoice) {
            try {
              const factRes = await fetch("/api/facturacion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId,
                  total: cartTotalPrice,
                  items: cart,
                  customer: shippingInfo,
                  billingInfo: billingInfo
                })
              });
              if (factRes.ok) {
                const factJson = await factRes.json();
                if (factJson.invoice) {
                  orderData.invoiceDetails = factJson.invoice;
                  orderData.invoiceStatus = "timbrada";
                }
              }
            } catch (e) {
              console.error("Error al timbrar/solicitar factura:", e);
            }
          }

          localStorage.setItem("fg_last_order", JSON.stringify(orderData));
          try {
            const existingOrders = JSON.parse(localStorage.getItem("fg_orders") || "[]");
            existingOrders.unshift(orderData);
            localStorage.setItem("fg_orders", JSON.stringify(existingOrders));
            localStorage.setItem("fg_received_orders", JSON.stringify(existingOrders));
            localStorage.setItem("Pedidos Recibidos", JSON.stringify(existingOrders));
          } catch (e) {
            console.error("Error guardando orden en LocalStorage:", e);
          }

          await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
          }).catch(() => {});

          onClearCart();
          setIsCheckoutModalOpen(false);
          setIsCartOpen(false);
          setLocalOrderCompleted(orderData);
        } catch (err: any) {
          console.error("Error ejecutando cobro:", err);
          setPaymentError("Ocurrió un error al registrar el pedido. Por favor reintenta.");
        } finally {
          setIsProcessingPayment(false);
        }
      };

      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const nameParts = (shippingInfo.fullName || "Cliente Restaurante").trim().split(" ");
      const firstName = nameParts[0] || "Cliente";
      const lastName = nameParts.slice(1).join(" ") || "Restaurante";

      const baseChargeBody = {
        amount: cartTotalPrice,
        currency: "MXN",
        description: `Compra Mayoreo Fruti Go #${orderId}`,
        order_id: orderId,
        device_session_id: deviceSessionId,
        confirm: true,
        redirect_url: window.location.href,
        customer: {
          fullName: shippingInfo.fullName,
          name: firstName,
          last_name: lastName,
          phone: shippingInfo.phone || "3300000000",
          email: billingInfo.email || "restaurante@frutigo.mx"
        }
      };

      let hasTokenized = false;

      if (openPayObj && openPayObj.token) {
        const createTokenParams = {
          card_number: cleanCard,
          holder_name: cardHolder,
          expiration_year: expYear,
          expiration_month: expMonth,
          cvv2: cardCvv
        };

        const tokenPromise = new Promise<string | null>((resolve) => {
          const timeoutId = setTimeout(() => resolve(null), 4000);
          openPayObj.token.create(
            createTokenParams,
            (response: any) => {
              clearTimeout(timeoutId);
              const tokenId = response.data?.id || response.id || response.data;
              resolve(tokenId || null);
            },
            (errorResponse: any) => {
              clearTimeout(timeoutId);
              console.warn("OpenPay Tokenization warning:", errorResponse);
              resolve(null);
            }
          );
        });

        const tokenId = await tokenPromise;
        if (tokenId) {
          hasTokenized = true;
          await executeCharge({ ...baseChargeBody, source_id: tokenId });
          return;
        }
      }

      if (!hasTokenized) {
        await executeCharge({
          ...baseChargeBody,
          card: {
            number: cleanCard,
            holderName: cardHolder,
            exp: `${expMonth}/${expYear}`,
            cvv: cardCvv
          }
        });
      }

    } catch (err: any) {
      console.error("Error en proceso de pago OpenPay:", err);
      setPaymentError("Ocurrió un error al procesar el pago con OpenPay. Intenta de nuevo.");
      setIsProcessingPayment(false);
    }
  };

  // Process Order and Send via WhatsApp without requiring immediate payment
  const handleProcessWhatsAppOrderWithoutPayment = async () => {
    setPaymentError(null);

    // 1. Validate Shipping Info
    if (!shippingInfo.fullName.trim() || !shippingInfo.phone.trim() || !shippingInfo.address.trim()) {
      setPaymentError("Por favor completa los campos de dirección de entrega obligatorios (Nombre, Teléfono, Dirección).");
      return;
    }

    // 2. Validate Billing Info if invoice requested
    if (billingInfo.requiresInvoice) {
      if (!billingInfo.rfc || billingInfo.rfc.trim().length < 12) {
        setPaymentError("Por favor ingresa un RFC válido (12 o 13 caracteres) para la factura.");
        return;
      }
      if (!billingInfo.razonSocial.trim()) {
        setPaymentError("Por favor ingresa la Razón Social o Nombre Fiscal.");
        return;
      }
      if (!billingInfo.zipCode || billingInfo.zipCode.trim().length !== 5) {
        setPaymentError("Por favor ingresa un Código Postal Fiscal de 5 dígitos.");
        return;
      }
    }

    setIsProcessingPayment(true);

    try {
      const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const now = new Date();
      const dateStr = now.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      const orderData: OrderSummary = {
        orderId,
        date: dateStr,
        deliveryDate: shippingInfo.deliveryDate || minDeliveryDate,
        deliveryTimeWindow: shippingInfo.deliveryTimeWindow || "08:00 AM - 12:00 PM",
        items: [...cart],
        total: cartTotalPrice,
        status: "pending",
        paymentMethod: "whatsapp",
        paymentStatus: "pending_whatsapp",
        invoiceAllowedByAdmin: false, // CRITICAL: WhatsApp unpaid orders cannot be invoiced until admin approves
        customer: { ...shippingInfo },
        billingInfo: billingInfo.requiresInvoice ? { ...billingInfo } : undefined,
        invoiceStatus: billingInfo.requiresInvoice ? "requested" : "none"
      };

      // Save to localStorage
      let localOrders: OrderSummary[] = [];
      try {
        const saved = localStorage.getItem("fg_orders");
        if (saved) localOrders = JSON.parse(saved);
      } catch {}
      localOrders.unshift(orderData);
      localStorage.setItem("fg_orders", JSON.stringify(localOrders));
      localStorage.setItem("fg_last_order", JSON.stringify(orderData));

      // Save to server
      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });
      } catch (err) {
        console.warn("Could not persist WhatsApp order to backend server:", err);
      }

      onClearCart();
      setIsCheckoutModalOpen(false);
      setIsCartOpen(false);
      setLocalOrderCompleted(orderData);

      // Launch WhatsApp redirect
      handleSendWhatsAppOrder(orderData);
    } catch (err: any) {
      console.error("Error al procesar pedido por WhatsApp:", err);
      setPaymentError("Ocurrió un error al registrar el pedido por WhatsApp. Por favor reintenta.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Send order summary directly to WhatsApp formatted for B2B restaurant orders
  const handleSendWhatsAppOrder = (order: OrderSummary) => {
    const deliveryPhone = "523317093598";

    let formattedDeliveryDate = order.deliveryDate || order.customer?.deliveryDate || minDeliveryDate;
    if (formattedDeliveryDate.includes("-")) {
      const [y, m, d] = formattedDeliveryDate.split("-");
      formattedDeliveryDate = `${d}/${m}/${y}`;
    }

    const timeWindow = order.deliveryTimeWindow || order.customer?.deliveryTimeWindow || "08:00 AM - 12:00 PM";

    const categoriesMap: Record<string, CartItem[]> = {};
    (order.items || []).forEach((item) => {
      const cat = item.product.category || "Otros";
      if (!categoriesMap[cat]) categoriesMap[cat] = [];
      categoriesMap[cat].push(item);
    });

    let itemsListText = "";
    const catIcons: Record<string, string> = {
      "Frutas": "🍎",
      "Verduras": "🥦",
      "Hierbas y Aromáticas": "🌿",
      "Secos y Especias": "🌶️",
      "Otros": "📦"
    };

    Object.entries(categoriesMap).forEach(([catKey, catItems]) => {
      const icon = catIcons[catKey] || "📦";
      const catLabel = getLocalizedCategory(catKey as ProductCategory, lang).toUpperCase();
      itemsListText += `\n${icon} *${catLabel}:*\n`;
      catItems.forEach((i) => {
        const locP = getLocalizedProduct(i.product, lang);
        const pres = locP.presentation || locP.unit || "Kg";
        const priceStr = formatPrice(i.product.price * i.quantity, lang);
        itemsListText += `  • ${i.quantity}x ${locP.name} (${pres}) - ${priceStr}\n`;
      });
    });

    const billing = order.billingInfo || order.customer?.billingInfo;
    let billingText = "\n🧾 *FACTURACIÓN ELECTRÓNICA CFDI 4.0:*\n❌ *NO REQUIERE FACTURA*\n";
    if (billing && billing.requiresInvoice) {
      const isApprovedByAdmin = order.invoiceAllowedByAdmin === true;
      billingText = `\n🧾 *FACTURACIÓN ELECTRÓNICA CFDI 4.0:*\n` +
        `📝 *FACTURA SOLICITADA*\n` +
        `• *RFC:* ${billing.rfc || "N/A"}\n` +
        `• *Razón Social:* ${billing.razonSocial || "N/A"}\n` +
        `• *CP Fiscal:* ${billing.zipCode || "N/A"}\n` +
        `• *Régimen Fiscal:* ${billing.regimenFiscal || "N/A"}\n` +
        `• *Uso CFDI:* ${billing.usoCFDI || "G01"}\n` +
        `• *Correo:* ${billing.email || "N/A"}\n` +
        (order.paymentMethod === "whatsapp" && !isApprovedByAdmin
          ? `⚠️ *Nota Fiscal:* Factura pendiente de aprobación de pago por administración.\n`
          : `✅ *Estado Factura:* Aprobada para timbrado\n`);
    }

    const isWhatsAppOrder = order.paymentMethod === "whatsapp" || order.paymentStatus === "pending_whatsapp";
    const paymentText = isWhatsAppOrder
      ? `🟡 *Pedido enviado por WhatsApp (Pendiente de Pago / Contra entrega)*`
      : `💳 *Pagado con Tarjeta vía OpenPay* (Auth: #${order.openpayDetails?.authorization || "OK"})`;

    const titleText = "🍉 *PEDIDO B2B / MAYOREO RESTAURANTE - FRUTI GO* 🚚";

    const waMsg = `${titleText}\n` +
      `*Folio de Pedido:* #${order.orderId}\n` +
      `*Fecha de Registro:* ${order.date}\n` +
      `*📅 FECHA DE ENTREGA PROGRAMADA:* ${formattedDeliveryDate} (${timeWindow})\n` +
      `*🏢 ORIGEN:* Bodega Central Guadalajara (24 Horas de Anticipación)\n\n` +
      `👤 *DATOS DEL RESTAURANTE / CLIENTE:*\n` +
      `• *Nombre / Razón Social:* ${order.customer?.fullName}\n` +
      `• *Teléfono:* ${order.customer?.phone}\n` +
      `• *Municipio ZMG:* ${order.customer?.municipality || "Guadalajara"} (${order.customer?.municipalityZip})\n` +
      `• *Dirección:* ${order.customer?.address}\n` +
      `• *Referencias:* ${order.customer?.references || "N/A"}\n` +
      `${billingText}\n` +
      `🛒 *DETALLE DEL PEDIDO POR CATEGORÍAS:*${itemsListText}\n` +
      `💰 *TOTAL MAYOREO:* ${formatPrice(order.total, lang)}\n` +
      `💳 *Estado de Pago:* ${paymentText}`;

    const waUrl = `https://api.whatsapp.com/send?phone=${deliveryPhone}&text=${encodeURIComponent(waMsg)}`;
    window.location.href = waUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-zinc-50 to-emerald-50/30 text-zinc-800 pb-28">
      {/* Top Store Header - Sticky Z-50 with Integrated Floating Search Bar (Yellow Contour) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-brand-yellow shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2 space-y-2">
          {/* Top Brand & Action Buttons Row */}
          <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
            {/* Top Brand & Logo Bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-green text-brand-yellow font-black italic flex items-center justify-center text-xs sm:text-sm shadow-xs border border-emerald-700 flex-shrink-0">
                  FG
                </div>
                <div>
                  <span className="font-black italic text-sm sm:text-lg text-brand-green tracking-tight leading-none block">
                    FRUTI GO
                  </span>
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider block">
                    Mayoreo & Suministro
                  </span>
                </div>
              </div>

              {/* Mobile Scroll Indicator & Menu Toggle */}
              <div className="flex sm:hidden items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-tight bg-zinc-100 px-2 py-0.5 rounded-md border border-zinc-200">
                  👉 Desliza menú
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl border border-zinc-200 active:scale-95 cursor-pointer"
                  title="Abrir Menú"
                >
                  <Menu className="w-4 h-4 text-zinc-800" />
                </button>
              </div>
            </div>

            {/* Action Buttons Horizontal Scroll Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 sm:pb-0 sm:pt-0 max-w-full flex-nowrap scroll-smooth border-t sm:border-0 border-zinc-100/80 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* 1. Profile & Orders History Button */}
              <button
                type="button"
                onClick={() => {
                  refreshMyOrders();
                  if (registeredProfile && registeredProfile.password && !isClientLoggedIn) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsProfileOpen(true);
                  }
                }}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl font-extrabold text-xs transition-all border border-emerald-300/80 shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
                title="Perfil del Cliente & Historial de Pedidos"
              >
                <User className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span className="font-black">Mi Perfil / Pedidos</span>
                {myOrders.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-brand-green text-white font-black text-[10px] rounded-md">
                    {myOrders.length}
                  </span>
                )}
              </button>

              {/* 2. Admin Panel Button */}
              {showAdminButton && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-extrabold text-xs transition-all border border-amber-300/80 shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
                  title="Panel Admin"
                >
                  <Store className="w-4 h-4 text-amber-800 flex-shrink-0" />
                  <span className="font-black">⚡ Panel Admin</span>
                </button>
              )}

              {/* 3. Legal Notice Button */}
              <button
                type="button"
                onClick={onReturnToLegal}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-extrabold text-xs transition-all border border-zinc-300/80 shadow-xs active:scale-95 cursor-pointer whitespace-nowrap"
                title="Aviso Legal / Políticas"
              >
                <FileText className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                <span>{t.legalNoticeButton}</span>
              </button>

              {/* 4. Language & Currency Switcher Dropdown */}
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-extrabold text-xs transition-all border border-zinc-300/80 shadow-xs cursor-pointer whitespace-nowrap"
                  title="Cambiar idioma y moneda"
                >
                  <span className="text-sm leading-none">
                    {LANGUAGES.find(l => l.code === lang)?.flag}
                  </span>
                  <span className="font-black text-zinc-800">
                    {LANGUAGES.find(l => l.code === lang)?.name}
                  </span>
                  <span className="px-1.5 py-0.5 bg-brand-green text-white text-[10px] font-black rounded-md">
                    {getCurrencyCode(lang)}
                  </span>
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                </button>

                {langDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setLangDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-1 text-[10px] uppercase font-black tracking-wider text-zinc-400 border-b border-zinc-100 mb-1">
                        {lang === "es" ? "Idioma y Moneda" : lang === "pt" ? "Idioma e Moeda" : "Language & Currency"}
                      </div>
                      {LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            if (onChangeLang) onChangeLang(l.code);
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-extrabold transition text-left hover:bg-zinc-50 ${
                            lang === l.code ? "text-brand-green bg-brand-green/5 font-black" : "text-zinc-700"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg leading-none">{l.flag}</span>
                            <span>{l.name}</span>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-black ${
                            l.code === "es" ? "bg-emerald-100 text-emerald-900" : "bg-blue-100 text-blue-900"
                          }`}>
                            {l.code === "es" ? "MXN" : "USD"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* 5. Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 bg-brand-green hover:bg-emerald-800 text-white rounded-xl font-extrabold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4 text-brand-yellow" />
                <span>{t.viewCartButton}</span>
                {cartTotalItems > 0 && (
                  <span className="px-2 py-0.5 bg-brand-yellow text-zinc-950 font-black rounded-full text-xs">
                    {cartTotalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Row 2: Floating Yellow Contour Search Bar & Category Filter Tabs (PERMANENTLY FLOATING ON SCROLL) */}
          <div className="pt-2 pb-1 border-t border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            {/* Yellow Contour Floating Search Input */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-80 flex-shrink-0">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-green font-black" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-1.5 sm:py-2 bg-yellow-50/90 hover:bg-white border-2 border-brand-yellow rounded-xl text-xs sm:text-sm text-zinc-950 font-extrabold placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green focus:bg-white shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {onRefreshProducts && (
                <button
                  type="button"
                  onClick={() => onRefreshProducts()}
                  className="p-1.5 sm:p-2 bg-yellow-400 hover:bg-brand-yellow text-zinc-950 font-black border-2 border-brand-yellow rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex-shrink-0"
                  title="Sincronizar y actualizar productos del servidor"
                >
                  <RefreshCw className="w-4 h-4 text-zinc-950" />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-full">
              {categories.map((cat) => {
                const count = cat === "Todos" 
                  ? products.length 
                  : products.filter(p => p.category === cat).length;
                const isSelected = selectedCategory === cat;
                const localizedCatName = getLocalizedCategory(cat, lang);

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-brand-green text-white shadow-md scale-102 font-black"
                        : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border border-zinc-200 font-extrabold"
                    }`}
                  >
                    <span>{localizedCatName}</span>
                    <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                      isSelected ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 sm:hidden">
          <div className="bg-white w-4/5 max-w-xs h-full flex flex-col shadow-2xl p-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-green text-brand-yellow font-black italic flex items-center justify-center text-xs">
                  FG
                </div>
                <span className="font-black italic text-base text-brand-green">Menú Fruti Go</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 bg-zinc-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {/* Language Switcher */}
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-zinc-400 block">
                  🌐 Idioma y Moneda
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        if (onChangeLang) onChangeLang(l.code);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold border transition ${
                        lang === l.code
                          ? "bg-brand-green text-white border-brand-green font-black"
                          : "bg-white text-zinc-700 border-zinc-200"
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span className="text-[10px] uppercase font-black">{l.code === "es" ? "MXN" : "USD"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* My Profile / Orders */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  refreshMyOrders();
                  if (registeredProfile && registeredProfile.password && !isClientLoggedIn) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsProfileOpen(true);
                  }
                }}
                className="w-full flex items-center justify-between p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 rounded-2xl font-black text-xs border border-emerald-200 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-green" />
                  <span>Mi Perfil / Mis Pedidos</span>
                </div>
                {myOrders.length > 0 && (
                  <span className="px-2 py-0.5 bg-brand-green text-white font-black text-[10px] rounded-full">
                    {myOrders.length}
                  </span>
                )}
              </button>

              {/* Legal Notice button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onReturnToLegal();
                }}
                className="w-full flex items-center gap-2 p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-2xl font-extrabold text-xs border border-zinc-200 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-zinc-600" />
                <span>{t.legalNoticeButton}</span>
              </button>

              {/* Admin Panel button */}
              {showAdminButton && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center gap-2 p-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-2xl font-bold text-xs border border-zinc-200 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-zinc-500" />
                  <span>{t.adminPanelButton}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* B2B Header Banner (Fully Compact and Mobile Responsive) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 pt-3 sm:pt-5 pb-2 sm:pb-3">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-zinc-900 text-white p-3 sm:p-8 shadow-xl border border-emerald-700/40">
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
            <Building2 className="w-28 h-28 sm:w-64 sm:h-64 text-white" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-brand-yellow text-zinc-950 font-black text-[9px] sm:text-xs uppercase tracking-wider rounded-full mb-1.5 sm:mb-2.5 shadow-sm">
              <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Suministro B2B / Mayoreo</span>
            </div>
            <h1 className="text-sm sm:text-3xl font-black italic tracking-tight mb-1 sm:mb-2">
              {t.b2bTitle}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm font-semibold leading-tight sm:leading-relaxed max-w-2xl mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-none">
              {t.b2bSubtitle}
            </p>
            
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[9px] sm:text-xs font-semibold text-emerald-100">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-brand-yellow" /> {t.badgeWarehouse}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/10 rounded-lg backdrop-blur-sm border border-brand-yellow/30">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-brand-yellow" /> {t.badgeKilosFrom1}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/10 rounded-lg backdrop-blur-sm">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-brand-yellow" /> {t.badgeDeliveryTime}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-brand-yellow text-zinc-950 font-black rounded-lg shadow-sm">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" /> {t.currencyTag}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Section - B2B List Format */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 py-3 sm:py-4">
        {/* B2B COMPACT LIST / TABLE */}

        {/* B2B COMPACT LIST / TABLE */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 shadow-xs p-8">
            <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-700">{t.noProductsFound}</h3>
            <p className="text-xs text-zinc-500 mt-1">{t.noProductsDesc}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("Todos");
                setSearchQuery("");
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <span>Mostrar Todo el Catálogo ({products?.length || 0} productos)</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {/* Table Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-zinc-100/90 border-b border-zinc-200 text-[11px] font-black text-zinc-600 uppercase tracking-wider">
              <div className="col-span-5">{t.colProduct}</div>
              <div className="col-span-2 text-center">{t.colCategory}</div>
              <div className="col-span-2 text-right">{t.colPrice}</div>
              <div className="col-span-2 text-center">{t.colQty}</div>
              <div className="col-span-1 text-right">{t.colSubtotal}</div>
            </div>

            {/* Product List Rows */}
            <div className="divide-y divide-zinc-100">
              {filteredProducts.map((product) => {
                const qtyInCart = getItemQuantityInCart(product.id);
                const isSelected = qtyInCart > 0;
                const locP = getLocalizedProduct(product, lang);
                const subtotalMXN = qtyInCart * product.price;

                return (
                  <div
                    key={product.id}
                    className={`p-3.5 sm:p-4 transition-colors flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center ${
                      isSelected ? "bg-emerald-50/60" : "hover:bg-zinc-50/80"
                    }`}
                  >
                    {/* Item Info (Image + Name + Presentation) */}
                    <div className="col-span-5 flex items-center gap-3">
                      <img
                        src={product.image || getProductWhiteBgImage(product.name, product.category)}
                        alt={locP.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain bg-white p-1 border border-zinc-200 shadow-xs flex-shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getProductWhiteBgImage(product.name, product.category);
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 leading-tight">
                            {locP.name}
                          </h3>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-md border border-emerald-200/80">
                            {locP.presentation || locP.unit || "1 Kg"}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                          {locP.description}
                        </p>
                      </div>
                    </div>

                    {/* Category (Mobile & Desktop) */}
                    <div className="col-span-2 hidden md:block text-center">
                      <span className="inline-block px-2.5 py-1 bg-zinc-100 text-zinc-700 text-[10px] font-bold rounded-lg border border-zinc-200">
                        {getLocalizedCategory(product.category, lang)}
                      </span>
                    </div>

                    {/* Price Mayoreo */}
                    <div className="col-span-2 my-2 md:my-0 flex md:block items-center justify-between md:text-right">
                      <span className="text-[11px] font-bold text-zinc-400 md:hidden">{t.priceLabel}:</span>
                      <div>
                        <span className="text-sm font-black text-brand-green">
                          {formatPrice(product.price, lang)}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium block">
                          / {locP.unit || "1 Kg"}
                        </span>
                      </div>
                    </div>

                    {/* Fast Quantity Selector (- / input / +) */}
                    <div className="col-span-2 my-1 md:my-0 flex items-center justify-between md:justify-center gap-2">
                      <span className="text-[11px] font-bold text-zinc-400 md:hidden">{t.quantityLabel}:</span>
                      <div className="flex items-center bg-white border border-zinc-300 rounded-xl shadow-xs overflow-hidden px-1">
                        <button
                          type="button"
                          onClick={() => handleDirectQuantityChange(product, String(Math.max(0, qtyInCart - 1)))}
                          disabled={qtyInCart === 0}
                          className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 active:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                          title="Restar 1 Kg"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        
                        <div className="flex items-center justify-center px-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={qtyInCart === 0 ? "" : qtyInCart}
                            onChange={(e) => handleDirectQuantityChange(product, e.target.value)}
                            placeholder="0"
                            className="w-10 h-8 text-center text-xs font-black text-zinc-900 bg-transparent focus:outline-none focus:bg-emerald-50/50"
                          />
                          <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded text-center">
                            {product.unit?.toLowerCase().includes("l") ? "L" : "Kg"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDirectQuantityChange(product, String(qtyInCart + 1))}
                          className="w-8 h-8 flex items-center justify-center text-brand-green hover:bg-emerald-50 active:bg-emerald-100 transition-colors font-bold"
                          title="Sumar 1 Kg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-1 mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 flex md:block items-center justify-between md:text-right">
                      <span className="text-[11px] font-bold text-zinc-400 md:hidden">{t.subtotalLabel}:</span>
                      <span className={`text-xs sm:text-sm font-black ${
                        isSelected ? "text-brand-green" : "text-zinc-400"
                      }`}>
                        {formatPrice(subtotalMXN, lang)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Bar: Order Summary & Checkout Trigger */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-2xl p-3 sm:p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onReturnToLegal}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-bold text-xs transition-all border border-zinc-300/60"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-600" />
            <span>{t.legalNoticeButton}</span>
          </button>

          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 block">
                {cartTotalItems} {cartTotalItems === 1 ? t.itemSelected : t.itemsSelected}
              </span>
              <span className="text-base sm:text-xl font-black text-brand-green">
                {formatPrice(cartTotalPrice, lang)}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              disabled={cartTotalItems === 0}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 active:scale-95 ${
                cartTotalItems > 0
                  ? "bg-brand-green hover:bg-emerald-800 text-white shadow-emerald-900/20"
                  : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-brand-yellow" />
              <span>{t.viewCartButton}</span>
            </button>
          </div>
        </div>
      </div>

      {/* CART & DELIVERY DATE DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-zinc-900 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-brand-yellow" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">{t.cartTitle}</h3>
                  <p className="text-[11px] text-emerald-200 font-medium">
                    {cartTotalItems} {cartTotalItems === 1 ? t.itemSelected : t.itemsSelected}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-zinc-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* Mandatory Delivery Date Selector Banner */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                  <Calendar className="w-4 h-4 text-brand-green flex-shrink-0" />
                  <span>{t.deliveryDateLabel} *</span>
                </div>
                
                <input
                  type="date"
                  min={minDeliveryDate}
                  value={shippingInfo.deliveryDate || minDeliveryDate}
                  onChange={(e) => handleShippingChange("deliveryDate", e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-extrabold text-zinc-900 focus:ring-2 focus:ring-brand-green focus:outline-none cursor-pointer shadow-xs"
                />

                <p className="text-[11px] font-semibold text-emerald-900 leading-tight flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                  <span>{t.deliveryDateNotice}</span>
                </p>
              </div>

              {/* Items List */}
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                  <p className="text-xs font-bold text-zinc-500">{t.emptyCartTitle}</p>
                  <p className="text-[11px] text-zinc-400 mt-1">{t.emptyCartDesc}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-zinc-600 uppercase tracking-wider">{t.summaryTitle}</h4>
                    {cart.length > 0 && (
                      <button
                        type="button"
                        onClick={onClearCart}
                        className="flex items-center gap-1.5 text-xs font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-xl border border-red-200 transition-all active:scale-95 shadow-2xs cursor-pointer"
                        title="Vaciar todos los productos del carrito"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        <span>Limpiar Carrito</span>
                      </button>
                    )}
                  </div>
                  {cart.map((item) => {
                    const locP = getLocalizedProduct(item.product, lang);
                    return (
                      <div
                        key={item.product.id}
                        className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.product.image || getProductWhiteBgImage(item.product.name, item.product.category)}
                            alt={locP.name}
                            className="w-12 h-12 rounded-lg object-contain bg-white p-0.5 border border-zinc-200 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getProductWhiteBgImage(item.product.name, item.product.category);
                            }}
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-zinc-900 truncate">{locP.name}</h5>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                              {locP.presentation || locP.unit}
                            </span>
                            <span className="text-xs font-black text-brand-green block mt-0.5">
                              {formatPrice(item.product.price * item.quantity, lang)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-zinc-300 bg-white rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-black">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-brand-green hover:bg-emerald-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveFromCart(item.product.id)}
                            className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Shipping Form Fields */}
              {cart.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-zinc-200">
                  <h4 className="text-xs font-black text-zinc-700 uppercase tracking-wider">{t.shippingHeader}</h4>
                  
                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">{t.fullNameLabel} *</label>
                    <input
                      type="text"
                      value={shippingInfo.fullName || ""}
                      onChange={(e) => handleShippingChange("fullName", e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">{t.phoneLabel} *</label>
                    <input
                      type="tel"
                      value={shippingInfo.phone || ""}
                      onChange={(e) => handleShippingChange("phone", e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">{t.addressLabel} *</label>
                    <input
                      type="text"
                      value={shippingInfo.address || ""}
                      onChange={(e) => handleShippingChange("address", e.target.value)}
                      placeholder={t.addressPlaceholder}
                      className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">{t.municipalityLabel} *</label>
                    <input
                      type="text"
                      value={shippingInfo.municipalityZip || ""}
                      onChange={(e) => handleShippingChange("municipalityZip", e.target.value)}
                      placeholder={t.municipalityPlaceholder}
                      className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">{t.referencesLabel}</label>
                    <input
                      type="text"
                      value={shippingInfo.references || ""}
                      onChange={(e) => handleShippingChange("references", e.target.value)}
                      placeholder={t.referencesPlaceholder}
                      className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white space-y-3">
                {openPayAlertMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                    {isRedirecting ? (
                      <Loader2 className="w-4 h-4 text-brand-green animate-spin flex-shrink-0" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0" />
                    )}
                    <span>{openPayAlertMsg}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-zinc-500">{t.totalToPay}:</span>
                  <span className="text-xl font-black text-brand-green">{formatPrice(cartTotalPrice, lang)}</span>
                </div>

                {!isShippingValid && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{t.completeRequiredFields}</span>
                  </div>
                )}

                <button
                  onClick={handleProceedToCheckout}
                  disabled={isRedirecting}
                  className="w-full py-3.5 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 bg-brand-green hover:bg-emerald-800 active:scale-98"
                >
                  <CreditCard className="w-4 h-4 text-brand-yellow" />
                  <span>{t.payCardButton}</span>
                </button>

                <button
                  type="button"
                  onClick={onClearCart}
                  className="w-full py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-2xs cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>🗑️ Limpiar Carrito</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL OPENPAY */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-zinc-200 relative overflow-hidden animate-in zoom-in-95 duration-200 my-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-zinc-900 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-400/30 text-brand-yellow">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base sm:text-lg text-white">{t.payModalTitle}</h3>
                  </div>
                  <p className="text-[11px] text-zinc-300">Bodega Central Guadalajara • Fruti Go B2B</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="p-2 text-zinc-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-zinc-50/50">
              {/* Order Summary Ribbon */}
              <div className="bg-white p-3.5 rounded-2xl border border-zinc-200 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide block">{t.summaryTitle}</span>
                  <span className="text-xs font-bold text-zinc-800">{cartTotalItems} {cartTotalItems === 1 ? t.itemSelected : t.itemsSelected}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-zinc-400 block">{t.totalToPay}</span>
                  <span className="text-lg font-black text-brand-green">{formatPrice(cartTotalPrice, lang)}</span>
                </div>
              </div>

              {/* SECCIÓN 1: LOGÍSTICA BODEGA CENTRAL Y COBERTURA ZMG */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2 font-black text-xs text-zinc-900 uppercase tracking-wide">
                    <Truck className="w-4 h-4 text-brand-green" />
                    <span>1. LOGÍSTICA DE BODEGA Y COBERTURA ZMG</span>
                  </div>
                  <span className="text-[10px] text-red-500 font-bold">* Campos obligatorios</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Notice Bodega Central 24h */}
                  <div className="sm:col-span-2 p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-emerald-950 font-black text-xs">
                      <Clock className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>Bodega Central Guadalajara • Mínimo 24h de anticipación</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="block text-[10px] font-black text-emerald-900 mb-1">
                          📅 Fecha de Entrega Programada *
                        </label>
                        <input
                          type="date"
                          min={minDeliveryDate}
                          value={shippingInfo.deliveryDate || minDeliveryDate}
                          onChange={(e) => handleShippingChange("deliveryDate", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-extrabold text-zinc-900 cursor-pointer shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-emerald-900 mb-1">
                          ⏰ Horario Preferente de Entrega *
                        </label>
                        <select
                          value={shippingInfo.deliveryTimeWindow || "08:00 AM - 12:00 PM (Turno Matutino)"}
                          onChange={(e) => handleShippingChange("deliveryTimeWindow", e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-zinc-900 cursor-pointer shadow-xs"
                        >
                          <option value="08:00 AM - 12:00 PM (Turno Matutino)">08:00 AM - 12:00 PM (Turno Matutino)</option>
                          <option value="12:00 PM - 04:00 PM (Turno Mediodía)">12:00 PM - 04:00 PM (Turno Mediodía)</option>
                          <option value="04:00 PM - 08:00 PM (Turno Vespertino)">04:00 PM - 08:00 PM (Turno Vespertino)</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-[10px] text-emerald-800 font-bold italic pt-0.5">
                      "Todos los pedidos se preparan desde Bodega Central Guadalajara con un mínimo de 24 horas de anticipación."
                    </p>
                  </div>

                  {/* Nombre Completo / Restaurante */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">Nombre del Restaurante / Cliente *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={shippingInfo.fullName || ""}
                        onChange={(e) => handleShippingChange("fullName", e.target.value)}
                        placeholder="Ej. Restaurante El Tapatío / Juan Pérez"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-brand-green focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Teléfono / WhatsApp */}
                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">Teléfono / WhatsApp de Contacto *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={shippingInfo.phone || ""}
                        onChange={(e) => handleShippingChange("phone", e.target.value)}
                        placeholder="Ej. 33 1234 5678"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-brand-green focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Municipio ZMG Dropdown */}
                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">Municipio de Cobertura ZMG *</label>
                    <select
                      value={shippingInfo.municipality || "Guadalajara"}
                      onChange={(e) => handleShippingChange("municipality", e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-brand-green focus:outline-none"
                    >
                      <option value="Guadalajara">Guadalajara</option>
                      <option value="Zapopan">Zapopan</option>
                      <option value="San Pedro Tlaquepaque">San Pedro Tlaquepaque</option>
                      <option value="Tonalá">Tonalá</option>
                      <option value="Tlajomulco de Zúñiga">Tlajomulco de Zúñiga</option>
                      <option value="FUERA_DE_COBERTURA">Otro municipio / Fuera de ZMG (Sin cobertura)</option>
                    </select>
                  </div>

                  {/* Código Postal y Colonia */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">Código Postal y Colonia *</label>
                    <div className="relative">
                      <Home className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={shippingInfo.municipalityZip || ""}
                        onChange={(e) => handleShippingChange("municipalityZip", e.target.value)}
                        placeholder="Ej. 44100, Col. Centro"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-brand-green focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Geofence Alert Warning if Outside ZMG */}
                  {!isLocationZMGValid && (
                    <div className="sm:col-span-2 p-3.5 bg-red-50 border border-red-300 rounded-2xl text-xs text-red-900 font-bold space-y-1">
                      <div className="flex items-center gap-2 text-red-700 font-black">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>UBICACIÓN FUERA DE COBERTURA ZMG</span>
                      </div>
                      <p className="text-[11px] leading-relaxed font-semibold text-red-800">
                        Lo sentimos: Por el momento únicamente realizamos entregas en la Zona Metropolitana de Guadalajara (Guadalajara, Zapopan, Tlaquepaque, Tonalá y Tlajomulco). Si tu negocio se encuentra dentro de esta área, por favor selecciona uno de los municipios con cobertura.
                      </p>
                    </div>
                  )}

                  {/* Dirección */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">Dirección del Restaurante (Calle y Número) *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={shippingInfo.address || ""}
                        onChange={(e) => handleShippingChange("address", e.target.value)}
                        placeholder="Ej. Av. Juárez #123 entre Hidalgo y Morelos"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-brand-green focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Referencias */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-black text-zinc-700 mb-1">Referencias de Entrega / Acceso Proveedores</label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-zinc-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={shippingInfo.references || ""}
                        onChange={(e) => handleShippingChange("references", e.target.value)}
                        placeholder="Ej. Entrada por portón trasero, recibir con cocina"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-900 focus:ring-2 focus:ring-brand-green focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN 2: FACTURACIÓN ELECTRÓNICA CFDI 4.0 */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div className="flex items-center gap-2 font-black text-xs text-zinc-900 uppercase tracking-wide">
                    <FileText className="w-4 h-4 text-brand-green" />
                    <span>2. FACTURACIÓN ELECTRÓNICA CFDI 4.0 (SOLUCIÓN FACTURA)</span>
                  </div>
                </div>

                <label className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={billingInfo.requiresInvoice}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      handleBillingChange("requiresInvoice", checked);
                      if (checked) {
                        if (registeredProfile && registeredProfile.password && !isClientLoggedIn) {
                          setIsAuthModalOpen(true);
                        } else if (registeredProfile && isClientLoggedIn) {
                          setBillingInfo((prev) => ({
                            ...prev,
                            requiresInvoice: true,
                            rfc: registeredProfile.rfc || prev.rfc,
                            razonSocial: registeredProfile.razonSocial || prev.razonSocial,
                            zipCode: registeredProfile.zipCode || prev.zipCode,
                            email: registeredProfile.email || prev.email,
                            regimenFiscal: registeredProfile.regimenFiscal || prev.regimenFiscal,
                            usoCFDI: registeredProfile.usoCFDI || prev.usoCFDI
                          }));
                        }
                      }
                    }}
                    className="w-4 h-4 text-brand-green rounded focus:ring-brand-green"
                  />
                  <div className="text-xs">
                    <span className="font-extrabold text-zinc-900 block">¿Requieres factura electrónica (CFDI 4.0)?</span>
                    <span className="text-[10px] text-zinc-500">Se enviará el XML y PDF timbrado mediante Solución Factura API v2.</span>
                  </div>
                </label>

                {billingInfo.requiresInvoice && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-100 animate-in fade-in duration-200">
                    {/* DESPLEGABLE DE CLIENTE EXCLUSIVO PARA EL USUARIO / PERFIL GUARDADO */}
                    <div className="sm:col-span-2 bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-300 space-y-2">
                      <label className="block text-[11px] font-black text-emerald-950 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-brand-green" />
                        <span>Desplegable de Cliente / Registro de Facturación:</span>
                      </label>
                      <select
                        value={
                          billingInfo.rfc === "XAXX010101000"
                            ? "publico_general"
                            : billingInfo.rfc === "XEXX010101000"
                            ? "extranjero"
                            : registeredProfile && isClientLoggedIn
                            ? "my_saved_profile"
                            : "custom"
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "my_saved_profile") {
                            if (registeredProfile) {
                              setBillingInfo((prev) => ({
                                ...prev,
                                requiresInvoice: true,
                                rfc: registeredProfile.rfc || prev.rfc,
                                razonSocial: registeredProfile.razonSocial || prev.razonSocial,
                                zipCode: registeredProfile.zipCode || prev.zipCode,
                                email: registeredProfile.email || prev.email,
                                regimenFiscal: registeredProfile.regimenFiscal || prev.regimenFiscal,
                                usoCFDI: registeredProfile.usoCFDI || prev.usoCFDI
                              }));
                            }
                          } else if (val === "publico_general") {
                            const updated = {
                              ...billingInfo,
                              rfc: "XAXX010101000",
                              razonSocial: "PUBLICO EN GENERAL",
                              zipCode: billingInfo.zipCode || "44100",
                              regimenFiscal: "616 - Sin obligaciones fiscales",
                              usoCFDI: "S01 - Sin efectos fiscales"
                            };
                            setBillingInfo(updated);
                            try { localStorage.setItem("fg_billing_info", JSON.stringify(updated)); } catch {}
                          } else if (val === "extranjero") {
                            const updated = {
                              ...billingInfo,
                              rfc: "XEXX010101000",
                              razonSocial: "CLIENTE EXTRANJERO",
                              zipCode: billingInfo.zipCode || "44100",
                              regimenFiscal: "616 - Sin obligaciones fiscales",
                              usoCFDI: "S01 - Sin efectos fiscales"
                            };
                            setBillingInfo(updated);
                            try { localStorage.setItem("fg_billing_info", JSON.stringify(updated)); } catch {}
                          }
                        }}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-zinc-900 cursor-pointer shadow-2xs focus:ring-2 focus:ring-brand-green"
                      >
                        {registeredProfile && isClientLoggedIn && (
                          <option value="my_saved_profile">
                            👤 Mi Registro Guardado ({registeredProfile.rfc} - {registeredProfile.razonSocial || "Perfil Fiscal"})
                          </option>
                        )}
                        <option value="custom">✏️ Llenar / Modificar Datos de Facturación Manualmente</option>
                        <option value="publico_general">📄 Factura a Público en General (RFC Genérico: XAXX010101000)</option>
                        <option value="extranjero">🌍 Ventas a Clientes del Extranjero (RFC Genérico: XEXX010101000)</option>
                      </select>

                      {registeredProfile && isClientLoggedIn ? (
                        <div className="p-2.5 bg-emerald-100/90 border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-950 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                            <span>Perfil Fiscal Activo: Datos auto-rellenados desde tu cuenta ({registeredProfile.rfc}).</span>
                          </div>
                          <span className="text-[9px] bg-emerald-800 text-white font-black px-2 py-0.5 rounded-md uppercase">
                            Sesión Activa
                          </span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-emerald-800 font-medium">
                          💡 Al registrar tus datos de facturación con contraseña por primera vez, tus datos quedarán guardados y protegidos para auto-completarse en tus siguientes compras.
                        </p>
                      )}
                    </div>

                    {/* REGISTRAR CONTRASEÑA SI NO TIENE PERFIL O ESTÁ DESCONECTADO */}
                    {(!registeredProfile || !registeredProfile.password) && (
                      <div className="sm:col-span-2 bg-emerald-50/90 p-3.5 rounded-xl border border-emerald-300 space-y-1.5">
                        <label className="block text-[11px] font-black text-emerald-950 flex items-center gap-1.5">
                          <Lock className="w-4 h-4 text-brand-green" />
                          <span>Crear Contraseña para tu Perfil de Facturación *</span>
                        </label>
                        <input
                          type="password"
                          value={clientPasswordInput}
                          onChange={(e) => setClientPasswordInput(e.target.value)}
                          placeholder="Crea una contraseña segura (mínimo 4 caracteres)"
                          className="w-full px-3 py-2 bg-white border border-emerald-400 rounded-lg text-xs font-bold text-zinc-900 focus:ring-2 focus:ring-brand-green"
                        />
                        <p className="text-[10px] text-emerald-800 font-medium">
                          🔑 Esta contraseña asegurará tu perfil fiscal. Cuando vuelvas a comprar y selecciones factura, solo ingresarás tu clave para entrar y auto-rellenar tus datos.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 mb-1">RFC del Cliente / Empresa *</label>
                      <input
                        type="text"
                        value={billingInfo.rfc || ""}
                        onChange={(e) => handleBillingChange("rfc", e.target.value.toUpperCase())}
                        placeholder="Ej. TAP800101XYZ"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 mb-1">Razón Social / Nombre Fiscal *</label>
                      <input
                        type="text"
                        value={billingInfo.razonSocial || ""}
                        onChange={(e) => handleBillingChange("razonSocial", e.target.value)}
                        placeholder="Ej. RESTAURANTE EL TAPATIO SA DE CV"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 mb-1">Código Postal Fiscal *</label>
                      <input
                        type="text"
                        maxLength={5}
                        value={billingInfo.zipCode || ""}
                        onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                        placeholder="Ej. 44100"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-mono font-bold text-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 mb-1">Correo para recibir XML/PDF *</label>
                      <input
                        type="email"
                        value={billingInfo.email || ""}
                        onChange={(e) => handleBillingChange("email", e.target.value)}
                        placeholder="facturacion@restaurante.com"
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-black text-zinc-700 mb-1">Régimen Fiscal (SAT) *</label>
                      <select
                        value={billingInfo.regimenFiscal || "601 - General de Ley Personas Morales"}
                        onChange={(e) => handleBillingChange("regimenFiscal", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900"
                      >
                        <option value="601 - General de Ley Personas Morales">601 - General de Ley Personas Morales</option>
                        <option value="612 - Personas Físicas con Actividades Empresariales y Profesionales">612 - Personas Físicas con Actividades Empresariales</option>
                        <option value="626 - Régimen Simplificado de Confianza (RESICO)">626 - Régimen Simplificado de Confianza (RESICO)</option>
                        <option value="603 - Personas Morales con Fines no Lucrativos">603 - Personas Morales con Fines no Lucrativos</option>
                        <option value="605 - Sueldos y Salarios e Ingresos por Prestación de Servicios">605 - Sueldos y Salarios</option>
                        <option value="616 - Sin obligaciones fiscales">616 - Sin obligaciones fiscales</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-black text-zinc-700 mb-1">Uso de CFDI *</label>
                      <select
                        value={billingInfo.usoCFDI || "G01 - Adquisición de mercancías"}
                        onChange={(e) => handleBillingChange("usoCFDI", e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-900"
                      >
                        <option value="G01 - Adquisición de mercancías">G01 - Adquisición de mercancías (Recomendado para insumos)</option>
                        <option value="G03 - Gastos en general">G03 - Gastos en general</option>
                        <option value="CP01 - Pagos">CP01 - Pagos</option>
                        <option value="S01 - Sin efectos fiscales">S01 - Sin efectos fiscales</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-zinc-200 space-y-2.5">
              {paymentError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Main Action: OpenPay Payment */}
              <button
                type="button"
                onClick={handleProcessOpenPayPayment}
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2 disabled:bg-zinc-400 cursor-pointer"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-5 h-5 text-brand-yellow animate-spin" />
                    <span>{t.processingPayment}</span>
                  </>
                ) : (
                  <>
                    <PackageCheck className="w-5 h-5 text-brand-yellow" />
                    <span>Pagar en Línea con Tarjeta ({formatPrice(cartTotalPrice, lang)}) 💳</span>
                  </>
                )}
              </button>

              {/* Secondary Action: WhatsApp Order Without Online Payment */}
              <button
                type="button"
                onClick={handleProcessWhatsAppOrderWithoutPayment}
                disabled={isProcessingPayment}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer border-2 border-emerald-500"
              >
                <MessageCircle className="w-5 h-5 text-brand-yellow" />
                <span>📱 Enviar Pedido por WhatsApp (Sin Pagar Ahora)</span>
              </button>

              <p className="text-[10px] text-zinc-500 text-center italic pt-1 leading-tight">
                * Los pedidos enviados por WhatsApp se procesan contra entrega. Si requieres factura fiscal, esta se habilitará en tu cuenta cuando el administrador confirme el pago en el panel de administración.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: OpenPay Return Success */}
      {openpaySuccessOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-emerald-100 text-center relative my-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full mb-2">
              💳 Transacción Aprobada por OpenPay (3D Secure)
            </span>

            <h2 className="text-lg sm:text-xl font-black text-zinc-900 mb-2">
              {t.paymentSuccessTitle}
            </h2>

            <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-3 rounded-2xl border border-emerald-200/80 mb-4 leading-relaxed">
              {t.paymentSuccessDesc}
            </p>

            <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 text-left space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
                <span className="text-zinc-500 font-bold">{t.folioLabel}:</span>
                <span className="font-mono font-black text-zinc-900">{openpaySuccessOrder.orderId}</span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
                <span className="text-zinc-500 font-bold">{t.scheduledDeliveryLabel}:</span>
                <span className="font-semibold text-emerald-900 font-bold">
                  {openpaySuccessOrder.deliveryDate || openpaySuccessOrder.customer?.deliveryDate || minDeliveryDate} (Bodega Central GDL)
                </span>
              </div>
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
                <span className="text-zinc-500 font-bold">{t.totalToPay}:</span>
                <span className="text-base font-black text-brand-green">{formatPrice(openpaySuccessOrder.total, lang)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => generateOrderPDF(openpaySuccessOrder, {
                  pdfLogoUrl: pdfConfig?.pdfLogoUrl || undefined,
                  pdfQrUrl: pdfConfig?.pdfQrUrl || undefined,
                  lang: lang
                })}
                className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 border border-zinc-700"
              >
                <Download className="w-4 h-4 text-brand-yellow" />
                <span>📄 Descargar Nota de Pedido (PDF)</span>
              </button>

              {(openpaySuccessOrder.invoiceDetails || openpaySuccessOrder.billingInfo?.requiresInvoice) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => generateCFDIPDF(openpaySuccessOrder, { invoiceDetails: openpaySuccessOrder.invoiceDetails })}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    <span>Factura CFDI (PDF) 📄</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCFDIXML(openpaySuccessOrder, openpaySuccessOrder.invoiceDetails)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-200" />
                    <span>Factura XML (CFDI 4.0) 📦</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSendWhatsAppOrder(openpaySuccessOrder)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>📱 {t.sendWhatsappButton}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onDismissSuccessOrder) onDismissSuccessOrder();
                }}
                className="w-full py-3 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-98"
              >
                {t.backToStore} 🍉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: Local Order Completed */}
      {localOrderCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-emerald-100 text-center relative my-auto">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-9 h-9 text-brand-green" />
            </div>

            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-full mb-2">
              📦 {t.paymentSuccessTitle} (3D Secure)
            </span>

            <h2 className="text-lg sm:text-xl font-black text-zinc-900 mb-2">
              {t.paymentSuccessTitle}
            </h2>

            <div className="text-xs font-bold text-emerald-900 bg-emerald-50/90 p-3 rounded-2xl border border-emerald-200 mb-4 leading-relaxed text-left">
              {t.paymentSuccessDesc} Total: <strong className="text-sm text-brand-green font-black">{formatPrice(localOrderCompleted.total, lang)}</strong>.
            </div>

            {/* Details */}
            <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-200 text-left space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
                <span className="text-zinc-500 font-bold">{t.folioLabel}:</span>
                <span className="font-mono font-black text-zinc-900">{localOrderCompleted.orderId}</span>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
                <span className="text-zinc-500 font-bold">📅 {t.scheduledDeliveryLabel}:</span>
                <span className="font-extrabold text-emerald-900">
                  {localOrderCompleted.deliveryDate || localOrderCompleted.customer?.deliveryDate || minDeliveryDate}
                </span>
              </div>

              {localOrderCompleted.openpayDetails && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 my-1.5">
                  <div className="flex items-center justify-between text-emerald-950">
                    <span className="font-bold">Estatus OpenPay:</span>
                    <span className="font-black uppercase text-[9px] px-2 py-0.5 bg-emerald-600 text-white rounded-full">
                      {localOrderCompleted.openpayDetails.status || "completed"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-900">
                    <span className="font-bold">Autorización:</span>
                    <span className="font-mono font-black text-brand-green text-xs">
                      #{localOrderCompleted.openpayDetails.authorization}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <span className="text-zinc-500 font-bold">{t.fullNameLabel}:</span>
                <span className="font-bold text-zinc-800">{localOrderCompleted.customer?.fullName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <span className="text-zinc-500 font-bold">{t.phoneLabel}:</span>
                <span className="font-bold font-mono text-zinc-800">{localOrderCompleted.customer?.phone}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <span className="text-zinc-500 font-bold">{t.deliveryAddressLabel}:</span>
                <span className="font-medium text-zinc-800">{localOrderCompleted.customer?.address}, {localOrderCompleted.customer?.municipalityZip}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => generateOrderPDF(localOrderCompleted, {
                  pdfLogoUrl: pdfConfig?.pdfLogoUrl || undefined,
                  pdfQrUrl: pdfConfig?.pdfQrUrl || undefined,
                  lang: lang
                })}
                className="w-full py-3 bg-zinc-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 border border-zinc-700"
              >
                <Download className="w-4 h-4 text-brand-yellow" />
                <span>📄 Descargar Nota de Pedido (PDF)</span>
              </button>

              {(localOrderCompleted.invoiceDetails || localOrderCompleted.billingInfo?.requiresInvoice) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => generateCFDIPDF(localOrderCompleted, { invoiceDetails: localOrderCompleted.invoiceDetails })}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    <span>Factura CFDI (PDF) 📄</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCFDIXML(localOrderCompleted, localOrderCompleted.invoiceDetails)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-200" />
                    <span>Factura XML (CFDI 4.0) 📦</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSendWhatsAppOrder(localOrderCompleted)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>📱 {t.sendWhatsappButton}</span>
              </button>

              <button
                type="button"
                onClick={() => setLocalOrderCompleted(null)}
                className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all active:scale-98"
              >
                {t.backToStore} 🍉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER PROFILE & ORDER HISTORY MODAL */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-zinc-200 relative my-8">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-5">
              <div className="w-12 h-12 bg-emerald-100 text-brand-green rounded-2xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-green">Perfil del Cliente B2B</span>
                <h2 className="text-xl font-black text-zinc-900 italic">Historial de Pedidos y Facturación CFDI 4.0</h2>
              </div>
            </div>

            {postInvoiceNotice && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 font-extrabold mb-4 flex items-center justify-between gap-2">
                <span>{postInvoiceNotice}</span>
                <button onClick={() => setPostInvoiceNotice(null)} className="text-emerald-700 hover:text-emerald-950">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Default Fiscal Profile Settings */}
            <div className="bg-zinc-50/80 p-4 rounded-2xl border border-zinc-200 space-y-3 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-zinc-200/80 pb-2">
                <div className="flex items-center gap-2 font-black text-xs text-zinc-900 uppercase">
                  <FileText className="w-4 h-4 text-brand-green" />
                  <span>Datos Fiscales Guardados en tu Perfil</span>
                </div>
                {isClientLoggedIn && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-md border border-emerald-300">
                      🟢 Sesión Activa
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        handleLogoutClient();
                        setIsProfileOpen(false);
                      }}
                      className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-extrabold text-[11px] rounded-lg border border-red-300 transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Cerrar Sesión de Perfil"
                    >
                      <Lock className="w-3 h-3 text-red-600" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div>
                  <label className="block text-[10px] font-black text-zinc-600 mb-0.5">RFC del Cliente</label>
                  <input
                    type="text"
                    value={billingInfo.rfc || ""}
                    onChange={(e) => handleBillingChange("rfc", e.target.value.toUpperCase())}
                    placeholder="Ej. TAP800101XYZ"
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono font-bold text-zinc-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-600 mb-0.5">Razón Social / Nombre Fiscal</label>
                  <input
                    type="text"
                    value={billingInfo.razonSocial || ""}
                    onChange={(e) => handleBillingChange("razonSocial", e.target.value)}
                    placeholder="Ej. RESTAURANTE EL TAPATIO SA DE CV"
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-bold text-zinc-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-600 mb-0.5">Código Postal Fiscal</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={billingInfo.zipCode || ""}
                    onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                    placeholder="Ej. 44100"
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-mono font-bold text-zinc-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-600 mb-0.5">Correo para Facturas XML/PDF</label>
                  <input
                    type="email"
                    value={billingInfo.email || ""}
                    onChange={(e) => handleBillingChange("email", e.target.value)}
                    placeholder="facturacion@restaurante.com"
                    className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-xl font-bold text-zinc-900 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Orders History List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
                  Historial de Pedidos Realizados ({myOrders.length})
                </h3>
                <button
                  onClick={refreshMyOrders}
                  className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Actualizar lista</span>
                </button>
              </div>

              {myOrders.length === 0 ? (
                <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-300 p-6">
                  <ShoppingBag className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-600">Aún no has realizado pedidos de insumos B2B en Fruti Go.</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Cuando completes una compra en la tienda, aparecerá aquí tu pedido para que descargues tu nota o solicites tu factura cuando lo desees.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {myOrders.map((ord) => {
                    const isAlreadyInvoiced = ord.invoiceStatus === "issued" || ord.invoiceDetails || ord.status === "paid" && ord.billingInfo?.requiresInvoice;
                    const invoiceUUID = ord.invoiceDetails?.uuid || ord.invoiceDetails?.invoiceId;

                    return (
                      <div
                        key={ord.orderId}
                        className="p-4 bg-white border border-zinc-200 rounded-2xl space-y-3 shadow-xs hover:border-emerald-300 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                          <div>
                            <span className="text-[10px] font-black uppercase text-zinc-400 block">Folio de Pedido:</span>
                            <span className="text-sm font-mono font-black text-zinc-900">#{ord.orderId}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] font-black uppercase text-zinc-400 block">Total:</span>
                            <span className="text-sm font-black text-brand-green">{formatPrice(ord.total, lang)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-700">
                          <div>
                            <span className="text-zinc-400 font-bold">Fecha Pedido: </span>
                            <span className="font-semibold">
                              {(() => {
                                if (!ord.date) return "Reciente";
                                try {
                                  const d = new Date(ord.date);
                                  return isNaN(d.getTime()) ? ord.date : d.toLocaleDateString();
                                } catch {
                                  return "Reciente";
                                }
                              })()}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-400 font-bold">Entrega Programada: </span>
                            <span className="font-bold text-emerald-900">
                              {ord.deliveryDate || ord.customer?.deliveryDate || minDeliveryDate}
                            </span>
                          </div>
                        </div>

                        {/* Items Purchased */}
                        {ord.items && ord.items.length > 0 && (
                          <div className="p-2.5 bg-zinc-50 rounded-xl text-[11px]">
                            <span className="font-bold text-zinc-500 block mb-1">Insumos Solicitados:</span>
                            <div className="flex flex-wrap gap-1">
                              {ord.items.map((it, idx) => (
                                <span key={idx} className="bg-white border border-zinc-200 px-2 py-0.5 rounded-md font-bold text-zinc-800">
                                  {it.quantity || 1}x {it.product?.name || "Insumo Fruti Go"}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Facturación Status Section & Download Actions */}
                        <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2.5">
                          {(() => {
                            const isInvoiceAllowed = ord.paymentMethod !== "whatsapp" || ord.status === "paid" || ord.status === "completed" || ord.invoiceAllowedByAdmin === true;

                            return (
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  {isAlreadyInvoiced ? (
                                    <div className="space-y-0.5">
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-900 font-black text-[10px] uppercase rounded-full border border-emerald-300">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
                                        <span>✅ Factura CFDI 4.0 Timbrada</span>
                                      </span>
                                      {invoiceUUID && (
                                        <p className="text-[10px] font-mono text-zinc-500 font-bold pl-1">
                                          UUID: {invoiceUUID}
                                        </p>
                                      )}
                                    </div>
                                  ) : !isInvoiceAllowed ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 font-bold text-[10px] uppercase rounded-full border border-amber-300">
                                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                                      <span>Facturación Requiere Aprobación</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 font-black text-[10px] uppercase rounded-full border border-amber-300">
                                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                                      <span>📄 Pendiente de Facturar</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex-shrink-0">
                                  {!isAlreadyInvoiced && (
                                    isInvoiceAllowed ? (
                                      <button
                                        onClick={() => {
                                          setSelectedOrderToInvoice(ord);
                                          setPostInvoiceBilling((prev) => ({
                                            ...prev,
                                            rfc: ord.billingInfo?.rfc || billingInfo.rfc || "",
                                            razonSocial: ord.billingInfo?.razonSocial || billingInfo.razonSocial || ord.customer?.fullName || "",
                                            zipCode: ord.billingInfo?.zipCode || billingInfo.zipCode || "44100",
                                            email: ord.billingInfo?.email || billingInfo.email || ""
                                          }));
                                        }}
                                        className="w-full sm:w-auto px-4 py-2 bg-brand-green hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-brand-yellow" />
                                        <span>Facturar Pedido Ahora 🧾</span>
                                      </button>
                                    ) : (
                                      <div className="flex flex-col items-end">
                                        <button
                                          disabled
                                          className="px-3 py-1.5 bg-zinc-200 text-zinc-500 font-bold text-xs rounded-xl cursor-not-allowed opacity-75 flex items-center gap-1"
                                          title="Este pedido fue realizado por WhatsApp sin pago previo. Para facturar, el administrador debe marcarlo como positivo en el panel de administración."
                                        >
                                          <Lock className="w-3.5 h-3.5 text-zinc-400" />
                                          <span>Facturar (Pendiente de Autorización)</span>
                                        </button>
                                        <p className="text-[9px] text-zinc-400 italic mt-0.5 max-w-[210px] text-right leading-tight">
                                          * Pedido por WhatsApp: Se requiere que el administrador autorice la facturación en el sistema.
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          })()}

                          {/* DOWNLOAD ACTIONS FOR ALL / INVOICED ORDERS */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-dashed border-zinc-200">
                            <button
                              type="button"
                              onClick={() => generateOrderPDF(ord, {
                                pdfLogoUrl: pdfConfig?.pdfLogoUrl || undefined,
                                pdfQrUrl: pdfConfig?.pdfQrUrl || undefined,
                                lang: lang
                              })}
                              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[11px] rounded-lg border border-zinc-200 flex items-center gap-1 transition-all"
                              title="Descargar nota/remisión de pedido"
                            >
                              <Download className="w-3.5 h-3.5 text-zinc-600" />
                              <span>Nota Pedido (PDF)</span>
                            </button>

                            {isAlreadyInvoiced && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => generateCFDIPDF(ord, { invoiceDetails: ord.invoiceDetails })}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg shadow-xs flex items-center gap-1 transition-all active:scale-95"
                                  title="Descargar representación impresa de factura fiscal CFDI 4.0 SAT"
                                >
                                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                                  <span>Descargar Factura (PDF) 📄</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => downloadCFDIXML(ord, ord.invoiceDetails)}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-lg shadow-xs flex items-center gap-1 transition-all active:scale-95"
                                  title="Descargar archivo XML CFDI 4.0 oficial SAT"
                                >
                                  <FileCode className="w-3.5 h-3.5 text-blue-200" />
                                  <span>Descargar XML (CFDI 4.0) 📦</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isAlreadyInvoiced && (
                          <p className="text-[10px] text-zinc-400 italic">
                            * Por seguridad fiscal SAT, este pedido ya fue timbrado y no se puede solicitar otra factura para el mismo folio.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING PRODUCT SEARCH BUBBLE (FIXED FLOATING ON SCREEN) */}
      {!isCartOpen && !isCheckoutModalOpen && (
        <div className="fixed top-[85px] left-4 z-40 animate-in fade-in zoom-in-95 duration-300 max-w-[calc(100vw-32px)] sm:max-w-md">
          <div className="flex items-center gap-2 bg-amber-300 text-zinc-950 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-2xl border-4 border-emerald-600 ring-4 ring-amber-400/50">
            <Search className="w-5 h-5 text-emerald-950 font-black flex-shrink-0" />

            <div className="relative flex-1 min-w-[130px] sm:min-w-[180px]">
              <input
                type="text"
                placeholder={t.searchPlaceholder || "Buscar productos..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-7 py-1 sm:py-1.5 bg-white/95 focus:bg-white text-zinc-950 text-xs sm:text-sm font-black rounded-full border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-zinc-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-700 cursor-pointer"
                  title="Limpiar búsqueda"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {searchQuery && (
              <span className="bg-emerald-700 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                {filteredProducts.length}
              </span>
            )}

            {onRefreshProducts && (
              <button
                type="button"
                onClick={() => onRefreshProducts()}
                className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-amber-300 rounded-full transition-all active:scale-95 cursor-pointer flex-shrink-0"
                title="Sincronizar y actualizar catálogo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* FLOATING CART TOTAL BUBBLE (YELLOW WITH GREEN CONTOUR, BLACK NUMBERS, DRAGGABLE WITH FINGER / MOUSE) */}
      {cartTotalItems > 0 && !isCartOpen && !isCheckoutModalOpen && (
        <div
          style={
            bubblePos
              ? { position: "fixed", left: `${bubblePos.x}px`, top: `${bubblePos.y}px`, zIndex: 50, touchAction: "none" }
              : { position: "fixed", top: "85px", right: "16px", zIndex: 50, touchAction: "none" }
          }
          className="touch-none select-none animate-in fade-in zoom-in-95 duration-300"
        >
          <div
            onPointerDown={handleBubblePointerDown}
            onPointerMove={handleBubblePointerMove}
            onPointerUp={handleBubblePointerUp}
            onClick={() => {
              if (!bubbleDragRef.current.moved) {
                setIsCartOpen(true);
              }
              bubbleDragRef.current.moved = false;
            }}
            className="group flex items-center gap-3 bg-amber-300 hover:bg-yellow-300 text-zinc-950 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border-4 border-emerald-600 ring-4 ring-amber-400/50 cursor-grab active:cursor-grabbing transition-shadow active:scale-95 touch-none select-none"
            title="Arrastra con el dedo a cualquier parte o toca para abrir tu carrito"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-zinc-950 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-3 -right-3 bg-emerald-700 text-white font-black text-[11px] px-1.5 py-0.5 rounded-full shadow-md border-2 border-amber-300 min-w-[22px] text-center">
                {cartTotalItems}
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] uppercase font-black tracking-wider text-emerald-950 leading-none flex items-center gap-1">
                <span>Mi Total</span>
                <Move className="w-3 h-3 text-emerald-800" />
              </span>
              <span className="text-base sm:text-lg font-black text-zinc-950 leading-tight">
                {formatPrice(cartTotalPrice, lang)}
              </span>
            </div>
            <div className="hidden sm:flex items-center pl-2 border-l border-emerald-800/40 text-xs font-black text-zinc-950 group-hover:translate-x-0.5 transition-transform">
              <span>Ver Carrito &rarr;</span>
            </div>
          </div>
        </div>
      )}

      {/* QUICK FACTURACIÓN POSTERIOR MODAL */}
      {selectedOrderToInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-zinc-200 relative">
            <button
              onClick={() => setSelectedOrderToInvoice(null)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-brand-green rounded-2xl flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-zinc-900">
                Facturar Pedido #{selectedOrderToInvoice.orderId}
              </h3>
              <p className="text-xs text-zinc-500">
                Monto Total a Facturar: <strong className="text-brand-green font-black">{formatPrice(selectedOrderToInvoice.total, lang)}</strong>
              </p>
            </div>

            <div className="space-y-3 text-xs mb-5">
              {/* SELECTOR DE PERFIL FISCAL DEL CLIENTE POST-COMPRA */}
              <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-300 space-y-2">
                <label className="block text-[11px] font-black text-emerald-950 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-brand-green" />
                  <span>Seleccionar Perfil Fiscal para Facturación:</span>
                </label>
                <select
                  value={
                    postInvoiceBilling.rfc === "XAXX010101000"
                      ? "publico_general"
                      : postInvoiceBilling.rfc === "XEXX010101000"
                      ? "extranjero"
                      : postInvoiceBilling.rfc
                      ? "my_saved_profile"
                      : "custom"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "my_saved_profile") {
                      try {
                        const saved = localStorage.getItem("fg_billing_info");
                        if (saved) {
                          const parsed = JSON.parse(saved);
                          setPostInvoiceBilling((prev) => ({ ...prev, ...parsed }));
                        }
                      } catch {}
                    } else if (val === "publico_general") {
                      setPostInvoiceBilling((prev) => ({
                        ...prev,
                        rfc: "XAXX010101000",
                        razonSocial: "PUBLICO EN GENERAL",
                        zipCode: prev.zipCode || "44100",
                        regimenFiscal: "616 - Sin obligaciones fiscales",
                        usoCFDI: "S01 - Sin efectos fiscales"
                      }));
                    } else if (val === "extranjero") {
                      setPostInvoiceBilling((prev) => ({
                        ...prev,
                        rfc: "XEXX010101000",
                        razonSocial: "CLIENTE EXTRANJERO",
                        zipCode: prev.zipCode || "44100",
                        regimenFiscal: "616 - Sin obligaciones fiscales",
                        usoCFDI: "S01 - Sin efectos fiscales"
                      }));
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-zinc-900 cursor-pointer shadow-2xs focus:ring-2 focus:ring-brand-green"
                >
                  {postInvoiceBilling.rfc && postInvoiceBilling.rfc !== "XAXX010101000" && postInvoiceBilling.rfc !== "XEXX010101000" && (
                    <option value="my_saved_profile">
                      👤 Usar Mi Registro Guardado ({postInvoiceBilling.rfc} - {postInvoiceBilling.razonSocial || "Perfil Fiscal"})
                    </option>
                  )}
                  <option value="custom">✏️ Llenar / Modificar Datos Fiscales Manualmente</option>
                  <option value="publico_general">📄 Factura a Público en General (RFC Genérico: XAXX010101000)</option>
                  <option value="extranjero">🌍 Ventas a Clientes del Extranjero (RFC Genérico: XEXX010101000)</option>
                </select>

                {postInvoiceBilling.rfc && postInvoiceBilling.rfc !== "XAXX010101000" && postInvoiceBilling.rfc !== "XEXX010101000" && (
                  <div className="p-2 bg-emerald-100/90 border border-emerald-300 rounded-lg text-[10px] font-bold text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                    <span>Datos fiscales cargados desde tu perfil registrado.</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-black text-zinc-700 mb-1">RFC del Cliente / Empresa *</label>
                <input
                  type="text"
                  value={postInvoiceBilling.rfc || ""}
                  onChange={(e) => setPostInvoiceBilling({ ...postInvoiceBilling, rfc: e.target.value.toUpperCase() })}
                  placeholder="Ej. TAP800101XYZ"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl font-mono font-bold text-zinc-900"
                />
              </div>

              <div>
                <label className="block font-black text-zinc-700 mb-1">Razón Social / Nombre Fiscal *</label>
                <input
                  type="text"
                  value={postInvoiceBilling.razonSocial || ""}
                  onChange={(e) => setPostInvoiceBilling({ ...postInvoiceBilling, razonSocial: e.target.value })}
                  placeholder="Ej. RESTAURANTE EL TAPATIO SA DE CV"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-zinc-700 mb-1">Código Postal Fiscal *</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={postInvoiceBilling.zipCode || ""}
                    onChange={(e) => setPostInvoiceBilling({ ...postInvoiceBilling, zipCode: e.target.value })}
                    placeholder="Ej. 44100"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl font-mono font-bold text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-black text-zinc-700 mb-1">Correo para XML/PDF *</label>
                  <input
                    type="email"
                    value={postInvoiceBilling.email || ""}
                    onChange={(e) => setPostInvoiceBilling({ ...postInvoiceBilling, email: e.target.value })}
                    placeholder="facturacion@restaurante.com"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-zinc-700 mb-1">Régimen Fiscal (SAT) *</label>
                <select
                  value={postInvoiceBilling.regimenFiscal || "601 - General de Ley Personas Morales"}
                  onChange={(e) => setPostInvoiceBilling({ ...postInvoiceBilling, regimenFiscal: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-zinc-900"
                >
                  <option value="601 - General de Ley Personas Morales">601 - General de Ley Personas Morales</option>
                  <option value="612 - Personas Físicas con Actividades Empresariales y Profesionales">612 - Personas Físicas con Actividades Empresariales</option>
                  <option value="626 - Régimen Simplificado de Confianza (RESICO)">626 - Régimen Simplificado de Confianza (RESICO)</option>
                  <option value="603 - Personas Morales con Fines no Lucrativos">603 - Personas Morales con Fines no Lucrativos</option>
                </select>
              </div>

              <div>
                <label className="block font-black text-zinc-700 mb-1">Uso de CFDI *</label>
                <select
                  value={postInvoiceBilling.usoCFDI || "G01 - Adquisición de mercancías"}
                  onChange={(e) => setPostInvoiceBilling({ ...postInvoiceBilling, usoCFDI: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-zinc-900"
                >
                  <option value="G01 - Adquisición de mercancías">G01 - Adquisición de mercancías</option>
                  <option value="G03 - Gastos en general">G03 - Gastos en general</option>
                  <option value="S01 - Sin efectos fiscales">S01 - Sin efectos fiscales</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleFacturarPedidoPosterior}
                disabled={isPostInvoicing}
                className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <FileText className="w-4 h-4 text-brand-yellow" />
                <span>{isPostInvoicing ? "Timbrando Factura CFDI 4.0..." : "Confirmar y Timbrar Factura CFDI 4.0"}</span>
              </button>

              <button
                onClick={() => setSelectedOrderToInvoice(null)}
                className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT PROFILE AUTHENTICATION / PASSWORD MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-emerald-100 relative text-center">
            <button
              type="button"
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthModalError(null);
                setLoginPasswordInput("");
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 bg-emerald-100 text-brand-green rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-zinc-900 mb-1">
              Acceso a tu Perfil Fiscal
            </h3>
            <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
              Para ingresar a tu perfil o solicitar factura con tus datos guardados ({registeredProfile?.rfc || "Cliente Registrado"}), por favor ingresa tu contraseña.
            </p>

            {authModalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold mb-3 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{authModalError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAuthenticateProfile(loginPasswordInput);
              }}
              className="space-y-3"
            >
              <div className="text-left">
                <label className="block text-[11px] font-black text-zinc-700 mb-1">
                  Contraseña de Perfil *
                </label>
                <input
                  type="password"
                  autoFocus
                  value={loginPasswordInput}
                  onChange={(e) => setLoginPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl font-bold text-zinc-900 text-sm focus:ring-2 focus:ring-brand-green focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-green hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-brand-yellow" />
                <span>Entrar a mi Perfil y Facturar 🚀</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setAuthModalError(null);
                  setLoginPasswordInput("");
                }}
                className="w-full py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
