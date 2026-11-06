"use client";

import { useAuth } from "@/context/auth/AuthContext";
import Link from "next/link";

export default function PerfilPage() {
  const { cliente, authenticated, loading } = useAuth();

  if (loading) {
    return <main className="p-8">Cargando perfil...</main>;
  }

  if (!authenticated) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Mi perfil</h1>
        <p className="mt-3 text-slate-600">
          Iniciá sesión para consultar tu perfil.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-lg bg-amber-800 px-4 py-2 text-white"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  if (!cliente) {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-2xl font-semibold">Mi perfil</h1>
        <p className="mt-3 text-slate-600">
          Todavía no tenés un perfil de cliente registrado.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold">Mi perfil</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-slate-500">Nombre y apellido</p>
            <p className="font-medium">
              {cliente.nombre} {cliente.apellido}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Correo electrónico</p>
            <p className="font-medium">{cliente.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Teléfono</p>
            <p className="font-medium">
              {cliente.telefono || "No registrado"}
            </p>
          </div>
        </div>
      </section>

      <Link
        href="/perfil/resenas"
        className="mt-6 inline-block rounded-lg bg-amber-800 px-4 py-2 text-white hover:bg-amber-900"
      >
        Mis reseñas
      </Link>
    </main>
  );
}