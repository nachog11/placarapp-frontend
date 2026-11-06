"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { API_URL, ENDPOINTS } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { productoSchema, type ProductoFormValues } from "@/lib/schemas";
import { unirImagen } from "@/lib/imagen";

export type EstadoLogin =
  | { error: string }
  | { success: boolean }
  | null;

export async function login(
  _estadoPrevio: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const res = await fetch(`${API_URL}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: formData.get("username"),
      password: formData.get("password"),
    }),
    cache: "no-store",
  }).catch(() => null);

  if (!res) {
    return { error: "No se pudo conectar con la API." };
  }

  if (res.status === 400 || res.status === 401) {
    return { error: "Usuario o contraseña incorrectos." };
  }

  if (!res.ok) {
    return { error: "La API respondió con un error. Intenta de nuevo." };
  }

  const { token } = await res.json();

  if (!token) {
    return { error: "La API no devolvió un token válido." };
  }

  (await cookies()).set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  return { success: true };
}

export async function logout() {
  (await cookies()).delete("token");
}

async function llamar(
  path: string,
  opciones: RequestInit = {}
) {
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

export type ResultadoProducto = {
  ok?: true;
  error?: string;
  errores?: Record<string, string[]>;
};

export async function borrarProducto(
  id: number
): Promise<ResultadoProducto> {
  const res = await llamar(
    `${ENDPOINTS.productos}${id}/`,
    { method: "DELETE" }
  );

  if (!res) {
    return { error: "Sin conexión con la API." };
  }

  if (res.status === 401 || res.status === 403) {
    return { error: "Tu sesión venció. Volvé a iniciar sesión." };
  }

  if (!res.ok && res.status !== 404) {
    return { error: "No se pudo borrar el producto." };
  }

  revalidatePath("/dashboard/productos");
  revalidatePath("/productos");

  return {};
}

async function enviarProducto(
  path: string,
  method: "POST" | "PUT",
  valores: ProductoFormValues
): Promise<ResultadoProducto> {
  const parsed = productoSchema.safeParse(valores);

  if (!parsed.success) {
    return { error: "Los datos del formulario no son válidos." };
  }

  const v = parsed.data;

  const res = await llamar(path, {
    method,
    body: JSON.stringify({
      nombre: v.nombre,
      descripcion: unirImagen(v.descripcion, v.imagen),
      precio: v.precio,
      stock: Number(v.stock),
      categoria: Number(v.categoria),
      materiales: v.materiales.map(Number),
      destacado: v.destacado,
      activo: v.activo,
    }),
  });

  if (!res) {
    return { error: "No se pudo conectar con la API." };
  }

  if (res.status === 401 || res.status === 403) {
    return {
      error: "Tu sesión venció. Volvé a iniciar sesión.",
    };
  }

  if (res.status === 400) {
    const errores = await res.json().catch(() => null);

    return {
      error: "La API rechazó algunos datos.",
      errores: errores ?? undefined,
    };
  }

  if (!res.ok) {
    return { error: "No se pudo guardar el producto." };
  }

  revalidatePath("/dashboard/productos");
  revalidatePath("/productos");

  return { ok: true };
}

export async function crearProducto(
  valores: ProductoFormValues
): Promise<ResultadoProducto> {
  return enviarProducto(ENDPOINTS.productos, "POST", valores);
}

export async function editarProducto(
  id: number,
  valores: ProductoFormValues
): Promise<ResultadoProducto> {
  return enviarProducto(
    `${ENDPOINTS.productos}${id}/`,
    "PUT",
    valores
  );
}
