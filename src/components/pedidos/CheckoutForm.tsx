"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { crearPedido } from "@/app/pedidos/actions";
import { OrderSummary } from "@/components/carrito/OrderSummary";
import { useCart } from "@/context/cart/CartContext";
import { pedidoSchema, type PedidoFormValues } from "@/lib/pedidoSchema";
import type { Direccion, Sucursal } from "@/lib/pedidos";
import { formatearMoneda } from "@/utils/cartUtils";

const campo =
  "w-full rounded-lg border border-madera/40 bg-card px-3 py-2.5 text-sm text-tinta focus:border-madera focus:outline-2 focus:outline-madera/30";

function Campo({ etiqueta, error, children }: { etiqueta: string; error?: string; children: ReactNode }) {
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
  tienePerfil: boolean;
  sucursales: Sucursal[];
  direcciones: Direccion[];
};

export function CheckoutForm({ tienePerfil, sucursales, direcciones }: Props) {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const [errorServidor, setErrorServidor] = useState("");
  const [terminado, setTerminado] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      tipoEntrega: "RETIRO",
      sucursal: "",
      direccion: direcciones[0] ? String(direcciones[0].id) : "nueva",
      calle: "",
      numero: "",
      ciudad: "",
      codigoPostal: "",
    },
  });

  const tipoEntrega = watch("tipoEntrega");
  const direccion = watch("direccion");

  const onSubmit = async (valores: PedidoFormValues) => {
    setErrorServidor("");
    const resultado = await crearPedido(
      valores,
      cart.map((i) => ({ id: i.id, cantidad: i.cantidad })),
    );

    if (!resultado.ok) {
      setErrorServidor(resultado.error);
      return;
    }
    setTerminado(true);
    clearCart();
    router.push(`/pedidos/${resultado.id}`);
  };

  if (terminado) {
    return (
      <p role="status" className="py-16 text-center text-sm text-tinta/60">
        ¡Pedido registrado! Te llevamos al detalle...
      </p>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-light text-cafe">No hay productos en el carrito</h2>
        <p className="mt-2 text-tinta/70">Agregá productos antes de continuar con el pedido.</p>
        <Link
          href="/productos"
          className="mt-6 inline-block rounded-full bg-oliva px-6 py-2.5 text-sm text-white hover:opacity-90"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid h-fit gap-5 rounded-2xl border border-madera/30 bg-card p-6 shadow-sm"
      >
        <h2 className="text-xl font-light text-cafe">¿Cómo querés recibir tu pedido?</h2>

        {!tienePerfil && (
          <p role="alert" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Para hacer un pedido necesitás tener un perfil de cliente.{" "}
            <Link href="/perfil" className="underline">
              Completá tu perfil
            </Link>
            .
          </p>
        )}

        <fieldset className="flex gap-6 text-sm text-tinta">
          <label className="flex items-center gap-2">
            <input type="radio" value="RETIRO" {...register("tipoEntrega")} /> Retiro en sucursal
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" value="ENVIO" {...register("tipoEntrega")} /> Envío a domicilio
          </label>
        </fieldset>

        {tipoEntrega === "RETIRO" ? (
          <Campo etiqueta="Sucursal" error={errors.sucursal?.message}>
            <select className={campo} {...register("sucursal")}>
              <option value="">Elegí una sucursal</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} — {s.direccion}, {s.ciudad}
                </option>
              ))}
            </select>
          </Campo>
        ) : (
          <>
            <Campo etiqueta="Dirección de entrega">
              <select className={campo} {...register("direccion")}>
                {direcciones.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.calle} {d.numero}, {d.ciudad}
                  </option>
                ))}
                <option value="nueva">Usar una dirección nueva</option>
              </select>
            </Campo>

            {direccion === "nueva" && (
              <div className="grid gap-4">
                <Campo etiqueta="Calle" error={errors.calle?.message}>
                  <input className={campo} {...register("calle")} />
                </Campo>
                <div className="grid grid-cols-2 gap-4">
                  <Campo etiqueta="Número" error={errors.numero?.message}>
                    <input className={campo} {...register("numero")} />
                  </Campo>
                  <Campo etiqueta="Código postal" error={errors.codigoPostal?.message}>
                    <input className={campo} {...register("codigoPostal")} />
                  </Campo>
                </div>
                <Campo etiqueta="Ciudad" error={errors.ciudad?.message}>
                  <input className={campo} {...register("ciudad")} />
                </Campo>
              </div>
            )}
          </>
        )}

        {errorServidor && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorServidor}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !tienePerfil}
          className="rounded-full bg-cafe py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Enviando pedido..." : "Confirmar pedido"}
        </button>
      </form>

      <div className="grid h-fit gap-6">
        <div className="rounded-2xl border border-madera/30 bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-light text-cafe">Tu carrito</h2>
          <ul className="grid gap-3">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between border-b border-madera/20 pb-2 text-sm">
                <span className="text-tinta">
                  {item.nombre} <span className="text-tinta/60">× {item.cantidad}</span>
                </span>
                <span className="text-cafe">{formatearMoneda(item.precio * item.cantidad)}</span>
              </li>
            ))}
          </ul>
        </div>
        <OrderSummary subtotal={totalPrice} />
      </div>
    </div>
  );
}
