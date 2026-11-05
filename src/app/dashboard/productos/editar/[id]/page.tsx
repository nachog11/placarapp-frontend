import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cargando from "@/components/Cargando";
import ProductImage from "@/components/ProductImage";
import { formatearPrecio } from "@/components/ProductCard";
import { getCategorias, getMateriales, getProducto } from "@/lib/api";
import { extraerImagen } from "@/lib/imagen";

async function Contenido({ id }: { id: string }) {
  const [producto, categorias, materiales] = await Promise.all([
    getProducto(id),
    getCategorias(),
    getMateriales(),
  ]);

  if (!producto) notFound();

  const categoria = categorias.find((c) => c.id === producto.categoria);
  const susMateriales = materiales.filter((m) => producto.materiales.includes(m.id));
  const { texto, imagen } = extraerImagen(producto.descripcion);

  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center">
      <ProductImage
        imagen={imagen}
        nombre={producto.nombre}
        className="aspect-square w-full max-w-md text-9xl"
      />

      <div>
        {categoria && (
          <p className="text-xs uppercase tracking-wide text-tinta/50">{categoria.nombre}</p>
        )}
        <h1 className="mt-1 text-4xl font-light text-cafe">{producto.nombre}</h1>
        <p className="mt-3 text-2xl text-cafe">{formatearPrecio(producto.precio)}</p>
        <p className="mt-6 text-tinta/80">{texto}</p>

        {susMateriales.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {susMateriales.map((m) => (
              <span key={m.id} className="rounded-full bg-arena px-3 py-1 text-sm text-cafe">
                {m.nombre}
              </span>
            ))}
          </div>
        )}

        <p className="mt-6 text-sm text-tinta/60">
          {producto.stock > 0 ? `${producto.stock} unidades disponibles` : "Sin stock por el momento"}
        </p>
      </div>
    </div>
  );
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/productos" className="text-sm text-cafe underline hover:opacity-70">
        ← Volver a productos
      </Link>
      <div className="mt-8">
        <Suspense fallback={<Cargando texto="Cargando producto..." />}>
          <Contenido id={id} />
        </Suspense>
      </div>
    </main>
  );
}