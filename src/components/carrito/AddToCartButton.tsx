"use client";

import { useState } from "react";
import { useCart } from "@/context/cart/CartContext";

type Props = {
  producto: {
    id: number;
    nombre: string;
    precio: string; // la API manda el precio como string ("150000.00")
    stock: number;
    imagen?: string;
  };
};

export function AddToCartButton({ producto }: Props) {
  const { cart, addToCart } = useCart();
  const [agregado, setAgregado] = useState(false);

  // No dejamos agregar más unidades que el stock disponible
  const enCarrito = cart.find((i) => i.id === producto.id)?.cantidad ?? 0;
  const disponible = producto.stock - enCarrito;

  const agregar = () => {
    addToCart({
      id: producto.id,
      nombre: producto.nombre,
      precio: Number(producto.precio),
      cantidad: 1,
      imagen: producto.imagen || undefined,
    });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={agregar}
        disabled={disponible <= 0}
        className="rounded-full bg-oliva px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {disponible <= 0 ? "Ya tenés todo el stock en el carrito" : agregado ? "¡Agregado!" : "Agregar al carrito"}
      </button>
      {enCarrito > 0 && (
        <p role="status" className="mt-2 text-xs text-tinta/60">
          Tenés {enCarrito} en el carrito
        </p>
      )}
    </div>
  );
}
