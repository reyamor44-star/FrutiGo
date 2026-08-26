import React from "react";
import CorporateAboutUs from "./CorporateAboutUs";

export interface FounderPhotoItem {
  url: string;
  caption?: string;
  description?: string;
}

export interface FounderData {
  name: string;
  role: string;
  photo: string;
  photoUrl?: string;
  photos?: FounderPhotoItem[];
  articles?: any[];
  bioP1?: string;
  bioP2?: string;
  bioP3?: string;
  bio1?: string;
  bio2?: string;
  bio?: string;
  quote?: string;
  linkedin?: string;
  youtube?: string;
  email?: string;
}

export const DEFAULT_FOUNDER_PHOTO = "https://firebasestorage.googleapis.com/v0/b/frutigo3.firebasestorage.app/o/founder-photos%2F1786483956397_vlk1om.jpg?alt=media&token=e622e4ce-4b10-486d-a296-45690f0f4ccd";

export const DEFAULT_FOUNDER_DATA: FounderData = {
  name: "FrutiGo Technologies",
  role: "Dirección de Infraestructura Tecnológica & Sistemas",
  photo: DEFAULT_FOUNDER_PHOTO,
  photoUrl: DEFAULT_FOUNDER_PHOTO,
  photos: [
    {
      url: DEFAULT_FOUNDER_PHOTO,
      caption: "FrutiGo Technologies — Infraestructura de Sistemas",
      description: "Dirección de Arquitectura y Sistemas en FrutiGo Technologies & FrutiGo Logistics."
    }
  ],
  quote: "En FrutiGo Technologies conectamos la frescura del campo y la eficiencia logística urbana a través de infraestructura de software robusta, transparente e ingeniería inteligente de alto rendimiento.",
  linkedin: "https://frutigo.com.mx/nosotros",
  youtube: "https://frutigo.com.mx/medios",
  email: "frutigo33@gmail.com"
};

interface FounderProfileCardProps {
  className?: string;
  data?: FounderData;
}

/**
 * Replaced with CorporateAboutUs component in adherence to corporate branding standards.
 */
export const FounderProfileCard: React.FC<FounderProfileCardProps> = ({ className = "" }) => {
  return <CorporateAboutUs className={className} />;
};

export default FounderProfileCard;
