import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducto } from "@/lib/api";
import { requireToken } from "@/lib/auth";
import { getCliente, getDirecciones, getPedido, getSucursales } from "@/lib/pedidos";
import { formatearMoneda } from "@/utils/cartUtils";

export const metadata: Metadata = { title: "Detalle del pedido" };

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  await requireToken();
  const { id } = await params;

  const [pedido, cliente] = await Promise.all([getPedido(id), getCliente()]);
  // El back deja ver cualquier pedido: acá solo mostramos los del cliente logueado
  if (!pedido || !cliente || pedido.cliente !== cliente.id) notFound();

  // Los detalles solo traen el id del producto: buscamos los nombres
  const [productos, sucursales, direcciones] = await Promise.all([
    Promise.all(pedido.detalles_pedido.map((d) => getProducto(String(d.producto)))),
    pedido.tipo_entrega === "RETIRO" ? getSucursales() : Promise.resolve([]),
    pedido.tipo_entrega === "ENVIO" ? getDirecciones() : Promise.resolve([]),
  ]);

  const sucursal = sucursales.find((s) => s.id === pedido.sucursal_retiro);
  const direccion = direcciones.find((d) => d.id === pedido.direccion_envio);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/pedidos" className="text-sm text-cafe underline hover:opacity-70">
        ← Volver a mis pedidos
      </Link>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-light text-cafe">Pedido #{pedido.id}</h1>
          <p className="text-sm text-tinta/60">
            {new Date(pedido.fecha_venta).toLocaleDateString("es-AR")}
          </p>
        </div>
        <span className="rounded-full bg-arena px-3 py-1 text-sm text-cafe">{pedido.estado}</span>
      </div>

      <section className="mt-8 rounded-2xl border border-madera/30 bg-card p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-light text-cafe">Productos</h2>
        <ul className="grid gap-2">
          {pedido.detalles_pedido.map((d, i) => (
            <li key={d.id} className="flex justify-between border-b border-madera/20 pb-2 text-sm">
              <span className="text-tinta">
                {productos[i]?.nombre ?? `Producto #${d.producto}`}{" "}
                <span className="text-tinta/60">× {d.cantidad}</span>
              </span>
              <span className="text-cafe">
                {formatearMoneda(Number(d.precio_unitario) * d.cantidad)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between text-lg font-medium text-cafe">
          <span>Total</span>
          <span>{formatearMoneda(Number(pedido.monto_total))}</span>
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-madera/30 bg-card p-6 text-sm text-tinta shadow-sm">
        <h2 className="mb-3 text-lg font-light text-cafe">Entrega</h2>
        {pedido.tipo_entrega === "RETIRO" ? (
          <p>
            Retiro en sucursal
            {sucursal ? `: ${sucursal.nombre} — ${sucursal.direccion}, ${sucursal.ciudad}` : ""}
          </p>
        ) : (
          <p>
            Envío a domicilio
            {direccion ? `: ${direccion.calle} ${direccion.numero}, ${direccion.ciudad}` : ""}
          </p>
        )}
        <p className="mt-2 text-tinta/70">
          Pago: {pedido.pago ? `${pedido.pago.metodo} (${pedido.pago.aprobado ? "aprobado" : "pendiente"})` : "todavía sin registrar"}
        </p>
      </section>
    </main>
  );
}
