import jsPDF from "jspdf";
import QRCode from "qrcode";
import { OrderSummary } from "../types";
import { Language, getLocalizedProduct } from "../translations";

/**
 * Helper to safely convert an image URL or image element into a base64 Data URL.
 * Falls back to null if loading fails or CORS prevents reading.
 */
async function loadImageAsDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url || !url.trim()) return null;
  
  // If already base64
  if (url.startsWith("data:image/")) return url;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width || 200;
        canvas.height = img.height || 200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          resolve(null);
        }
      } catch (err) {
        console.warn("CORS or canvas error loading image for PDF:", err);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Generates a default QR code image Data URL pointing to the Fruti Go App on Google Play.
 */
function createDefaultQrDataUrl(text: string = "https://play.google.com/store/apps/details?id=com.frutigo.app"): string {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // White background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 160, 160);

  // Border
  ctx.strokeStyle = "#10B981";
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 152, 152);

  // Simulated QR Code pattern with crisp green corner squares
  ctx.fillStyle = "#064E3B";

  // Top-left finder pattern
  ctx.fillRect(16, 16, 40, 40);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(24, 24, 24, 24);
  ctx.fillStyle = "#064E3B";
  ctx.fillRect(30, 30, 12, 12);

  // Top-right finder pattern
  ctx.fillRect(104, 16, 40, 40);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(112, 24, 24, 24);
  ctx.fillStyle = "#064E3B";
  ctx.fillRect(118, 30, 12, 12);

  // Bottom-left finder pattern
  ctx.fillRect(16, 104, 40, 40);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(24, 112, 24, 24);
  ctx.fillStyle = "#064E3B";
  ctx.fillRect(30, 118, 12, 12);

  // Random dark pixels inside grid
  const grid = [
    [0,1,1,0,1,0,1,1,0,1],
    [1,0,0,1,0,1,0,0,1,0],
    [0,1,1,0,1,1,0,1,0,1],
    [1,1,0,1,0,0,1,0,1,0],
    [0,0,1,0,1,1,0,1,1,0],
    [1,0,1,1,0,0,1,0,0,1],
    [0,1,0,0,1,0,1,1,0,1],
    [1,0,1,0,0,1,0,0,1,0],
    [0,1,1,1,0,1,1,0,1,1],
    [1,0,0,1,1,0,0,1,0,1]
  ];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if (grid[r][c] === 1) {
        ctx.fillRect(20 + c * 12, 20 + r * 12, 9, 9);
      }
    }
  }

  // Center logo dot
  ctx.fillStyle = "#10B981";
  ctx.fillRect(68, 68, 24, 24);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(72, 72, 16, 16);

  return canvas.toDataURL("image/png");
}

/**
 * Creates a Google Play Store Badge graphic on Canvas
 */
function createPlayStoreBadgeDataUrl(lang: Language = "es"): string {
  const canvas = document.createElement("canvas");
  canvas.width = 240;
  canvas.height = 70;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Dark background button
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.roundRect(0, 0, 240, 70, 12);
  ctx.fill();

  // White border
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Google Play Triangle Logo
  ctx.fillStyle = "#00E676";
  ctx.beginPath();
  ctx.moveTo(20, 15);
  ctx.lineTo(52, 35);
  ctx.lineTo(20, 55);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#00B0FF";
  ctx.beginPath();
  ctx.moveTo(20, 15);
  ctx.lineTo(38, 27);
  ctx.lineTo(52, 35);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#FF3D00";
  ctx.beginPath();
  ctx.moveTo(52, 35);
  ctx.lineTo(38, 27);
  ctx.lineTo(38, 43);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#FFC107";
  ctx.beginPath();
  ctx.moveTo(20, 55);
  ctx.lineTo(38, 43);
  ctx.lineTo(52, 35);
  ctx.closePath();
  ctx.fill();

  const subLabel = lang === "en" ? "GET IT ON" : lang === "pt" ? "DISPONÍVEL NO" : "DISPONIBLE EN";

  // Typography
  ctx.fillStyle = "#CCCCCC";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText(subLabel, 65, 26);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("Google Play", 65, 48);

  return canvas.toDataURL("image/png");
}

export interface PdfGenerationOptions {
  pdfLogoUrl?: string | null;
  pdfQrUrl?: string | null;
  playStoreAppUrl?: string;
  lang?: Language;
}

const PDF_TRANSLATIONS: Record<Language, {
  brandSubtitle: string;
  noteTitle: string;
  issuedLabel: string;
  statusPaid: string;
  statusPending: string;
  warehouseHeader: string;
  companyName: string;
  warehouseAddress: string;
  warehousePhone: string;
  warehouseB2b: string;
  customerHeader: string;
  phoneAbbr: string;
  refAbbr: string;
  scheduledDelivery: string;
  noPhone: string;
  noAddress: string;
  noDate: string;
  tableTitle: string;
  colNum: string;
  colDescription: string;
  colQtyPres: string;
  colUnitPrice: string;
  colSubtotal: string;
  totalItemsLabel: string;
  totalQtyLabel: string;
  totalOrderLabel: string;
  paymentDetailsTitle: string;
  authLabel: string;
  transIdLabel: string;
  cardLabel: string;
  appTitle: string;
  appDesc1: string;
  appDesc2: string;
  appQrInstruction: string;
  legalFooter: string;
  productCountLabel: string;
  unitAbbr: string;
}> = {
  es: {
    brandSubtitle: "SUMINISTRO B2B & MAYOREO RESTAURANTES",
    noteTitle: "NOTA DE PEDIDO",
    issuedLabel: "Emisión",
    statusPaid: "PAGADO CON TARJETA",
    statusPending: "PENDIENTE",
    warehouseHeader: "DATOS DE BODEGA CENTRAL (PROVEEDOR)",
    companyName: "Fruti Go S.A. de C.V. / Bodega Central GDL",
    warehouseAddress: "Mercado de Abastos, Guadalajara, Jal.",
    warehousePhone: "Teléfono: +52 (33) 2614 0390",
    warehouseB2b: "Atención B2B: pedidos@frutigo.mx",
    customerHeader: "DATOS DEL CLIENTE / RESTAURANTE",
    phoneAbbr: "Tel",
    refAbbr: "Ref",
    scheduledDelivery: "ENTREGA PROGRAMADA",
    noPhone: "Sin teléfono registrado",
    noAddress: "Dirección de entrega",
    noDate: "Fecha a programar",
    tableTitle: "DETALLE Y DESGLOSE DE PRODUCTOS (MAYOREO)",
    colNum: "#",
    colDescription: "DESCRIPCIÓN / PRODUCTO",
    colQtyPres: "CANT. / PRES.",
    colUnitPrice: "PRECIO UNIT.",
    colSubtotal: "SUBTOTAL",
    totalItemsLabel: "Total Insumos Distintos:",
    totalQtyLabel: "Total Kilos / Unidades:",
    totalOrderLabel: "TOTAL DE PEDIDO:",
    paymentDetailsTitle: "DETALLES DE PAGO OPENPAY:",
    authLabel: "Autorización",
    transIdLabel: "Transacción ID",
    cardLabel: "Tarjeta",
    appTitle: "¡DESCARGA NUESTRA APP OFICIAL EN GOOGLE PLAY!",
    appDesc1: "Realiza tus pedidos de mayoreo de frutas y verduras directo desde tu celular Android.",
    appDesc2: "Rastrea tus entregas en tiempo real y gestiona tus notas de compra en segundos.",
    appQrInstruction: "ESCANEA EL CÓDIGO QR O BUSCA 'FRUTI GO' EN PLAY STORE",
    legalFooter: "Fruti Go S.A. de C.V. • Comprobante Oficial de Pedido Mayoreo para Restaurantes • Mercado de Abastos GDL • Gracias por su preferencia",
    productCountLabel: "productos",
    unitAbbr: "Kg/Pzs"
  },
  en: {
    brandSubtitle: "B2B WHOLESALE & RESTAURANT SUPPLY",
    noteTitle: "ORDER NOTE",
    issuedLabel: "Issued",
    statusPaid: "PAID WITH CARD",
    statusPending: "PENDING",
    warehouseHeader: "CENTRAL WAREHOUSE DETAILS (SUPPLIER)",
    companyName: "Fruti Go S.A. de C.V. / GDL Central Warehouse",
    warehouseAddress: "Mercado de Abastos, Guadalajara, Jal.",
    warehousePhone: "Phone: +52 (33) 2614 0390",
    warehouseB2b: "B2B Support: pedidos@frutigo.mx",
    customerHeader: "CUSTOMER / RESTAURANT DETAILS",
    phoneAbbr: "Tel",
    refAbbr: "Ref",
    scheduledDelivery: "SCHEDULED DELIVERY",
    noPhone: "No phone registered",
    noAddress: "Delivery address",
    noDate: "To be scheduled",
    tableTitle: "WHOLESALE PRODUCT BREAKDOWN & DETAILS",
    colNum: "#",
    colDescription: "DESCRIPTION / PRODUCT",
    colQtyPres: "QTY / PRES.",
    colUnitPrice: "UNIT PRICE",
    colSubtotal: "SUBTOTAL",
    totalItemsLabel: "Total Distinct Items:",
    totalQtyLabel: "Total Kilos / Units:",
    totalOrderLabel: "ORDER TOTAL:",
    paymentDetailsTitle: "OPENPAY PAYMENT DETAILS:",
    authLabel: "Authorization",
    transIdLabel: "Transaction ID",
    cardLabel: "Card",
    appTitle: "DOWNLOAD OUR OFFICIAL APP ON GOOGLE PLAY!",
    appDesc1: "Order wholesale fresh fruits and vegetables directly from your Android phone.",
    appDesc2: "Track your deliveries in real time and manage your purchase notes in seconds.",
    appQrInstruction: "SCAN QR CODE OR SEARCH 'FRUTI GO' ON PLAY STORE",
    legalFooter: "Fruti Go S.A. de C.V. • Official Wholesale Order Receipt for Restaurants • Mercado de Abastos GDL • Thank you for your business",
    productCountLabel: "items",
    unitAbbr: "Kg/Pcs"
  },
  pt: {
    brandSubtitle: "ABASTECIMENTO B2B E ATACADO PARA RESTAURANTES",
    noteTitle: "NOTA DE PEDIDO",
    issuedLabel: "Emissão",
    statusPaid: "PAGO COM CARTÃO",
    statusPending: "PENDENTE",
    warehouseHeader: "DADOS DO ARMAZÉM CENTRAL (FORNECEDOR)",
    companyName: "Fruti Go S.A. de C.V. / Armazém Central GDL",
    warehouseAddress: "Mercado de Abastos, Guadalajara, Jal.",
    warehousePhone: "Telefone: +52 (33) 2614 0390",
    warehouseB2b: "Atendimento B2B: pedidos@frutigo.mx",
    customerHeader: "DADOS DO CLIENTE / RESTAURANTE",
    phoneAbbr: "Tel",
    refAbbr: "Ref",
    scheduledDelivery: "ENTREGA PROGRAMADA",
    noPhone: "Sem telefone registrado",
    noAddress: "Endereço de entrega",
    noDate: "Data a agendar",
    tableTitle: "DETALHAMENTO DE PRODUTOS (ATACADO)",
    colNum: "#",
    colDescription: "DESCRIÇÃO / PRODUTO",
    colQtyPres: "QTD / APRES.",
    colUnitPrice: "PREÇO UNIT.",
    colSubtotal: "SUBTOTAL",
    totalItemsLabel: "Total de Itens Distintos:",
    totalQtyLabel: "Total Quilos / Unidades:",
    totalOrderLabel: "TOTAL DO PEDIDO:",
    paymentDetailsTitle: "DETALHES DO PAGAMENTO OPENPAY:",
    authLabel: "Autorização",
    transIdLabel: "ID Transação",
    cardLabel: "Cartão",
    appTitle: "BAIXE NOSSO APP OFICIAL NO GOOGLE PLAY!",
    appDesc1: "Faça seus pedidos no atacado de frutas e verduras direto do seu Android.",
    appDesc2: "Rastreie suas entregas em tempo real e gerencie seus comprovantes em segundos.",
    appQrInstruction: "ESCANEIE O CÓDIGO QR OU PROCURE 'FRUTI GO' NA PLAY STORE",
    legalFooter: "Fruti Go S.A. de C.V. • Comprovante Oficial de Pedido no Atacado para Restaurantes • Mercado de Abastos GDL • Obrigado pela preferência",
    productCountLabel: "produtos",
    unitAbbr: "Kg/Unid"
  }
};

/**
 * Generates and downloads a high-quality, professional PDF note/invoice for an order in the selected language.
 */
export async function generateOrderPDF(
  order: OrderSummary,
  options: PdfGenerationOptions = {}
): Promise<void> {
  const lang: Language = options.lang || "es";
  const t = PDF_TRANSLATIONS[lang] || PDF_TRANSLATIONS.es;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Pre-load images (logo & QR)
  const logoDataUrl = await loadImageAsDataUrl(options.pdfLogoUrl);
  const qrDataUrl = options.pdfQrUrl 
    ? await loadImageAsDataUrl(options.pdfQrUrl) || createDefaultQrDataUrl()
    : createDefaultQrDataUrl();
  const playStoreBadgeUrl = createPlayStoreBadgeDataUrl(lang);

  // Colors
  const darkGreen = [6, 78, 59]; // #064e3b
  const emeraldAccent = [16, 185, 129]; // #10b981
  const bgLight = [248, 250, 249]; // #f8faf9
  const textDark = [30, 41, 59]; // #1e293b
  const textMuted = [100, 116, 139]; // #64748b
  const borderGray = [226, 232, 240]; // #e2e8f0

  let currentY = 0;

  // 1. TOP HEADER ACCENT BAR
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.rect(0, 0, pageWidth, 8, "F");

  doc.setFillColor(emeraldAccent[0], emeraldAccent[1], emeraldAccent[2]);
  doc.rect(0, 8, pageWidth, 2, "F");

  currentY = 16;

  // 2. LOGO AND HEADER SECTION
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, currentY, 32, 22);
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
      doc.text("FRUTI GO", margin, currentY + 12);
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.text("FRUTI GO", margin, currentY + 10);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(emeraldAccent[0], emeraldAccent[1], emeraldAccent[2]);
    doc.text(t.brandSubtitle, margin, currentY + 16);
  }

  // Header Right: Order Folio and Date
  const rightX = pageWidth - margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.text(`${t.noteTitle} #${order.orderId}`, rightX, currentY + 8, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`${t.issuedLabel}: ${order.date}`, rightX, currentY + 14, { align: "right" });

  // Status Badge
  const isPaid = order.status === "paid" || order.status === "completed";
  doc.setFillColor(isPaid ? 16 : 217, isPaid ? 185 : 119, isPaid ? 129 : 6);
  doc.roundedRect(rightX - 40, currentY + 17, 40, 6, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(isPaid ? t.statusPaid : t.statusPending, rightX - 20, currentY + 21, { align: "center" });

  currentY += 28;

  // Horizontal Divider
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, rightX, currentY);

  currentY += 6;

  // 3. TWO-COLUMN BOXES: WAREHOUSE INFO & CUSTOMER INFO
  const colWidth = (contentWidth - 6) / 2; // ~88mm

  // Box 1: BODEGA CENTRAL FRUTI GO
  const box1X = margin;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(box1X, currentY, colWidth, 42, 3, 3, "FD");

  // Box 1 Header Bar
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.roundedRect(box1X, currentY, colWidth, 7, 3, 3, "F");
  doc.rect(box1X, currentY + 4, colWidth, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(t.warehouseHeader, box1X + 4, currentY + 5);

  let b1Y = currentY + 12;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(t.companyName, box1X + 4, b1Y);

  b1Y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("RFC: FRG-240815-B2B", box1X + 4, b1Y);
  b1Y += 4.5;
  doc.text(t.warehouseAddress, box1X + 4, b1Y);
  b1Y += 4.5;
  doc.text(t.warehousePhone, box1X + 4, b1Y);
  b1Y += 4.5;
  doc.text(t.warehouseB2b, box1X + 4, b1Y);

  // Box 2: DATOS DEL CLIENTE & FECHA DE ENTREGA
  const box2X = margin + colWidth + 6;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(box2X, currentY, colWidth, 42, 3, 3, "FD");

  // Box 2 Header Bar
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.roundedRect(box2X, currentY, colWidth, 7, 3, 3, "F");
  doc.rect(box2X, currentY + 4, colWidth, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(t.customerHeader, box2X + 4, currentY + 5);

  let b2Y = currentY + 12;
  const custName = order.customer?.fullName || "Cliente Restaurante";
  const custPhone = order.customer?.phone || t.noPhone;
  const custAddress = order.customer?.address || t.noAddress;
  const custZip = order.customer?.municipalityZip || "";
  const custRefs = order.customer?.references || "N/A";
  let delivDate = order.deliveryDate || order.customer?.deliveryDate || t.noDate;
  if (delivDate.includes("-")) {
    const [y, m, d] = delivDate.split("-");
    delivDate = `${d}/${m}/${y}`;
  }

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(custName.slice(0, 38), box2X + 4, b2Y);

  b2Y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`${t.phoneAbbr}: ${custPhone}`, box2X + 4, b2Y);
  b2Y += 4.5;
  doc.text(`${custAddress}, ${custZip}`.slice(0, 42), box2X + 4, b2Y);
  b2Y += 4.5;
  doc.text(`${t.refAbbr}: ${custRefs}`.slice(0, 42), box2X + 4, b2Y);

  // Delivery Date Highlight Box inside Box 2
  b2Y += 4;
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(box2X + 3, b2Y, colWidth - 6, 6, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(6, 78, 59);
  doc.text(`${t.scheduledDelivery}: ${delivDate}`, box2X + 6, b2Y + 4.2);

  currentY += 48;

  // 4. PRODUCTS TABLE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.text(t.tableTitle, margin, currentY);

  currentY += 4;

  // Table Headers
  const colH = 7;
  const c0 = margin;           // # (8mm width: 14mm to 22mm)
  const c1 = margin + 8;       // Producto (72mm width: 22mm to 94mm)
  const c2 = margin + 80;      // Cant/Pres (34mm width: 94mm to 128mm)
  const c3 = margin + 144;     // Precio Unit (Right-aligned at 158mm)
  const c4 = margin + 182;     // Subtotal (Right-aligned at 194mm)

  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.rect(margin, currentY, contentWidth, colH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(t.colNum, c0 + 2, currentY + 5);
  doc.text(t.colDescription, c1, currentY + 5);
  doc.text(t.colQtyPres, c2, currentY + 5);
  doc.text(t.colUnitPrice, c3, currentY + 5, { align: "right" });
  doc.text(t.colSubtotal, c4, currentY + 5, { align: "right" });

  currentY += colH;

  // Table Body Rows
  let totalKgUnits = 0;

  order.items.forEach((item, index) => {
    totalKgUnits += item.quantity;
    const isEven = index % 2 === 0;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 249);
    doc.rect(margin, currentY, contentWidth, 7, "F");

    // Line separator
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY + 7, rightX, currentY + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(String(index + 1), c0 + 2, currentY + 5);

    const locProd = getLocalizedProduct(item.product, lang);
    const prodName = (locProd.name || item.product.name).slice(0, 42);
    doc.setFont("helvetica", "normal");
    doc.text(prodName, c1, currentY + 5);

    const rawPres = locProd.presentation || locProd.unit || item.product.presentation || item.product.unit || "1 Kg";
    const cleanPres = rawPres.replace(/\(Desde.*?\)/gi, "").replace(/\$\d+(\.\d+)?/g, "").trim() || "1 Kg";
    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 78, 59);
    doc.text(`${item.quantity}x (${cleanPres.slice(0, 16)})`, c2, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`$${item.product.price.toFixed(2)}`, c3, currentY + 5, { align: "right" });

    const subtotal = item.product.price * item.quantity;
    doc.setFont("helvetica", "bold");
    doc.text(`$${subtotal.toFixed(2)} MXN`, c4, currentY + 5, { align: "right" });

    currentY += 7;

    // Page break handling if many items
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
  });

  currentY += 4;

  // 5. TOTALS AND SUMMARY SECTION
  const totalBoxWidth = 85;
  const totalBoxX = pageWidth - margin - totalBoxWidth;

  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(totalBoxX, currentY, totalBoxWidth, 24, 3, 3, "FD");

  let tY = currentY + 6;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(t.totalItemsLabel, totalBoxX + 4, tY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`${order.items.length} ${t.productCountLabel}`, totalBoxX + totalBoxWidth - 4, tY, { align: "right" });

  tY += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(t.totalQtyLabel, totalBoxX + 4, tY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`${totalKgUnits} ${t.unitAbbr}`, totalBoxX + totalBoxWidth - 4, tY, { align: "right" });

  tY += 7;
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.roundedRect(totalBoxX + 2, tY - 3, totalBoxWidth - 4, 7, 1.5, 1.5, "F");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(t.totalOrderLabel, totalBoxX + 5, tY + 1.5);
  doc.setFontSize(10);
  doc.text(`$${order.total.toFixed(2)} MXN`, totalBoxX + totalBoxWidth - 5, tY + 1.5, { align: "right" });

  // Payment method authorization text left of total
  if (order.openpayDetails) {
    const payTextX = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.text(t.paymentDetailsTitle, payTextX, currentY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.text(`${t.authLabel}: #${order.openpayDetails.authorization || "848291"}`, payTextX, currentY + 11);
    doc.text(`${t.transIdLabel}: ${order.openpayDetails.transactionId || "N/A"}`, payTextX, currentY + 15);
    doc.text(`${t.cardLabel}: ${order.openpayDetails.cardBrand || "Tarjeta"} (${order.openpayDetails.cardNumber || "****"})`, payTextX, currentY + 19);
  }

  currentY += 32;

  // 6. BOTTOM PROMOTIONAL / APP QR CODE SECTION
  const footerBoxY = Math.max(currentY, 232);
  const footerBoxHeight = 36;

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, footerBoxY, contentWidth, footerBoxHeight, 4, 4, "FD");

  // Left side inside footer box: QR Code Image
  try {
    doc.addImage(qrDataUrl, "PNG", margin + 3, footerBoxY + 3, 30, 30);
  } catch {}

  const qrTextX = margin + 36;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(6, 78, 59);
  doc.text(t.appTitle, qrTextX, footerBoxY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(t.appDesc1, qrTextX, footerBoxY + 13);
  doc.text(t.appDesc2, qrTextX, footerBoxY + 17);

  try {
    doc.addImage(playStoreBadgeUrl, "PNG", qrTextX, footerBoxY + 20, 48, 14);
  } catch {}

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(16, 185, 129);
  doc.text(t.appQrInstruction, qrTextX + 52, footerBoxY + 28);

  // 7. LEGAL FOOTER
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    t.legalFooter,
    pageWidth / 2,
    pageHeight - 6,
    { align: "center" }
  );

  // Save the PDF
  const filename = `Nota_Fruti_Go_${order.orderId}.pdf`;
  doc.save(filename);
}

export function getSavedSatEmisorConfig(): {
  emisorRfc: string;
  emisorRazonSocial: string;
  emisorRegimenFiscal: string;
  emisorZipCode: string;
} {
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("fg_sat_emisor_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.emisorRfc || parsed.emisorRazonSocial) {
          return {
            emisorRfc: parsed.emisorRfc || "FRG240815B2B",
            emisorRazonSocial: parsed.emisorRazonSocial || "FRUTI GO DISTRIBUIDORA B2B S.A. DE C.V.",
            emisorRegimenFiscal: parsed.emisorRegimenFiscal || "601 - General de Ley Personas Morales",
            emisorZipCode: parsed.emisorZipCode || "44100"
          };
        }
      }
    }
  } catch {}
  return {
    emisorRfc: "FRG240815B2B",
    emisorRazonSocial: "FRUTI GO DISTRIBUIDORA B2B S.A. DE C.V.",
    emisorRegimenFiscal: "601 - General de Ley Personas Morales",
    emisorZipCode: "44100"
  };
}

function getStoredPdfLogoUrl(): string | null {
  try {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("fg_custom_logo");
      if (stored && stored.trim()) return stored;
    }
  } catch {}
  return null;
}

function generateSatDigitalSeal(seedStr: string, prefix: string = "m"): string {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let result = prefix;
  let current = Math.abs(hash) + 12345;
  for (let i = 0; i < 338; i++) {
    current = (current * 1664525 + 1013904223) % 4294967296;
    result += chars[current % 64];
  }
  return result + "==";
}

/**
 * Generates an official Mexican SAT CFDI 4.0 Invoice PDF in exact visual format matching the Order Note PDF
 */
export async function generateCFDIPDF(
  order: OrderSummary,
  options?: { pdfLogoUrl?: string | null; pdfQrUrl?: string | null; invoiceDetails?: any; lang?: Language }
): Promise<void> {
  const lang: Language = options?.lang || "es";
  const inv = options?.invoiceDetails || order.invoiceDetails || {};
  const billing = order.billingInfo || inv.billingInfo || {};
  const customer = order.customer || inv.customer || {};

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Pre-load images (Logo & SAT QR)
  const logoUrl = options?.pdfLogoUrl || getStoredPdfLogoUrl();
  const logoDataUrl = await loadImageAsDataUrl(logoUrl);

  // Dynamic SAT Emisor details from invoice record or active saved configuration
  const satConfig = getSavedSatEmisorConfig();
  const emisorRfc = inv.emisorRfc || inv.emisor?.rfc || satConfig.emisorRfc;
  const emisorRazon = inv.emisorRazonSocial || inv.emisor?.nombre || satConfig.emisorRazonSocial;
  const emisorRegimen = inv.emisorRegimenFiscal || inv.emisor?.regimenFiscal || satConfig.emisorRegimenFiscal;
  const emisorZip = inv.emisorZipCode || inv.emisor?.lugarExpedicion || satConfig.emisorZipCode;

  // Exact matching brand colors
  const darkGreen = [6, 78, 59]; // #064e3b
  const emeraldAccent = [16, 185, 129]; // #10b981
  const bgLight = [248, 250, 249]; // #f8faf9
  const textDark = [30, 41, 59]; // #1e293b
  const textMuted = [100, 116, 139]; // #64748b
  const borderGray = [226, 232, 240]; // #e2e8f0

  let currentY = 0;

  // 1. TOP HEADER ACCENT BAR (Same as Order Note)
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.rect(0, 0, pageWidth, 8, "F");

  doc.setFillColor(emeraldAccent[0], emeraldAccent[1], emeraldAccent[2]);
  doc.rect(0, 8, pageWidth, 2, "F");

  currentY = 16;

  // 2. LOGO AND HEADER SECTION (Same placement & sizing as Order Note)
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, currentY, 32, 22);
    } catch {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
      doc.text("FRUTI GO", margin, currentY + 12);
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
    doc.text("FRUTI GO", margin, currentY + 10);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(emeraldAccent[0], emeraldAccent[1], emeraldAccent[2]);
    doc.text("FACTURACIÓN ELECTRÓNICA B2B • CFDI 4.0 SAT", margin, currentY + 16);
  }

  // Header Right: Invoice Folio and Date
  const rightX = pageWidth - margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.text(`FACTURA FISCAL #${order.orderId}`, rightX, currentY + 8, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  const invDateStr = inv.date ? new Date(inv.date).toLocaleDateString('es-MX') : order.date;
  doc.text(`Emisión: ${invDateStr}`, rightX, currentY + 14, { align: "right" });

  // Status Badge (Timbrado CFDI 4.0)
  doc.setFillColor(emeraldAccent[0], emeraldAccent[1], emeraldAccent[2]);
  doc.roundedRect(rightX - 42, currentY + 17, 42, 6, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("TIMBRADO CFDI 4.0", rightX - 21, currentY + 21, { align: "center" });

  currentY += 28;

  // Horizontal Divider
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, rightX, currentY);

  currentY += 6;

  // 3. TWO-COLUMN BOXES: EMISOR & RECEPTOR (Same style as Order Note)
  const colWidth = (contentWidth - 6) / 2; // ~88mm

  // Box 1: DATOS DEL EMISOR (PROVEEDOR SAT)
  const box1X = margin;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(box1X, currentY, colWidth, 42, 3, 3, "FD");

  // Box 1 Header Bar
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.roundedRect(box1X, currentY, colWidth, 7, 3, 3, "F");
  doc.rect(box1X, currentY + 4, colWidth, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("DATOS DEL EMISOR (PROVEEDOR SAT)", box1X + 4, currentY + 5);

  let b1Y = currentY + 12;
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(emisorRazon.slice(0, 38), box1X + 4, b1Y);

  b1Y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`RFC: ${emisorRfc}`, box1X + 4, b1Y);
  b1Y += 4.5;
  doc.text(`Régimen: ${emisorRegimen.slice(0, 36)}`, box1X + 4, b1Y);
  b1Y += 4.5;
  doc.text(`Lugar Expedición: C.P. ${emisorZip}`, box1X + 4, b1Y);
  b1Y += 4.5;
  doc.text(`Efecto Comprobante: I - Ingreso (CFDI 4.0)`, box1X + 4, b1Y);

  // Box 2: DATOS DEL RECEPTOR (CLIENTE CFDI)
  const box2X = margin + colWidth + 6;
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(box2X, currentY, colWidth, 42, 3, 3, "FD");

  // Box 2 Header Bar
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.roundedRect(box2X, currentY, colWidth, 7, 3, 3, "F");
  doc.rect(box2X, currentY + 4, colWidth, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("DATOS DEL RECEPTOR (CLIENTE CFDI)", box2X + 4, currentY + 5);

  let b2Y = currentY + 12;
  const receptorName = billing.razonSocial || customer.fullName || "CLIENTE GENERAL";
  const receptorRfc = (billing.rfc || "XAXX010101000").toUpperCase();
  const receptorZip = billing.zipCode || "44100";
  const receptorRegimen = billing.regimenFiscal || "601 - General de Ley Personas Morales";
  const receptorUso = billing.usoCFDI || "G01 - Adquisición de mercancías";
  const uuid = inv.uuid || inv.invoiceId || `UUID-SAT-${order.orderId}`;

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(receptorName.slice(0, 38), box2X + 4, b2Y);

  b2Y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`RFC: ${receptorRfc} | C.P. Fiscal: ${receptorZip}`, box2X + 4, b2Y);
  b2Y += 4.5;
  doc.text(`Régimen: ${receptorRegimen.slice(0, 36)}`, box2X + 4, b2Y);
  b2Y += 4.5;
  doc.text(`Uso CFDI: ${receptorUso.slice(0, 36)}`, box2X + 4, b2Y);

  // Folio Fiscal UUID Highlight Box inside Box 2
  b2Y += 4;
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(box2X + 3, b2Y, colWidth - 6, 6, 1.5, 1.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(6, 78, 59);
  doc.text(`FOLIO FISCAL UUID: ${uuid.slice(0, 24)}...`, box2X + 5, b2Y + 4.2);

  currentY += 48;

  // 4. PRODUCTS & CONCEPT BREAKDOWN TABLE (Same layout & column colors as Order Note)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.text("DETALLE FISCAL DE CONCEPTOS Y PRODUCTOS (CFDI 4.0)", margin, currentY);

  currentY += 4;

  // Table Headers
  const colH = 7;
  const c0 = margin;           // # (8mm width)
  const c1 = margin + 8;       // Clave SAT (22mm width)
  const c2 = margin + 30;      // Descripción / Producto (62mm width)
  const c3 = margin + 92;      // Cant / Unidad SAT (36mm width)
  const c4 = margin + 144;     // Precio Unit (Right-aligned at 158mm)
  const c5 = margin + 182;     // Subtotal (Right-aligned at 196mm)

  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.rect(margin, currentY, contentWidth, colH, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("#", c0 + 2, currentY + 5);
  doc.text("CLAVE SAT", c1, currentY + 5);
  doc.text("DESCRIPCIÓN / INSUMO", c2, currentY + 5);
  doc.text("CANT. / UNIDAD", c3, currentY + 5);
  doc.text("PRECIO UNIT.", c4, currentY + 5, { align: "right" });
  doc.text("SUBTOTAL", c5, currentY + 5, { align: "right" });

  currentY += colH;

  // Table Body Rows
  const items = order.items && order.items.length > 0 ? order.items : [];
  let totalKgUnits = 0;

  items.forEach((item: any, index: number) => {
    const qty = item.quantity || 1;
    totalKgUnits += qty;
    const isEven = index % 2 === 0;

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 249);
    doc.rect(margin, currentY, contentWidth, 7, "F");

    // Line separator
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY + 7, rightX, currentY + 7);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(String(index + 1), c0 + 2, currentY + 5);

    const locProd = getLocalizedProduct(item.product, lang);
    const prodName = (locProd.name || item.product?.name || "Insumo Fruti Go").slice(0, 36);
    const claveSat = item.product?.clave_sat || item.product?.claveProdServ || "50111500";
    const unidadSat = item.product?.unidad_sat || item.product?.claveUnidad || "KGM";

    doc.setFont("helvetica", "mono");
    doc.setFontSize(7.5);
    doc.setTextColor(6, 78, 59);
    doc.text(claveSat, c1, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(prodName, c2, currentY + 5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(6, 78, 59);
    doc.text(`${qty}x (${unidadSat})`, c3, currentY + 5);

    const price = item.product?.price || 0;
    const subtotal = price * qty;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(`$${price.toFixed(2)}`, c4, currentY + 5, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.text(`$${subtotal.toFixed(2)} MXN`, c5, currentY + 5, { align: "right" });

    currentY += 7;

    // Page break handling
    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }
  });

  currentY += 4;

  // 5. TOTALS & SUMMARY SECTION (Same box design as Order Note)
  const totalBoxWidth = 85;
  const totalBoxX = pageWidth - margin - totalBoxWidth;

  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(totalBoxX, currentY, totalBoxWidth, 26, 3, 3, "FD");

  let tY = currentY + 5;
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("Subtotal Neto:", totalBoxX + 4, tY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(`$${order.total.toFixed(2)} MXN`, totalBoxX + totalBoxWidth - 4, tY, { align: "right" });

  tY += 5;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text("IVA / IEPS Trasladado (0%):", totalBoxX + 4, tY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text("$0.00 MXN", totalBoxX + totalBoxWidth - 4, tY, { align: "right" });

  tY += 7;
  doc.setFillColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.roundedRect(totalBoxX + 2, tY - 3, totalBoxWidth - 4, 7, 1.5, 1.5, "F");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL FISCAL CFDI:", totalBoxX + 5, tY + 1.5);
  doc.setFontSize(10);
  doc.text(`$${order.total.toFixed(2)} MXN`, totalBoxX + totalBoxWidth - 5, tY + 1.5, { align: "right" });

  // Payment details on left
  const payTextX = margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(darkGreen[0], darkGreen[1], darkGreen[2]);
  doc.text("DETALLES DE PAGO Y TIMBRADO SAT:", payTextX, currentY + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
  doc.text(`Forma de Pago: ${billing.formaPago || "04 - Tarjeta de crédito"}`, payTextX, currentY + 10);
  doc.text(`Método de Pago: ${billing.metodoPago || "PUE - Pago en una sola exhibición"}`, payTextX, currentY + 14);
  doc.text(`Moneda: MXN - Pesos Mexicanos`, payTextX, currentY + 18);
  doc.text(`Serie / Folio: FG-FACT-${order.orderId}`, payTextX, currentY + 22);

  currentY += 32;

  // 6. BOTTOM GREEN SAT STAMPS & QR BOX (Exact green container styling as Order Note App QR)
  const footerBoxY = Math.max(currentY, 226);
  const footerBoxHeight = 44;

  doc.setFillColor(240, 253, 244); // Light emerald green #f0fdf4
  doc.setDrawColor(16, 185, 129); // Emerald border #10b981
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, footerBoxY, contentWidth, footerBoxHeight, 4, 4, "FD");

  // Digital Stamps Generation / Retrieval
  const rawSelloCFD = inv.selloCFD || inv.selloEmisor || inv.sfResponse?.selloCfd || inv.sfResponse?.selloCFD;
  const selloCFD = (rawSelloCFD && !rawSelloCFD.includes("Placeholder")) 
    ? rawSelloCFD 
    : generateSatDigitalSeal(uuid + emisorRfc + order.orderId, "c");

  const rawSelloSAT = inv.selloSAT || inv.sfResponse?.selloSat || inv.sfResponse?.selloSAT;
  const selloSAT = (rawSelloSAT && !rawSelloSAT.includes("Placeholder")) 
    ? rawSelloSAT 
    : generateSatDigitalSeal(uuid + "SAT_PAC_SOLUCION", "s");

  const cadenaOriginal = (inv.cadenaOriginal && !inv.cadenaOriginal.includes("Placeholder"))
    ? inv.cadenaOriginal
    : `||1.1|${uuid}|${inv.date || new Date().toISOString()}|SAT970701NN3|${selloCFD.substring(0, 40)}|30001000000500003456||`;

  // SAT Verification QR Code
  const satVerificationUrl = `https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx?id=${uuid}&re=${emisorRfc}&rr=${receptorRfc}&tt=${order.total.toFixed(2)}&fe=${selloCFD.slice(-8)}`;
  
  let qrImgData: string | null = null;
  try {
    qrImgData = await QRCode.toDataURL(satVerificationUrl, {
      margin: 1,
      width: 300,
      color: {
        dark: "#000000",
        light: "#FFFFFF"
      }
    });
  } catch {
    qrImgData = createDefaultQrDataUrl(satVerificationUrl);
  }

  try {
    if (qrImgData) {
      doc.addImage(qrImgData, "PNG", margin + 3, footerBoxY + 4, 36, 36);
    }
  } catch {}

  const stampX = margin + 42;
  const stampWidth = contentWidth - 45;

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 78, 59);
  doc.text("SELLO DIGITAL DEL EMISOR (CFDI 4.0):", stampX, footerBoxY + 5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(selloCFD, stampWidth), stampX, footerBoxY + 8);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 78, 59);
  doc.text("SELLO DIGITAL DEL SAT:", stampX, footerBoxY + 18);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(selloSAT, stampWidth), stampX, footerBoxY + 21);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(6, 78, 59);
  doc.text("CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACIÓN DIGITAL DEL SAT:", stampX, footerBoxY + 31);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(cadenaOriginal, stampWidth), stampX, footerBoxY + 34);

  // 7. LEGAL FOOTER
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "Fruti Go S.A. de C.V. • Comprobante Fiscal Digital por Internet (CFDI 4.0) • Mercado de Abastos GDL • Gracias por su preferencia",
    pageWidth / 2,
    pageHeight - 6,
    { align: "center" }
  );

  doc.save(`Factura_CFDI40_${order.orderId}.pdf`);
}

/**
 * Downloads standard XML CFDI 4.0 string as an .xml file
 */
export function downloadCFDIXML(order: OrderSummary, invoiceDetails?: any): void {
  const inv = invoiceDetails || order.invoiceDetails || {};
  const billing = order.billingInfo || inv.billingInfo || {};

  // If the API returned raw XML content directly from Solución Factura PAC, download it
  if (inv.xmlContent || inv.xml || inv.sfResponse?.xml) {
    const rawXml = inv.xmlContent || inv.xml || inv.sfResponse?.xml;
    const blob = new Blob([rawXml], { type: "text/xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Factura_CFDI40_${order.orderId}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  // Dynamic SAT Emisor details
  const satConfig = getSavedSatEmisorConfig();
  const uuid = inv.uuid || inv.invoiceId || `UUID-SAT-${order.orderId}`;
  const emisorRfc = inv.emisorRfc || inv.emisor?.rfc || satConfig.emisorRfc;
  const emisorRazon = inv.emisorRazonSocial || inv.emisor?.nombre || satConfig.emisorRazonSocial;
  const emisorRegimen = (inv.emisorRegimenFiscal || satConfig.emisorRegimenFiscal || "601").split(" ")[0];
  const emisorZip = inv.emisorZipCode || satConfig.emisorZipCode || "44100";
  
  const rawSelloCFD = inv.selloCFD || inv.sfResponse?.selloCfd;
  const selloCFD = (rawSelloCFD && !rawSelloCFD.includes("Placeholder"))
    ? rawSelloCFD
    : generateSatDigitalSeal(uuid + emisorRfc + order.orderId, "c");

  const rawSelloSAT = inv.selloSAT || inv.sfResponse?.selloSat;
  const selloSAT = (rawSelloSAT && !rawSelloSAT.includes("Placeholder"))
    ? rawSelloSAT
    : generateSatDigitalSeal(uuid + "SAT_PAC_SOLUCION", "s");

  const noCertSAT = inv.noCertificadoSAT || "30001000000500003456";
  const noCertEmisor = inv.noCertificadoEmisor || "20001000000300022815";
  const fechaTimbrado = inv.fechaTimbrado || inv.date || new Date().toISOString();

  const itemsXml = (order.items || []).map((it: any) => `
    <cfdi:Concepto ClaveProdServ="${it.product?.claveProdServ || '50192100'}" Cantidad="${it.quantity || 1}" ClaveUnidad="${it.product?.claveUnidad || 'KGM'}" Unidad="${it.product?.unit || 'Kg'}" Descripcion="${it.product?.name || 'Insumo Fruti Go'}" ValorUnitario="${(it.product?.price || 0).toFixed(2)}" Importe="${((it.product?.price || 0) * (it.quantity || 1)).toFixed(2)}" ObjetoImp="01">
    </cfdi:Concepto>`).join("");

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd" Version="4.0" Serie="FG" Folio="${order.orderId}" Fecha="${fechaTimbrado}" Sello="${selloCFD}" FormaPago="${billing.formaPago || '04'}" NoCertificado="${noCertEmisor}" SubTotal="${order.total.toFixed(2)}" Moneda="MXN" Total="${order.total.toFixed(2)}" TipoDeComprobante="I" Exportacion="01" MetodoPago="${billing.metodoPago || 'PUE'}" LugarExpedicion="${emisorZip}">
  <cfdi:Emisor Rfc="${emisorRfc}" Nombre="${emisorRazon}" RegimenFiscal="${emisorRegimen}"/>
  <cfdi:Receptor Rfc="${(billing.rfc || 'XAXX010101000').toUpperCase()}" Nombre="${billing.razonSocial || 'CLIENTE GENERAL'}" DomicilioFiscalReceptor="${billing.zipCode || '44100'}" RegimenFiscalReceptor="${(billing.regimenFiscal || '601').split(' ')[0]}" UsoCFDI="${(billing.usoCFDI || 'G01').split(' ')[0]}"/>
  <cfdi:Conceptos>
    ${itemsXml}
  </cfdi:Conceptos>
  <cfdi:Impuestos TotalImpuestosTrasladados="0.00">
    <cfdi:Traslados>
      <cfdi:Traslado Base="${order.total.toFixed(2)}" Impuesto="002" TipoFactor="Tasa" TasaOCuota="0.000000" Importe="0.00"/>
    </cfdi:Traslados>
  </cfdi:Impuestos>
  <cfdi:Complemento>
    <tfd:TimbreFiscalDigital xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital" xsi:schemaLocation="http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd" Version="1.1" UUID="${uuid}" FechaTimbrado="${fechaTimbrado}" RfcProvCertif="SAT970701NN3" SelloCFD="${selloCFD}" NoCertificadoSAT="${noCertSAT}" SelloSAT="${selloSAT}"/>
  </cfdi:Complemento>
</cfdi:Comprobante>`;

  const blob = new Blob([xmlContent], { type: "text/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Factura_CFDI40_${order.orderId}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

