"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { API_URL, ENDPOINTS } from "@/lib/api";
import { getToken } from "@/lib/auth";

export type EstadoLogin = { error: string } | null;

export async function login(_estadoPrevio: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const res = await fetch(`${API_URL}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!res) return { error: "No se pudo conectar con la API." };
  if (res.status === 400 || res.status === 401) return { error: "Usuario o contraseña incorrectos." };
  if (!res.ok) return { error: "La API respondió con un error. Intenta de nuevo." };

  const { token } = await res.json();
  (await cookies()).set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete("token");
  redirect("/login");
}

async function llamar(path: string, opciones: RequestInit = {}) {
  const token = await getToken();
  return fetch(`${API_URL}${path}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    cache: "no-store",
  }).catch(() => null);
}

export async function borrarProducto(id: number): Promise<{ error?: string }> {
  const res = await llamar(`${ENDPOINTS.productos}${id}/`, { method: "DELETE" });
  if (!res) return { error: "Sin conexión con la API." };
  if (res.status === 401 || res.status === 403) return { error: "Tu sesión venció. Volvé a iniciar sesión." };
  if (!res.ok && res.status !== 404) return { error: "No se pudo borrar el producto." };
  revalidatePath("/dashboard/productos");
  revalidatePath("/productos");
  return {};
}