import { apiFetch } from "@/lib/api"

export type CustomerAuthResponse = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  token: string
}

export type CustomerProfile = {
  _id: string
  name: string
  email: string
  isAdmin: boolean
}

export async function apiLoginCustomer(email: string, password: string) {
  return apiFetch<CustomerAuthResponse>("/api/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function apiRegisterCustomer(name: string, email: string, password: string) {
  return apiFetch<CustomerAuthResponse>("/api/users", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  })
}

export async function apiFetchCustomerProfile() {
  return apiFetch<CustomerProfile>("/api/users/profile", {
    auth: true,
    useCustomerToken: true,
  })
}
