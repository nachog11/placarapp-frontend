import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, cliente: null },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_URL}/api/clientes/clientes/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { authenticated: false, cliente: null },
        { status: response.status }
      );
    }

    const clientes = await response.json();
    const cliente = clientes.results
      ? clientes.results[0] ?? null
      : clientes[0] ?? null;

    return NextResponse.json({
      authenticated: true,
      cliente,
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, cliente: null },
      { status: 500 }
    );
  }
}