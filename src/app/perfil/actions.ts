"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { ENDPOINTS_PEDIDOS } from "@/lib/pedidos";

export type EstadoPerfil = { error?: string; errores?: Record<string, string> } | null;

const NOMBRES_CAMPO: Record<string, string> = {
  nombre: "nombre",
  apellido: "apellido",
  email: "email",
  telefono: "teléfono",
};

// Crea el Cliente del usuario logueado (el back toma el usuario del token).
// Después de crearlo vuelve al checkout, que es de donde casi siempre se llega.
export async function crearPerfil(_prev: EstadoPerfil, formData: FormData): Promise<EstadoPerfil> {
  const token = await getToken();
  if (!token) redirect("/login");

  const valores = {
    nombre: String(formData.get("nombre") ?? "").trim(),
    apellido: String(formData.get("apellido") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    telefono: String(formData.get("telefono") ?? "").trim(),
  };

  const errores: Record<string, string> = {};
  if (valores.nombre.length < 2) errores.nombre = "Ingresá tu nombre";
  if (valores.apellido.length < 2) errores.apellido = "Ingresá tu apellido";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email)) errores.email = "Ingresá un email válido";
  if (Object.keys(errores).length > 0) return { errores };

  const res = await fetch(`${API_URL}${ENDPOINTS_PEDIDOS.clientes}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Token ${token}` },
    body: JSON.stringify(valores),
    cache: "no-store",
  }).catch(() => null);

  if (!res) return { error: "No se pudo conectar con la API." };
  if (res.status === 401 || res.status === 403) redirect("/login");
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    // El back devuelve {campo: [msg]} o una lista de strings (ej: "Ya existe un perfil...")
    const campos: Record<string, string> = {};
    if (data && !Array.isArray(data) && typeof data === "object") {
      for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
        if (k in NOMBRES_CAMPO) campos[k] = Array.isArray(v) ? String(v[0]) : String(v);
      }
    }
    if (Object.keys(campos).length > 0) return { errores: campos };
    const general = Array.isArray(data) ? data.join(" ") : "";
    return { error: general || "No se pudo guardar tu perfil. Probá de nuevo." };
  }

  revalidatePath("/pedidos/checkout");
  redirect("/pedidos/checkout");
}
