"use client";

import React from "react";
import { useCart } from "@/context/cart/CartContext";
import type { CartItemType } from "@/utils/cartUtils";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center space-x-4">
        {item.imagen && (
          <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover rounded-md" />
        )}
        <div>
          <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
          <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">${(item.precio * item.cantidad).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-xs text-red-500 hover:text-red-700 mt-1"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}