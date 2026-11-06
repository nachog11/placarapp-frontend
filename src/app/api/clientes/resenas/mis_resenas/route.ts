import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";

export async function GET() {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Debés iniciar sesión." },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_URL}/api/clientes/resenas/mis_resenas/`,
      {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => ({
      error: "No se pudo interpretar la respuesta del servidor.",
    }));

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar las reseñas." },
      { status: 500 }
    );
  }
}
