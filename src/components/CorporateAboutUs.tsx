import React from "react";
import {
  Cpu,
  Truck,
  Building2,
  ShieldCheck,
  Zap,
  Network,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Server,
  Layers,
  CheckCircle2,
  Lock,
  Globe2,
  Database,
  LineChart
} from "lucide-react";

interface CorporateAboutUsProps {
  className?: string;
}

export const CorporateAboutUs: React.FC<CorporateAboutUsProps> = ({ className = "" }) => {
  return (
    <article
      id="acerca-de-nosotros-infraestructura"
      className={`space-y-6 sm:space-y-10 text-zinc-900 ${className}`}
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* Meta Organization schema hints */}
      <meta itemProp="name" content="FrutiGo Technologies" />
      <meta itemProp="url" content="https://frutigo.com.mx" />
      <meta itemProp="logo" content="https://frutigo.com.mx/logo.svg" />

      {/* Hero / Encabezado Principal */}
      <header className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white p-6 sm:p-10 lg:p-12 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-zinc-700/10 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>Infraestructura & Plataforma Corporativa</span>
          </div>

          <h1
            id="titulo-infraestructura-tecnologica"
            className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight"
            itemProp="headline"
          >
            FrutiGo Technologies — <span className="text-zinc-300">Infraestructura Logística</span> y Comercio Digital
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base lg:text-lg font-normal leading-relaxed">
            Plataforma de alta disponibilidad para la digitalización de la cadena de suministro agroalimentaria y la distribución de última milla en México.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="/cliente"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, "", "/cliente");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-950" />
              <span>Portal Mayorista B2B</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <a
              href="/tienda"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState(null, "", "/tienda");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm border border-zinc-700 shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Tienda en Línea</span>
              <ArrowRight className="w-4 h-4 text-zinc-300" />
            </a>
          </div>
        </div>
      </header>

      {/* Bloque de Propósito */}
      <section
        id="bloque-proposito-corporativo"
        className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-2 text-zinc-900 text-xs font-black uppercase tracking-wider">
          <Network className="w-4 h-4 text-zinc-700" />
          <span>Propósito y Modelo Tecnológico</span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 tracking-tight">
          Conectando comercios, restaurantes y consumidores mediante tecnología de vanguardia
        </h2>

        <p
          className="text-zinc-700 text-sm sm:text-base leading-relaxed font-normal"
          itemProp="description"
        >
          En <strong>FrutiGo Technologies</strong> conectamos comercios locales, restaurantes y clientes finales mediante tecnología de ruteo eficiente y una cadena de suministro completamente digitalizada. Nuestra arquitectura elimina intermediarios innecesarios, garantizando frescura, trazabilidad de producto y una operación logística ágil, transparente y sostenible.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100 text-xs">
          <div className="flex items-start gap-2 text-zinc-700">
            <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
            <span>Trazabilidad directa desde el origen agroalimentario</span>
          </div>
          <div className="flex items-start gap-2 text-zinc-700">
            <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
            <span>Integración automatizada para compras corporativas</span>
          </div>
          <div className="flex items-start gap-2 text-zinc-700">
            <CheckCircle2 className="w-4 h-4 text-zinc-700 shrink-0 mt-0.5" />
            <span>Monitoreo en tiempo real de despacho y entrega</span>
          </div>
        </div>
      </section>

      {/* Pilares Corporativos (3 tarjetas) */}
      <section id="pilares-corporativos" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-900 text-xs font-black uppercase tracking-wider">
            <Layers className="w-4 h-4 text-zinc-700" />
            <span>Pilares Corporativos</span>
          </div>
          <span className="text-[11px] font-bold text-zinc-500">Arquitectura de Plataforma</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Pilar 1: Logística Inteligente */}
          <div
            id="pilar-logistica-inteligente"
            className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-zinc-200 hover:border-zinc-400 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6 text-zinc-800" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                Logística Inteligente
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Ruteo optimizado en tiempo real y despacho de última milla con algoritmos avanzados de asignación y eficiencia de flota.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-extrabold text-zinc-800">
              <Zap className="w-3.5 h-3.5 text-zinc-600" />
              <span>Despacho y Ruteo Dinámico</span>
            </div>
          </div>

          {/* Pilar 2: Comercio B2B Integrado */}
          <div
            id="pilar-comercio-b2b"
            className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-zinc-200 hover:border-zinc-400 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-zinc-800" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                Comercio B2B Integrado
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Abastecimiento directo para negocios, restaurantes y mayoristas con catálogos institucionales, facturación CFDI y precios preferenciales.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-extrabold text-zinc-800">
              <ShoppingBag className="w-3.5 h-3.5 text-zinc-600" />
              <span>Suministro Mayorista y Empresas</span>
            </div>
          </div>

          {/* Pilar 3: Escalabilidad y Seguridad */}
          <div
            id="pilar-escalabilidad-seguridad"
            className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-zinc-200 hover:border-zinc-400 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-zinc-800" />
              </div>
              <h3 className="text-lg font-black text-zinc-900 tracking-tight">
                Escalabilidad y Seguridad
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Pagos procesados de forma segura, protección de datos bajo estándares internacionales y soporte operativo continuo de alta disponibilidad.
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-[11px] font-extrabold text-zinc-800">
              <Lock className="w-3.5 h-3.5 text-zinc-600" />
              <span>Transacciones Seguras & 99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Liderazgo Institucional */}
      <footer
        id="bloque-liderazgo-corporativo"
        className="bg-zinc-100 rounded-2xl p-4 sm:p-5 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-2 text-zinc-700">
          <Server className="w-4 h-4 text-zinc-700 shrink-0" />
          <span className="font-bold text-zinc-900">
            FrutiGo Technologies — Dirección de Arquitectura e Infraestructura de Sistemas.
          </span>
        </div>

        <div className="flex items-center gap-3 text-zinc-500 font-medium shrink-0">
          <span>Zapopan & Guadalajara, Jalisco</span>
          <span>•</span>
          <a
            href="mailto:frutigo33@gmail.com"
            className="text-zinc-800 hover:text-black font-bold underline"
          >
            frutigo33@gmail.com
          </a>
        </div>
      </footer>
    </article>
  );
};

export default CorporateAboutUs;
