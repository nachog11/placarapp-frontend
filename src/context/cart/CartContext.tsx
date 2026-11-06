"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { calcularTotalCarrito, type CartItemType } from "@/utils/cartUtils";

export type { CartItemType };

interface CartContextType {
  cart: CartItemType[];
  addToCart: (product: CartItemType) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
  enviarPedido: (datosCliente: any) => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItemType[]>([]);

  const addToCart = (product: CartItemType) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + product.cantidad }
            : item
        );
      }

      return [...prev, product];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = calcularTotalCarrito(cart);

  const enviarPedido = async (datosCliente: any) => {
    const orderPayload = {
      tipo_entrega: "ENVIO",
      direccion_envio: {
        calle: datosCliente.direccion,
        numero: datosCliente.numero,
        ciudad: datosCliente.ciudad,
        codigo_postal: datosCliente.codigoPostal,
      },
      productos: cart.map((item) => ({
        producto_id: item.id,
        cantidad: item.cantidad,
      })),
    };

    const response = await fetch("/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    const resultado = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        resultado.error ||
        resultado.detail ||
        "Error al procesar el pedido."
      );
    }

    clearCart();
    return resultado;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        enviarPedido,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }

  return context;
};
