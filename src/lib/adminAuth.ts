const STORAGE_KEY = "fg_admin_password";

export function getAdminPassword(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export function clearAdminPassword(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}

/** Valida la contraseña en el servidor (ADMIN_PASSWORD) y la guarda en la sesión. */
export async function adminLogin(password: string): Promise<boolean> {
  if (!password) return false;
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-password": password },
    body: JSON.stringify({}),
  });
  if (!res.ok) return false;
  try {
    sessionStorage.setItem(STORAGE_KEY, password);
  } catch {}
  return true;
}

function isSameOriginApi(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin === window.location.origin && parsed.pathname.startsWith("/api/");
  } catch {
    return false;
  }
}

/** Adjunta `x-admin-password` a las llamadas a /api del mismo origen tras iniciar sesión. */
export function installAdminFetch(): void {
  if (typeof window === "undefined") return;
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const password = getAdminPassword();
    if (!password || !isSameOriginApi(url)) return originalFetch(input, init);
    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    if (!headers.has("x-admin-password")) headers.set("x-admin-password", password);
    return originalFetch(input, { ...init, headers });
  };
}
