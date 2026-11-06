import React from "react";
import { formatearMoneda } from "@/utils/cartUtils";

interface OrderSummaryProps {
  subtotal: number;
}

// Sin hooks ni estado: solo recibe datos por props y los muestra.
export function OrderSummary({ subtotal }: OrderSummaryProps) {
  const envio: number = 0;
  const total = subtotal + envio;

  return (
    <div className="rounded-2xl border border-madera/30 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-light text-cafe">Resumen del pedido</h2>
      <div className="space-y-2 text-tinta/80">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatearMoneda(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{envio === 0 ? "Se define en el checkout" : formatearMoneda(envio)}</span>
        </div>
        <div className="flex justify-between border-t border-madera/30 pt-2 text-lg font-medium text-cafe">
          <span>Total</span>
          <span>{formatearMoneda(total)}</span>
        </div>
      </div>
    </div>
  );
}
