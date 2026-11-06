import { getToken } from "@/lib/auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ENDPOINTS = {
  productos: "/api/productos/",
  categorias: "/api/categorias/",
  materiales: "/api/materiales/",
};

export async function list<T = any>(path: string): Promise<T[]> {
  const token = await getToken();
  const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {};

  let page = 1;
  let all: T[] = [];
  while (true) {
    const res = await fetch(`${API_URL}${path}?page=${page}`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`La API respondió ${res.status} en ${path}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    all = all.concat(data.results ?? []);
    if (!data.next) return all;
    page += 1;
  }
}

export async function getProductos(params?: { search?: string; categoria?: string; ordering?: string; activo?: string | boolean }) {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  const url = `${API_URL}${ENDPOINTS.productos}${query ? `?${query}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export async function getProducto(id: string) {
  const res = await fetch(`${API_URL}${ENDPOINTS.productos}${id}/`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function getCategorias() {
  return list(ENDPOINTS.categorias);
}

export async function getMateriales() {
  return list(ENDPOINTS.materiales);
}