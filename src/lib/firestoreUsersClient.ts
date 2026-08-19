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

// Normaliza el rol del usuario identificando repartidor, tienda o cliente según las reglas estrictas
export function parseUserRole(data: FirestoreUsuarioDoc): {
  normalized: "cliente" | "repartidor" | "negocio";
  display: string;
} {
  if (!data || typeof data !== "object") {
    return { normalized: "cliente", display: "Cliente" };
  }

  // 1. Campos de Rol normalizados a minúsculas
  const tipo = String((data as any).tipo || "").toLowerCase().trim();
  const role = String((data as any).role || (data as any).rol || "").toLowerCase().trim();

  // 2. REPARTIDORES:
  // Condición: tipo === 'repartidor' || role === 'repartidor' || Boolean(data.foto_vehiculo_repartidor_url) || Boolean(data.identificacion_repartidor)
  if (
    tipo === "repartidor" ||
    role === "repartidor" ||
    tipo === "driver" ||
    role === "driver" ||
    Boolean((data as any).foto_vehiculo_repartidor_url) ||
    Boolean((data as any).foto_vehiculo_url) ||
    Boolean((data as any).identificacion_repartidor) ||
    Boolean((data as any).identificacion_repartidor_image_url) ||
    Boolean((data as any).identificacion_repartidor_img_url)
  ) {
    return { normalized: "repartidor", display: "Repartidor" };
  }

  // 3. TIENDAS / NEGOCIOS / SOCIOS:
  // Condición: tipo === 'negocio' || role === 'negocio' || role === 'admin'
  if (
    tipo === "negocio" ||
    role === "negocio" ||
    role === "admin" ||
    tipo === "tienda" ||
    role === "tienda" ||
    tipo === "store" ||
    role === "store"
  ) {
    return { normalized: "negocio", display: "Tienda / Negocio" };
  }

  // 4. CLIENTES / COMPRADORES:
  // Condición: tipo === 'cliente' || role === 'cliente' || (!tipo && !role)
  if (
    tipo === "cliente" ||
    role === "cliente" ||
    tipo === "customer" ||
    role === "customer" ||
    tipo === "comprador" ||
    role === "comprador" ||
    (!tipo && !role)
  ) {
    return { normalized: "cliente", display: "Cliente" };
  }

  // Por defecto (si no encaja en otra categoría): Cliente
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

  // 1. Campos específicos de Repartidor de la app FrutiGo
  // Identificación: doc.identificacion_repartidor_image_url || doc.identificacion_repartidor_img_url || doc.identificacion_repartidor
  const idRepartidor = (data as any).identificacion_repartidor_image_url || 
                       (data as any).identificacion_repartidor_img_url || 
                       (data as any).identificacion_repartidor;
  addIfValid("identificacion_repartidor", "Identificación Oficial Repartidor", idRepartidor);

  // Foto Vehículo: doc.foto_vehiculo_repartidor_url || doc.foto_vehiculo
  const fotoVehiculo = (data as any).foto_vehiculo_repartidor_url || 
                       (data as any).foto_vehiculo_url || 
                       (data as any).foto_vehiculo;
  addIfValid("foto_vehiculo_repartidor", "Foto de Vehículo", fotoVehiculo);

  // Foto Perfil Repartidor / Usuario: doc.foto_perfil_repartidor_url || doc.foto_perfil
  const fotoPerfil = (data as any).foto_perfil_repartidor_url || 
                     (data as any).foto_perfil_url || 
                     (data as any).foto_perfil || 
                     (data as any).profilePic || 
                     (data as any).photoUrl || 
                     (data as any).avatar;
  addIfValid("foto_perfil_repartidor", "Foto de Perfil", fotoPerfil);

  // 2. Otros campos estándar de documentos (INE, Licencia, Comprobante, etc.)
  addIfValid("ine", "INE / Identificación", data.ine || data.ineUrl || data.ine_url || data.fotoIne);
  addIfValid("licencia", "Licencia de Conducir", data.licencia || data.licenciaUrl || data.licencia_url || data.fotoLicencia || (data as any).driverLicense);
  addIfValid("comprobante", "Comprobante de Domicilio", data.comprobante || data.comprobanteDomicilio || data.comprobanteUrl || (data as any).proofOfAddress);
  addIfValid("foto_local", "Foto del Local / Fachada", data.fotoLocal || data.foto_local || (data as any).fachadaLocal || (data as any).fotoFachada);

  // 3. Mapas anidados de documentos
  const subMaps = [data.documentos, data.documents, data.archivos, data.adjuntos, data.verificationDocs, data.files];
  subMaps.forEach((mapObj) => {
    if (mapObj && typeof mapObj === "object") {
      Object.entries(mapObj).forEach(([key, val]) => {
        let label = key.toUpperCase();
        if (key.toLowerCase().includes("ine")) label = "INE / Identificación";
        else if (key.toLowerCase().includes("licen")) label = "Licencia";
        else if (key.toLowerCase().includes("comprob")) label = "Comprobante";
        else if (key.toLowerCase().includes("vehiculo")) label = "Foto Vehículo";
        else if (key.toLowerCase().includes("local") || key.toLowerCase().includes("fachada")) label = "Foto Local";
        
        addIfValid(key, label, val);
      });
    }
  });

  // 4. Rastreo dinámico de cualquier campo adicional con URL válida
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
        
        addIfValid(k, label, v);
      }
    });
  }

  return docs;
}

// Parsea un documento Firestore bruto al formato unificado
export function parseFirestoreUsuario(docId: string, data: FirestoreUsuarioDoc): ParsedUsuario {
  // 1. Estructura Real de Campos por Documento
  // Nombre: doc.name || doc.nombre || 'Sin Nombre'
  const nombre = (data.name || data.nombre || data.fullName || data.full_name || data.displayName || "Sin Nombre").toString().trim() || "Sin Nombre";

  // Correo: doc.email || doc.correo || 'Sin correo'
  const correo = (data.email || data.correo || (data as any).userEmail || (data as any).mail || "Sin correo").toString().trim() || "Sin correo";

  // Teléfono: doc.phone || doc.telefono || 'Sin teléfono'
  const telefono = (data.phone || data.telefono || (data as any).phoneNumber || (data as any).phone_number || (data as any).celular || (data as any).mobile || "Sin teléfono").toString().trim() || "Sin teléfono";

  // Rol / Tipo: Detectar mediante (doc.tipo || doc.role || '').toLowerCase().trim()
  const roleInfo = parseUserRole(data);

  // Estatus Documentos: Evaluar doc.documents_submitted === true
  const documentsSubmitted = Boolean((data as any).documents_submitted === true);
  const documentos = extractUserDocuments(data);
  const tieneDocumentos = documentos.length > 0 || documentsSubmitted;

  // 2. Lógica de Clasificación de Roles y Estatus:
  // REPARTIDORES: Si doc.documents_submitted === true (o tiene documentos subidos), marcar como Completado (OK); de lo contrario, Pendiente.
  // CLIENTES / COMPRADORES: Marcar como Completado (OK) automáticamente (o mostrar 'N/A').
  // TIENDAS / NEGOCIOS: Si doc.documents_submitted === true (o tiene documentos), marcar como Completado; de lo contrario, Pendiente.
  let estatusRegistro: "Completado" | "Pendiente de Documentos" = "Completado";

  if (roleInfo.normalized === "cliente") {
    estatusRegistro = "Completado";
  } else if (roleInfo.normalized === "repartidor") {
    estatusRegistro = documentsSubmitted || tieneDocumentos ? "Completado" : "Pendiente de Documentos";
  } else if (roleInfo.normalized === "negocio") {
    estatusRegistro = documentsSubmitted || tieneDocumentos ? "Completado" : "Pendiente de Documentos";
  }

  // Fecha de registro
  let rawDate = data.fechaRegistro || data.createdAt || data.created_at || data.creationTime || data.fecha || data.timestamp || data.registered_at;
  if (!rawDate && (data as any).fcm_updated_at_ms) {
    rawDate = new Date((data as any).fcm_updated_at_ms);
  }

  // Datos adicionales
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
    nombre,
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
