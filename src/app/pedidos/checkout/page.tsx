"use client";

import React from "react";
import { useCart } from "@/context/cart/CartContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

// Validación con Zod (mantenemos la robustez del formulario)
const checkoutSchema = z.object({
  nombre: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().min(6, "Teléfono inválido"),
  direccion: z.string().min(5, "Dirección obligatoria"),
  ciudad: z.string().min(2, "Ciudad obligatoria"),
  codigoPostal: z.string().min(2, "Código postal obligatorio"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, totalPrice, enviarPedido } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      await enviarPedido(data);
      alert("¡Pedido registrado con éxito en el backend! 🚀");
    } catch (error: any) {
      alert(`Error al enviar el pedido: ${error.message}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">No hay productos en el carrito</h2>
        <p className="text-gray-400 mb-6">Agregá productos antes de proceder al checkout.</p>
        <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra / Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Información de Envío</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre Completo</label>
            <input {...register("nombre")} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
            {errors.nombre && <span className="text-red-500 text-xs">{errors.nombre.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Correo Electrónico</label>
              <input {...register("email")} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
              <input {...register("telefono")} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
              {errors.telefono && <span className="text-red-500 text-xs">{errors.telefono.message}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Dirección de Entrega</label>
            <input {...register("direccion")} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
            {errors.direccion && <span className="text-red-500 text-xs">{errors.direccion.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ciudad</label>
              <input {...register("ciudad")} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
              {errors.ciudad && <span className="text-red-500 text-xs">{errors.ciudad.message}</span>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Código Postal</label>
              <input {...register("codigoPostal")} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
              {errors.codigoPostal && <span className="text-red-500 text-xs">{errors.codigoPostal.message}</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition mt-6 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando pedido..." : "Confirmar y Enviar Pedido"}
          </button>
        </form>

        {/* Resumen del Pedido */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 h-fit">
          <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <div>
                  <p className="font-medium">{item.nombre}</p>
                  <p className="text-sm text-gray-400">Cant: {item.cantidad}</p>
                </div>
                <p className="font-semibold">${(item.precio * item.cantidad).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t border-zinc-700 pt-4">
            <span>Total a Pagar:</span>
            <span className="text-green-400">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}