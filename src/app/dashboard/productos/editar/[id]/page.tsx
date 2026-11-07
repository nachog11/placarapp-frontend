import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editarProducto } from "@/app/actions";
import Cargando from "@/components/Cargando";
import ProductForm from "@/components/ProductForm";
import { getCategorias, getMateriales, getProducto } from "@/lib/api";
import { extraerImagen } from "@/lib/imagen";
import { requireToken } from "@/lib/auth";

async function Contenido({ id }: { id: string }) {
  await requireToken();

  const [producto, categorias, materiales] = await Promise.all([
    getProducto(id),
    getCategorias(),
    getMateriales(),
  ]);

  if (!producto) notFound();

  const { texto, imagen } = extraerImagen(producto.descripcion);

  return (
    <ProductForm
      categorias={categorias}
      materiales={materiales}
      accion={editarProducto.bind(null, Number(id))}
      valoresIniciales={{
        nombre: producto.nombre,
        descripcion: texto,
        imagen,
        precio: producto.precio,
        stock: String(producto.stock),
        categoria: producto.categoria === null ? "" : String(producto.categoria),
        materiales: producto.materiales.map(String),
        destacado: producto.destacado,
        activo: producto.activo,
      }}
      textoBoton="Guardar cambios"
    />
  );
}

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link
        href="/dashboard/productos"
        className="text-sm text-cafe underline hover:opacity-70"
      >
        ← Volver a productos
      </Link>
      <h1 className="mb-8 mt-4 text-3xl font-light text-cafe">
        Editar producto
      </h1>
      <Suspense fallback={<Cargando texto="Cargando producto..." />}>
        <Contenido id={id} />
      </Suspense>
    </main>
  );
}
