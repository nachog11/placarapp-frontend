"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface DetalleItem {
  id: number;
  producto_nombre?: string;
  cantidad: number;
  precio_unitario: number;
}

interface Pedido {
  id: number;
  fecha_venta: string;
  monto_total: number;
  estado: string;
  tipo_entrega?: string;
  detalles?: DetalleItem[];
}

export default function DetallePedidoPage() {
  const params = useParams();
  const id = params?.id;

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPedido = async () => {
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
          `http://localhost:8000/api/ventas/pedidos/${id}/`,
          { headers }
        );

        if (!response.ok) {
          if (response.status === 403) {
            throw new Error(
              "No tienes permisos para ver este pedido o necesitas iniciar sesión."
            );
          }
          if (response.status === 404) {
            throw new Error("El pedido solicitado no existe.");
          }
          throw new Error("Ocurrió un error al cargar el pedido.");
        }

        const data = await response.json();
        setPedido(data);
      } catch (err: any) {
        setError(err.message || "Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  if (loading) {
    return (
      <main className="container mx-auto p-6 max-w-3xl text-center">
        <p className="text-gray-400">Cargando información del pedido...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto p-6 max-w-3xl text-center">
        <div className="bg-red-900/40 border border-red-500 text-red-200 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
        <Link
          href="/carrito"
          className="text-emerald-400 underline hover:text-emerald-300"
        >
          Volver al carrito
        </Link>
      </main>
    );
  }

  if (!pedido) return null;

  return (
    <main className="container mx-auto p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Detalle del Pedido #{pedido.id}</h1>
        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-500">
          {pedido.estado || "Procesando"}
        </span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-400">Fecha del Pedido:</p>
            <p className="font-medium">
              {new Date(pedido.fecha_venta).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Monto Total:</p>
            <p className="font-bold text-emerald-400 text-lg">
              ${pedido.monto_total}
            </p>
          </div>
        </div>

        {pedido.detalles && pedido.detalles.length > 0 && (
          <div className="mt-6 border-t border-gray-800 pt-4">
            <h2 className="text-lg font-semibold mb-3">Productos Comprados</h2>
            <ul className="divide-y divide-gray-800">
              {pedido.detalles.map((item) => (
                <li
                  key={item.id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {item.producto_nombre || `Producto #${item.id}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      Cantidad: {item.cantidad}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-200">
                    ${item.precio_unitario * item.cantidad}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Link
          href="/pedidos"
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md text-sm transition"
        >
          Ver todos mis pedidos
        </Link>
        <Link
          href="/"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm transition"
        >
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}