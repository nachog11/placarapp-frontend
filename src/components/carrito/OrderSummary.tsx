import React from "react";

interface OrderSummaryProps {
  subtotal: number;
}

export function OrderSummary({ subtotal }: OrderSummaryProps) {
  const envio: number = 0; 
  const total = subtotal + envio;

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Resumen del pedido</h2>
      <div className="space-y-2 mb-4 text-gray-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Envío</span>
          <span>{envio === 0 ? "Gratis" : `$${envio.toFixed(2)}`}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}