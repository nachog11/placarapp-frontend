import Link from "next/link";
import BorrarProducto from "@/components/BorrarProducto";
import { formatearPrecio } from "@/components/ProductCard";
import type { ProductoLista } from "@/lib/types";

export default function ProductTable({ productos }: { productos: ProductoLista[] }) {
  if (productos.length === 0) {
    return (
      <p className="py-16 text-center text-tinta/60">
        Todavía no hay productos. Creá el primero con el botón de arriba.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-madera/30 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-arena/60 text-xs uppercase tracking-wide text-tinta/60">
          <tr>
            <th className="px-4 py-3">Nombre</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-madera/20">
          {productos.map((p) => (
            <tr key={p.id}>
              <td className="px-4 py-3 text-tinta">{p.nombre}</td>
              <td className="px-4 py-3 text-tinta/70">{p.categoria?.nombre ?? "-"}</td>
              <td className="px-4 py-3 text-cafe">{formatearPrecio(p.precio)}</td>
              <td className="px-4 py-3">{p.stock}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-0.5 text-xs ${
                    p.activo ? "bg-oliva/15 text-oliva" : "bg-madera/25 text-cafe"
                  }`}
                >
                  {p.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-end gap-4">
                  <Link
                    href={`/dashboard/productos/editar/${p.id}`}
                    className="text-sm text-cafe hover:underline"
                  >
                    Editar
                  </Link>
                  <BorrarProducto id={p.id} nombre={p.nombre} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}