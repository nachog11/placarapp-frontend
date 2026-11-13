import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import Cargando from "@/components/Cargando";
import { formatearPrecio } from "@/components/ProductCard";
import { getProductos } from "@/lib/api";
import { requireToken } from "@/lib/auth";
import { getPedidos, type Pedido } from "@/lib/pedidos";
import { formatearMoneda } from "@/utils/cartUtils";

function Tarjeta({ titulo, valor, detalle }: { titulo: string; valor: number; detalle: string }) {
  return (
    <div className="rounded-2xl border border-madera/30 bg-card p-6">
      <p className="text-sm text-tinta/60">{titulo}</p>
      <p className="mt-2 text-4xl font-light text-cafe">{valor}</p>
      <p className="mt-1 text-xs text-tinta/50">{detalle}</p>
    </div>
  );
}

async function cargarPedidos(): Promise<Pedido[]> {
  try {
    return await getPedidos();
  } catch {
    return [];
  }
}

async function Contenido() {
  await requireToken();
  const usuario = (await cookies()).get("usuario")?.value;
  const [productos, pedidos] = await Promise.all([getProductos(), cargarPedidos()]);

  const activos = productos.filter((p) => p.activo).length;
  const stockBajo = productos.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const sinStock = productos.filter((p) => p.stock === 0).length;
  const pendientes = pedidos.filter((p) => p.estado === "PENDIENTE").length;

  const paraReponer = productos
    .filter((p) => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const ultimosPedidos = [...pedidos]
    .sort((a, b) => b.fecha_venta.localeCompare(a.fecha_venta))
    .slice(0, 5);

  return (
    <>
      <p className="mt-2 text-sm text-tinta/60">
        {usuario ? `Hola, ${usuario}. ` : ""}Este es el resumen de PlacarApp.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tarjeta titulo="Productos" valor={productos.length} detalle="en el catálogo" />
        <Tarjeta titulo="Activos" valor={activos} detalle="visibles en la tienda" />
        <Tarjeta titulo="Stock bajo" valor={stockBajo} detalle="quedan 5 o menos" />
        <Tarjeta titulo="Sin stock" valor={sinStock} detalle="para reponer" />
        <Tarjeta titulo="Pedidos" valor={pedidos.length} detalle="en total" />
        <Tarjeta titulo="Pendientes" valor={pendientes} detalle="esperando pago o envío" />
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/dashboard/productos/nuevo"
          className="rounded-full bg-oliva px-6 py-2.5 text-sm text-white hover:opacity-90"
        >
          Nuevo producto
        </Link>
        <Link
          href="/dashboard/productos"
          className="rounded-full border border-madera/50 px-6 py-2.5 text-sm text-cafe hover:bg-arena"
        >
          Gestionar productos
        </Link>
        <Link
          href="/productos"
          className="rounded-full border border-madera/50 px-6 py-2.5 text-sm text-cafe hover:bg-arena"
        >
          Ver la tienda
        </Link>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-xl font-light text-cafe">Productos para reponer</h2>
          {paraReponer.length === 0 ? (
            <p className="text-sm text-tinta/60">Todo el stock está en buen nivel.</p>
          ) : (
            <ul className="grid gap-2">
              {paraReponer.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/dashboard/productos/editar/${p.id}`}
                    className="flex items-center justify-between rounded-xl border border-madera/30 bg-card px-4 py-3 text-sm hover:border-madera"
                  >
                    <span className="text-tinta">{p.nombre}</span>
                    <span className="flex items-center gap-3">
                      <span className="text-tinta/60">{formatearPrecio(p.precio)}</span>
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                          p.stock === 0
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {p.stock === 0 ? "Sin stock" : `${p.stock} u.`}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-light text-cafe">Últimos pedidos</h2>
          {ultimosPedidos.length === 0 ? (
            <p className="text-sm text-tinta/60">Todavía no hay pedidos.</p>
          ) : (
            <ul className="grid gap-2">
              {ultimosPedidos.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/pedidos/${p.id}`}
                    className="flex items-center justify-between rounded-xl border border-madera/30 bg-card px-4 py-3 text-sm hover:border-madera"
                  >
                    <span className="text-tinta">
                      Pedido #{p.id} · {new Date(p.fecha_venta).toLocaleDateString("es-AR")}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-cafe">{formatearMoneda(Number(p.monto_total))}</span>
                      <span className="rounded-full bg-arena px-3 py-0.5 text-xs text-cafe">
                        {p.estado}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-light text-cafe">Panel de administración</h1>
      <Suspense fallback={<Cargando />}>
        <Contenido />
      </Suspense>
    </main>
  );
}