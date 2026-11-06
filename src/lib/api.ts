import { getToken } from "@/lib/auth";
import type { Categoria, Material, ProductoLista } from "@/lib/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ENDPOINTS = {
  productos: "/api/productos/",
  categorias: "/api/categorias/",
  materiales: "/api/materiales/",
};

export async function list<T = unknown>(path: string): Promise<T[]> {
  const token = await getToken();
  const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {};

  let page = 1;
  let all: T[] = [];
  while (true) {
    const separador = path.includes("?") ? "&" : "?";
    const res = await fetch(`${API_URL}${path}${separador}page=${page}`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`La API respondió ${res.status} en ${path}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    all = all.concat(data.results ?? []);
    if (!data.next) return all;
    page += 1;
  }
}

// El back pagina de a 10 (PAGE_SIZE), así que se piden todas las páginas con list()
export async function getProductos(params?: { search?: string; categoria?: string; ordering?: string; activo?: string | boolean }): Promise<ProductoLista[]> {
  const query = new URLSearchParams();
  for (const [clave, valor] of Object.entries(params ?? {})) {
    if (valor !== undefined && valor !== "") query.set(clave, String(valor));
  }
  const qs = query.toString();
  return list<ProductoLista>(`${ENDPOINTS.productos}${qs ? `?${qs}` : ""}`);
}

export async function getProducto(id: string) {
  const res = await fetch(`${API_URL}${ENDPOINTS.productos}${id}/`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function getCategorias() {
  return list<Categoria>(ENDPOINTS.categorias);
}

export async function getMateriales() {
  return list<Material>(ENDPOINTS.materiales);
}