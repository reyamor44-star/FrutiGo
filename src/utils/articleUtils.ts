export interface ArticleImage {
  url: string;
  caption?: string;
}

export interface FounderArticle {
  id: string;
  title: string;
  date: string;
  category?: string;
  summary?: string;
  content: string;
  images?: ArticleImage[];
  authorName?: string;
  signedBy?: string;
  createdAt?: number;
  updatedAt?: number;
}

/**
 * Extracts a numeric timestamp from an article object using createdAt, updatedAt, id, or date string.
 */
export function getArticleTimestamp(art: any): number {
  if (!art) return 0;

  if (typeof art.createdAt === "number" && !isNaN(art.createdAt) && art.createdAt > 0) {
    return art.createdAt;
  }
  if (typeof art.updatedAt === "number" && !isNaN(art.updatedAt) && art.updatedAt > 0) {
    return art.updatedAt;
  }

  // Check if id contains a timestamp (e.g. art-1786770260495)
  if (typeof art.id === "string") {
    const match = art.id.match(/\d{10,15}/);
    if (match) {
      const parsed = parseInt(match[0], 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }

  // Parse date string (Spanish months supported)
  if (typeof art.date === "string" && art.date.trim()) {
    const raw = art.date.trim().toLowerCase();
    const months: Record<string, number> = {
      enero: 0,
      feb: 1,
      febrero: 1,
      mar: 2,
      marzo: 2,
      abr: 3,
      abril: 3,
      may: 4,
      mayo: 4,
      jun: 5,
      junio: 5,
      jul: 6,
      julio: 6,
      ago: 7,
      agosto: 7,
      sep: 8,
      sept: 8,
      septiembre: 8,
      oct: 9,
      octubre: 9,
      nov: 10,
      noviembre: 10,
      dic: 11,
      diciembre: 11,
    };

    for (const [mName, mIdx] of Object.entries(months)) {
      if (raw.includes(mName)) {
        const dayMatch = raw.match(/\b(\d{1,2})\b/);
        const yearMatch = raw.match(/\b(20\d{2})\b/);
        const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;
        const year = yearMatch ? parseInt(yearMatch[1], 10) : 2026;
        return new Date(year, mIdx, day).getTime();
      }
    }

    const parsedDirect = Date.parse(art.date);
    if (!isNaN(parsedDirect)) return parsedDirect;
  }

  // Fallback for art-1, art-2 legacy IDs (art-1 is newer than art-2)
  if (typeof art.id === "string") {
    if (art.id === "art-1") return 1785900000000;
    if (art.id === "art-2") return 1785640000000;
  }

  return 0;
}

/**
 * Sorts articles strictly with newest at the top (descending order) and oldest at the bottom.
 */
export function sortArticlesNewestFirst<T = any>(articles: T[]): T[] {
  if (!Array.isArray(articles)) return [];
  return [...articles].sort((a: any, b: any) => {
    const timeA = getArticleTimestamp(a);
    const timeB = getArticleTimestamp(b);
    return timeB - timeA; // Descending: newest first
  });
}
