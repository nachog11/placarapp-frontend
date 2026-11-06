import { Suspense } from "react";
import Link from "next/link";
import Cargando from "@/components/Cargando";
import { logout } from "@/app/actions";
import { requireToken } from "@/lib/auth";

async function Contenido() {
  await requireToken();
  return (
    <Link
      href="/dashboard/productos"
      className="mt-6 inline-block rounded-full bg-oliva px-6 py-2 text-sm text-white hover:opacity-90"
    >
      Administrar productos
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-light text-cafe">Panel de administración</h1>
      <Suspense fallback={<Cargando />}>
        <Contenido />
      </Suspense>

      <form action={logout} className="mt-6">
        <button
          type="submit"
          className="rounded-full border border-border px-6 py-2 text-sm text-foreground hover:bg-card"
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}