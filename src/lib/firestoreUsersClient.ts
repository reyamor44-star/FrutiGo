import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  Firestore,
  DocumentChange,
  QuerySnapshot,
  FirestoreError
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

export interface FirestoreUsuarioDoc {
  id: string;
  nombre?: string;
  name?: string;
  fullName?: string;
  razonSocial?: string;
  displayName?: string;
  
  correo?: string;
  email?: string;
  
  telefono?: string;
  phone?: string;
  celular?: string;
  
  rol?: "cliente" | "repartidor" | "negocio" | string;
  role?: "cliente" | "repartidor" | "negocio" | string;
  tipo?: string;
  
  fechaRegistro?: any;
  createdAt?: any;
  fecha?: any;
  timestamp?: any;
  
  estatus?: "completado" | "pendiente" | "activo" | "revision" | string;
  status?: string;
  estatusRegistro?: string;
  
  // Posibles campos de documentos (directos o anidados)
  ine?: string;
  ineUrl?: string;
  ine_url?: string;
  ineFrente?: string;
  ineReverso?: string;
  fotoIne?: string;
  
  licencia?: string;
  licenciaUrl?: string;
  licencia_url?: string;
  fotoLicencia?: string;
  
  comprobante?: string;
  comprobanteDomicilio?: string;
  comprobanteUrl?: string;
  comprobante_url?: string;
  
  fotoLocal?: string;
  foto_local?: string;
  fachadaLocal?: string;
  logoNegocio?: string;
  comprobanteFiscal?: string;
  csf?: string;
  
  tarjetaCirculacion?: string;
  polizaSeguro?: string;
  
  documentos?: Record<string, any>;
  documents?: Record<string, any>;
  archivos?: Record<string, any>;
  [key: string]: any;
}

export interface ParsedUsuario {
  id: string;
  raw: FirestoreUsuarioDoc;
  nombre: string;
  correo: string;
  telefono: string;
  rol: "cliente" | "repartidor" | "negocio";
  rolDisplay: string;
  fechaRegistroRaw: any;
  fechaRegistroFormateada: string;
  estatusRegistro: "Completado" | "Pendiente de Documentos";
  documentos: Array<{
    tipo: string;
    nombre: string;
    url: string;
    isImage?: boolean;
  }>;
  tieneDocumentos: boolean;
  documentsSubmitted?: boolean;
  direccion?: string;
  lat?: number;
  lng?: number;
  rankLevel?: string;
  rating?: number;
  totalDeliveries?: number;
  totalEarnings?: number;
  vehiculoTipo?: string;
  placas?: string;
  pin?: string;
  bankName?: string;
  openpayClabe?: string;
  openpayBankName?: string;
  openpayAccountHolderName?: string;
  openpayCustomerId?: string;
  openpayLinkStatus?: string;
  fcmToken?: string;
}

// Inicializa o reutiliza la instancia de Firebase App
export function getFirebaseClientApp(): FirebaseApp {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }
  return initializeApp(firebaseConfig);
}

// Inicializa Firestore conectándose a la base de datos (default) de Firestore
export function getFirestoreDefaultDb(): Firestore {
  const app = getFirebaseClientApp();
  return getFirestore(app);
}

// Obtiene todas las bases de datos disponibles en el proyecto (default y personalizada)
export function getFirestoreDatabases(): Array<{ name: string; db: Firestore }> {
  const app = getFirebaseClientApp();
  const list: Array<{ name: string; db: Firestore }> = [];
  try {
    list.push({ name: "(default)", db: getFirestore(app) });
  } catch (e) {
    console.warn("Error obteniendo base (default):", e);
  }

  const customDbId = (firebaseConfig as any)?.firestoreDatabaseId;
  if (customDbId && customDbId !== "(default)") {
    try {
      const customDb = getFirestore(app, customDbId);
      list.push({ name: customDbId, db: customDb });
    } catch (e) {
      console.warn("Error obteniendo base personalizada:", e);
    }
  }
  return list;
}

// Formateador de fecha legible (ej: 17/08/2026 16:50)
export function formatFechaRegistro(fechaVal: any): string {
  if (!fechaVal) return "Fecha no disponible";
  
  let date: Date | null = null;
  
  // Firestore Timestamp con método toDate()
  if (fechaVal && typeof fechaVal.toDate === "function") {
    date = fechaVal.toDate();
  } else if (fechaVal && typeof fechaVal.seconds === "number") {
    date = new Date(fechaVal.seconds * 1000);
  } else if (typeof fechaVal === "string" || typeof fechaVal === "number") {
    const parsed = new Date(fechaVal);
    if (!isNaN(parsed.getTime())) {
      date = parsed;
    }
  }

  if (!date) return "Fecha no disponible";

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const anio = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

// Normaliza el rol del usuario identificando tienda/negocio, repartidor o cliente
export function parseUserRole(data: FirestoreUsuarioDoc): {
  normalized: "cliente" | "repartidor" | "negocio";
  display: string;
} {
  if (!data || typeof data !== "object") {
    return { normalized: "cliente", display: "Cliente" };
  }

  const checkValue = (raw: any): "cliente" | "repartidor" | "negocio" | null => {
    if (raw === undefined || raw === null) return null;
    const s = String(raw).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!s) return null;

    // 1. Coincidencia exacta o directa para Cliente
    if (
      s === "cliente" ||
      s === "clientes" ||
      s === "client" ||
      s === "clients" ||
      s === "customer" ||
      s === "customers" ||
      s === "usuario" ||
      s === "usuarios" ||
      s === "user" ||
      s === "users" ||
      s === "comprador" ||
      s === "compradores" ||
      s === "consumidor" ||
      s === "consumidores"
    ) {
      return "cliente";
    }

    // 2. Coincidencia exacta o directa para Repartidor
    if (
      s === "repartidor" ||
      s === "repartidores" ||
      s === "driver" ||
      s === "drivers" ||
      s === "chofer" ||
      s === "choferes" ||
      s === "moto" ||
      s === "motos" ||
      s === "motociclista" ||
      s === "motociclistas" ||
      s === "conductor" ||
      s === "conductores" ||
      s === "delivery" ||
      s === "deliveries" ||
      s === "rider" ||
      s === "riders" ||
      s === "courier" ||
      s === "mensajero" ||
      s === "repartidor_moto" ||
      s === "repartidor_auto" ||
      s === "socio_repartidor"
    ) {
      return "repartidor";
    }

    // 3. Coincidencia exacta o directa para Tienda / Negocio
    if (
      s === "tienda" ||
      s === "tiendas" ||
      s === "negocio" ||
      s === "negocios" ||
      s === "comercio" ||
      s === "comercios" ||
      s === "store" ||
      s === "stores" ||
      s === "shop" ||
      s === "shops" ||
      s === "restaurante" ||
      s === "restaurantes" ||
      s === "vendedor" ||
      s === "vendedores" ||
      s === "merchant" ||
      s === "merchants" ||
      s === "seller" ||
      s === "sellers" ||
      s === "sucursal" ||
      s === "local" ||
      s === "empresa" ||
      s === "business" ||
      s === "socio_tienda" ||
      s === "socio_negocio"
    ) {
      return "negocio";
    }

    // 4. Búsqueda por subcadenas si no fue coincidencia exacta
    if (s.includes("repart") || s.includes("driver") || s.includes("chofer") || s.includes("delivery") || s.includes("conductor") || s.includes("motocicl")) {
      return "repartidor";
    }
    if (s.includes("tiend") || s.includes("negoc") || s.includes("store") || s.includes("comerc") || s.includes("restauran") || s.includes("merchant") || s.includes("vendedor")) {
      return "negocio";
    }
    if (s.includes("client") || s.includes("custom") || s.includes("comprad") || s.includes("consumid")) {
      return "cliente";
    }

    return null;
  };

  // 1. Revisión directa de campos prioritarios 'tipo', 'role', 'rol'
  const candidateValues = [
    data.tipo,
    data.role,
    data.rol,
    data.type,
    data.identificador,
    data.identifier,
    data.tipoUsuario,
    data.tipo_usuario,
    data.userRole,
    data.user_role,
    data.userType,
    data.user_type,
    data.tipoCuenta,
    data.tipo_cuenta,
    data.accountType,
    data.account_type,
    data.perfil,
    data.profile,
    data.categoria,
    data.category,
    data.roleType,
    data.role_type,
    data.tipoRegistro,
    data.tipo_registro,
    (data as any).usuarioTipo,
    (data as any).perfilUsuario
  ];

  for (const rawVal of candidateValues) {
    const res = checkValue(rawVal);
    if (res === "cliente") return { normalized: "cliente", display: "Cliente" };
    if (res === "repartidor") return { normalized: "repartidor", display: "Repartidor" };
    if (res === "negocio") return { normalized: "negocio", display: "Tienda / Negocio" };
  }

  // 2. Objetos anidados comunes en apps móviles (data.datos, data.userData, data.perfil, etc.)
  const nestedObjects = [
    (data as any).datos,
    (data as any).userData,
    (data as any).user_data,
    (data as any).perfil,
    (data as any).info,
    (data as any).auth,
    (data as any).account,
    (data as any).driverData,
    (data as any).storeData
  ];

  for (const obj of nestedObjects) {
    if (obj && typeof obj === "object") {
      const nestedVals = [obj.tipo, obj.role, obj.rol, obj.identificador, obj.type, obj.tipoUsuario, obj.userType, obj.accountType];
      for (const rawVal of nestedVals) {
        const res = checkValue(rawVal);
        if (res === "cliente") return { normalized: "cliente", display: "Cliente" };
        if (res === "repartidor") return { normalized: "repartidor", display: "Repartidor" };
        if (res === "negocio") return { normalized: "negocio", display: "Tienda / Negocio" };
      }
    }
  }

  // 3. Banderas booleanas directas
  const d = data as any;
  if (d.isCliente === true || d.esCliente === true || d.is_cliente === true || d.isCustomer === true || d.isUser === true) {
    return { normalized: "cliente", display: "Cliente" };
  }
  if (d.isRepartidor === true || d.is_repartidor === true || d.isDriver === true || d.is_driver === true || d.esRepartidor === true || d.isChofer === true) {
    return { normalized: "repartidor", display: "Repartidor" };
  }
  if (d.isTienda === true || d.is_tienda === true || d.isNegocio === true || d.is_negocio === true || d.isStore === true || d.is_store === true || d.esTienda === true || d.esNegocio === true) {
    return { normalized: "negocio", display: "Tienda / Negocio" };
  }

  // 4. Revisión de colección de origen si viene de subcolección dedicada
  const colSource = String(d._collection || "").toLowerCase();
  if (colSource.includes("repart") || colSource.includes("driver") || colSource.includes("chofer")) {
    return { normalized: "repartidor", display: "Repartidor" };
  }
  if (colSource.includes("tiend") || colSource.includes("negoc") || colSource.includes("store") || colSource.includes("merchant")) {
    return { normalized: "negocio", display: "Tienda / Negocio" };
  }
  if (colSource.includes("client") || colSource.includes("custom")) {
    return { normalized: "cliente", display: "Cliente" };
  }

  // 5. Detección por campos específicos y no ambiguos de Repartidor
  if (
    d.licenciaConducir ||
    d.driverLicense ||
    d.tarjetaCirculacion ||
    d.datosRepartidor ||
    d.driverData ||
    d.foto_perfil_repartidor_url ||
    d.foto_vehiculo_repartidor_url ||
    d.identificacion_repartidor ||
    d.identificacion_repartidor_img_url ||
    d.vehiculo_tipo ||
    (d.tipoVehiculo && typeof d.tipoVehiculo === "string" && d.tipoVehiculo.length > 0) ||
    (d.vehiculo && typeof d.vehiculo === "string" && (d.vehiculo.toLowerCase().includes("moto") || d.vehiculo.toLowerCase().includes("auto")))
  ) {
    return { normalized: "repartidor", display: "Repartidor" };
  }

  // 6. Detección por campos específicos y no ambiguos de Tienda / Negocio
  if (
    d.nombreNegocio ||
    d.nombre_negocio ||
    d.nombreTienda ||
    d.nombre_tienda ||
    d.giroNegocio ||
    d.datosTienda ||
    d.datosNegocio ||
    d.fotoFachada ||
    d.fachadaLocal
  ) {
    return { normalized: "negocio", display: "Tienda / Negocio" };
  }

  // 7. Prefijos en ID de documento si aplica
  const idStr = String(data.id || "").toLowerCase();
  if (idStr.startsWith("rep_") || idStr.startsWith("driver_") || idStr.startsWith("chofer_") || idStr.startsWith("repartidor_")) {
    return { normalized: "repartidor", display: "Repartidor" };
  }
  if (idStr.startsWith("store_") || idStr.startsWith("tienda_") || idStr.startsWith("negocio_") || idStr.startsWith("comercio_")) {
    return { normalized: "negocio", display: "Tienda / Negocio" };
  }
  if (idStr.startsWith("cli_") || idStr.startsWith("client_") || idStr.startsWith("usr_") || idStr.startsWith("user_")) {
    return { normalized: "cliente", display: "Cliente" };
  }

  // 8. Por defecto: Cliente
  return { normalized: "cliente", display: "Cliente" };
}

// Extrae todos los documentos o enlaces válidos (URLs / Base64) encontrados en el registro
export function extractUserDocuments(data: FirestoreUsuarioDoc): Array<{
  tipo: string;
  nombre: string;
  url: string;
  isImage?: boolean;
}> {
  const docs: Array<{ tipo: string; nombre: string; url: string; isImage?: boolean }> = [];

  const addIfValid = (tipo: string, nombre: string, val: any) => {
    if (!val || typeof val !== "string") return;
    const str = val.trim();
    if (
      str.startsWith("http://") || 
      str.startsWith("https://") || 
      str.startsWith("data:image/") ||
      str.startsWith("data:application/pdf") ||
      str.startsWith("gs://")
    ) {
      const isImg = Boolean(
        str.startsWith("data:image/") ||
        str.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) ||
        tipo.toLowerCase().includes("foto") ||
        tipo.toLowerCase().includes("img") ||
        tipo.toLowerCase().includes("perfil") ||
        tipo.toLowerCase().includes("vehiculo") ||
        tipo.toLowerCase().includes("fachada") ||
        tipo.toLowerCase().includes("ine") ||
        tipo.toLowerCase().includes("identificacion")
      );

      // Evitar duplicados por url
      if (!docs.some(d => d.url === str)) {
        docs.push({ tipo, nombre, url: str, isImage: isImg });
      }
    }
  };

  // 1. Campos específicos de la app Fruti Go (capturados directamente del documento Firestore)
  addIfValid("foto_perfil_repartidor", "Foto de Perfil Repartidor", (data as any).foto_perfil_repartidor_url || (data as any).foto_perfil_url);
  addIfValid("foto_vehiculo_repartidor", "Foto de Vehículo", (data as any).foto_vehiculo_repartidor_url || (data as any).foto_vehiculo_url || (data as any).fotoVehiculo);
  addIfValid("identificacion_repartidor_img", "Identificación Oficial Repartidor (Imagen)", (data as any).identificacion_repartidor_img_url);
  addIfValid("identificacion_repartidor", "Identificación Oficial Repartidor", (data as any).identificacion_repartidor);

  // 2. Campos estándar de identificación, licencias y fiscales
  addIfValid("ine", "INE / Identificación Oficial", data.ine || data.ineUrl || data.ine_url || data.fotoIne || data.identification);
  addIfValid("ine_frente", "INE Frente", data.ineFrente || data.ine_frente || data.ineFront);
  addIfValid("ine_reverso", "INE Reverso", data.ineReverso || data.ine_reverso || data.ineBack);
  addIfValid("licencia", "Licencia de Conducir", data.licencia || data.licenciaUrl || data.licencia_url || data.fotoLicencia || data.driverLicense || data.driver_license);
  addIfValid("comprobante", "Comprobante de Domicilio", data.comprobante || data.comprobanteDomicilio || data.comprobanteUrl || data.comprobante_url || data.proofOfAddress);
  addIfValid("foto_local", "Foto del Local / Fachada", data.fotoLocal || data.foto_local || data.fachadaLocal || data.logoNegocio || data.storePhoto);
  addIfValid("csf", "Constancia Fiscal (CSF)", data.csf || data.comprobanteFiscal || data.constanciaFiscal || data.taxId);
  addIfValid("tarjeta_circulacion", "Tarjeta de Circulación", data.tarjetaCirculacion || data.tarjeta_circulacion || data.vehicleRegistration);
  addIfValid("poliza_seguro", "Póliza de Seguro", data.polizaSeguro || data.poliza_seguro || data.seguro || data.insurancePolicy);
  addIfValid("perfil", "Foto de Perfil / Avatar", data.profilePic || data.profileImage || data.photoUrl || data.avatar || data.photo_url || data.avatarUrl);

  // 3. Mapas anidados de documentos
  const subMaps = [data.documentos, data.documents, data.archivos, data.adjuntos, data.verificationDocs, data.files];
  subMaps.forEach((mapObj) => {
    if (mapObj && typeof mapObj === "object") {
      Object.entries(mapObj).forEach(([key, val]) => {
        let label = key.toUpperCase();
        if (key.toLowerCase().includes("ine")) label = "INE / Identificación";
        else if (key.toLowerCase().includes("licen")) label = "Licencia";
        else if (key.toLowerCase().includes("comprob")) label = "Comprobante";
        else if (key.toLowerCase().includes("local") || key.toLowerCase().includes("fachada")) label = "Foto Local";
        else if (key.toLowerCase().includes("tarjeta")) label = "Tarjeta Circulación";
        else if (key.toLowerCase().includes("seguro")) label = "Póliza Seguro";
        else if (key.toLowerCase().includes("fiscal") || key.toLowerCase().includes("csf")) label = "Constancia Fiscal";
        else if (key.toLowerCase().includes("avatar") || key.toLowerCase().includes("photo") || key.toLowerCase().includes("perfil")) label = "Foto Perfil";
        
        addIfValid(key, label, val);
      });
    }
  });

  // 4. Rastreo dinámico de cualquier campo del documento que contenga URLs de fotos o documentos
  if (data && typeof data === "object") {
    Object.entries(data).forEach(([k, v]) => {
      if (typeof v === "string" && (v.startsWith("http://") || v.startsWith("https://") || v.startsWith("data:image/"))) {
        const kLower = k.toLowerCase();
        let label = k;
        if (kLower.includes("foto_perfil")) label = "Foto de Perfil";
        else if (kLower.includes("foto_vehiculo")) label = "Foto del Vehículo";
        else if (kLower.includes("identificacion")) label = "Identificación Oficial";
        else if (kLower.includes("licencia")) label = "Licencia";
        else if (kLower.includes("fachada") || kLower.includes("local")) label = "Foto Fachada";
        else if (kLower.includes("comprobante")) label = "Comprobante";
        
        addIfValid(k, label, v);
      }
    });
  }

  return docs;
}

// Parsea un documento Firestore bruto al formato unificado
export function parseFirestoreUsuario(docId: string, data: FirestoreUsuarioDoc): ParsedUsuario {
  // Extracción exhaustiva de nombre
  let nombre = "";
  if (data.name) nombre = String(data.name);
  else if (data.nombre) nombre = String(data.nombre);
  else if (data.fullName) nombre = String(data.fullName);
  else if (data.full_name) nombre = String(data.full_name);
  else if (data.displayName) nombre = String(data.displayName);
  else if (data.display_name) nombre = String(data.display_name);
  else if (data.username) nombre = String(data.username);
  else if (data.userName) nombre = String(data.userName);
  else if (data.firstName || data.first_name) {
    const fn = data.firstName || data.first_name || "";
    const ln = data.lastName || data.last_name || "";
    nombre = `${fn} ${ln}`.trim();
  } else if (data.razonSocial || data.businessName || data.tiendaName) {
    nombre = String(data.razonSocial || data.businessName || data.tiendaName);
  }

  if (!nombre.trim()) {
    if (data.email || data.correo) {
      nombre = String(data.email || data.correo).split("@")[0];
    } else if (data.phone || data.telefono) {
      nombre = `Usuario ${String(data.phone || data.telefono)}`;
    } else {
      nombre = `Usuario ${docId ? docId.substring(0, 8) : "Sin ID"}`;
    }
  }

  const correo = String(data.correo || data.email || data.userEmail || data.mail || "Sin correo").trim();
  const telefono = String(data.telefono || data.phone || data.phoneNumber || data.phone_number || data.celular || data.mobile || "Sin teléfono").trim();
  
  const roleInfo = parseUserRole(data);
  const documentos = extractUserDocuments(data);
  const documentsSubmitted = Boolean((data as any).documents_submitted === true);
  const tieneDocumentos = documentos.length > 0 || documentsSubmitted;
  
  // Determinación del Estatus de Registro
  let estatusRegistro: "Completado" | "Pendiente de Documentos" = "Completado";
  
  const statusField = (data.estatus || data.status || data.estatusRegistro || data.state || "").toString().toLowerCase();
  if (statusField === "completado" || statusField === "activo" || statusField === "active" || statusField === "aprobado" || statusField === "approved" || statusField === "verificado" || statusField === "verified") {
    estatusRegistro = "Completado";
  } else if (roleInfo.normalized === "cliente") {
    estatusRegistro = "Completado";
  } else if (tieneDocumentos || documentsSubmitted) {
    estatusRegistro = "Completado";
  } else if (statusField.includes("pend") || statusField.includes("review") || statusField.includes("revision")) {
    estatusRegistro = "Pendiente de Documentos";
  } else {
    estatusRegistro = "Pendiente de Documentos";
  }

  // Extracción de fecha de registro
  let rawDate = data.fechaRegistro || data.createdAt || data.created_at || data.creationTime || data.fecha || data.timestamp || data.registered_at || data.date;
  if (!rawDate && (data as any).fcm_updated_at_ms) {
    rawDate = new Date((data as any).fcm_updated_at_ms);
  }

  // Datos adicionales extraídos directamente de los documentos de Firestore
  const d = data as any;
  const direccion = d.direccion || d.address || d.domicilio || "";
  const lat = typeof d.lat === "number" ? d.lat : undefined;
  const lng = typeof d.lng === "number" ? d.lng : undefined;
  const rankLevel = d.rankLevel || d.rank || d.nivel || undefined;
  const rating = typeof d.rating === "number" ? d.rating : undefined;
  const totalDeliveries = typeof d.totalDeliveries === "number" ? d.totalDeliveries : undefined;
  const totalEarnings = typeof d.totalEarnings === "number" ? d.totalEarnings : undefined;
  const vehiculoTipo = d.vehiculo_tipo || d.tipoVehiculo || d.vehiculo || undefined;
  const placas = d.placas || d.placa || undefined;
  const pin = d.pin || undefined;
  const bankName = d.bank_name || d.banco || d.openpay_bank_name || undefined;
  const openpayClabe = d.openpay_clabe || d.clabe || undefined;
  const openpayBankName = d.openpay_bank_name || undefined;
  const openpayAccountHolderName = d.openpay_account_holder_name || undefined;
  const openpayCustomerId = d.openpay_customer_id || undefined;
  const openpayLinkStatus = d.openpay_link_status || undefined;
  const fcmToken = d.fcmToken || d.token || undefined;

  return {
    id: docId,
    raw: data,
    nombre: nombre.trim(),
    correo,
    telefono,
    rol: roleInfo.normalized,
    rolDisplay: roleInfo.display,
    fechaRegistroRaw: rawDate,
    fechaRegistroFormateada: formatFechaRegistro(rawDate),
    estatusRegistro,
    documentos,
    tieneDocumentos,
    documentsSubmitted,
    direccion,
    lat,
    lng,
    rankLevel,
    rating,
    totalDeliveries,
    totalEarnings,
    vehiculoTipo,
    placas,
    pin,
    bankName,
    openpayClabe,
    openpayBankName,
    openpayAccountHolderName,
    openpayCustomerId,
    openpayLinkStatus,
    fcmToken
  };
}

export interface RealtimeAlertEvent {
  id: string;
  type: "new_user" | "docs_completed";
  userName: string;
  userRole: string;
  message: string;
  timestamp: string;
  userId: string;
}

/**
 * Suscripción en Tiempo Real SOLO LECTURA a la colección 'users'
 * de la base de datos Firestore (default) de FrutiGo con estabilización y anti-flicker.
 */
export function subscribeToUsuariosCollection(
  onData: (usuarios: ParsedUsuario[]) => void,
  onAlert: (alert: RealtimeAlertEvent) => void,
  onError?: (err: FirestoreError | Error) => void
): () => void {
  let isInitialLoad = true;
  const previousDocsMap = new Map<string, ParsedUsuario>();
  const seenUserIds = new Set<string>();
  let lastDataFingerprint = "";
  let debounceTimeout: any = null;
  let pollingInterval: any = null;
  let isCleanedUp = false;

  const emitStabilizedList = (rawItems: Array<{ id: string; [key: string]: any }>) => {
    if (isCleanedUp) return;

    const currentList: ParsedUsuario[] = [];
    rawItems.forEach((item) => {
      if (!item || !item.id) return;
      const parsed = parseFirestoreUsuario(String(item.id), item as FirestoreUsuarioDoc);
      currentList.push(parsed);
    });

    // Ordenar por fecha de registro descendente
    currentList.sort((a, b) => {
      const timeA = a.fechaRegistroRaw?.toDate ? a.fechaRegistroRaw.toDate().getTime() : new Date(a.fechaRegistroRaw || 0).getTime();
      const timeB = b.fechaRegistroRaw?.toDate ? b.fechaRegistroRaw.toDate().getTime() : new Date(b.fechaRegistroRaw || 0).getTime();
      return timeB - timeA;
    });

    // Crear huella digital para evitar re-renders idénticos
    const currentFingerprint = currentList.map((u) => `${u.id}:${u.rol}:${u.estatusRegistro}:${u.documentos.length}:${u.nombre}`).join("|");
    if (currentFingerprint === lastDataFingerprint && currentList.length > 0) {
      return; // Sin cambios, no disparar re-render
    }
    lastDataFingerprint = currentFingerprint;

    // Si ya pasó la carga inicial, detectar eventos y disparar alertas en tiempo real
    if (!isInitialLoad) {
      currentList.forEach((parsed) => {
        const wasKnown = seenUserIds.has(parsed.id);
        const prev = previousDocsMap.get(parsed.id);

        if (!wasKnown) {
          seenUserIds.add(parsed.id);
          onAlert({
            id: "alert-new-" + parsed.id + "-" + Date.now(),
            type: "new_user",
            userName: parsed.nombre,
            userRole: parsed.rolDisplay,
            message: `¡Nuevo usuario registrado: ${parsed.nombre}! (${parsed.rolDisplay})`,
            timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            userId: parsed.id
          });
        } else if (prev) {
          const previousHadDocs = prev.tieneDocumentos;
          const nowHasDocs = parsed.tieneDocumentos;
          const statusChangedToCompleted = prev.estatusRegistro !== "Completado" && parsed.estatusRegistro === "Completado";

          if ((!previousHadDocs && nowHasDocs) || statusChangedToCompleted) {
            onAlert({
              id: "alert-docs-" + parsed.id + "-" + Date.now(),
              type: "docs_completed",
              userName: parsed.nombre,
              userRole: parsed.rolDisplay,
              message: `¡${parsed.nombre} ha completado sus documentos desde la App!`,
              timestamp: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
              userId: parsed.id
            });
          }
        }
      });
    } else {
      currentList.forEach((u) => seenUserIds.add(u.id));
    }

    // Actualizar el mapa de estados previos
    previousDocsMap.clear();
    currentList.forEach((u) => previousDocsMap.set(u.id, u));
    isInitialLoad = false;
    onData(currentList);
  };

  const scheduleEmit = (rawItems: Array<{ id: string; [key: string]: any }>) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      emitStabilizedList(rawItems);
    }, 250);
  };

  // Función de sincronización via API como respaldo
  const fetchFromServerApi = async () => {
    if (isCleanedUp) return;
    try {
      const res = await fetch("/api/admin/firestore-users");
      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.users) && json.users.length > 0) {
          scheduleEmit(json.users);
        }
      }
    } catch (e) {
      console.warn("Fallo de respaldo al consultar /api/admin/firestore-users:", e);
    }
  };

  // 1. Carga inmediata rápida desde API
  fetchFromServerApi();

  // 2. Suscripción directa de Firestore en tiempo real (onSnapshot) a todas las bases y colecciones relevantes
  const unsubscribers: Array<() => void> = [];
  const allKnownDocs = new Map<string, any>();

  try {
    const databases = getFirestoreDatabases();
    const collectionsToListen = [
      "users",
      "usuarios",
      "clientes",
      "repartidores",
      "tiendas",
      "negocios",
      "drivers",
      "customers",
      "stores",
      "app_users"
    ];

    const handleSnapshotDocs = (docs: Array<{ id: string; [key: string]: any }>, colName: string, dbName: string) => {
      if (isCleanedUp) return;
      docs.forEach((d) => {
        if (d && d.id) {
          allKnownDocs.set(d.id, { ...d, _collection: colName, _database: dbName });
        }
      });
      scheduleEmit(Array.from(allKnownDocs.values()));
    };

    databases.forEach((dbEntry) => {
      collectionsToListen.forEach((colName) => {
        try {
          const unsub = onSnapshot(
            query(collection(dbEntry.db, colName)),
            (snap) => {
              const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
              if (docs.length > 0) {
                handleSnapshotDocs(docs, colName, dbEntry.name);
              } else if (colName === "users" && dbEntry.name === "(default)") {
                fetchFromServerApi();
              }
            },
            (error) => {
              if (colName === "users") {
                console.warn(`Firestore onSnapshot error en BD '${dbEntry.name}', colección '${colName}':`, error);
                if (onError) onError(error);
                fetchFromServerApi();
              }
            }
          );
          unsubscribers.push(unsub);
        } catch (e) {
          // Saltear si la subcolección o consulta no está disponible
        }
      });
    });

  } catch (err: any) {
    console.warn("No se pudo iniciar onSnapshot directo:", err);
  }

  // Polling suave y espaciado de respaldo cada 30 segundos
  pollingInterval = setInterval(fetchFromServerApi, 30000);

  // Retornar función de limpieza
  return () => {
    isCleanedUp = true;
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    unsubscribers.forEach((unsub) => {
      try {
        unsub();
      } catch {}
    });
  };
}
