import { Suspense } from "react";
import Cargando from "@/components/Cargando";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { getCategorias, getProductos } from "@/lib/api";

type Filtros = { 
  search?: string; 
  categoria?: string; 
  ordering?: string; 
  activo?: string | boolean; 
};

async function FiltrosComponent() {
  const categorias = await getCategorias();
  return <ProductFilters categorias={categorias} />;
}

async function Contenido({ filtros }: { filtros: Filtros }) {
  const productos = await getProductos({
    activo: "true",
    search: filtros.search,
    categoria: filtros.categoria,
    ordering: filtros.ordering,
  });

  if (productos.length === 0) {
    return (
      <p className="py-16 text-center text-tinta/60">
        No encontramos productos con esos filtros.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<Filtros>;
}) {
  const filtros = await searchParams;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-light text-cafe">Nuestros productos</h1>
      <p className="mt-2 text-sm text-tinta/70">Muebles pensados para tu casa.</p>

      <div className="mt-8">
        <Suspense fallback={<div className="h-10" />}>
          <FiltrosComponent />
        </Suspense>
      </div>

      <div className="mt-10">
        <Suspense key={JSON.stringify(filtros)} fallback={<Cargando texto="Cargando productos..." />}>
          <Contenido filtros={filtros} />
        </Suspense>
      </div>
    </main>
  );
}