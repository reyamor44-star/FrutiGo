import React from "react";
import { Mail, Globe } from "lucide-react";

export interface SocialNetworkLink {
  name: string;
  url: string;
  category: "founder" | "company" | "contact" | "app";
  ariaLabel: string;
  badge?: string;
  icon: (props: { className?: string }) => React.ReactElement;
  bgClass: string;
  borderClass?: string;
  hoverGlow?: string;
}

export const SOCIAL_LINKS: SocialNetworkLink[] = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/alberto-reyes-sandoval?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    category: "founder",
    ariaLabel: "Perfil oficial de LinkedIn de Alberto Reyes Sandoval",
    bgClass: "bg-[#0A66C2] text-white",
    borderClass: "border-[#004182]",
    hoverGlow: "hover:shadow-[#0A66C2]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    )
  },
  {
    name: "YouTube (Fundador)",
    url: "https://www.youtube.com/@albertofrutigo",
    category: "founder",
    ariaLabel: "Canal oficial de YouTube de Alberto Reyes Sandoval",
    badge: "@albertofrutigo",
    bgClass: "bg-[#FF0000] text-white",
    borderClass: "border-[#CC0000]",
    hoverGlow: "hover:shadow-[#FF0000]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  },
  {
    name: "YouTube (FrutiGo)",
    url: "https://www.youtube.com/@albertoreyesfrutigo",
    category: "company",
    ariaLabel: "Canal oficial de YouTube de FrutiGo y Desarrollo",
    badge: "@albertoreyesfrutigo",
    bgClass: "bg-[#CC0000] text-white",
    borderClass: "border-[#990000]",
    hoverGlow: "hover:shadow-[#CC0000]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  },
  {
    name: "Crunchbase",
    url: "https://www.crunchbase.com/person/alberto-reyes-sandoval",
    category: "founder",
    ariaLabel: "Perfil oficial de Crunchbase de Alberto Reyes Sandoval",
    bgClass: "bg-[#0288D1] text-white",
    borderClass: "border-[#026aa7]",
    hoverGlow: "hover:shadow-[#0288D1]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 3A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3h-15zM7 7.5h5a3.5 3.5 0 0 1 3.5 3.5v.5a3.5 3.5 0 0 1-3.5 3.5H7V7.5zm2.5 2.5v3h2.5a1.5 1.5 0 0 0 1.5-1.5v-.5A1.5 1.5 0 0 0 12 10H9.5z" />
      </svg>
    )
  },
  {
    name: "Dunsguide (D&B)",
    url: "https://www.dunsguide.com/6864818a-b01d-41b8-b375-4a9608ce5674/admin/profile/preview",
    category: "company",
    ariaLabel: "Perfil comercial verificado Dunsguide (Dun & Bradstreet) de FrutiGo y Alberto Reyes Sandoval",
    badge: "D&B DUNS",
    bgClass: "bg-[#002D62] text-white",
    borderClass: "border-[#001D40]",
    hoverGlow: "hover:shadow-[#002D62]/50",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16.5h-2v-2h2v2zm0-4h-2V7h2v6.5zm4.5 4h-2v-2h2v2zm0-4h-2V7h2v6.5z" />
      </svg>
    )
  },
  {
    name: "X (Twitter)",
    url: "https://x.com/Albertofruti",
    category: "founder",
    ariaLabel: "Cuenta oficial de X (Twitter) de Alberto Reyes Sandoval",
    bgClass: "bg-black text-white",
    borderClass: "border-zinc-800",
    hoverGlow: "hover:shadow-black/50",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/frutigo_delivery?igsi=MTF2bGFtMTQxemhreQ==",
    category: "company",
    ariaLabel: "Perfil oficial de Instagram de FrutiGo Delivery",
    bgClass: "bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white",
    borderClass: "border-[#dc2743]/50",
    hoverGlow: "hover:shadow-[#dc2743]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/share/1EBAhhHCEv/",
    category: "company",
    ariaLabel: "Página oficial de Facebook de FrutiGo",
    bgClass: "bg-[#1877F2] text-white",
    borderClass: "border-[#1464cc]",
    hoverGlow: "hover:shadow-[#1877F2]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@fruti.go",
    category: "company",
    ariaLabel: "Cuenta oficial de TikTok de FrutiGo",
    bgClass: "bg-black text-white",
    borderClass: "border-[#25F4EE]/40",
    hoverGlow: "hover:shadow-[#25F4EE]/30",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    )
  },
  {
    name: "Threads",
    url: "https://www.threads.net/@frutigo_delivery",
    category: "company",
    ariaLabel: "Cuenta oficial de Threads de FrutiGo",
    bgClass: "bg-[#101010] text-white",
    borderClass: "border-zinc-800",
    hoverGlow: "hover:shadow-zinc-700/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.186 24C5.514 24 0 18.544 0 12.001 0 5.459 5.514 0 12.186 0c6.672 0 12.186 5.459 12.186 12.001 0 2.215-.615 4.398-1.78 6.309l-2.03-1.258a10.02 10.02 0 0 0 1.464-5.051c0-5.318-4.475-9.646-9.84-9.646-5.365 0-9.84 4.328-9.84 9.646s4.475 9.646 9.84 9.646c2.81 0 5.37-1.184 7.185-3.09l1.66 1.7c-2.316 2.37-5.51 3.744-8.845 3.744zm4.183-9.52c-.114 2.203-1.657 3.639-3.926 3.639-2.368 0-4.04-1.572-4.04-3.793 0-2.22 1.672-3.792 4.04-3.792 1.577 0 2.87.72 3.498 1.942.234-.14.45-.29.654-.45 1.057-.84 1.67-1.988 1.67-3.138 0-2.348-2.218-4.25-5.302-4.25-3.69 0-6.69 2.766-6.69 6.168 0 3.402 3 6.168 6.69 6.168 2.05 0 3.96-.867 5.23-2.379l-1.824-1.115zm-3.926 1.693c1.196 0 1.967-.745 2.028-1.776-.554-.535-1.24-.82-2.028-.82-1.245 0-2.083.795-2.083 1.798 0 1.003.838 1.798 2.083 1.798z" />
      </svg>
    )
  },
  {
    name: "Quora",
    url: "https://es.quora.com/profile/Alberto-Reyes-Sandoval?ch=10&oid=3224999692&share=8799c97b&srid=5IIx71&target_type=user",
    category: "founder",
    ariaLabel: "Perfil oficial de Quora de Alberto Reyes Sandoval",
    bgClass: "bg-[#B92B27] text-white",
    borderClass: "border-[#96221f]",
    hoverGlow: "hover:shadow-[#B92B27]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.02 0C5.38 0 0 5.38 0 12.02c0 5.37 3.52 9.91 8.37 11.44l-.2-1.92c-3.73-1.39-6.39-4.99-6.39-9.52 0-5.64 4.58-10.22 10.24-10.22 5.66 0 10.24 4.58 10.24 10.22 0 4.53-2.66 8.13-6.39 9.52l-.2 1.92c4.85-1.53 8.37-6.07 8.37-11.44C24.04 5.38 18.66 0 12.02 0zm-.02 4.41c-4.14 0-7.5 3.36-7.5 7.5 0 3.32 2.16 6.13 5.16 7.1l.47-4.52c-1.74-.6-3.03-2.26-3.03-4.18 0-2.43 1.97-4.4 4.4-4.4 2.43 0 4.4 1.97 4.4 4.4 0 1.92-1.29 3.58-3.03 4.18l.47 4.52c3-.97 5.16-3.78 5.16-7.1 0-4.14-3.36-7.5-7.5-7.5z" />
      </svg>
    )
  },
  {
    name: "Medium",
    url: "https://medium.com/@reyamor44",
    category: "founder",
    ariaLabel: "Artículos y publicaciones en Medium de Alberto Reyes Sandoval",
    bgClass: "bg-[#242424] text-white",
    borderClass: "border-zinc-700",
    hoverGlow: "hover:shadow-zinc-700/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    )
  },
  {
    name: "F6S",
    url: "https://www.f6s.com/albertoreyessandoval",
    category: "founder",
    ariaLabel: "Perfil oficial de F6S de Alberto Reyes Sandoval",
    bgClass: "bg-[#E44F26] text-white",
    borderClass: "border-[#bf3d19]",
    hoverGlow: "hover:shadow-[#E44F26]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v15A1.5 1.5 0 0 0 2.5 21h19a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 21.5 3h-19zm2.75 3.5h7.25v2.25H7.75v2.5h4v2.25h-4v4H5.25v-11zm9.5 0h6.5v2.25h-4.25v2h3.5v2.25h-3.5v2.25h4.5V17.5h-6.75v-11z" />
      </svg>
    )
  },
  {
    name: "Google Play Store",
    url: "https://play.google.com/store/apps/details?id=com.frutigo.app",
    category: "app",
    ariaLabel: "Descargar aplicación oficial de FrutiGo en Google Play Store",
    badge: "com.frutigo.app",
    bgClass: "bg-[#01875F] text-white",
    borderClass: "border-[#016849]",
    hoverGlow: "hover:shadow-[#01875F]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.61-1.636V3.45c0-.624.225-1.205.609-1.636zm11.237 11.24L17.58 15.8l-11.83 6.83 9.096-9.576zm0-2.108L5.75 1.37 17.58 8.2l-2.734 2.746zm1.488 1.054l3.666 2.117a1.696 1.696 0 0 1 0 2.946l-3.666 2.117-2.124-2.124 2.124-2.124z" />
      </svg>
    )
  },
  {
    name: "FrutiGo Web",
    url: "https://frutigo.com.mx/",
    category: "company",
    ariaLabel: "Sitio web oficial de FrutiGo México",
    bgClass: "bg-[#0F3A1D] text-[#E5FF7F]",
    borderClass: "border-[#1A5C30]",
    hoverGlow: "hover:shadow-[#0F3A1D]/50",
    icon: ({ className = "w-3.5 h-3.5" }) => <Globe className={className} />
  },
  {
    name: "Correo Oficial",
    url: "mailto:frutigo33@gmail.com",
    category: "contact",
    ariaLabel: "Enviar correo de contacto a frutigo33@gmail.com",
    badge: "frutigo33@gmail.com",
    bgClass: "bg-[#059669] text-white",
    borderClass: "border-[#047857]",
    hoverGlow: "hover:shadow-[#059669]/40",
    icon: ({ className = "w-3.5 h-3.5" }) => <Mail className={className} />
  }
];

interface SocialFooterLinksProps {
  className?: string;
}

export default function SocialFooterLinks({ className = "" }: SocialFooterLinksProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col space-y-3">
        {/* Header Label */}
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200/80 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-xs" />
            <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-zinc-800">
              Redes Sociales & Enlaces Oficiales
            </h4>
          </div>
          <span className="text-[10px] sm:text-[11px] text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shadow-2xs">
            {SOCIAL_LINKS.length} canales verificados
          </span>
        </div>

        {/* Compact, Sleek Micro-Button Grid */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {SOCIAL_LINKS.map((link) => {
            const IconComp = link.icon;
            const isEmail = link.url.startsWith("mailto:");

            return (
              <a
                key={link.name + link.url}
                href={link.url}
                target={isEmail ? undefined : "_blank"}
                rel={isEmail ? undefined : "noopener noreferrer"}
                aria-label={link.ariaLabel}
                title={`${link.name}${link.badge ? ` (${link.badge})` : ""}`}
                className={`group/soc inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl border shadow-xs transition-all duration-200 transform hover:-translate-y-0.5 hover:brightness-110 active:scale-95 text-[11px] font-bold ${link.bgClass} ${link.borderClass || "border-transparent"} ${link.hoverGlow || ""} cursor-pointer`}
              >
                <span className="shrink-0 transition-transform duration-200 group-hover/soc:scale-115">
                  <IconComp className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-tight whitespace-nowrap">
                  {link.name}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
