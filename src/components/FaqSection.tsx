import React from "react";
import { HelpCircle, ChevronDown, Sparkles, Download, ShieldCheck, HeartHandshake, Truck, Bike } from "lucide-react";

export interface FaqItemData {
  id: string;
  question: string;
  answerHtml: string;
  icon?: React.ReactNode;
}

export const FRUTIGO_FAQS: FaqItemData[] = [
  {
    id: "faq-1",
    question: "¿Qué servicios ofrece FrutiGo en la Zona Sur de Guadalajara?",
    answerHtml: `FrutiGo ofrece en su Fase 1 servicios de <strong>paquetería exprés local ultrarrápida</strong> y <strong>Taxi Pet</strong> para el traslado seguro y cómodo de mascotas en toda la Zona Sur de Guadalajara, Jalisco. En su Fase 2, se integrará el marketplace de fruta fresca y alimentos locales. Puedes solicitar todos estos servicios descargando la <a href="https://play.google.com/store/apps/details?id=com.tuapp.frutigo" target="_blank" rel="noopener noreferrer" class="text-emerald-800 font-bold underline hover:text-emerald-950">aplicación de FrutiGo en Google Play Store</a> o visitando nuestra web oficial <a href="https://frutigo.com.mx" class="text-emerald-800 font-bold underline hover:text-emerald-950">frutigo.com.mx</a>.`
  },
  {
    id: "faq-2",
    question: "¿Cómo funciona el servicio de Taxi Pet para el traslado de mascotas?",
    answerHtml: `El servicio de Taxi Pet de FrutiGo está diseñado exclusivamente para el <strong>traslado seguro, climatizado y con protocolos de cuidado</strong> para perros, gatos y otras mascotas en la Zona Sur de Guadalajara. Los viajes se solicitan en tiempo real desde la <a href="https://play.google.com/store/apps/details?id=com.tuapp.frutigo" target="_blank" rel="noopener noreferrer" class="text-emerald-800 font-bold underline hover:text-emerald-950">app móvil de FrutiGo</a>, permitiendo monitorear la ruta por GPS con conductores capacitados y amigables con los animales.`
  },
  {
    id: "faq-3",
    question: "¿Cuáles son los requisitos y beneficios para trabajar como repartidor en FrutiGo?",
    answerHtml: `FrutiGo implementa un modelo laboral ético y justo que limita las jornadas a un <strong>máximo de 6 horas diarias</strong> para evitar el agotamiento y promover el bienestar del repartidor, acompañado de comisiones competitivas y transparentes. Para registrarte como socio repartidor (en moto o auto), solo necesitas subir tu identificación oficial y documentación directamente desde la <a href="https://play.google.com/store/apps/details?id=com.tuapp.frutigo" target="_blank" rel="noopener noreferrer" class="text-emerald-800 font-bold underline hover:text-emerald-950">aplicación oficial de FrutiGo</a>.`
  },
  {
    id: "faq-4",
    question: "¿Dónde y cómo puedo descargar la aplicación móvil de FrutiGo?",
    answerHtml: `Puedes descargar la aplicación oficial de FrutiGo para dispositivos Android de forma 100% gratuita directamente desde la <a href="https://play.google.com/store/apps/details?id=com.tuapp.frutigo" target="_blank" rel="noopener noreferrer" class="text-emerald-800 font-bold underline hover:text-emerald-950">tienda oficial de Google Play Store</a> o accediendo desde nuestro portal web <a href="https://frutigo.com.mx" class="text-emerald-800 font-bold underline hover:text-emerald-950">https://frutigo.com.mx</a> para comenzar a enviar paquetes y solicitar Taxi Pet al instante.`
  },
  {
    id: "faq-5",
    question: "¿Cómo apoya FrutiGo a las comunidades nativas y al comercio local?",
    answerHtml: `En su Fase 2, FrutiGo implementa una política social de <strong>0% de comisión para productores de comunidades nativas</strong> y pequeños agricultores locales en su marketplace de frutas y verduras frescas. Esto garantiza un comercio 100% justo, precios directos del campo sin intermediarios y apoyo económico directo a las familias productoras de la región de Jalisco.`
  }
];

export default function FaqSection({ className = "" }: { className?: string }) {
  return (
    <section 
      id="seccion-faq" 
      aria-labelledby="faq-main-heading"
      className={`py-12 px-4 sm:px-6 bg-zinc-50 border-t border-zinc-200 rounded-3xl my-8 ${className}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-300">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-800" />
            <span>Centro de Ayuda & FAQ Oficial</span>
          </div>
          <h2 id="faq-main-heading" className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Preguntas Frecuentes sobre FrutiGo
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            Conoce todo sobre nuestros servicios de paquetería exprés, Taxi Pet seguro, trabajo digno para repartidores y apoyo al comercio local en Guadalajara.
          </p>
        </div>

        {/* Acordeón Accesible usando <details> y <summary> */}
        <div className="space-y-3 pt-2">
          {FRUTIGO_FAQS.map((faq, index) => (
            <details
              key={faq.id}
              id={`faq-item-${index + 1}`}
              className="group bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs hover:border-zinc-300 open:border-emerald-800 open:shadow-md transition-all duration-200"
              {...(index === 0 ? { open: true } : {})}
            >
              <summary className="flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-zinc-900 cursor-pointer list-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700">
                <span className="pr-4 flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black shrink-0 border border-emerald-200">
                    {index + 1}
                  </span>
                  <span>{faq.question}</span>
                </span>
                <span className="w-8 h-8 rounded-full bg-zinc-100 group-open:bg-emerald-800 group-open:text-brand-yellow text-zinc-600 flex items-center justify-center shrink-0 transition-transform duration-200 group-open:rotate-180">
                  <ChevronDown className="w-4 h-4" />
                </span>
              </summary>

              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs sm:text-sm text-zinc-700 leading-relaxed border-t border-zinc-100">
                <div 
                  dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  className="space-y-2 prose prose-sm max-w-none prose-a:text-emerald-800 prose-a:font-bold hover:prose-a:underline"
                />
              </div>
            </details>
          ))}
        </div>

        {/* Banner de llamada a la acción en la app */}
        <div className="mt-8 p-5 bg-gradient-to-r from-[#0F3A1D] to-emerald-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-emerald-700">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-base font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span>¿Listo para enviar paquetes o solicitar Taxi Pet?</span>
            </h3>
            <p className="text-xs text-emerald-200">
              Descarga gratis la app de FrutiGo en Google Play Store y comienza hoy mismo.
            </p>
          </div>
          <a
            href="https://play.google.com/store/apps/details?id=com.tuapp.frutigo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-zinc-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Descargar en Google Play</span>
          </a>
        </div>
      </div>
    </section>
  );
}
