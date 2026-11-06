"use server";

import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

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
