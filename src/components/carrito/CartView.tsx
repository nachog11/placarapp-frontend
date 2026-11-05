"use client";

import React from "react";
import { useCart } from "@/context/cart/CartContext";
import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";
import Link from "next/link";

export function CartView() {
  const { cart, clearCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-8">¿Todavía no elegiste ningún mueble para tu hogar?</p>
        <Link
          href="/productos"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos en el carrito */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <span className="font-semibold text-gray-700">Productos</span>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Vaciar carrito
            </button>
          </div>

          <div>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Resumen del pedido y botón de checkout */}
        <div>
          <OrderSummary subtotal={totalPrice} />
          <Link
            href="/pedidos/checkout"
            className="block text-center mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
          >
            Proceder al pago
          </Link>
        </div>
      </div>
    </div>
  );
}