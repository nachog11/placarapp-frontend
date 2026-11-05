"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { borrarProducto } from "@/app/actions";

export default function BorrarProducto({ id, nombre }: { id: number; nombre: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, startTransition] = useTransition();

  function borrar() {
    startTransition(async () => {
      const res = await borrarProducto(id);
      if (res.error) {
        setError(res.error);
        return;
      }
      setConfirmando(false);
      router.refresh();
    });
  }

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        aria-label={`Borrar ${nombre}`}
        className="text-sm text-red-700 hover:underline"
      >
        Borrar
      </button>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm">
      <span className="text-tinta/70">¿Seguro?</span>
      <button
        onClick={borrar}
        disabled={pendiente}
        className="rounded-full bg-red-700 px-3 py-1 text-white disabled:opacity-60"
      >
        {pendiente ? "Borrando..." : "Sí, borrar"}
      </button>
      <button
        onClick={() => {
          setConfirmando(false);
          setError(null);
        }}
        className="text-cafe underline"
      >
        Cancelar
      </button>
      {error && (
        <span role="alert" className="w-full text-red-700">
          {error}
        </span>
      )}
    </span>
  );
}