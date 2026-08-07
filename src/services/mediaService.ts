export interface FounderMediaItem {
  id: string;
  title: string;
  description: string;
  type: "image" | "video" | "youtube";
  url: string;
  youtubeId?: string;
  altText: string;
  createdAt: string;
}

const STORAGE_KEY = "fg_founder_media_v1";

// Helper to extract YouTube video ID from standard URLs or embed URLs
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  return null;
}

// Initial seed data for Alberto Reyes Sandoval
const DEFAULT_MEDIA_ITEMS: FounderMediaItem[] = [
  {
    id: "seed-1",
    title: "Alberto Reyes Sandoval - Fundador y CEO de Fruti Go",
    description: "Fotografía oficial de Alberto Reyes Sandoval, Creador, Desarrollador Principal y CEO de Fruti Go en Guadalajara, Jalisco.",
    type: "image",
    url: "/logo.svg",
    altText: "Alberto Reyes Sandoval - Creador, Desarrollador Principal y Fundador de Fruti Go",
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-2",
    title: "Presentación de la Plataforma Fruti Go",
    description: "Video explicativo sobre la arquitectura tecnológica y el modelo de distribución directa del campo a tu hogar ideado por Alberto Reyes Sandoval.",
    type: "youtube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    altText: "Alberto Reyes Sandoval - Presentación de Tecnología y Visión Fruti Go",
    createdAt: new Date().toISOString()
  }
];

export const mediaService = {
  getFounderMedia(): FounderMediaItem[] {
    if (typeof window === "undefined") return DEFAULT_MEDIA_ITEMS;
    try {
      // Async fetch from server API to update cache
      fetch("/api/founder/media")
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("HTTP " + res.status);
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const localStr = localStorage.getItem(STORAGE_KEY);
            if (JSON.stringify(data) !== localStr) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
              window.dispatchEvent(new Event("fg_founder_media_updated"));
            }
          }
        })
        .catch(() => {});

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MEDIA_ITEMS));
      return DEFAULT_MEDIA_ITEMS;
    } catch (error) {
      console.error("Error reading founder media storage:", error);
      return DEFAULT_MEDIA_ITEMS;
    }
  },

  saveFounderMedia(items: FounderMediaItem[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("fg_founder_media_updated"));
      
      // Post to backend server API
      fetch("/api/founder/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items)
      }).catch((e) => console.error("Error al guardar galería en servidor:", e));
    } catch (error) {
      console.error("Error saving founder media:", error);
    }
  },

  addFounderMedia(itemData: Omit<FounderMediaItem, "id" | "createdAt">): FounderMediaItem {
    const current = this.getFounderMedia();
    let youtubeId = itemData.youtubeId;
    if (itemData.type === "youtube" && !youtubeId) {
      youtubeId = extractYouTubeId(itemData.url) || undefined;
    }

    const newItem: FounderMediaItem = {
      ...itemData,
      id: "media-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      youtubeId,
      altText: itemData.altText.trim() || "Alberto Reyes Sandoval - Fundador de Fruti Go",
      createdAt: new Date().toISOString()
    };

    const updated = [newItem, ...current];
    this.saveFounderMedia(updated);
    return newItem;
  },

  updateFounderMedia(id: string, updates: Partial<FounderMediaItem>): FounderMediaItem | null {
    const current = this.getFounderMedia();
    const index = current.findIndex(item => item.id === id);
    if (index === -1) return null;

    let youtubeId = updates.youtubeId;
    if (updates.type === "youtube" || (current[index].type === "youtube" && updates.url)) {
      const urlToTest = updates.url || current[index].url;
      youtubeId = extractYouTubeId(urlToTest) || undefined;
    }

    const updatedItem = {
      ...current[index],
      ...updates,
      youtubeId: youtubeId ?? current[index].youtubeId
    };

    current[index] = updatedItem;
    this.saveFounderMedia(current);
    return updatedItem;
  },

  deleteFounderMedia(id: string): boolean {
    const current = this.getFounderMedia();
    const filtered = current.filter(item => item.id !== id);
    if (filtered.length !== current.length) {
      this.saveFounderMedia(filtered);
      return true;
    }
    return false;
  },

  subscribe(listener: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const handleUpdate = () => listener();
    window.addEventListener("fg_founder_media_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("fg_founder_media_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }
};
