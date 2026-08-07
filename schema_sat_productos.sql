-- =============================================================================
-- SCRIPT DE MIGRACIÓN SQL: CAMPOS FISCALES SAT CFDI 4.0 EN TABLA DE PRODUCTOS
-- Sistema: Fruti Go B2B Distribuidora
-- =============================================================================

-- 1. Agregar columnas fiscales para timbrado de facturas CFDI 4.0
ALTER TABLE productos
ADD COLUMN IF NOT EXISTS clave_sat VARCHAR(8) DEFAULT '50111500',
ADD COLUMN IF NOT EXISTS unidad_sat VARCHAR(5) DEFAULT 'KGM',
ADD COLUMN IF NOT EXISTS objeto_imp VARCHAR(2) DEFAULT '02',
ADD COLUMN IF NOT EXISTS impuesto_tipo VARCHAR(3) DEFAULT '002',
ADD COLUMN IF NOT EXISTS tasa_ocuota DECIMAL(10,6) DEFAULT 0.000000,
ADD COLUMN IF NOT EXISTS precio_incluye_iva BOOLEAN DEFAULT true;

-- 2. Documentación de columnas y descripciones del catálogo SAT
COMMENT ON COLUMN productos.clave_sat IS 'ClaveProdServ del catálogo del SAT (8 dígitos, ej: 50111500 para Frutas, 50192100 para Snacks)';
COMMENT ON COLUMN productos.unidad_sat IS 'ClaveUnidad del catálogo del SAT (ej: KGM para Kilogramo, H87 para Pieza, LTR para Litro)';
COMMENT ON COLUMN productos.objeto_imp IS '01=No objeto de impuesto, 02=Sí objeto de impuesto, 03=Sí objeto de impuesto y no obligado al desglose';
COMMENT ON COLUMN productos.impuesto_tipo IS '002=IVA, 003=IEPS, EXENTO=Exento de impuesto';
COMMENT ON COLUMN productos.tasa_ocuota IS 'Tasa o cuota del impuesto (ej: 0.160000 para IVA 16%, 0.000000 para IVA 0%, 0.080000 para IEPS 8%)';
COMMENT ON COLUMN productos.precio_incluye_iva IS 'true=El precio mostrado en tienda ya incluye impuestos, false=Precio antes de impuestos';

-- 3. Índices para optimización de consultas de facturación
CREATE INDEX IF NOT EXISTS idx_productos_clave_sat ON productos(clave_sat);
CREATE INDEX IF NOT EXISTS idx_productos_unidad_sat ON productos(unidad_sat);

-- 4. Actualización de datos preexistentes (Ejemplo para Frutas y Verduras a Tasa 0% IVA)
UPDATE productos 
SET 
  clave_sat = '50111500', 
  unidad_sat = 'KGM', 
  objeto_imp = '02', 
  impuesto_tipo = '002', 
  tasa_ocuota = 0.000000, 
  precio_incluye_iva = true 
WHERE categoria IN ('Frutas', 'Verduras', 'Hierbas y Aromáticas');
