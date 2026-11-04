import { Suspense } from "react";
import Link from "next/link";
import Cargando from "@/components/Cargando";
import ProductTable from "@/components/ProductTable";
import { getProductos } from "@/lib/api";
import { requireToken } from "@/lib/auth";

async function Contenido() {
  await requireToken();
  const productos = await getProductos();
  return <ProductTable productos={productos} />;
}

export default function DashboardProductosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-light text-cafe">Productos</h1>
        <Link
          href="/dashboard/productos/nuevo"
          className="rounded-full bg-oliva px-6 py-2 text-sm text-white hover:opacity-90"
        >
          Nuevo producto
        </Link>
      </div>
      <Suspense fallback={<Cargando texto="Cargando productos..." />}>
        <Contenido />
      </Suspense>
    </main>
  );
}