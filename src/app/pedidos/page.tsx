import type { Metadata } from "next";
import Link from "next/link";
import { requireToken } from "@/lib/auth";
import { getMisPedidos } from "@/lib/pedidos";
import { formatearMoneda } from "@/utils/cartUtils";

export const metadata: Metadata = { title: "Mis pedidos" };

export default async function PedidosPage() {
  await requireToken();
  const pedidos = await getMisPedidos();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-light text-cafe">Mis pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-tinta/70">Todavía no hiciste ningún pedido.</p>
          <Link
            href="/productos"
            className="mt-6 inline-block rounded-full bg-oliva px-6 py-2.5 text-sm text-white hover:opacity-90"
          >
            Ver catálogo
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3">
          {pedidos.map((p) => (
            <li key={p.id}>
              <Link
                href={`/pedidos/${p.id}`}
                className="flex items-center justify-between rounded-2xl border border-madera/30 bg-white p-5 shadow-sm transition hover:border-madera"
              >
                <div>
                  <p className="font-medium text-tinta">Pedido #{p.id}</p>
                  <p className="text-sm text-tinta/60">
                    {new Date(p.fecha_venta).toLocaleDateString("es-AR")} ·{" "}
                    {p.tipo_entrega === "ENVIO" ? "Envío a domicilio" : "Retiro en sucursal"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-cafe">{formatearMoneda(Number(p.monto_total))}</p>
                  <span className="rounded-full bg-arena px-3 py-0.5 text-xs text-cafe">{p.estado}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
