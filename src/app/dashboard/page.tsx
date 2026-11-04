import { Suspense } from "react";
import { logout } from "@/app/actions";
import { requireToken } from "@/lib/auth";

async function Contenido() {
  await requireToken();
  return <p className="text-slate-700">Sesión iniciada correctamente.</p>;
}

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <Suspense fallback={<p className="text-slate-500">Cargando...</p>}>
        <Contenido />
      </Suspense>
      <form action={logout} className="mt-6">
        <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100">
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}