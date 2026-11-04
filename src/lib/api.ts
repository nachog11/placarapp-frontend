import { getToken } from "@/lib/auth";
import type { Categoria, Material, ProductoDetalle, ProductoLista } from "@/lib/types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ENDPOINTS = {
  productos: "/api/productos/",
  categorias: "/api/categorias/",
  materiales: "/api/materiales/",
};

export async function list<T = unknown>(
  path: string,
  params: Record<string, string | undefined> = {},
): Promise<T[]> {
  const token = await getToken();
  const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {};

  let page = 1;
  let all: T[] = [];
  while (true) {
    const query = new URLSearchParams();
    for (const [clave, valor] of Object.entries(params)) {
      if (valor) query.set(clave, valor);
    }
    query.set("page", String(page));

    const res = await fetch(`${API_URL}${path}?${query}`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`La API respondió ${res.status} en ${path}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    all = all.concat(data.results ?? []);
    if (!data.next) return all;
    page += 1;
  }
}

export const getProductos = (params?: Record<string, string | undefined>) =>
  list<ProductoLista>(ENDPOINTS.productos, params);

export const getCategorias = () => list<Categoria>(ENDPOINTS.categorias);

export const getMateriales = () => list<Material>(ENDPOINTS.materiales);

export async function getProducto(id: string): Promise<ProductoDetalle | null> {
  const token = await getToken();
  const headers: HeadersInit = token ? { Authorization: `Token ${token}` } : {};

  const res = await fetch(`${API_URL}${ENDPOINTS.productos}${id}/`, { headers, cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`La API respondió ${res.status} al pedir el producto ${id}`);
  return res.json();
}