import Link from "next/link";
import type { ProductoLista } from "@/lib/types";

export function formatearPrecio(valor: string) {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function ProductCard({ producto }: { producto: ProductoLista }) {
  return (
    <Link
      href={`/productos/${producto.id}`}
      className="group flex flex-col items-center text-center"
    >
      <div className="grid aspect-square w-full max-w-56 place-items-center rounded-full bg-arena text-7xl font-light text-madera transition group-hover:bg-madera/25">
        {producto.nombre.charAt(0).toUpperCase()}
      </div>

      <h3 className="mt-4 text-lg text-tinta">{producto.nombre}</h3>
      {producto.categoria && (
        <p className="text-xs uppercase tracking-wide text-tinta/50">
          {producto.categoria.nombre}
        </p>
      )}
      <p className="mt-1 text-base text-cafe">{formatearPrecio(producto.precio)}</p>

      <div className="mt-2 flex gap-2">
        {producto.destacado && (
          <span className="rounded-full bg-oliva px-3 py-0.5 text-xs text-white">
            Destacado
          </span>
        )}
        {producto.stock === 0 && (
          <span className="rounded-full bg-madera/30 px-3 py-0.5 text-xs text-cafe">
            Sin stock
          </span>
        )}
      </div>
    </Link>
  );
}