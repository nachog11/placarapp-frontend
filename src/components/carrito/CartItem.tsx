"use client";

import React from "react";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/context/cart/CartContext";
import { formatearMoneda, type CartItemType } from "@/utils/cartUtils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between gap-4 border-b border-madera/20 py-4">
      <div className="flex items-center gap-4">
        <ProductImage
          imagen={item.imagen ?? ""}
          nombre={item.nombre}
          className="h-16 w-16 shrink-0 text-2xl"
        />
        <div>
          <h3 className="font-medium text-tinta">{item.nombre}</h3>
          <p className="text-sm text-tinta/60">
            Cantidad: {item.cantidad} · {formatearMoneda(item.precio)} c/u
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-cafe">{formatearMoneda(item.precio * item.cantidad)}</p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="mt-1 text-xs text-red-700 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
