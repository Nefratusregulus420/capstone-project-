const API_URL = "http://localhost:8080/api";
export class ApiError extends Error { constructor(message: string) { super(message); } }
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("novavault_token");
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401) { localStorage.removeItem("novavault_token"); window.dispatchEvent(new Event("novavault:logout")); }
  if (!response.ok) { const body = await response.json().catch(() => null); throw new ApiError(body?.message || "Request failed."); }
  if (response.status === 204) return undefined as T;
  return response.json();
}
export async function authenticatedBlob(path: string) { const token = localStorage.getItem("novavault_token"); const res = await fetch(`${API_URL}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }); if (!res.ok) throw new ApiError("Could not load file."); return res.blob(); }
