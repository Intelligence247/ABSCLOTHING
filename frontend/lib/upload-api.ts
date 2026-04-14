import { API_BASE_URL, getAuthToken } from "@/lib/api"

export type UploadImageResponse = {
  message: string
  image: string
}

const MAX_BYTES = 5 * 1024 * 1024

/**
 * POST /api/upload (multipart field `image`). Uses XHR for upload progress. Admin JWT required.
 */
export function uploadAdminProductImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadImageResponse> {
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please choose an image file (JPEG, PNG, or WebP)."))
  }
  if (file.size > MAX_BYTES) {
    return Promise.reject(new Error("Image must be 5 MB or smaller."))
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const form = new FormData()
    form.append("image", file)

    xhr.upload.addEventListener("progress", (ev) => {
      if (ev.lengthComputable && onProgress && ev.total > 0) {
        onProgress(Math.min(100, Math.round((ev.loaded / ev.total) * 100)))
      }
    })

    xhr.addEventListener("load", () => {
      let body: { message?: string; image?: string } = {}
      try {
        body = JSON.parse(xhr.responseText) as { message?: string; image?: string }
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300 && typeof body.image === "string" && body.image) {
        resolve({ message: body.message ?? "Image uploaded", image: body.image })
        return
      }
      const msg =
        typeof body.message === "string" && body.message
          ? body.message
          : xhr.status === 401
            ? "Sign in again as admin — upload requires a valid session."
            : `Upload failed (${xhr.status})`
      reject(new Error(msg))
    })

    xhr.addEventListener("error", () => reject(new Error("Network error — check your connection and API URL.")))
    xhr.addEventListener("abort", () => reject(new Error("Upload cancelled.")))

    xhr.open("POST", `${API_BASE_URL}/api/upload`)
    const token = getAuthToken()
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`)
    }
    xhr.send(form)
  })
}
