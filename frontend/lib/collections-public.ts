import { API_BASE_URL } from "@/lib/api"
import { fetchCollectionsApi } from "@/lib/collection-api"

export type PublicCollection = {
  id: string
  name: string
  heroImage: string
  description: string
}

export function parseCollection(raw: unknown): PublicCollection | null {
  if (!raw || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  const id = r.id != null ? String(r.id) : null
  const name = typeof r.name === "string" ? r.name : null
  if (!id || !name) return null
  return {
    id,
    name,
    heroImage: typeof r.heroImage === "string" ? r.heroImage : "",
    description: typeof r.description === "string" ? r.description : "",
  }
}

/** URL segment for routes: stable for common names (e.g. "Men" → "men"). */
export function collectionNameToSlug(name: string): string {
  const s = name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return s || "collection"
}

export async function getPublicCollections(): Promise<PublicCollection[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/collections`, {
      next: { revalidate: 120 },
    })
    if (!res.ok) return []
    const rows: unknown = await res.json()
    if (!Array.isArray(rows)) return []
    return rows.map(parseCollection).filter((x): x is PublicCollection => x != null)
  } catch {
    return []
  }
}

export async function fetchPublicCollectionsClient(): Promise<PublicCollection[]> {
  const rows = await fetchCollectionsApi()
  if (!Array.isArray(rows)) return []
  return rows.map(parseCollection).filter((x): x is PublicCollection => x != null)
}

export function isCollectionsSectionPath(pathname: string | null): boolean {
  if (!pathname) return false
  return pathname === "/collections" || pathname.startsWith("/collections/")
}
