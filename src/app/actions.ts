"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { API_URL, ENDPOINTS } from "@/lib/api";
import { getToken, removeToken } from "@/lib/auth";
import { cookies } from "next/headers";

export type ResultadoProducto = {
  ok?: boolean;
  error?: string;
  errores?: Record<string, string[]>;
  success?: boolean;
};

export async function login(prevState: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const res = await fetch(`${API_URL}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return { error: "Credenciales inválidas" };
  }

  const data = await res.json();
  const cookieStore = await cookies();
  cookieStore.set("token", data.token, { httpOnly: true, path: "/" });

  redirect("/dashboard");
}

export async function logout() {
  await removeToken();
  redirect("/login");
}

export async function crearProducto(valores: {
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: string;
  stock: string;
  categoria: string;
  materiales: string[];
  destacado: boolean;
  activo: boolean;
}): Promise<ResultadoProducto> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${ENDPOINTS.productos}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(valores),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return { error: "Error al crear el producto", errores: data };
  }

  revalidatePath("/dashboard/productos");
  revalidatePath("/productos");
  return { ok: true, success: true };
}

export async function borrarProducto(id: number): Promise<ResultadoProducto> {
  const token = await getToken();
  const res = await fetch(`${API_URL}${ENDPOINTS.productos}${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    return { error: "Error al borrar el producto" };
  }

  revalidatePath("/dashboard/productos");
  revalidatePath("/productos");
  return { ok: true, success: true };
}