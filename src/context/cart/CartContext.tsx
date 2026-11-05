"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

import { calcularTotalCarrito, type CartItemType } from "@/utils/cartUtils";

// Re-exportamos el tipo para que los componentes puedan importarlo desde el contexto
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

  // Función de envío preparada para integrar el token de autenticación de Ignacio
  const enviarPedido = async (datosCliente: any) => {
    const orderPayload = {
      cliente: datosCliente,
      items: cart.map((item) => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
      })),
      total: totalPrice,
    };

    // Obtenemos el token de autenticación del almacenamiento local (generado por el login de Ignacio)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Si el usuario ya inició sesión y el token existe, lo adjuntamos al header
    if (token) {
      headers["Authorization"] = `Token ${token}`;
    }

    const response = await fetch("http://localhost:8000/api/ventas/pedidos/", {
      method: "POST",
      headers,
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.non_field_errors?.[0] || "Error al procesar el pedido en el servidor"
      );
    }

    const resultado = await response.json();
    clearCart(); // Limpiamos el carrito al completarse con éxito
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