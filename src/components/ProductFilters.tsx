"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Categoria } from "@/lib/types";

const campo =
  "rounded-full border border-madera/40 bg-card px-4 py-2 text-sm text-tinta focus:border-madera focus:outline-2 focus:outline-madera/30";

export default function ProductFilters({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState(searchParams.get("search") ?? "");

  function actualizar(clave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    router.replace(`${pathname}?${params.toString()}`);
  }

  function limpiar() {
    setBusqueda("");
    router.replace(pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          actualizar("search", busqueda.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar muebles..."
          aria-label="Buscar productos"
          className={campo}
        />
        <button className="rounded-full bg-oliva px-5 py-2 text-sm text-white hover:opacity-90">
          Buscar
        </button>
      </form>

      <select
        value={searchParams.get("categoria") ?? ""}
        onChange={(e) => actualizar("categoria", e.target.value)}
        aria-label="Filtrar por categoría"
        className={campo}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("ordering") ?? ""}
        onChange={(e) => actualizar("ordering", e.target.value)}
        aria-label="Ordenar productos"
        className={campo}
      >
        <option value="">Orden por defecto</option>
        <option value="precio">Menor precio</option>
        <option value="-precio">Mayor precio</option>
        <option value="nombre">Nombre A-Z</option>
      </select>

      <button onClick={limpiar} className="text-sm text-cafe underline hover:opacity-70">
        Limpiar filtros
      </button>
    </div>
  );
}