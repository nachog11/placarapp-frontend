"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/AuthContext";
import Link from "next/link";

interface Resena {
  id: number;
  producto: number;
  producto_nombre: string;
  puntuacion: number;
  comentario: string;
  fecha: string;
}

export default function ResenasPage() {
  const { authenticated, loading } = useAuth();

  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!authenticated) return;

    async function cargarResenas() {
      try {
        const response = await fetch(
          "/api/clientes/resenas/mis_resenas/",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("No se pudieron cargar las reseñas.");
        }

        const data = await response.json();
        setResenas(data.results ?? data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ocurrió un error."
        );
      } finally {
        setCargando(false);
      }
    }

    cargarResenas();
  }, [authenticated, loading]);

  if (loading || (authenticated && cargando)) {
    return <main className="p-8">Cargando reseñas...</main>;
  }

  if (!authenticated) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-semibold">Mis reseñas</h1>
        <p className="mt-3 text-slate-600">
          Iniciá sesión para consultar tus reseñas.
        </p>
        <Link href="/login" className="mt-4 inline-block text-amber-800">
          Iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link href="/perfil" className="text-sm text-amber-800">
        ← Volver a mi perfil
      </Link>

      <h1 className="my-6 text-2xl font-semibold">Mis reseñas</h1>

      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      {!error && resenas.length === 0 && (
        <p className="text-slate-600">
          Todavía no publicaste ninguna reseña.
        </p>
      )}

      <div className="grid gap-4">
        {resenas.map((resena) => (
          <article
            key={resena.id}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h2 className="font-semibold">{resena.producto_nombre}</h2>

            <p className="my-2 text-amber-600">
              {"★".repeat(resena.puntuacion)}
              {"☆".repeat(5 - resena.puntuacion)}
            </p>

            <p className="text-sm text-slate-700">
              {resena.comentario}
            </p>

            <p className="mt-3 text-xs text-slate-500">
              {new Date(resena.fecha).toLocaleDateString("es-AR")}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}