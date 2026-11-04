"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Pedido {
  id: number;
  fecha_venta: string;
  monto_total: number;
  estado: string;
  tipo_entrega?: string;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Token ${token}`;
        }

        const response = await fetch(
          "http://localhost:8000/api/ventas/pedidos/",
          { headers }
        );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(
              "No tienes permisos para ver los pedidos o necesitas iniciar sesión."
            );
          }
          throw new Error("Ocurrió un error al obtener la lista de pedidos.");
        }

        const data = await response.json();
        // Si la respuesta es paginada de Django, tomamos `results`, sino el array directo
        const listaPedidos = Array.isArray(data) ? data : data.results || [];
        setPedidos(listaPedidos);
      } catch (err: any) {
        setError(err.message || "Error de conexión con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  if (loading) {
    return (
      <main className="container mx-auto p-6 max-w-4xl text-center">
        <p className="text-gray-400">Cargando historial de pedidos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-6 max-w-4xl text-center">
        <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
        <Link
          href="/"
          className="text-emerald-400 underline hover:text-emerald-300"
        >
          Volver a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400 mb-4">Aún no has realizado ningún pedido.</p>
          <Link
            href="/"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm transition"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex items-center justify-between hover:border-gray-700 transition"
            >
              <div>
                <p className="font-semibold text-lg">Pedido #{pedido.id}</p>
                <p className="text-xs text-gray-400">
                  Fecha:{" "}
                  {new Date(pedido.fecha_venta).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm font-bold text-emerald-400 mt-1">
                  ${pedido.monto_total}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-500">
                  {pedido.estado || "Procesando"}
                </span>
                <Link
                  href={`/pedidos/${pedido.id}`}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm transition"
                >
                  Ver Detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}