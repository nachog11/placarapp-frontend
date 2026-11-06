import type { Metadata } from "next";
import Link from "next/link";
import { PerfilForm } from "@/components/pedidos/PerfilForm";
import { requireToken } from "@/lib/auth";
import { getCliente } from "@/lib/pedidos";

export const metadata: Metadata = { title: "Mi perfil | PlacarApp" };

export default async function PerfilPage() {
  await requireToken();
  const cliente = await getCliente();

  return (
    <main className="mx-auto max-w-lg px-6 py-12">
      <h1 className="mb-2 text-3xl font-light text-cafe">Mi perfil</h1>

      {cliente ? (
        <section className="mt-6 rounded-2xl border border-madera/30 bg-white p-6 text-sm text-tinta shadow-sm">
          <p className="text-lg text-cafe">
            {cliente.nombre} {cliente.apellido}
          </p>
          <p className="mt-1 text-tinta/70">{cliente.email}</p>
          <Link
            href="/pedidos/checkout"
            className="mt-6 inline-block rounded-full bg-oliva px-6 py-2.5 text-sm text-white hover:opacity-90"
          >
            Ir al checkout
          </Link>
        </section>
      ) : (
        <>
          <p className="mb-6 text-sm text-tinta/70">
            Completá tus datos para poder hacer pedidos. Lo hacés una sola vez.
          </p>
          <PerfilForm />
        </>
      )}
    </main>
  );
}
