import { describe, it, expect } from "vitest";
import { calcularTotalCarrito, type CartItemType } from "./cartUtils";

describe("Cart Utils - Pruebas unitarias (R7)", () => {
  it("debería calcular correctamente el total de un carrito con varios ítems", () => {
    const itemsMock: CartItemType[] = [
      { id: 1, nombre: "Placar 2 Puertas", precio: 150000, cantidad: 1 },
      { id: 2, nombre: "Mesa de Luz", precio: 25000, cantidad: 2 },
    ];

    const total = calcularTotalCarrito(itemsMock);
    // 150000 * 1 + 25000 * 2 = 200000
    expect(total).toBe(200000);
  });

  it("debería retornar 0 si el carrito está vacío", () => {
    const itemsMock: CartItemType[] = [];
    const total = calcularTotalCarrito(itemsMock);
    expect(total).toBe(0);
  });
});