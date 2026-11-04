"use client";

import React from "react";
import { useCart } from "@/context/cart/CartContext";
import Link from "next/link";

export default function Home() {
  const { addToCart } = useCart();

  // Un producto de prueba para simular la tienda
  const productoPrueba = {
    id: 1,
    nombre: "Placard Moderno 3 Puertas",
    precio: 150000,
    cantidad: 1,
    imagen: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=300&auto=format&fit=crop",
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a PlacarApp 🛋️</h1>
      <p className="text-gray-600 mb-8">Sistema de gestión y tienda de muebles.</p>

      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => {
            addToCart(productoPrueba);
            alert("¡Placard de prueba agregado al carrito con éxito!");
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
        >
          Agregar Mueble de Prueba
        </button>

        <Link
          href="/pedidos/checkout"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition shadow-md"
        >
          Ir al Checkout
        </Link>

        <Link
          href="/carrito"
          className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition shadow-md"
        >
          Ver Carrito
        </Link>
      </div>
    </div>
  );
}