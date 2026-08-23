const MAX_ITEMS = 10;
const STORAGE_KEY = "casele_recently_viewed";

export function addRecentlyViewed(productId: string): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getRecentlyViewed();
    const filtered = existing.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — degrade gracefully
  }
}

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
