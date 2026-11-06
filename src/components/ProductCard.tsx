import Link from "next/link";
import { AddToCartButton } from "@/components/carrito/AddToCartButton";
import ProductImage from "@/components/ProductImage";
import { extraerImagen } from "@/lib/imagen";
import type { ProductoLista } from "@/lib/types";

export function formatearPrecio(valor: string) {
  return Number(valor).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export default function ProductCard({ producto }: { producto: ProductoLista }) {
  const { imagen } = extraerImagen(producto.descripcion);

  // El botón va FUERA del <Link>: un botón dentro de un link es HTML inválido
  return (
    <div className="flex flex-col items-center text-center">
      <Link
        href={`/productos/${producto.id}`}
        className="group flex w-full flex-col items-center"
      >
        <ProductImage
          imagen={imagen}
          nombre={producto.nombre}
          className="aspect-square w-full max-w-56 text-7xl transition group-hover:bg-madera/25"
        />

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

      {producto.stock > 0 && (
        <AddToCartButton
          compacto
          producto={{
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            imagen: imagen || undefined,
          }}
        />
      )}
    </div>
  );
}
