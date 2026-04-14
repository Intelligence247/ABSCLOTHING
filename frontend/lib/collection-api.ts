import { apiFetch } from "@/lib/api"

export type CollectionWritePayload = {
  name: string
  description: string
  heroImage: string
  productIds: string[]
}

export function buildCollectionWritePayload(input: {
  name: string
  description: string
  heroImage: string
  productIds: string[]
}): CollectionWritePayload {
  return {
    name: input.name.trim(),
    description: input.description.trim(),
    heroImage: input.heroImage.trim(),
    productIds: [...input.productIds],
  }
}

export async function fetchCollectionsApi() {
  return apiFetch<unknown[]>("/api/collections")
}

export async function createCollectionApi(body: CollectionWritePayload) {
  return apiFetch<unknown>("/api/collections", {
    method: "POST",
    body: JSON.stringify(body),
    auth: true,
  })
}

export async function updateCollectionApi(id: string, body: CollectionWritePayload) {
  return apiFetch<unknown>(`/api/collections/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    auth: true,
  })
}

export async function deleteCollectionApi(id: string) {
  return apiFetch<{ message: string }>(`/api/collections/${id}`, {
    method: "DELETE",
    auth: true,
  })
}
