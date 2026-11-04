export interface CartItemType {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

/**
 * Calcula el precio total del carrito sumando el precio por la cantidad de cada ítem.
 */
export function calcularTotalCarrito(items: CartItemType[]): number {
  return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
}

/**
 * Formatea un número a moneda con formato de Argentina ($).
 */
export function formatearMoneda(monto: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(monto);
}
