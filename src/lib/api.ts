import { getToken } from "@/lib/auth";

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
    const res = await fetch(`${API_URL}${path}?page=${page}`, { headers, cache: "no-store" });
    if (!res.ok) throw new Error(`La API respondió ${res.status} en ${path}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    all = all.concat(data.results ?? []);
    if (!data.next) return all;
    page += 1;
  }
}