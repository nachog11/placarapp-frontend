"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productoSchema, type ProductoFormValues } from "@/lib/schemas";
import type { ResultadoProducto } from "@/app/actions";
import type { Categoria, Material } from "@/lib/types";

const campo =
  "w-full rounded-lg border border-madera/40 bg-white px-3 py-2.5 text-sm text-tinta focus:border-madera focus:outline-2 focus:outline-madera/30";

const VALORES_VACIOS: ProductoFormValues = {
  nombre: "",
  descripcion: "",
  imagen: "",
  precio: "",
  stock: "0",
  categoria: "",
  materiales: [],
  destacado: false,
  activo: true,
};

const CAMPOS = [
  "nombre",
  "descripcion",
  "imagen",
  "precio",
  "stock",
  "categoria",
  "materiales",
  "destacado",
  "activo",
] as const;

function Campo({
  etiqueta,
  error,
  children,
}: {
  etiqueta: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-tinta">
      {etiqueta}
      {children}
      {error && (
        <span role="alert" className="text-xs font-normal text-red-700">
          {error}
        </span>
      )}
    </label>
  );
}

type Props = {
  categorias: Categoria[];
  materiales: Material[];
  accion: (valores: ProductoFormValues) => Promise<ResultadoProducto>;
  valoresIniciales?: ProductoFormValues;
  textoBoton?: string;
};

export default function ProductForm({
  categorias,
  materiales,
  accion,
  valoresIniciales,
  textoBoton = "Guardar producto",
}: Props) {
  const router = useRouter();
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: valoresIniciales ?? VALORES_VACIOS,
  });

  const seleccionados = watch("materiales");

  function alternarMaterial(id: string) {
    const actuales = getValues("materiales");
    setValue(
      "materiales",
      actuales.includes(id) ? actuales.filter((m) => m !== id) : [...actuales, id],
      { shouldValidate: true },
    );
  }

  async function onSubmit(valores: ProductoFormValues) {
    setErrorGeneral(null);
    const res = await accion(valores);

    if (res.ok) {
      router.push("/dashboard/productos");
      router.refresh();
      return;
    }

    setErrorGeneral(res.error ?? "No se pudo guardar el producto.");
    for (const [clave, mensajes] of Object.entries(res.errores ?? {})) {
      if ((CAMPOS as readonly string[]).includes(clave)) {
        setError(clave as keyof ProductoFormValues, { message: mensajes.join(" ") });
      } else {
        setErrorGeneral((previo) => `${previo} ${mensajes.join(" ")}`);
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid max-w-2xl gap-5 rounded-2xl border border-madera/30 bg-white p-8"
    >
      <Campo etiqueta="Nombre" error={errors.nombre?.message}>
        <input {...register("nombre")} className={campo} />
      </Campo>

      <Campo etiqueta="Descripción" error={errors.descripcion?.message}>
        <textarea {...register("descripcion")} rows={4} className={campo} />
      </Campo>

      <Campo etiqueta="Link de la imagen (opcional)" error={errors.imagen?.message}>
        <input
          {...register("imagen")}
          placeholder="https://drive.google.com/file/d/..."
          className={campo}
        />
        <span className="text-xs font-normal text-tinta/60">
          En Drive: clic derecho en la foto → Compartir → Acceso general: &quot;Cualquier persona
          con el enlace&quot; → Copiar enlace.
        </span>
      </Campo>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo etiqueta="Precio (ARS)" error={errors.precio?.message}>
          <input {...register("precio")} inputMode="decimal" className={campo} />
        </Campo>
        <Campo etiqueta="Stock" error={errors.stock?.message}>
          <input {...register("stock")} type="number" min={0} className={campo} />
        </Campo>
      </div>

      <Campo etiqueta="Categoría" error={errors.categoria?.message}>
        <select {...register("categoria")} className={campo}>
          <option value="">Elegí una categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.nombre}
            </option>
          ))}
        </select>
      </Campo>

      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-tinta">Materiales</legend>
        <div className="flex flex-wrap gap-3">
          {materiales.map((m) => (
            <label key={m.id} className="flex items-center gap-2 text-sm text-tinta">
              <input
                type="checkbox"
                checked={seleccionados.includes(String(m.id))}
                onChange={() => alternarMaterial(String(m.id))}
              />
              {m.nombre}
            </label>
          ))}
        </div>
        {errors.materiales?.message && (
          <span role="alert" className="text-xs text-red-700">
            {errors.materiales.message}
          </span>
        )}
      </fieldset>

      <div className="flex flex-wrap gap-6 text-sm text-tinta">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("destacado")} />
          Producto destacado
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("activo")} />
          Activo (visible en la tienda)
        </label>
      </div>

      {errorGeneral && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
          {errorGeneral}
        </p>
      )}

      <button
        disabled={isSubmitting}
        className="rounded-full bg-oliva px-6 py-2.5 text-sm text-white hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Guardando..." : textoBoton}
      </button>
    </form>
  );
}