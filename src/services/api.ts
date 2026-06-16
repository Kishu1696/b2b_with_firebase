/**
 * api.ts — Firebase Auth token ko automatically attach karta hai
 * Axios interceptor Firebase ID token use karta hai (refreshes automatically)
 */
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { auth } from "@/lib/firebase";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// Attach Firebase ID token to every request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const user = auth.currentUser;
    if (user && config.headers) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401 — refresh Firebase token and retry once
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken(true); // force refresh
          if (original.headers) original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }
      } catch {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

// Extract readable Firebase error message
export function getApiError(error: unknown): string {
  if (error instanceof Error) {
    const m = error.message;
    if (m.includes("auth/invalid-credential") || m.includes("auth/wrong-password") || m.includes("auth/user-not-found"))
      return "Email ya password galat hai.";
    if (m.includes("auth/email-already-in-use")) return "Ye email already registered hai.";
    if (m.includes("auth/weak-password"))         return "Password kam se kam 6 characters ka hona chahiye.";
    if (m.includes("auth/too-many-requests"))     return "Bahut zyada attempts. Thodi der baad try karein.";
    if (m.includes("auth/network-request-failed"))return "Network error. Internet check karein.";
    return m;
  }
  if (axios.isAxiosError(error)) {
    if (!error.response) return "Server se connect nahi ho pa raha.";
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    return `Server error (${error.response.status}).`;
  }
  return "Kuch gadbad hui. Dobara try karein.";
}
