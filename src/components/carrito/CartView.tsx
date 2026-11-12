"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart/CartContext";
import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";

export function CartView() {
  const { cart, clearCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-2xl font-light text-cafe">Tu carrito está vacío</h1>
        <p className="mt-2 text-tinta/70">¿Todavía no elegiste ningún mueble para tu hogar?</p>
        <Link
          href="/productos"
          className="mt-6 inline-block rounded-full bg-oliva px-6 py-2.5 text-sm text-white hover:opacity-90"
        >
          Ver catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-light text-cafe">Carrito de compras</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-madera/30 bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-2 flex items-center justify-between border-b border-madera/30 pb-2">
            <span className="font-medium text-tinta">Productos</span>
            <button onClick={clearCart} className="text-sm text-red-700 hover:underline">
              Vaciar carrito
            </button>
          </div>
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div>
          <OrderSummary subtotal={totalPrice} />
          <Link
            href="/pedidos/checkout"
            className="mt-6 block w-full rounded-full bg-cafe py-3 text-center text-sm font-medium text-white hover:opacity-90"
          >
            Continuar con el pedido
          </Link>
        </div>
      </div>
    </main>
  );
}
