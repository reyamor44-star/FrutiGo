import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadString, uploadBytes, getDownloadURL } from "firebase/storage";
import fs from "fs";
import path from "path";

let firebaseConfig: any = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
} catch (e) {
  console.error("No se pudo cargar firebase-applet-config.json:", e);
}

let dbInstance: any = null;
let storageInstance: any = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  if (!firebaseConfig) return null;
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const dbId = firebaseConfig.firestoreDatabaseId;
    dbInstance = dbId && dbId !== "(default)" ? getFirestore(app, dbId) : getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.error("Error al inicializar Firestore:", err);
    return null;
  }
}

export function getFirebaseStorage() {
  if (storageInstance) return storageInstance;
  if (!firebaseConfig) return null;
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    storageInstance = getStorage(app);
    return storageInstance;
  } catch (err) {
    console.error("Error al inicializar Firebase Storage:", err);
    return null;
  }
}

/**
 * Sube una imagen/archivo a Firebase Storage y devuelve la URL pública de descarga (https://...)
 */
export async function uploadImageToFirebaseStorage(
  base64OrFile: string | File | Blob | Buffer,
  folder: string = "uploads",
  filename?: string
): Promise<string | null> {
  const storage = getFirebaseStorage();
  if (!storage) {
    console.warn("Firebase Storage no está inicializado.");
    return null;
  }

  try {
    const time = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    let ext = "jpg";

    if (typeof base64OrFile === "string") {
      if (base64OrFile.startsWith("http://") || base64OrFile.startsWith("https://")) {
        return base64OrFile; // Ya es URL pública
      }

      const match = base64OrFile.match(/^data:(image|video|application)\/(\w+);base64,/);
      if (match && match[2]) {
        ext = match[2] === "jpeg" ? "jpg" : match[2];
      }

      const cleanFileName = filename
        ? `${time}_${filename.replace(/[^a-zA-Z0-9_.-]/g, "_")}`
        : `${time}_${random}.${ext}`;

      const storageRef = ref(storage, `${folder}/${cleanFileName}`);

      if (base64OrFile.startsWith("data:")) {
        await uploadString(storageRef, base64OrFile, "data_url");
      } else {
        await uploadString(storageRef, base64OrFile, "base64");
      }

      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } else if (base64OrFile instanceof File || base64OrFile instanceof Blob || Buffer.isBuffer(base64OrFile)) {
      if ("name" in base64OrFile && typeof base64OrFile.name === "string") {
        const nameExt = base64OrFile.name.split(".").pop();
        if (nameExt) ext = nameExt;
      }

      const cleanFileName = filename
        ? `${time}_${filename.replace(/[^a-zA-Z0-9_.-]/g, "_")}`
        : `${time}_${random}.${ext}`;

      const storageRef = ref(storage, `${folder}/${cleanFileName}`);
      await uploadBytes(storageRef, base64OrFile);
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    }
  } catch (err) {
    console.error("Error al subir archivo a Firebase Storage:", err);
  }
  return null;
}

/**
 * Reemplaza recursivamente cualquier cadena Base64 en el objeto/arreglo
 * por su URL pública obtenida en Firebase Storage (getDownloadURL)
 */
export async function replaceBase64WithFirebaseStorageUrls(data: any, folder: string = "uploads"): Promise<any> {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    if (data.startsWith("data:image/") || data.startsWith("data:video/") || data.startsWith("data:application/")) {
      const publicUrl = await uploadImageToFirebaseStorage(data, folder);
      return publicUrl || data;
    }
    return data;
  }

  if (Array.isArray(data)) {
    const newArr = [];
    for (const item of data) {
      newArr.push(await replaceBase64WithFirebaseStorageUrls(item, folder));
    }
    return newArr;
  }

  if (typeof data === "object") {
    const newObj: any = {};
    for (const key of Object.keys(data)) {
      if ((key === "photoBase64" || key === "base64") && (data["url"] || data["photo"] || data["image"])) {
        continue; // Omitir campos base64 redundantes cuando ya existe el campo de URL
      }
      newObj[key] = await replaceBase64WithFirebaseStorageUrls(data[key], folder);
    }
    return newObj;
  }

  return data;
}

/**
 * Limpia y optimiza los datos para no exceder los límites de tamaño por documento en Firestore (1MB max).
 */
function cleanPayloadForFirestore(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data === "string") {
    if (data.startsWith("data:image/") && data.length > 200000) {
      return data.slice(0, 500) + "...[base64_almacenado_en_servidor]";
    }
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => cleanPayloadForFirestore(item));
  }
  if (typeof data === "object") {
    const cleaned: any = {};
    for (const key of Object.keys(data)) {
      if ((key === "photoBase64" || key === "base64") && typeof data[key] === "string" && data[key].length > 200000) {
        continue;
      }
      cleaned[key] = cleanPayloadForFirestore(data[key]);
    }
    return cleaned;
  }
  return data;
}

export async function fetchFounderProfileFromFirestore(): Promise<any | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const docRef = doc(db, "founder", "profile");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.error("Firestore fetchFounderProfile error:", err);
  }
  return null;
}

export async function saveFounderProfileToFirestore(data: any): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const docRef = doc(db, "founder", "profile");
    let profileCopy = JSON.parse(JSON.stringify(data));

    if (Array.isArray(profileCopy.articles)) {
      for (const article of profileCopy.articles) {
        if (article && article.id) {
          saveArticleToFirestore(article).catch((e) => console.error("Error al guardar artículo desde perfil:", e));
        }
      }
      delete profileCopy.articles;
    }

    profileCopy = await replaceBase64WithFirebaseStorageUrls(profileCopy, "founder-photos");

    // Ensure all bio variations and photos are explicitly defined in Firestore document
    if (!profileCopy.bio1 && profileCopy.bioP1) {
      profileCopy.bio1 = [profileCopy.bioP1, profileCopy.bioP2].filter(Boolean).join("\n\n");
    }
    if (!profileCopy.bio2 && profileCopy.bioP3) {
      profileCopy.bio2 = profileCopy.bioP3;
    }
    if (!profileCopy.bio && (profileCopy.bio1 || profileCopy.bioP1)) {
      profileCopy.bio = [profileCopy.bio1 || profileCopy.bioP1, profileCopy.bio2 || profileCopy.bioP2, profileCopy.bioP3].filter(Boolean).join("\n\n");
    }
    if (!profileCopy.photoUrl && profileCopy.photo) {
      profileCopy.photoUrl = profileCopy.photo;
    }

    // Ensure fields exist explicitly
    profileCopy.bio1 = profileCopy.bio1 || profileCopy.bioP1 || "";
    profileCopy.bio2 = profileCopy.bio2 || profileCopy.bioP3 || "";
    profileCopy.bioP1 = profileCopy.bioP1 || "";
    profileCopy.bioP2 = profileCopy.bioP2 || "";
    profileCopy.bioP3 = profileCopy.bioP3 || "";
    profileCopy.bio = profileCopy.bio || "";
    profileCopy.photoUrl = profileCopy.photoUrl || profileCopy.photo || "";

    const cleanData = cleanPayloadForFirestore(profileCopy);
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveFounderProfile error:", err);
    return false;
  }
}

export async function fetchFounderMediaFromFirestore(): Promise<any[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const docRef = doc(db, "founder", "media");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data()?.items || [];
    }
  } catch (err) {
    console.error("Firestore fetchFounderMedia error:", err);
  }
  return null;
}

export async function saveFounderMediaToFirestore(items: any[]): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const docRef = doc(db, "founder", "media");
    const processedItems = await replaceBase64WithFirebaseStorageUrls(items, "founder-media");
    const cleanItems = cleanPayloadForFirestore(processedItems);
    await setDoc(docRef, { items: cleanItems, updatedAt: Date.now() }, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveFounderMedia error:", err);
    return false;
  }
}

export async function saveArticleToFirestore(article: any): Promise<boolean> {
  const db = getDb();
  if (!db || !article || !article.id) return false;
  try {
    const processedArticle = await replaceBase64WithFirebaseStorageUrls(article, "article-images");
    const cleanData = cleanPayloadForFirestore(processedArticle);
    const docRef = doc(db, "articles", String(article.id));
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveArticle error:", err);
    return false;
  }
}

export async function deleteArticleFromFirestore(articleId: string): Promise<boolean> {
  const db = getDb();
  if (!db || !articleId) return false;
  try {
    const docRef = doc(db, "articles", String(articleId));
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Firestore deleteArticle error:", err);
    return false;
  }
}

export async function fetchAllArticlesFromFirestore(): Promise<any[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const colRef = collection(db, "articles");
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch (err) {
    console.error("Firestore fetchAllArticles error:", err);
    return null;
  }
}

export async function saveOrderToFirestore(order: any): Promise<boolean> {
  const db = getDb();
  if (!db || !order || !order.id) return false;
  try {
    const processedOrder = await replaceBase64WithFirebaseStorageUrls(order, "orders");
    const cleanData = cleanPayloadForFirestore(processedOrder);
    const docRef = doc(db, "orders", String(order.id));
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveOrder error:", err);
    return false;
  }
}

export async function fetchAllOrdersFromFirestore(): Promise<any[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const colRef = collection(db, "orders");
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch (err) {
    console.error("Firestore fetchAllOrders error:", err);
    return null;
  }
}

export async function saveProductToFirestore(product: any): Promise<boolean> {
  const db = getDb();
  if (!db || !product) return false;
  const docId = String(product.name || product.id || "").trim();
  if (!docId) return false;

  try {
    const productToSave = {
      ...product,
      id: docId,
      name: product.name || docId
    };
    const processedProduct = await replaceBase64WithFirebaseStorageUrls(productToSave, "products");
    const cleanData = cleanPayloadForFirestore(processedProduct);
    const docRef = doc(db, "products", docId);
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveProduct error:", err);
    return false;
  }
}

export async function saveAllProductsToFirestore(products: any[]): Promise<boolean> {
  const db = getDb();
  if (!db || !Array.isArray(products)) return false;
  try {
    const colRef = collection(db, "products");
    const snap = await getDocs(colRef);
    const validDocIds = new Set(
      products.map((p) => String(p.name || p.id || "").trim()).filter(Boolean)
    );

    // Clean up old Firestore documents with generic/numeric IDs (e.g. "prod-1", "1", "prod-2") that don't match current product names
    for (const d of snap.docs) {
      const docId = d.id;
      if (!validDocIds.has(docId)) {
        try {
          await deleteDoc(doc(db, "products", docId));
          console.log(`[Firestore Sync] Documento de producto antiguo eliminado de Firestore: '${docId}'`);
        } catch (e) {}
      }
    }

    // Save each product using product name as document ID in Firestore
    for (const product of products) {
      if (product && (product.name || product.id)) {
        await saveProductToFirestore(product);
      }
    }
    return true;
  } catch (err) {
    console.error("Firestore saveAllProducts error:", err);
    return false;
  }
}

export async function deleteProductFromFirestore(productIdOrName: string): Promise<boolean> {
  const db = getDb();
  if (!db || !productIdOrName) return false;
  try {
    const docId = String(productIdOrName).trim();
    const docRef = doc(db, "products", docId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Firestore deleteProduct error:", err);
    return false;
  }
}

export async function fetchAllProductsFromFirestore(): Promise<any[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const colRef = collection(db, "products");
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      const data = d.data();
      const docId = d.id;
      list.push({
        ...data,
        id: data.name || data.id || docId,
        name: data.name || docId
      });
    });
    return list;
  } catch (err) {
    console.error("Firestore fetchAllProducts error:", err);
    return null;
  }
}

// SAT CLIENTS
export async function saveSatClientToFirestore(client: any): Promise<boolean> {
  const db = getDb();
  if (!db || !client || (!client.id && !client.rfc)) return false;
  try {
    const docId = String(client.id || client.rfc).replace(/\//g, "_");
    const cleanData = cleanPayloadForFirestore(JSON.parse(JSON.stringify(client)));
    const docRef = doc(db, "sat_clients", docId);
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveSatClient error:", err);
    return false;
  }
}

export async function saveAllSatClientsToFirestore(clients: any[]): Promise<boolean> {
  const db = getDb();
  if (!db || !Array.isArray(clients)) return false;
  try {
    for (const client of clients) {
      if (client && (client.id || client.rfc)) {
        await saveSatClientToFirestore(client);
      }
    }
    return true;
  } catch (err) {
    console.error("Firestore saveAllSatClients error:", err);
    return false;
  }
}

export async function fetchAllSatClientsFromFirestore(): Promise<any[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const colRef = collection(db, "sat_clients");
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch (err) {
    console.error("Firestore fetchAllSatClients error:", err);
    return null;
  }
}

// INVOICES
export async function saveInvoiceToFirestore(invoice: any): Promise<boolean> {
  const db = getDb();
  if (!db || !invoice || (!invoice.id && !invoice.uuid)) return false;
  try {
    const docId = String(invoice.id || invoice.uuid).replace(/\//g, "_");
    const cleanData = cleanPayloadForFirestore(JSON.parse(JSON.stringify(invoice)));
    const docRef = doc(db, "invoices", docId);
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveInvoice error:", err);
    return false;
  }
}

export async function fetchAllInvoicesFromFirestore(): Promise<any[] | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const colRef = collection(db, "invoices");
    const snap = await getDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push(d.data());
    });
    return list;
  } catch (err) {
    console.error("Firestore fetchAllInvoices error:", err);
    return null;
  }
}

// BANNER & MAIN DATA
export async function saveBannerToFirestore(banner: any): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const processedBanner = await replaceBase64WithFirebaseStorageUrls(banner, "banners");
    const cleanData = cleanPayloadForFirestore(processedBanner);
    const docRef = doc(db, "settings", "banner");
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveBanner error:", err);
    return false;
  }
}

export async function fetchBannerFromFirestore(): Promise<any | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const docRef = doc(db, "settings", "banner");
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data();
  } catch (err) {
    console.error("Firestore fetchBanner error:", err);
  }
  return null;
}

export async function saveMainDataToFirestore(data: any): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const processedData = await replaceBase64WithFirebaseStorageUrls(data, "settings");
    const cleanData = cleanPayloadForFirestore(processedData);
    const docRef = doc(db, "settings", "main_data");
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveMainData error:", err);
    return false;
  }
}

export async function fetchMainDataFromFirestore(): Promise<any | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const docRef = doc(db, "settings", "main_data");
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data();
  } catch (err) {
    console.error("Firestore fetchMainData error:", err);
  }
  return null;
}

export async function saveLogoToFirestore(logoData: any): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const payload = typeof logoData === "string" ? { logoUrl: logoData } : (logoData || {});
    const processedData = await replaceBase64WithFirebaseStorageUrls(payload, "logos");
    const cleanData = cleanPayloadForFirestore({
      logoUrl: processedData.logoUrl || "https://frutigo.com.mx/logo.svg",
      type: "image/svg+xml",
      width: 500,
      height: 500,
      altText: "Logo Oficial de Fruti Go - Delivery Exprés y Logística Urbana",
      caption: "Logotipo vectorial e imagen oficial de Fruti Go para indexación en Google Search y metabuscadores",
      publisher: "Alberto Reyes Sandoval - Fruti Go",
      updatedAt: new Date().toISOString()
    });
    const docRef = doc(db, "settings", "logo");
    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error("Firestore saveLogo error:", err);
    return false;
  }
}

export async function fetchLogoFromFirestore(): Promise<any | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const docRef = doc(db, "settings", "logo");
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data();
  } catch (err) {
    console.error("Firestore fetchLogo error:", err);
  }
  return null;
}

