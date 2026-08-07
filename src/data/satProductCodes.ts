export interface SatCodeOption {
  code: string;
  description: string;
  category: string;
  keywords: string[];
}

export interface SatUnitOption {
  code: string;
  name: string;
  symbol: string;
}

export interface TaxRateOption {
  id: string;
  impuesto_tipo: string; // "002" | "003" | "EXENTO"
  tasa_ocuota: number;
  label: string;
  shortLabel: string;
}

// 40+ Códigos SAT oficiales de ClaveProdServ para Frutas, Verduras, Alimentos, Botanas y Bebidas con búsqueda exacta por producto
export const SAT_PRODUCT_CODES: SatCodeOption[] = [
  // PEPINOS Y HORTALIZAS DE FRUTO
  {
    code: "50121905",
    description: "Pepinos frescos (Verde, Persa, Blanco, Pepinillos)",
    category: "Verduras",
    keywords: ["pepino", "pepinos", "pepino verde", "pepino persa", "pepino blanco", "pepinillo", "pepinillos", "cucumber"]
  },
  {
    code: "50121900",
    description: "Verduras, legumbres y hortalizas frescas",
    category: "Verduras",
    keywords: ["verdura", "legumbre", "fresca", "general", "verduras", "hortaliza", "hortalizas"]
  },
  {
    code: "50121901",
    description: "Jitomates y tomates frescos (Saladette, Bola, Cherry)",
    category: "Verduras",
    keywords: ["jitomate", "tomate", "saladette", "bola", "cherry", "tomate verde", "tomate de cáscara"]
  },
  {
    code: "50121902",
    description: "Cebollas y ajos frescos (Blanca, Morada, Cambray)",
    category: "Verduras",
    keywords: ["cebolla", "cebollas", "blanca", "morada", "cambray", "ajo", "ajos", "cebollin"]
  },
  {
    code: "50121903",
    description: "Chiles frescos y pimientos (Serrano, Jalapeño, Poblano, Habanero, Pimiento Morrón)",
    category: "Verduras",
    keywords: ["chile", "chiles", "serrano", "jalapeño", "poblano", "pimiento", "morrón", "habanero", "cuaresmeño", "güero"]
  },
  {
    code: "50121904",
    description: "Lechugas y hortalizas de hoja (Orejona, Italiana, Espinaca, Acelga, Col, Repollo)",
    category: "Verduras",
    keywords: ["lechuga", "lechugas", "orejona", "italiana", "espinaca", "espinacas", "acelga", "col", "repollo", "kale"]
  },
  {
    code: "50121906",
    description: "Calabazas, calabacitas y zuchinis frescos",
    category: "Verduras",
    keywords: ["calabaza", "calabacita", "zucchini", "calabacitas", "calabaza criolla", "calabaza de castilla"]
  },
  {
    code: "50121907",
    description: "Zanahorias y raíces comestibles frescas",
    category: "Verduras",
    keywords: ["zanahoria", "zanahorias", "betabel", "rábano", "rabanos", "nabo"]
  },
  {
    code: "50121908",
    description: "Papas, camotes y tubérculos frescos",
    category: "Verduras",
    keywords: ["papa", "papas", "camote", "yuca", "tubérculo", "papa alfa", "papa blanca"]
  },
  {
    code: "50121909",
    description: "Nopales frescos y tunas",
    category: "Verduras",
    keywords: ["nopal", "nopales", "nopal verdura", "tuna", "tunas", "xoconostle"]
  },
  {
    code: "50121910",
    description: "Elotes frescos, maíz tierno y mazorcas",
    category: "Verduras",
    keywords: ["elote", "elotes", "maiz tierno", "mazorca", "esquite"]
  },
  {
    code: "50121911",
    description: "Champiñones, setas y hongos comestibles",
    category: "Verduras",
    keywords: ["champiñon", "champiñones", "setas", "hongos", "portobello", "portobelo"]
  },
  {
    code: "50121912",
    description: "Brócoli, coliflor y coles frescas",
    category: "Verduras",
    keywords: ["brocoli", "brócoli", "coliflor", "col de bruselas"]
  },

  // FRUTAS Y CÍTRICOS
  {
    code: "50111500",
    description: "Frutas frescas y hortalizas frutales",
    category: "Frutas",
    keywords: ["fruta", "frutas", "fresca", "hortaliza", "general"]
  },
  {
    code: "50111501",
    description: "Manzanas frescas (Red Delicious, Gala, Golden, Fuji, Granny)",
    category: "Frutas",
    keywords: ["manzana", "manzanas", "apple", "red", "fuji", "golden", "red delicious", "gala"]
  },
  {
    code: "50111502",
    description: "Plátanos y bananos frescos (Tabasco, Dominico, Macho, Morado)",
    category: "Frutas",
    keywords: ["platano", "plátano", "plátanos", "banano", "bananos", "tabasco", "dominico", "macho"]
  },
  {
    code: "50111503",
    description: "Mangos frescos (Ataulfo, Kent, Tommy, Haden, Petacón)",
    category: "Frutas",
    keywords: ["mango", "mangos", "ataulfo", "kent", "tommy", "haden", "petacon"]
  },
  {
    code: "50111504",
    description: "Naranjas frescas, mandarinas, toronjas y cítricos",
    category: "Frutas",
    keywords: ["naranja", "naranjas", "citrico", "mandarina", "mandarinas", "toronja", "toronjas", "clementina"]
  },
  {
    code: "50111505",
    description: "Uvas frescas (Verde, Roja, Negra, Sin Semilla)",
    category: "Frutas",
    keywords: ["uva", "uvas", "grape", "verde", "roja", "sin semilla", "uvas frescas"]
  },
  {
    code: "50111506",
    description: "Aguacates frescos (Hass, Criollo, Fuerte)",
    category: "Frutas",
    keywords: ["aguacate", "aguacates", "hass", "avocado", "guacamole", "criollo"]
  },
  {
    code: "50111507",
    description: "Fresas, frambuesas, zarzamoras, arándanos y frutos rojos",
    category: "Frutas",
    keywords: ["fresa", "fresas", "berry", "frambuesa", "frambuesas", "zarzamora", "zarzamoras", "arándano", "arandanos", "frutos rojos"]
  },
  {
    code: "50111508",
    description: "Limones frescos (Persa, Colima, Agrio, Italiano)",
    category: "Frutas",
    keywords: ["limon", "limón", "limones", "persa", "colima", "agrio", "limón agrio"]
  },
  {
    code: "50111509",
    description: "Papayas frescas (Maradol, Criolla)",
    category: "Frutas",
    keywords: ["papaya", "papayas", "maradol", "papayita"]
  },
  {
    code: "50111510",
    description: "Melones y sandías frescas",
    category: "Frutas",
    keywords: ["melon", "melón", "melones", "sandia", "sandía", "sandias", "cantaloupe", "honeydew"]
  },
  {
    code: "50111511",
    description: "Piñas frescas (Miel, Cayenne)",
    category: "Frutas",
    keywords: ["piña", "pina", "piñas", "pina miel", "pineapple"]
  },
  {
    code: "50111512",
    description: "Jícamas frescas y tubérculos dulces",
    category: "Frutas",
    keywords: ["jicama", "jícama", "jicamas", "jícama de agua"]
  },
  {
    code: "50111513",
    description: "Guayabas, maracuyá, carambola y frutas tropicales",
    category: "Frutas",
    keywords: ["guayaba", "guayabas", "maracuya", "maracuyá", "carambola", "fruta tropical", "kiwi"]
  },
  {
    code: "50111514",
    description: "Duraznos, ciruelas, albaricoques y nectarinas",
    category: "Frutas",
    keywords: ["durazno", "duraznos", "ciruela", "ciruelas", "albaricoque", "damasco", "nectarina", "chabacano"]
  },
  {
    code: "50111515",
    description: "Peras frescas (Anjou, Bartlett, Bosc)",
    category: "Frutas",
    keywords: ["pera", "peras", "anjou", "bartlett", "bosc"]
  },

  // HIERBAS, AROMÁTICAS Y CONDIMENTOS
  {
    code: "50171800",
    description: "Hierbas aromáticas, condimentos y especias (Cilantro, Perejil, Albahaca, Epazote)",
    category: "Hierbas y Aromáticas",
    keywords: ["hierba", "hierbas", "cilantro", "perejil", "albahaca", "epazote", "romero", "tomillo", "especia", "especias", "menta", "hierbabuena"]
  },

  // SECOS, ESPECIAS Y SEMILLAS
  {
    code: "50192500",
    description: "Frutos secos, nueces, almendras, semillas y chiles secos",
    category: "Secos y Especias",
    keywords: ["fruto seco", "nuez", "nueces", "almendra", "almendras", "semilla", "semillas", "arándano seco", "cacahuate seco", "chile seco", "ancho", "guajillo", "pasilla"]
  },

  // OTROS Y ABARROTES
  {
    code: "50192100",
    description: "Botanas, snacks, papas fritas y galletas",
    category: "Otros",
    keywords: ["botana", "botanas", "snack", "snacks", "papas", "fritura", "frituras", "galleta", "galletas", "cacahuate", "totopo", "totopos"]
  },
  {
    code: "50181900",
    description: "Panadería, galletas y repostería",
    category: "Otros",
    keywords: ["pan", "panaderia", "bolillo", "reposteria", "harina"]
  },
  {
    code: "50202300",
    description: "Jugos de frutas y verduras, bebidas no alcohólicas",
    category: "Otros",
    keywords: ["jugo", "jugos", "bebida", "bebidas", "agua", "refresco", "concentrado"]
  },
  {
    code: "50201700",
    description: "Café, té e infusiones",
    category: "Otros",
    keywords: ["cafe", "café", "te", "té", "infusion", "infusiones"]
  },
  {
    code: "50131700",
    description: "Productos lácteos y quesos",
    category: "Otros",
    keywords: ["queso", "quesos", "leche", "crema", "mantequilla", "lacteo", "lacteos"]
  },
  {
    code: "50151500",
    description: "Aceites comestibles y grasas vegetales",
    category: "Otros",
    keywords: ["aceite", "aceites", "grasa", "vegetal", "oliva", "canola"]
  }
];

// Unidades del SAT más comunes
export const SAT_UNITS: SatUnitOption[] = [
  { code: "KGM", name: "Kilogramo (KGM)", symbol: "kg" },
  { code: "H87", name: "Pieza (H87)", symbol: "pza" },
  { code: "LTR", name: "Litro (LTR)", symbol: "L" },
  { code: "X4X", name: "Caja / Empaque (X4X)", symbol: "caja" },
  { code: "GRM", name: "Gramo (GRM)", symbol: "g" },
  { code: "E48", name: "Unidad de Servicio (E48)", symbol: "srv" },
  { code: "XBX", name: "Atado / Manojo (XBX)", symbol: "atado" }
];

// Opciones de configuración de Impuestos SAT CFDI 4.0
export const SAT_TAX_OPTIONS: TaxRateOption[] = [
  {
    id: "iva_0",
    impuesto_tipo: "002",
    tasa_ocuota: 0.000000,
    label: "IVA 0% (Alimentos sin procesar, frutas, verduras)",
    shortLabel: "IVA 0%"
  },
  {
    id: "iva_16",
    impuesto_tipo: "002",
    tasa_ocuota: 0.160000,
    label: "IVA 16% (Tasa general / Productos procesados)",
    shortLabel: "IVA 16%"
  },
  {
    id: "ieps_8",
    impuesto_tipo: "003",
    tasa_ocuota: 0.080000,
    label: "IEPS 8% (Alimentos de alta densidad calórica / Botanas)",
    shortLabel: "IEPS 8%"
  },
  {
    id: "exento",
    impuesto_tipo: "EXENTO",
    tasa_ocuota: 0.000000,
    label: "Exento (Sin impuesto retenido o trasladado)",
    shortLabel: "Exento"
  }
];

// Opciones de Objeto de Impuesto CFDI 4.0
export const SAT_OBJETO_IMP_OPTIONS = [
  { code: "02", name: "02 - Sí objeto de impuesto (Estándar)" },
  { code: "01", name: "01 - No objeto de impuesto" },
  { code: "03", name: "03 - Sí objeto de impuesto y no obligado al desglose" }
];
