import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

export async function GET() {
  const jar = await cookies();
  const token = jar.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { authenticated: false, usuario: null, staff: false, cliente: null },
      { status: 401 }
    );
  }

  const usuario = jar.get("usuario")?.value || null;
  let cliente = null;

  try {
    const response = await fetch(`${API_URL}/api/clientes/clientes/`, {
      headers: { Authorization: `Token ${token}` },
      cache: "no-store",
    });

    if (response.ok) {
      const clientes = await response.json();
      cliente = clientes.results
        ? (clientes.results[0] ?? null)
        : (clientes[0] ?? null);
    }
  } catch {
    // si falla la consulta del cliente, igual hay sesión
  }

  return NextResponse.json({
    authenticated: true,
    usuario,
    staff: jar.get("staff")?.value === "1",
    cliente,
  });
}
