import { apiFetch } from "@/lib/api"

export type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: "new" | "replied"
  adminReply?: string
  repliedAt?: string | null
  createdAt: string
}

export type ContactPayload = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function submitContactMessage(payload: ContactPayload) {
  return apiFetch<{ id: string; message: string }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function fetchAdminContactMessages() {
  return apiFetch<ContactMessage[]>("/api/contact/admin/messages", {
    auth: true,
  })
}

export async function replyAdminContactMessage(id: string, reply: string) {
  return apiFetch<ContactMessage>(`/api/contact/admin/messages/${id}/reply`, {
    method: "POST",
    body: JSON.stringify({ reply }),
    auth: true,
  })
}
