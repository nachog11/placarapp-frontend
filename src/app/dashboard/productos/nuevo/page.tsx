import { Suspense } from "react";
import Link from "next/link";
import { crearProducto } from "@/app/actions";
import Cargando from "@/components/Cargando";
import ProductForm from "@/components/ProductForm";
import { getCategorias, getMateriales } from "@/lib/api";
import { requireToken } from "@/lib/auth";

async function Contenido() {
  await requireToken();
  const [categorias, materiales] = await Promise.all([getCategorias(), getMateriales()]);

  return (
    <ProductForm
      categorias={categorias}
      materiales={materiales}
      accion={crearProducto}
      textoBoton="Crear producto"
    />
  );
}

export default function NuevoProductoPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/dashboard/productos" className="text-sm text-cafe underline hover:opacity-70">
        ← Volver a productos
      </Link>
      <h1 className="mb-8 mt-4 text-3xl font-light text-cafe">Nuevo producto</h1>
      <Suspense fallback={<Cargando texto="Cargando formulario..." />}>
        <Contenido />
      </Suspense>
    </main>
  );
}