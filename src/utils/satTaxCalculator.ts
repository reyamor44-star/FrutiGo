/**
 * SAT Tax Calculator Utility for CFDI 4.0
 * Calculates Base Gravable, Tax Breakdown (IVA / IEPS / Exento), Subtotal, and Totals
 * according to Mexican SAT regulations.
 */

export interface SatTaxInput {
  priceUnit: number;
  quantity: number;
  precioIncluyeIva?: boolean; // default: true
  impuestoTipo?: string; // "002" | "003" | "EXENTO"
  tasaOCuota?: number; // e.g. 0.160000, 0.080000, 0.000000
  objetoImp?: string; // "01" | "02" | "03" (default "02")
}

export interface SatTaxResult {
  importeBruto: number; // Unit price * Quantity
  baseGravable: number; // Base for tax calculation (2 decimals)
  impuestoMonto: number; // Tax amount (2 decimals)
  subtotalSinImpuestos: number; // Base subtotal
  totalConImpuestos: number; // Final total for this item
  tasaOCuotaFormatted: string; // 6 decimals string, e.g., "0.160000"
  impuestoTipo: string; // "002", "003", "EXENTO"
  objetoImp: string; // "01", "02", "03"
  impuestoNombre: string; // "IVA", "IEPS", "Exento"
}

export function calculateSatTaxes(input: SatTaxInput): SatTaxResult {
  const priceUnit = Number(input.priceUnit) || 0;
  const quantity = Number(input.quantity) || 0;
  const precioIncluyeIva = input.precioIncluyeIva !== false; // Default true
  const impuestoTipo = input.impuestoTipo || "002";
  const rate = Number(input.tasaOCuota) || 0;
  const objetoImp = input.objetoImp || "02";

  const importeBruto = Number((priceUnit * quantity).toFixed(2));

  let impuestoNombre = "IVA";
  if (impuestoTipo === "003") impuestoNombre = "IEPS";
  if (impuestoTipo === "EXENTO" || objetoImp === "01") impuestoNombre = "Exento";

  // Case 1: No tax object or EXENTO or rate is 0
  if (objetoImp === "01" || impuestoTipo === "EXENTO" || rate === 0) {
    const base = importeBruto;
    return {
      importeBruto,
      baseGravable: base,
      impuestoMonto: 0,
      subtotalSinImpuestos: base,
      totalConImpuestos: base,
      tasaOCuotaFormatted: rate.toFixed(6),
      impuestoTipo: impuestoTipo === "EXENTO" ? "002" : impuestoTipo,
      objetoImp,
      impuestoNombre
    };
  }

  // Case 2: Active tax rate (e.g. 0.16 or 0.08)
  let baseGravable = 0;
  let impuestoMonto = 0;

  if (precioIncluyeIva) {
    // Price includes tax: Base = Total / (1 + Rate)
    // Rounded to 2 decimals per SAT rule
    baseGravable = Number((importeBruto / (1 + rate)).toFixed(2));
    impuestoMonto = Number((importeBruto - baseGravable).toFixed(2));
  } else {
    // Price + tax: Base = ImporteBruto
    baseGravable = importeBruto;
    impuestoMonto = Number((baseGravable * rate).toFixed(2));
  }

  const totalConImpuestos = Number((baseGravable + impuestoMonto).toFixed(2));

  return {
    importeBruto,
    baseGravable,
    impuestoMonto,
    subtotalSinImpuestos: baseGravable,
    totalConImpuestos,
    tasaOCuotaFormatted: rate.toFixed(6),
    impuestoTipo,
    objetoImp,
    impuestoNombre
  };
}

/**
 * Helper to calculate total invoice breakdown for an array of items
 */
export function calculateOrderSatBreakdown(items: Array<{ product: any; quantity: number }>) {
  let subtotal = 0;
  let totalIva = 0;
  let totalIeps = 0;
  let grandTotal = 0;

  const itemDetails = items.map((item) => {
    const p = item.product || {};
    const taxRes = calculateSatTaxes({
      priceUnit: p.price,
      quantity: item.quantity,
      precioIncluyeIva: p.precio_incluye_iva !== false,
      impuestoTipo: p.impuesto_tipo || "002",
      tasaOCuota: p.tasa_ocuota !== undefined ? p.tasa_ocuota : 0.0,
      objetoImp: p.objeto_imp || "02"
    });

    subtotal += taxRes.subtotalSinImpuestos;
    if (taxRes.impuestoTipo === "002") {
      totalIva += taxRes.impuestoMonto;
    } else if (taxRes.impuestoTipo === "003") {
      totalIeps += taxRes.impuestoMonto;
    }
    grandTotal += taxRes.totalConImpuestos;

    return {
      product: p,
      quantity: item.quantity,
      taxBreakdown: taxRes
    };
  });

  return {
    subtotal: Number(subtotal.toFixed(2)),
    totalIva: Number(totalIva.toFixed(2)),
    totalIeps: Number(totalIeps.toFixed(2)),
    totalImpuestos: Number((totalIva + totalIeps).toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
    items: itemDetails
  };
}
