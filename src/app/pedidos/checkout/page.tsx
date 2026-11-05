import type { Metadata } from "next";
import { CheckoutForm } from "@/components/pedidos/CheckoutForm";
import { requireToken } from "@/lib/auth";
import { getCliente, getDirecciones, getSucursales } from "@/lib/pedidos";

export const metadata: Metadata = { title: "Finalizar pedido" };

// Server Component: trae los datos con el token de la cookie y se los pasa al formulario (Client)
export default async function CheckoutPage() {
  await requireToken();
  const [cliente, sucursales, direcciones] = await Promise.all([
    getCliente(),
    getSucursales(),
    getDirecciones(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-light text-cafe">Finalizar pedido</h1>
      <CheckoutForm tienePerfil={cliente !== null} sucursales={sucursales} direcciones={direcciones} />
    </main>
  );
}
